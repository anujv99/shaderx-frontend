export interface ITextureSize {
  width: number;
  height: number;
}

export interface IUserProfile {
  name: string;
  email: string;
}

export interface IShaderData {
  code: string;
}

export const ShaderAccessValues = ["Public", "Unlisted", "Private"] as const;

export type TShaderAccess = (typeof ShaderAccessValues)[number];

export interface IShaderTags {
  [key: string]: string;
}

export interface IShader {
  id: string;
  name: string;
  description: string;
  data: IShaderData;
  access: TShaderAccess;
  tags: IShaderTags;
  created_at: string;
  updated_at: string;
}

export interface ICreateShaderParams {
  name: string;
  description: string;
  data: IShaderData;
}

export type TUpdateShaderParams = Partial<{
  name: string;
  description: string;
  data: IShaderData;
  access: TShaderAccess;
  tags: IShaderTags;
}>;

export interface IVec2 {
  x: number;
  y: number;
}

export interface IVec3 extends IVec2 {
  z: number;
}

export interface IVec4 extends IVec3 {
  w: number;
}

export enum MathOp {
  add = "+",
  subtract = "-",
  multiply = "*",
  divide = "/",
  modulo = "%",
}

export enum TrignoOp {
  sin = "sin",
  cos = "cos",
  tan = "tan",
  asin = "asin",
  acos = "acos",
  atan = "atan",
}
