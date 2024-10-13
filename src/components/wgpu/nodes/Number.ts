import { INodeSpec, NodeModuleType, ShaderType } from "../../../utils/types";
import BuildNode from "./NodeBuilder";

export const NumberNode: INodeSpec = {
  title: "Number",
  input: {},
  output: { $0: { type: ShaderType.float, data: "$number" } },
  modules: {
    $number: { type: NodeModuleType.NumberInput },
  },
  getCode: ({ node, generateVarName }) => {
    const vars = generateVarName(1)[0];
    let number = node.data.$number as number;
    if (typeof number === undefined) number = 0;

    return {
      code: `let ${vars} = ${number};`,
      vars: [vars],
    };
  },
};

export default BuildNode(NumberNode);
