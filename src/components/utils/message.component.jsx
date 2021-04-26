import React from "react";

const Message = ({ message }) => {
  return (
    <div className={`messageBox ${message.type === "SENT" ? "right" : "left"}`}>
      <p>{message.content}</p>
    </div>
  );
};
export default Message;
