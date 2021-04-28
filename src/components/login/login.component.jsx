import React from "react";
import { useHistory } from "react-router-dom";
import "./login.css";
import {
  signInWithGoogle,
  signInWithTwitter,
} from "./../../firebase/firebase.utils";
import { axiosInstance } from "./../../api/axios.js";

const Login = ({ user }) => {
  const history = useHistory();
  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      const authRes = await signInWithGoogle();
      console.log(authRes);
      const body = {
        query: `
        mutation CreateUser($name: String!, $image: String!){
          createUser(data:{
            name: $name
            image: $image
          }){
            name
            image
          }
        }
        `,
        variables: {
          name: authRes.user.displayName,
          image: authRes.user.photoURL ? authRes.user.photoURL : "",
        },
      };

      const res = await axiosInstance.post("/graphql", body);
      console.log(res);

      history.push("/");
    } catch (e) {
      console.log(e);
    }
  };

  const handleTwitterSignIn = async (e) => {
    e.preventDefault();
    try {
      const authRes = await signInWithTwitter();
      console.log(authRes);

      const body = {
        query: `
        mutation CreateUser($name: String!, $image: String!){
          createUser(data:{
            name: $name
            image: $image
          }){
            name
            image
          }
        }
        `,
        variables: {
          name: authRes.user.displayName,
          image: authRes.user.photoURL ? authRes.user.photoURL : "",
        },
      };

      const res = await axiosInstance.post("/graphql", body);
      console.log(res);

      history.push("/");
    } catch (e) {
      console.log(e);
    }
  };

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
