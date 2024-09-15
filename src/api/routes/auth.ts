import { IUserProfile } from "../../utils/types";
import apiRouter from "./router";

const getLoginUrl = async () => {
  try {
    const response = await apiRouter({
      method: "get",
      url: "/auth/login",
    });
    return response.data as string;
  } catch (error) {
    console.error(error);
  }
};

const passCallbackToken = async (token: string) => {
  try {
    await apiRouter({
      method: "post",
      url: "/auth/google_callback",
      params: {
        code: token,
      },
    });
  } catch (error) {
    console.error(error);
  }
};

const validate = async () => {
  try {
    const response = await apiRouter({
      method: "get",
      url: "/auth/validate",
    });
    return response.data as IUserProfile;
  } catch (error) {
    console.error(error);
  }
};

const logout = async () => {
  try {
    await apiRouter({
      method: "post",
      url: "/auth/logout",
    });
  } catch (error) {
    console.error(error);
  }
};

export { getLoginUrl, passCallbackToken, validate, logout };
