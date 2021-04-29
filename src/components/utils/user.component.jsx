import axios from "axios";
import React from "react";
import { useHistory } from "react-router-dom";

const User = ({ recipient, sender, chatExists, chat }) => {
  const history = useHistory();

  const handleClick = async (e) => {
    if (chatExists) {
      return history.push("/chat", {
        chat,
        recipient,
        sender,
      });
    }
    e.preventDefault();
    const body = {
      user1Id: recipient._id,
      user2Id: sender._id,
    };
    try {
      await axios.post("https://dro-chat-app-api.herokuapp.com/chat", body);
    } catch (e) {
      console.log(e);
    }
  };

  return <button onClick={handleClick}>{recipient.name}</button>;
};

export default User;
