import React, { createContext, useState } from "react";

export const UserContext = createContext({
  currentUser: null,
  setCurrentUser: () => null,
  addMessage: () => null,
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
      user.chats.data = user.chats.data.map((userData) => {
        return {
          ...userData,
          users: userData.users.data.filter((data) => data._id !== userID),
        };
      });
    }
    setUser(user);
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        addMessage,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
export default UserProvider;
