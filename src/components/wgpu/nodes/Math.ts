import assert from "assert";

import {
  INodeSpec,
  MathOp,
  NodeModuleType,
  ShaderType,
} from "../../../utils/types";
import BuildNode from "./NodeBuilder";

export const MathNode: INodeSpec = {
  title: "Math",
  input: {
    $0: { type: ShaderType.any },
    $1: { type: ShaderType.any },
  },
  output: {
    $0: { type: ShaderType.any, data: "$op" },
  },
  modules: {
    $op: { type: NodeModuleType.EnumSelect, options: Object.values(MathOp) },
  },
  getCode: ({ node, inputVars, generateVarName }) => {
    assert(inputVars.length === 2);

    const vars = generateVarName(1)[0];
    const op = (node.data.$op ?? MathOp.add) as MathOp;

    return {
      code: `let ${vars} = ${inputVars[0]} ${op} ${inputVars[1]};`,
      vars: [vars],
    };
  },
};

export default BuildNode(MathNode);
