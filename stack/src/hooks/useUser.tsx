import { useState, useEffect } from "react";
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

const useUser = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reAuth, setReAuth] = useState<AuthCredential | null>(null);
  const [myAlert, setAlert] = useState({
    variant: "",
    message: "",
  });
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [emailPayload, setEmailPayload] = useState("");
  const [resetPassDone, setResetPassDone] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      setUser(user), setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const updateIt = async () => {
      const isRAuth = await Reauthenticate();
      isRAuth && !isCancelled && (await updateTheEmail());
    };
    updateIt();
  }, [reAuth]);

  const changePassword = async (email: string) => {
    if (!resetPassDone && user) {
      await sendPasswordResetEmail(getAuth(), email)
        .then(() => {
          setAlert({
            variant: "success",
            message: "Password Reset email sent.",
          });
          setResetPassDone(true);
        })
        .catch((error) => {
          setAlert({
            variant: "danger",
            message: "Password Reset Error. Try Again Later",
          });
          console.log(error.message);
        });
    } else {
      setAlert({
        variant: "warning",
        message: "Password Reset email already sent",
      });
    }
  };

  const updateDisplayName = async (displayName: string) => {
    if (!user) return;
    try {
      await updateProfile(user, {
        displayName: displayName,
      })
        .then(() => {
          setAlert({
            variant: "success",
            message: "User's Name Updated",
          });
        })
        .catch((error) => {
          setAlert({ variant: "danger", message: error.message });
          console.log(error.message);
        });
    } catch (error) {
      console.error("Error updating display name:", error);
    }
  };

  const promptForCredentials = (authEmail: string, authPassword: string) => {
    setReAuth(EmailAuthProvider.credential(authEmail, authPassword));
    console.log("Reauth Done");
  };

  const Reauthenticate = async () => {
    if (user && reAuth) {
      try {
        await reauthenticateWithCredential(user, reAuth)
          .then(() => {
            setAlert({
              variant: "success",
              message: "Reauthentication success",
            });
          })
          .catch((error) => {
            setAlert({
              variant: "danger",
              message: "Reauthentication Failed. Try Again",
            });
            console.log(error.message);
            setIsCancelled(true);
          });
      } catch (error) {
        console.log(error);
      }
      return true;
    }
    return false;
  };

  const updateWithReauthenticate = (action: {
    type: string;
    payload: string;
  }) => {
    switch (action.type) {
      case "EMAIL":
        setEmailPayload(action.payload);
        break;
      default:
        break;
    }
  };

  const updateTheEmail = async () => {
    if (!user) return;
    try {
      await updateEmail(user, emailPayload)
        .then(() => {
          setAlert({
            variant: "success",
            message: "User Email Updated",
          });
          setIsCancelled(false);
        })
        .catch((e) => {
          setAlert({
            variant: "danger",
            message: "Update Email Failed. Try Again",
          });
          setIsCancelled(true);
          console.log(e.message);
        });
    } catch (error) {
      console.error("Error updating email:", error);
    }
  };

  return {
    user,
    isLoading,
    updateWithReauthenticate,
    promptForCredentials,
    updateDisplayName,
    myAlert,
    changePassword,
    isCancelled,
    setIsCancelled,
  };
};

export default useUser;
