import React, { useContext, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { axiosInstance } from "./api/axios";
import Chat from "./components/chat/chat.component";
import Home from "./components/home/home.component";

import Login from "./components/login/login.component";
import Loader from "./components/utils/loader.component";
import { UserContext } from "./context/user.provider";
import { auth } from "./firebase/firebase.utils";

function App() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeFromAuth = auth.onAuthStateChanged((authUser) => {
      console.log(authUser);
      const getUserFromFauna = async () => {
        setLoading(true);
        const body = {
          query: `
      query FindUser($name: String!){
        findUserByName(name: $name){
          name
          image
          _id
          chats{
            data{
              _id
              users{
                data{
                  _id
                  name
                  image
                }
              }
              messages{
                data{
                  content
                  sender{
                    _id
                  }
                }
              }
            }
          }
        }
      }
      `,
          variables: {
            name: authUser.displayName,
          },
        };

        const response = await axiosInstance.post("/graphql", body);
        const user = response?.data?.data?.findUserByName;
        setLoading(false);
        if (user) {
          setCurrentUser(user);
        }
      };
      if (authUser) {
        console.log(authUser);
        getUserFromFauna();
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });
    return unsubscribeFromAuth;
    //eslint-disable-next-line
  }, []);

  const PublicRoute = ({ exact, path, children }) =>
    loading ? (
      <Loader />
    ) : currentUser ? (
      <Redirect to="/" />
    ) : (
      <Route exact={exact ? true : false} path={path} children={children} />
    );

  const PrivateRoute = ({ exact, path, children }) =>
    loading ? (
      <Loader />
    ) : !currentUser ? (
      <Redirect to="/login" />
    ) : (
      <Route exact={exact ? true : false} path={path} children={children} />
    );

  return (
    <Router>
      <Switch>
        <PrivateRoute exact path="/" children={<Home />} />
        <PrivateRoute path="/chat" children={<Chat />} />
        <PublicRoute path="/login" children={<Login />} />
      </Switch>
    </Router>
  );
}

export default App;
