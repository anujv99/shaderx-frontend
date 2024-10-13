import BuildNode from "./NodeBuilder";
import { INodeSpec, ShaderType } from "../../../utils/types";

export const FragPosNode: INodeSpec = {
  title: "Fragment position",
  input: {},
  output: { $0: { type: ShaderType.vec2 } },
  modules: {},
  getCode: ({ generateVarName }) => {
    const vars = generateVarName(1)[0];
    return {
      code: `let ${vars} = vec2<f32>(in.vert_position.xy);`,
      vars: [vars],
    };
  },
};

export default BuildNode(FragPosNode);
