import axios from "axios";

const instance = axios.create({
  baseURL: "https://contractr.onrender.com",
  withCredentials: true,
});

export default instance;
