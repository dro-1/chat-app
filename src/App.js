import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Chat from "./components/chat/chat.component";
import Home from "./components/home/home.component";

import Login from "./components/login/login.component";
import { auth } from "./firebase/firebase.utils";

function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribeFromAuth = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        console.log(authUser);
      }
    });
    return unsubscribeFromAuth;
  }, []);

  return (
    <Router>
      <Switch>
        {user ? <Route exact path="/" children={<Home user={user} />} /> : null}
        {user ? (
          <Route exact path="/chat" children={<Chat user={user} />} />
        ) : null}
        <Route exact path="/login" component={Login} />
      </Switch>
    </Router>
  );
}

export default App;
