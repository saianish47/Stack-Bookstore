import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  updateEmail,
  updateProfile,
} from "firebase/auth";
import { RootState } from "../reducer";
import { MyUserState } from "../models/types";

interface UserState {
  user: MyUserState | null;
  isLoading: boolean;
  reAuth: boolean;
  myAlert: {
    variant: string;
    message: string;
  };
  isCancelled: boolean;
  emailPayload: string;
  resetPassDone: boolean;
}

const initialState: UserState = {
  user: null,
  isLoading: true,
  reAuth: false,
  myAlert: {
    variant: "",
    message: "",
  },
  isCancelled: false,
  emailPayload: "",
  resetPassDone: false,
};

export const changePassword = createAsyncThunk(
  "user/changePassword",
  async (email: string, { getState }) => {
    const user = getAuth().currentUser;
    const resetPassDone = (getState() as RootState).userDetails.resetPassDone;
    if (user && !resetPassDone) {
      await sendPasswordResetEmail(getAuth(), email);
      return true;
    }
    return false;
  }
);

export const updateDisplayName = createAsyncThunk(
  "user/updateDisplayName",
  async (displayName: string) => {
    const user = getAuth().currentUser;
    if (!user) throw new Error("User not found");
    try {
      await updateProfile(user, { displayName });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
);

export const reauthenticateUser = createAsyncThunk(
  "user/reauthenticateUser",
  async ({ email, password }: { email: string; password: string }) => {
    const user = getAuth().currentUser;
    if (email.length == 0 || password.length == 0) return false;
    const creds = EmailAuthProvider.credential(email, password);
    if (!user) throw new Error("User not found");

    try {
      await reauthenticateWithCredential(user, creds);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
);

export const updateUserEmail = createAsyncThunk(
  "user/updateUserEmail",
  async (_, { getState }) => {
    const user = getAuth().currentUser;
    const { reAuth, emailPayload } = (getState() as RootState).userDetails;
    let flag = false;
    if (!user) throw new Error("User not found");
    reAuth &&
      (await updateEmail(user, emailPayload)
        .then(() => (flag = true))
        .catch((e) => console.log(e)));
    return flag;
  }
);

const userSlice = createSlice({
  name: "userDetail",
  initialState,
  reducers: {
    updateWithReauthenticate(state, action) {
      state.emailPayload = action.payload;
    },
    resetResetPassDone(state) {
      state.resetPassDone = false;
    },
    resetMyAlert(state) {
      state.myAlert = {
        variant: "",
        message: "",
      };
    },
    setIsCancelled(state, action) {
      state.isCancelled = action.payload;
    },
    setUserDetails(state, action) {
      if (action.payload) {
        state.user = action.payload;
        state.isLoading = false;
      }
    },
    resetUserDetails() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(reauthenticateUser.rejected, (state) => {
        state.myAlert = {
          variant: "danger",
          message: "User Reauthentication Failed",
        };
        state.reAuth = false;
      })
      .addCase(reauthenticateUser.fulfilled, (state, action) => {
        if (action.payload) {
          state.myAlert = {
            variant: "success",
            message: "User Reauthentication Success",
          };
          state.isCancelled = true;
          state.reAuth = true;
        } else {
          state.myAlert = {
            variant: "danger",
            message: "User Reauthentication Failed",
          };
          state.isCancelled = true;
          state.reAuth = false;
        }
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        if (action.payload) {
          state.resetPassDone = action.payload;
          state.myAlert = {
            variant: "success",
            message: "Password Reset email sent.",
          };
        } else {
          state.myAlert = {
            variant: "warning",
            message: "Password reset email already sent",
          };
        }
      })
      .addCase(updateUserEmail.fulfilled, (state, action) => {
        if (action.payload) {
          state.myAlert = {
            variant: "success",
            message: "Email updated successfully",
          };
          state.reAuth = false;
        }
        state.isCancelled = true;
      })
      .addCase(updateDisplayName.fulfilled, (state, action) => {
        if (action.payload) {
          state.myAlert = {
            variant: "success",
            message: "Name Updated Successfully",
          };
        } else {
          state.myAlert = {
            variant: "danger",
            message: "Name Update Failed",
          };
        }
      });
  },
});

export const {
  setUserDetails,
  resetUserDetails,
  updateWithReauthenticate,
  setIsCancelled,
  resetMyAlert,
} = userSlice.actions;
export default userSlice.reducer;
