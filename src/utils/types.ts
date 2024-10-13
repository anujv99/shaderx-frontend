import { Edge, Node } from "@xyflow/react";

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

export enum ShaderType {
  vec2 = "vec2",
  vec3 = "vec3",
  vec4 = "vec4",
  float = "float",
  any = "any",
}

export enum NodeModuleType {
  ColorInput,
  NumberInput,
  EnumSelect,
}

export interface INodeModule {
  type: NodeModuleType;
  label?: string;
}

type IColorInputModule = {
  type: NodeModuleType.ColorInput;
} & INodeModule;

type IEnumSelectModule = {
  type: NodeModuleType.EnumSelect;
  options: string[];
} & INodeModule;

type INumberInputModule = {
  type: NodeModuleType.NumberInput;
} & INodeModule;

type IModules = IColorInputModule | IEnumSelectModule | INumberInputModule;

export type TNodeId = string;
export type TNodeDataId = string;

export interface INodeHandle {
  type: ShaderType;
  label?: string;
  data?: TNodeDataId;
}

export interface IProcessNodeResult {
  code: string;
  vars: string[];
}

export interface IProcessNodeProps {
  node: Node;
  edge: Edge;
  spec: INodeSpec;
  inputVars: string[];
  generateVarName: (count: number) => string[];
}

export interface INodeSpec {
  title: string;
  input: { [key: TNodeId]: INodeHandle };
  output: { [key: TNodeId]: INodeHandle };
  modules: { [key: TNodeDataId]: IModules };
  getCode: (props: IProcessNodeProps) => IProcessNodeResult;
}

export interface INodeModuleProps {
  id: TNodeId;
  module: IModules;
  data: any;
  dataId: TNodeDataId;
}
