import axios from "axios";

const apiRouter = axios.create({
  baseURL: "http://localhost:3001/",
  withCredentials: true,
  timeout: 1000,
});

export default apiRouter;
