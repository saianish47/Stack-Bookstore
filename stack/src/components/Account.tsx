import React, { useState, useEffect } from "react";
import useUser from "../hooks/useUser";
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

  const {
    user,
    updateDisplayName,
    updateWithReauthenticate,
    myAlert,
    changePassword,
    isCancelled,
    promptForCredentials,
    setIsCancelled,
  } = useUser();

  useEffect(() => {
    setAlert(myAlert);
    if (isCancelled && user) {
      setEmail(user.email ?? "");
      setShow(false);
      setIsCancelled(false);
    }
  }, [myAlert, isCancelled]);

  useEffect(() => {
    if (user) {
      setName(user.displayName ?? "Not Available");
      setEmail(user.email ?? "");
    }
  }, [user]);

  const handlePasswordChange = async () => {
    await changePassword(email);
    setIsAlert((prevIsAlertShown) => !prevIsAlertShown);
  };
  const handleEdit = () => {
    setIsEditable(true);
  };
  useEffect(() => {
    setIsAlert((prevIsAlertShown) => !prevIsAlertShown);
    setShow(false);
  }, [alert]);

  const handleSave = async () => {
    setIsEditable(false);
    if (user) {
      if (email.trim() != user.email) {
        setShow(true);
        updateWithReauthenticate({ type: "EMAIL", payload: email });
      }
      if (name.trim() != user.displayName) {
        await updateDisplayName(name);
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
              <button
                className="button"
                style={{ padding: "0.6em" }}
                onClick={handleSave}
              >
                Save
              </button>
            ) : (
              <button
                className="button"
                style={{ padding: "0.6em" }}
                onClick={handleEdit}
              >
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
          setCancel={setIsCancelled}
        />
      )}
    </div>
  );
};
