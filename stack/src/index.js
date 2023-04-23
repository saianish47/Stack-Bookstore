import React from "react";
import ReactDOM from "react-dom/client";
import { store } from "./reducer";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./reducer";
import { Loading } from "./pages/Loading";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import firebaseConfig from "./firebase_config";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
