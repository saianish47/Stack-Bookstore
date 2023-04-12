import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

const CreateAccount = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string>("");
  const emailPattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  const navigate = useNavigate();
  const create = async () => {
    if (error.length === 0) {
      try {
        if (password != confirmPassword) {
          setError("Passwords Does not match");
          return;
        }
        await createUserWithEmailAndPassword(getAuth(), email, password)
          .then((userCred) => {
            updateProfile(userCred.user, {
              displayName: name,
            })
              .then(() => {
                console.log(
                  `User ${userCred.user.uid} updated with display name: ${userCred.user.displayName}`
                );
              })
              .catch((error) => {
                console.log(`Error updating user profile: ${error}`);
              });
          })
          .catch((error) => {
            console.log(`Error creating user ${error}`);
          });
        navigate("/");
      } catch (e) {
        setError(e as string);
      }
    }
  };

  const validate = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case "email":
        emailPattern.test(e.target.value)
          ? setError("")
          : setError("Email not valid");
        break;
      case "password":
        e.target.value.length < 8
          ? setError("Password must be atleast 8 characters")
          : setError("");
        break;
      default:
        break;
    }
  };
  return (
    <div className="auth-page">
      <div className="auth-page-body">
        {error && <p className="error"> {error}</p>}
        <h1 className="auth-heading">Create Account</h1>
        <div>
          <i className="fa-solid fa-user"></i>
          <input
            placeholder="Enter Your Name (Optional)"
            name={email}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <i className="fa-solid fa-envelope"></i>
          <input
            placeholder="Enter Your Email"
            name="email"
            value={email}
            onChange={(e) => {
              validate(e);
              setEmail(e.target.value);
            }}
          />
        </div>
        <div>
          <i className="fa-solid fa-lock"></i>
          <input
            type="password"
            placeholder="Enter Password"
            name="password"
            value={password}
            onChange={(e) => {
              validate(e);
              setPassword(e.target.value);
            }}
          />
        </div>
        <div>
          <i className="fa-solid fa-lock-open"></i>
          <input
            type="text"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button className="button submit-button" onClick={create}>
          {" "}
          Create Account{" "}
        </button>
        <Link to="/login" className="bottom-msg">
          {" "}
          Already have an account? Login
        </Link>
      </div>
    </div>
  );
};

export default CreateAccount;
