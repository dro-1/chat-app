import React, { createContext, useState } from "react";

export const UserContext = createContext({
  currentUser: null,
  setCurrentUser: () => null,
  addMessage: () => null,
  addChatToUser: () => null,
});

const UserProvider = ({ children }) => {
  const [currentUser, setUser] = useState(null);

  const addMessage = (chatId, newMsg) => {
    const chatIndex = currentUser.chats.data.findIndex(
      (iChat) => iChat._id === chatId
    );
    currentUser.chats.data[chatIndex].messages.data.push(newMsg);
  };

  const setCurrentUser = (user, skipCheck) => {
    if (!user) {
      return setUser(null);
    }
    const userID = user._id;
    if (!skipCheck) {
      //removes currentUser from chats
      user.chats.data = user.chats.data.map((chatData) => {
        console.log(chatData);
        return {
          ...chatData,
          users: chatData.users.data.filter((data) => data._id !== userID),
        };
      });
    }
    setUser(user);
  };

  const addChatToUser = (chat) => {
    console.log(chat);
    chat.users = chat.users.data.filter((data) => data._id !== currentUser._id);
    setCurrentUser(
      {
        ...currentUser,
        chats: { data: [...currentUser.chats.data, chat] },
      },
      true
    );
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        addMessage,
        addChatToUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
export default UserProvider;
