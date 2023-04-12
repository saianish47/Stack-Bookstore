import React, { useState, useEffect } from "react";
import useUser from "../hooks/useUser";
import {
  AuthCredential,
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  updateEmail,
  updateProfile,
} from "firebase/auth";
import { AlertMe } from "./AlertMe";
import { ModalLogin } from "./Modal";

export const Account = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [alert, setAlert] = useState({
    variant: "",
    message: "",
  });
  const [isAlertShown, setIsAlert] = useState(true);
  const [isEditable, setIsEditable] = useState(false);
  const [show, setShow] = useState(false);
  const [reAuth, setReAuth] = useState<AuthCredential | null>(null);
  const { user } = useUser();
  // const credential = promptForCredentials();
  const promptForCredentials = (authEmail: string, authPassword: string) => {
    setReAuth(EmailAuthProvider.credential(authEmail, authPassword));
  };

  useEffect(() => {
    if (user) {
      setName(user.displayName ?? "Not Available");
      setEmail(user.email ?? "");
    }
  }, [user]);

  const handlePasswordChange = () => {
    if (alert.message.length === 0 && user) {
      sendPasswordResetEmail(getAuth(), email)
        .then(() =>
          setAlert({
            variant: "success",
            message: "Password Reset email sent.",
          })
        )
        .catch((error) =>
          setAlert({ variant: "danger", message: error.message })
        );
      setAlert({
        variant: "success",
        message: "Password Reset email sent.",
      });
    } else {
      setAlert({
        variant: "warning",
        message: "Password Reset email already sent",
      });
    }
    setIsAlert((prevIsAlertShown) => !prevIsAlertShown);
  };
  const handleEdit = () => {
    setIsEditable(true);
  };
  useEffect(() => {
    const updateMyEmail = async () => {
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
              setAlert({ variant: "danger", message: error.message });
            });
        } catch (error) {
          console.log(error);
        }
        console.log("ReAuth Done");

        setIsAlert((prevIsAlertShown) => !prevIsAlertShown);
        try {
          await updateEmail(user, email)
            .then(() => {
              setAlert({
                variant: "success",
                message: "User Email Updated",
              });
            })
            .catch((error) => {
              setAlert({ variant: "danger", message: error.message });
            });
        } catch (error) {
          console.log(error);
        }
        setIsAlert((prevIsAlertShown) => !prevIsAlertShown);
      }
    };

    updateMyEmail();

    setReAuth(null);
  }, [reAuth]);

  const handleSave = async () => {
    setIsEditable(false);
    if (user) {
      if (email.trim() != user.email) {
        setShow(true);
        // await updateMyEmail();
      }
      if (name.trim() != user.displayName) {
        await updateProfile(user, {
          displayName: name,
        })
          .then(() => {
            setAlert({
              variant: "success",
              message: "User's Name Updated",
            });
          })
          .catch((error) => {
            setAlert({ variant: "danger", message: error.message });
          });
        setIsAlert((prevIsAlertShown) => !prevIsAlertShown);
      }
    }
  };

  return (
    <div style={{ minHeight: "400px" }}>
      <div className="container mt-5 account-page">
        <h1 className="conf-header">Account Details</h1>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            className="form-control"
            value={name}
            disabled={!isEditable}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            disabled={!isEditable}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div className="form-group d-flex justify-content-evenly mt-3">
          <button className="button sec-button" onClick={handlePasswordChange}>
            Reset Password
          </button>
          <div>
            {isEditable ? (
              <button className="button" onClick={handleSave}>
                Save
              </button>
            ) : (
              <button className="button sec-button" onClick={handleEdit}>
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="account-alert">
        <AlertMe
          variant={alert.variant}
          message={alert.message}
          timeout={5}
          showAlert={isAlertShown}
        />
      </div>
      {show && (
        <ModalLogin
          promptForCredentials={promptForCredentials}
          modalShow={show}
        />
      )}
    </div>
  );
};
