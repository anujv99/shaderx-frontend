import axios from "axios";

const apiRouter = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/`,
  withCredentials: true,
  timeout: 10000,
});

export default apiRouter;
