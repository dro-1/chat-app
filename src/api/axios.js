import axios from "axios";

export const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.REACT_APP_FAUNA_SECRET}`,
  },
  baseURL: "https://graphql.fauna.com/graphql",
});
