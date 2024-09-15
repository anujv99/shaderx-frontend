import { atom } from "jotai";
import { ShaderRoutes } from "../api/routes";

const shaderAtom = atom(async () => {
  const response = await ShaderRoutes.getAllShaders();
  return response;
});

const myShaderAtom = atom(async () => {
  const response = await ShaderRoutes.getMyShaders();
  return response;
});

const archivedShaderAtom = atom(async () => {
  const response = await ShaderRoutes.getMyArchivedShaders();
  return response;
});

export { shaderAtom, myShaderAtom, archivedShaderAtom };
