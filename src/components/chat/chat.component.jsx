import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Message from "../utils/message.component";
import { signOut } from "../../firebase/firebase.utils";

import "./chat.scss";

const Chat = ({ user }) => {
  const history = useHistory();
  const handleSignOut = (e) => {
    e.preventDefault();
    signOut();
    history.push("/login");
    console.log("hello");
  };

  const [message, setMessage] = useState("");

  return (
    <main className="home">
      <header>
        <img src={user.photoURL} alt="User" />
        <p>{user.displayName}</p>
        <button onClick={handleSignOut}>SIGN OUT</button>
      </header>
      <main>
        <Message
          message={{
            content: "Hello there",
            type: "SENT",
          }}
        />
        <Message
          message={{
            content: "Hello there",
            type: "RECEIVED",
          }}
        />
        <Message
          message={{
            content: "Hello there",
            type: "SENT",
          }}
        />
        <Message
          message={{
            content: "Hello there",
            type: "RECEIVED",
          }}
        />
        <Message
          message={{
            content: "Hello there",
            type: "SENT",
          }}
        />
        <Message
          message={{
            content: "Hello there",
            type: "RECEIVED",
          }}
        />
        <Message
          message={{
            content: "Hello there",
            type: "SENT",
          }}
        />
        <Message
          message={{
            content: "Hello there",
            type: "RECEIVED",
          }}
        />
        <Message
          message={{
            content: "Hello there",
            type: "SENT",
          }}
        />
        <Message
          message={{
            content: "Hello there",
            type: "RECEIVED",
          }}
        />
        <Message
          message={{
            content: "Hello there",
            type: "SENT",
          }}
        />
        <Message
          message={{
            content: "Hello there",
            type: "RECEIVED",
          }}
        />
      </main>
      <form>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button>SEND</button>
      </form>
    </main>
  );
};
export default Chat;
