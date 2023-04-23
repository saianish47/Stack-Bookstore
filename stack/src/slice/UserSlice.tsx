import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  AuthCredential,
  EmailAuthProvider,
  getAuth,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  updateEmail,
  updateProfile,
} from "firebase/auth";
import { User as FirebaseUser } from "firebase/auth";
import { RootState } from "../reducer";
import { MyUserState } from "../models/types";

interface UserState {
  user: MyUserState | null;
  isLoading: boolean;
  reAuth: AuthCredential | null;
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
  reAuth: null,
  myAlert: {
    variant: "",
    message: "",
  },
  isCancelled: false,
  emailPayload: "",
  resetPassDone: false,
};

export const getUserToken = createAsyncThunk("user/getUserToken", async () => {
  const userAuthDetails = getAuth().currentUser;
  return userAuthDetails;
});
export const setUser = createAsyncThunk("user/setUser", async () => {
  return await new Promise<FirebaseUser | null>((resolve) => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      unsubscribe();
      resolve(user);
    });
  });
});

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
  async (_, { getState }) => {
    const { reAuth } = (getState() as RootState).userDetails;
    const user = getAuth().currentUser;
    if (!user) throw new Error("User not found");
    if (!reAuth) throw new Error("No Credentials");

    try {
      reAuth && (await reauthenticateWithCredential(user, reAuth));
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
    promptForCredentials(state, action) {
      const { authEmail, authPassword } = action.payload;
      if (authEmail.length == 0 || authPassword.length == 0) {
        state.myAlert = {
          variant: "danger",
          message: "User Auth Failed",
        };
        state.isCancelled = true;
      } else {
        state.reAuth = EmailAuthProvider.credential(authEmail, authPassword);
      }
    },
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
      state.user = action.payload;
    },
    resetUserDetails() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(setUser.fulfilled, (state) => {
        state.isLoading = false;
        // const { email, displayName } = action.payload;
        // state.user = action.payload;
      })
      .addCase(setUser.rejected, (state) => {
        state.isLoading = false;
        state.myAlert = {
          variant: "danger",
          message: "User Auth Failed",
        };
      })
      .addCase(reauthenticateUser.rejected, (state) => {
        state.myAlert = {
          variant: "danger",
          message: "User Reauthentication Failed",
        };
        state.reAuth = null;
      })
      .addCase(reauthenticateUser.fulfilled, (state, action) => {
        if (action.payload) {
          state.myAlert = {
            variant: "success",
            message: "User Reauthentication Success",
          };
        } else {
          state.myAlert = {
            variant: "danger",
            message: "User Reauthentication Failed",
          };
          state.isCancelled = true;
          state.reAuth = null;
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
          state.reAuth = null;
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
  promptForCredentials,
  updateWithReauthenticate,
  setIsCancelled,
  resetMyAlert,
} = userSlice.actions;
export default userSlice.reducer;
