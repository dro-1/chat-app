import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { axiosInstance } from "../../api/axios";
import { UserContext } from "../../context/user.provider";

const User = ({ recipient, sender, chatExists, chat }) => {
  const history = useHistory();
  const { currentUser, setCurrentUser } = useContext(UserContext);

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
      query: `
      mutation CreateChat($user1: ID, $user2: ID){
        createChat(data:{
          users:{
            connect:[$user1,$user2]
          }
        }){
          _id
          messages{
            data{
              content
              sender{
                _id
              }
            }
          }
          users{
            data{
              _id
              name
              image
            }
          }
        }
      }
      `,
      variables: {
        user1: recipient._id,
        user2: sender._id,
      },
    };
    try {
      const response = await axiosInstance.post("/graphql", body);
      console.log(response);
      setCurrentUser({
        ...currentUser,
        chats: { data: [response.data.data.createChat] },
      });
      history.push("/chat", {
        chat: response.data.data.createChat,
        recipient,
        sender,
      });
    } catch (e) {
      console.log(e);
    }
  };

  return <button onClick={handleClick}>{recipient.name}</button>;
};

export default User;
