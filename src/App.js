import React, { useEffect, useState } from "react";
import Login from "./components/login/login.component";
import { auth } from "./firebase/firebase.utils";

function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
      console.log(authUser);
    });
  }, []);

  return (
    <div className="App">
      <Login />
    </div>
  );
}

export default App;
