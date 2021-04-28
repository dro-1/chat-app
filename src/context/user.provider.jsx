import React, { createContext, useState } from "react";

export const UserContext = createContext({
  currentUser: null,
  setCurrentUser: () => null,
});

const UserProvider = ({ children }) => {
  const [currentUser, setUser] = useState(null);
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
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
export default UserProvider;
