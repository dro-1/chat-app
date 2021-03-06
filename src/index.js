import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import UserProvider from "./context/user.provider.jsx";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <UserProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </UserProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
