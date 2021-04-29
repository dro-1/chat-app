import React, { useEffect, useState, useRef, useContext } from "react";
import { useHistory } from "react-router-dom";
import io from "socket.io-client";
import Message from "../utils/message.component";
import { auth } from "../../firebase/firebase.utils";

import "./chat.scss";
import axios from "axios";
import { UserContext } from "../../context/user.provider";

const Chat = ({ recipient, sender }) => {
  const history = useHistory();
  const [iRecipient, setRecipient] = useState(recipient);
  const [iSender, setSender] = useState(sender);
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [message, setMessage] = useState("");

  const { addMessage } = useContext(UserContext);

  const socketRef = useRef(null);

  const bottomDivRef = useRef(null);

  const handleSignOut = (e) => {
    e.preventDefault();
    auth.signOut();
    history.push("/login");
  };

  const submitMessage = async (e) => {
    e.preventDefault();
    if (!chat || !message) return;
    const body = {
      chatID: chat._id,
      message: {
        senderID: iSender._id,
        content: message,
      },
    };
    await axios.post("https://dro-chat-app-api.herokuapp.com/message", body, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    setMessage("");
  };

  useEffect(() => {
    if (chat) {
      setMessages(chat.messages.data);
    }
  }, [chat]);

  useEffect(() => {
    console.log("Location effect ran");
    if (history.location.state) {
      setRecipient(history.location.state.recipient);
      setChat(history.location.state.chat);
      setSender(history.location.state.sender);
    }
  }, [history.location.state]);

  useEffect(() => {
    console.log("Socket io effect ran");
    if (!chat?._id) return;

    socketRef.current = io("https://dro-chat-app-api.herokuapp.com", {
      query: { chatId: chat._id },
    });

    socketRef.current.on("connect", () => {
      console.log(`Connected to ID ${socketRef.current.id}`);
    });

    socketRef.current.on("newMessage", (newMsg) => {
      console.log(newMsg);
      setMessages((prevMessages) => {
        return [...prevMessages, newMsg];
      });
      addMessage(chat?._id, newMsg);
    });

    return () => {
      socketRef.current.disconnect();
    };
    //eslint-disable-next-line
  }, [chat]);

  useEffect(() => {
    console.log(messages);
    bottomDivRef.current.scrollIntoView();
  }, [messages]);

  return (
    <main className="home">
      <header>
        <img src={iRecipient?.image} alt="User" />
        <p>{iRecipient?.name}</p>
        <button onClick={handleSignOut}>SIGN OUT</button>
      </header>
      <main>
        {messages
          ? messages.map((message, index) => (
              <Message
                key={index}
                message={{
                  content: message.content,
                  type:
                    message.sender._id === iSender._id ? "SENT" : "RECEIVED",
                }}
              />
            ))
          : null}
        <div ref={bottomDivRef} />
      </main>

      <form>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={submitMessage}>SEND</button>
      </form>
    </main>
  );
};
export default Chat;
