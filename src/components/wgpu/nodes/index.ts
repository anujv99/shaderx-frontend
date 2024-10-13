import { NodeProps } from "@xyflow/react";

import FragPos, { FragPosNode } from "./FragPos";
import FragColor, { FragColorNode } from "./FragColor";
import Color, { ColorNode } from "./Color";
import Math, { MathNode } from "./Math";
import Time, { TimeNode } from "./Time";
import Trigno, { TrignoNode } from "./Trigno";
import Split from "./Split";
import Combine from "./Combine";
import Number, { NumberNode } from "./Number";
import { INodeSpec } from "../../../utils/types";

export const Nodes: {
  [key: string]: { comp: React.FC<NodeProps>; spec: INodeSpec };
} = {
  color: { comp: Color, spec: ColorNode },
  fragColor: { comp: FragColor, spec: FragColorNode },
  fragPos: { comp: FragPos, spec: FragPosNode },
  math: { comp: Math, spec: MathNode },
  time: { comp: Time, spec: TimeNode },
  trigno: { comp: Trigno, spec: TrignoNode },
  number: { comp: Number, spec: NumberNode },
};

export function getNodeSpec(type: string | undefined) {
  if (!type) return undefined;
  return Nodes[type].spec as INodeSpec | undefined;
}
