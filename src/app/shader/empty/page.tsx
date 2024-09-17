import React from "react";
import Editor from "../Editor";
import { IShaderData } from "../../../utils/types";
import { newShaderCode } from "../../../utils/data";

const emptyShader: IShaderData = {
  code: newShaderCode,
};

const Page: React.FC = () => {
  return <Editor data={emptyShader} />;
};

export default Page;
