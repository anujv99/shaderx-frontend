interface ITextureSize {
  width: number;
  height: number;
}

interface IUserProfile {
  name: string;
  email: string;
}

interface IShaderData {
  code: string;
}

interface IShader {
  id: string;
  name: string;
  description: string;
  data: IShaderData;
  created_at: string;
  updated_at: string;
}

interface ICreateShaderParams {
  name: string;
  description: string;
  data: IShaderData;
}

export type {
  ITextureSize,
  IUserProfile,
  IShaderData,
  IShader,
  ICreateShaderParams,
};
