import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "@firebase/util";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const logIn = async () => {
    try {
      await signInWithEmailAndPassword(getAuth(), email, password);
      navigate(-1);
    } catch (e: unknown) {
      if (e instanceof FirebaseError) {
        if (
          e.code === "auth/wrong-password" ||
          e.code === "auth/user-not-found"
        ) {
          setError("Wrong Email/Password");
        } else if (e.code === "auth/too-many-requests") {
          setError("Too many failed attempts. Please wait some time");
        } else {
          console.log(e);
          setError("Unknown Error Occurred. Please Try again later");
        }
        console.log(e);
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page-body">
        {error && <p className="error-auth"> {error}</p>}
        <h1 className="auth-heading">Login</h1>
        <div>
          <i className="fa-solid fa-envelope"></i>
          <input
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-container">
          <i className="fa-solid fa-lock"></i>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <i
            className={`fa-solid eye-icon fa-eye${
              showPassword ? "" : "-slash"
            }`}
            onClick={() => setShowPassword(!showPassword)}
          ></i>
        </div>
        <button className="button submit-button" onClick={logIn}>
          {" "}
          Login{" "}
        </button>
        <Link to="/create-account" className="bottom-msg">
          {" "}
          Dont have an account? Create One
        </Link>
      </div>
    </div>
  );
};

export default Login;
