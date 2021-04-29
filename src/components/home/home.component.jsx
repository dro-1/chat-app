import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { io } from "socket.io-client";
import { axiosInstance } from "../../api/axios";
import { UserContext } from "../../context/user.provider";
import { auth } from "../../firebase/firebase.utils";
import User from "../utils/user.component";

import "./home.scss";

const Home = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [chats, setChats] = useState(currentUser.chats?.data || []);
  const history = useHistory();
  const socketRef = useRef(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    let isSearchEmpty = search.length === 0;
    const body = isSearchEmpty
      ? {
          query: `
      {
        allUsers{
          data{
            name
            image
            _id
          }
        }
      }
      `,
        }
      : {
          query: `
      query FindUser($name: String!){
        findUserByName(name: $name){
          name
          image
          _id
        }
      }
      `,
          variables: {
            name: search,
          },
        };

    try {
      const response = await axiosInstance.post("/graphql", body);
      console.log(response);
      let userArray = isSearchEmpty
        ? response?.data?.data?.allUsers?.data
        : [response?.data?.data?.findUserByName];
      if (userArray.length > 0) {
        userArray = userArray.filter(
          (arrUser) => currentUser.name !== arrUser.name
        );
        setUsers(userArray);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleSignOut = (e) => {
    e.preventDefault();
    auth.signOut();
    history.push("/login");
  };

  useEffect(() => {
    if (!currentUser) {
      history.push("/login");
    }
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    socketRef.current = io("http://localhost:3000");

    socketRef.current.on("connect", () => {
      console.log(`Connected to ID ${socketRef.current.id}`);
    });

    socketRef.current.on("newChat", (chat) => {
      console.log(chat);
      setChats([
        ...chats,
        {
          ...chat,
          users: chat.users.data,
        },
      ]);
      setCurrentUser({
        ...currentUser,
        chats: { data: [...currentUser.chats.data, chat] },
      });
    });
    return () => socketRef.current.disconnect();
    //eslint-disable-next-line
  }, []);

  return (
    <div className="home">
      <header>
        <img src={currentUser?.image} alt="User" />
        <p>{currentUser?.name}</p>
        <button onClick={handleSignOut}>SIGN OUT</button>
      </header>
      <form>
        <input
          type="text"
          placeholder="Search for users"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </form>
      <p>*Leave empty to search for all users</p>
      {users.length > 0 ? (
        <main>
          {users
            .filter((user) => {
              const userStore = {};
              chats.forEach((chatDeets) => {
                userStore[chatDeets.users[0]._id] = true;
              });
              return !!!userStore[user._id];
            })
            .map((arrUser, index) => (
              <User key={index} recipient={arrUser} sender={currentUser} />
            ))}
        </main>
      ) : null}
      {chats.length > 0 ? (
        <div className="chats">
          <header>
            <h3>Chats</h3>
            {chats.map((chatData, index) => (
              <User
                chatExists
                chat={chatData}
                key={index}
                recipient={chatData.users[0]}
                sender={currentUser}
              />
            ))}
          </header>
        </div>
      ) : null}
    </div>
  );
};
export default Home;
