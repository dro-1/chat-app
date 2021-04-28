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
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const { currentUser, setCurrentUser } = useContext(UserContext);

  const socketRef = useRef(null);

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
    await axios.post("http://localhost:3000/message", body, {
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
    if (history.location.state) {
      setRecipient(history.location.state.recipient);
      setChat(history.location.state.chat);
      setSender(history.location.state.sender);
    }
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!chat?._id) return;
    socketRef.current = io("http://localhost:3000", {
      query: { chatId: chat._id },
    });
    socketRef.current.on("connect", () => {
      console.log(`Connected to ID ${socketRef.current.id}`);
    });
    socketRef.current.on("newMessage", (args) => {
      console.log(args);

      const chatIndex = currentUser.chats.data.findIndex(
        (iChat) => iChat._id === chat._id
      );
      currentUser.chats.data[chatIndex].messages.data.push(args);
      const newMessages = currentUser.chats.data[chatIndex].messages.data;
      console.log(currentUser);
      setCurrentUser(currentUser, true);
      console.log(newMessages);
      setMessages((prevMessage) => {
        console.log(prevMessage);
        return newMessages;
      });
    });
    return () => socketRef.current.disconnect();
    //eslint-disable-next-line
  }, [chat?._id]);

  useEffect(() => console.log(messages), [messages]);

  return (
    <main className="home">
      <header>
        <img src={iRecipient?.image} alt="User" />
        <p>{iRecipient?.name}</p>
        <button onClick={handleSignOut}>SIGN OUT</button>
      </header>
      <main>
        {messages.map((message, index) => (
          <Message
            key={index}
            message={{
              content: message.content,
              type: message.sender._id === iSender._id ? "SENT" : "RECEIVED",
            }}
          />
        ))}
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
