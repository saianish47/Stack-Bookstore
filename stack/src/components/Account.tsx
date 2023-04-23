import React, { useState, useEffect } from "react";
import { AlertMe } from "./AlertMe";
import { ModalLogin } from "./Modal";
import {
  changePassword,
  reauthenticateUser,
  setIsCancelled,
  updateDisplayName,
  updateUserEmail,
  updateWithReauthenticate,
} from "../slice/UserSlice";
import { useAppDispatch, useAppSelector } from "../hooks";
import { getAuth } from "firebase/auth";

export const Account = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAlertShown, setIsAlert] = useState(true);
  const [isEditable, setIsEditable] = useState(false);
  const [show, setShow] = useState(false);
  const { reAuth } = useAppSelector((state) => state.userDetails);

  const user = getAuth().currentUser;

  const dispatch = useAppDispatch();
  const { isCancelled, myAlert } = useAppSelector((state) => state.userDetails);

  useEffect(() => {
    if (isCancelled && user) {
      setEmail(user.email ?? "");
      setShow(false);
      dispatch(setIsCancelled(false));
    }
  }, [isCancelled]);

  useEffect(() => {
    if (user) {
      setName(user.displayName ?? "Not Available");
      setEmail(user.email ?? "");
    }
  }, [user]);

  useEffect(() => {
    const updateIt = async () => {
      dispatch(reauthenticateUser());
      !isCancelled && dispatch(updateUserEmail());
    };
    reAuth && updateIt();
  }, [reAuth]);

  const handlePasswordChange = async () => {
    dispatch(changePassword(email));
    setIsAlert((prevIsAlertShown) => !prevIsAlertShown);
  };
  const handleEdit = () => {
    setIsEditable(true);
  };
  useEffect(() => {
    setIsAlert((prevIsAlertShown) => !prevIsAlertShown);
    setShow(false);
  }, [myAlert]);

  const handleSave = async () => {
    setIsEditable(false);
    if (user) {
      if (email.trim() != user.email) {
        setShow(true);
        dispatch(updateWithReauthenticate(email));
      }
      if (name.trim() != user.displayName) {
        await dispatch(updateDisplayName(name));
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
          variant={myAlert.variant}
          message={myAlert.message}
          timeout={5}
          showAlert={isAlertShown}
        />
      </div>
      {show && <ModalLogin modalShow={show} />}
    </div>
  );
};
