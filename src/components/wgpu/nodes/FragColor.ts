import assert from "assert";
import BuildNode from "./NodeBuilder";
import { INodeSpec, ShaderType } from "../../../utils/types";

export const FragColorNode: INodeSpec = {
  title: "Fragment color",
  modules: {},
  output: {},
  input: {
    $0: { type: ShaderType.vec4 },
  },
  getCode: ({ inputVars }) => {
    assert(inputVars.length === 1);

    return {
      code: `return vec4<f32>(${inputVars[0]});`,
      vars: inputVars,
    };
  },
};

export default BuildNode(FragColorNode);
