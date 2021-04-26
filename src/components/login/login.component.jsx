import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import io from "socket.io-client";
import "./login.css";
import {
  signInWithGoogle,
  signInWithTwitter,
} from "./../../firebase/firebase.utils";

const Login = () => {
  const history = useHistory();
  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      const res = await signInWithGoogle();
      console.log(res);
      history.push("/");
    } catch (e) {
      console.log(e);
    }
  };

  const handleTwitterSignIn = async (e) => {
    e.preventDefault();
    try {
      const res = await signInWithTwitter();
      console.log(res);
      history.push("/");
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const socket = io("http://localhost:3000");
    socket.on("connect", () => {
      console.log(`Connected to ID ${socket.id}`);
    });
    socket.on("hello", (data) => {
      console.log(data);
    });
  }, []);

  return (
    <div className="login">
      <main>
        <header>Login</header>
        <form className="login">
          <button onClick={handleGoogleSignIn}>Login With Gmail</button>
          <button onClick={handleTwitterSignIn}>Login With Twitter</button>
        </form>
      </main>
    </div>
  );
};
export default Login;
