import {
  INodeSpec,
  IVec4,
  NodeModuleType,
  ShaderType,
} from "../../../utils/types";
import BuildNode from "./NodeBuilder";

export const ColorNode: INodeSpec = {
  title: "Color",
  input: {},
  output: { $0: { type: ShaderType.vec4, data: "$color" } },
  modules: {
    $color: { type: NodeModuleType.ColorInput },
  },
  getCode: ({ node, generateVarName }) => {
    const vars = generateVarName(1)[0];
    const col = node.data.$color as IVec4;

    return {
      code: `let ${vars} = vec4<f32>(${col.x}, ${col.y}, ${col.z}, ${col.w});`,
      vars: [vars],
    };
  },
};

export default BuildNode(ColorNode);
