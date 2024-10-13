import { INodeSpec, ShaderType } from "../../../utils/types";
import BuildNode from "./NodeBuilder";

export const TimeNode: INodeSpec = {
  title: "Time",
  input: {},
  output: { time: { type: ShaderType.float } },
  modules: {},
  getCode: () => {
    return {
      code: ``,
      vars: [`buffer.time`],
    };
  },
};

export default BuildNode(TimeNode);
