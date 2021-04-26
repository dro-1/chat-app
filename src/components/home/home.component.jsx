import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { axiosInstance } from "../../api/axios";
import { signOut } from "../../firebase/firebase.utils";
import User from "../utils/user.component";

import "./home.scss";

const Home = ({ user }) => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const history = useHistory();

  const handleSearch = async (e) => {
    e.preventDefault();

    const body = {
      query: `
      query{
        allUsers{
          data{
            name
          }
        }
      }
      `,
    };

    try {
      const response = await axiosInstance.post("/", body);
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSignOut = (e) => {
    e.preventDefault();
    signOut();
    history.push("/login");
  };

  return (
    <div className="home">
      <header>
        <img src={user.photoURL} alt="User" />
        <p>{user.displayName}</p>
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
          {users.map((user, index) => (
            <User key={index} user={user} />
          ))}
        </main>
      ) : null}
    </div>
  );
};
export default Home;
