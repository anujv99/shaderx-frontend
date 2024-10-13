import assert from "assert";
import {
  INodeSpec,
  NodeModuleType,
  ShaderType,
  TrignoOp,
} from "../../../utils/types";
import BuildNode from "./NodeBuilder";

export const TrignoNode: INodeSpec = {
  title: "Trigonometry",
  input: {
    $0: { type: ShaderType.any },
  },
  output: {
    $0: { type: ShaderType.any, data: "$op" },
  },
  modules: {
    $op: { type: NodeModuleType.EnumSelect, options: Object.values(TrignoOp) },
  },
  getCode: ({ node, inputVars, generateVarName }) => {
    assert(inputVars.length === 1);

    const vars = generateVarName(1)[0];
    const op = (node.data.$op ?? TrignoOp.sin) as TrignoOp;

    return {
      code: `let ${vars} = Math.${op}(${inputVars[0]});`,
      vars: [vars],
    };
  },
};

export default BuildNode(TrignoNode);
