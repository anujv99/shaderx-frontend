import {
  ICreateShaderParams,
  IShader,
  TUpdateShaderParams,
} from "../../utils/types";
import apiRouter from "./router";

const createNewShader = async (data: ICreateShaderParams) => {
  try {
    const response = await apiRouter({
      method: "post",
      url: "/shader",
      data,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data as IShader;
  } catch (error) {
    console.error(error);
  }
};

const getShader = async (id: string) => {
  try {
    const response = await apiRouter({
      method: "get",
      url: `/shader/${id}`,
    });
    return response.data as IShader;
  } catch (error) {
    console.error(error);
  }
};

const getAllShaders = async () => {
  try {
    const response = await apiRouter({
      method: "get",
      url: "/shader/all",
    });
    return response.data as IShader[];
  } catch (error) {
    console.error(error);
  }
};

const getMyShaders = async () => {
  try {
    const response = await apiRouter({
      method: "get",
      url: "/shader/my",
    });
    return response.data as IShader[];
  } catch (error) {
    console.error(error);
  }
};

const getMyArchivedShaders = async () => {
  try {
    const response = await apiRouter({
      method: "get",
      url: "/shader/archive",
    });
    return response.data as IShader[];
  } catch (error) {
    console.error(error);
  }
};

const deleteShader = async (id: string, force = false) => {
  if (force) {
    try {
      const response = await apiRouter({
        method: "delete",
        url: `/shader/${id}`,
      });
      return response.data as IShader;
    } catch (error) {
      console.error(error);
    }
    return;
  }

  try {
    const response = await apiRouter({
      method: "post",
      url: `/shader/${id}/delete`,
    });
    return response.data as IShader;
  } catch (error) {
    console.error(error);
  }
};

const restoreShader = async (id: string) => {
  try {
    const response = await apiRouter({
      method: "post",
      url: `/shader/${id}/restore`,
    });
    return response.data as IShader;
  } catch (error) {
    console.error(error);
  }
};

const updateShader = async (id: string, data: TUpdateShaderParams) => {
  try {
    const response = await apiRouter({
      method: "put",
      url: `/shader/${id}`,
      data,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data as IShader;
  } catch (error) {
    console.error(error);
  }
};

export {
  createNewShader,
  getShader,
  getAllShaders,
  getMyShaders,
  getMyArchivedShaders,
  deleteShader,
  restoreShader,
  updateShader,
};
