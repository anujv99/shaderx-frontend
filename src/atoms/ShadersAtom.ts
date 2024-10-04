import { atom } from "jotai";
import { atomWithDefault, loadable } from "jotai/utils";

import { ShaderRoutes } from "../api/routes";
import { IShader } from "../utils/types";

const deleteReducer = async (state: IShader[] | undefined, action: any) => {
  if (!state) return state;

  switch (action.type) {
    case "DELETE_SHADER":
      state = state.filter((shader) => shader.id !== action.payload.id);
      break;
    default:
      return state;
  }

  return state;
};

const myShaderReducer = async (state: IShader[] | undefined, action: any) => {
  if (!state) return state;

  switch (action.type) {
    case "ARCHIVE_SHADER":
      state = state.filter((shader) => shader.id !== action.payload.id);
      break;
    case "RESTORE_SHADER":
      state = [...state, action.payload];
      break;
    case "UPDATE_SHADER":
      state = state.map((shader) =>
        shader.id === action.payload.id
          ? { ...shader, ...action.payload }
          : shader,
      );
      break;
    default:
      break;
  }

  return deleteReducer(state, action);
};

const archivedShaderReducer = async (
  state: IShader[] | undefined,
  action: any,
) => {
  if (!state) return state;

  switch (action.type) {
    case "ARCHIVE_SHADER":
      state = [...state, action.payload];
      break;
    case "RESTORE_SHADER":
      state = state.filter((shader) => shader.id !== action.payload.id);
      break;
    case "UPDATE_SHADER":
      state = state.map((shader) =>
        shader.id === action.payload.id
          ? { ...shader, ...action.payload }
          : shader,
      );
      break;
    default:
      break;
  }

  return deleteReducer(state, action);
};

const shaderAsyncAtom = atomWithDefault(async () => {
  const response = await ShaderRoutes.getAllShaders();
  return response;
});

const myShaderAsyncAtom = atomWithDefault(async () => {
  const response = await ShaderRoutes.getMyShaders();
  return response;
});

const archivedShaderAsyncAtom = atomWithDefault(async () => {
  const response = await ShaderRoutes.getMyArchivedShaders();
  return response;
});

const shaderAtom = loadable(shaderAsyncAtom);
const myShaderAtom = loadable(myShaderAsyncAtom);
const archivedShaderAtom = loadable(archivedShaderAsyncAtom);

const shaderReducerAtom = atom(null, async (get, set, action: any) => {
  if (get(shaderAtom).state === "hasData")
    set(shaderAsyncAtom, deleteReducer(await get(shaderAsyncAtom), action));
  if (get(myShaderAtom).state === "hasData")
    set(
      myShaderAsyncAtom,
      myShaderReducer(await get(myShaderAsyncAtom), action),
    );
  if (get(archivedShaderAtom).state === "hasData")
    set(
      archivedShaderAsyncAtom,
      archivedShaderReducer(await get(archivedShaderAsyncAtom), action),
    );
});

export { shaderAtom, myShaderAtom, archivedShaderAtom, shaderReducerAtom };
