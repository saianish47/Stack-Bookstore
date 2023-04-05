import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const logIn = async () => {
    try {
      await signInWithEmailAndPassword(getAuth(), email, password);
      navigate(-1);
    } catch (e) {
      setError(e as string);
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
        <div>
          <i className="fa-solid fa-lock"></i>
          <input
            type="password"
            placeholder="Enter Your Email"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* <i className="fa-sharp fa-solid fa-eye-slash"></i> */}
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
