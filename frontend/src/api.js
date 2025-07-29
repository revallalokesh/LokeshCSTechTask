import axios from "axios";
export const API = axios.create({
  baseURL: "https://mnaotp.onrender.com/api",
  withCredentials: true,
});
