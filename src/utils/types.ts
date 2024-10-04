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

const ShaderAccessValues = ["Public", "Unlisted", "Private"] as const;

type TShaderAccess = (typeof ShaderAccessValues)[number];

interface IShaderTags {
  [key: string]: string;
}

interface IShader {
  id: string;
  name: string;
  description: string;
  data: IShaderData;
  access: TShaderAccess;
  tags: IShaderTags;
  created_at: string;
  updated_at: string;
}

interface ICreateShaderParams {
  name: string;
  description: string;
  data: IShaderData;
}

type TUpdateShaderParams = Partial<{
  name: string;
  description: string;
  data: IShaderData;
  access: TShaderAccess;
  tags: IShaderTags;
}>;

export type {
  ITextureSize,
  IUserProfile,
  IShaderData,
  IShader,
  ICreateShaderParams,
  TUpdateShaderParams,
  TShaderAccess,
};

export { ShaderAccessValues };
