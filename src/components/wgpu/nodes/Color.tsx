import React, { useCallback, useId } from "react";
import { Node, NodeProps, Position, useReactFlow } from "@xyflow/react";

import { NodeContainer, NodeHandle, NodeLabel } from "./Common";
import { IVec4 } from "../../../utils/types";

type ColorProps = NodeProps<
  Node<{
    color?: IVec4;
  }>
>;

function toHex(c?: IVec4) {
  if (!c) return "#000000";

  return `#${Math.round(c.x * 255)
    .toString(16)
    .padStart(2, "0")}${Math.round(c.y * 255)
    .toString(16)
    .padStart(2, "0")}${Math.round(c.z * 255)
    .toString(16)
    .padStart(2, "0")}`;
}

function toVec4(hex: string): IVec4 {
  const c = hex.substring(1);
  return {
    x: parseInt(c.substring(0, 2), 16) / 255,
    y: parseInt(c.substring(2, 4), 16) / 255,
    z: parseInt(c.substring(4, 6), 16) / 255,
    w: 1,
  };
}

const Color: React.FC<ColorProps> = ({ id, isConnectable, data }) => {
  const { color } = data;
  const labelId = useId();
  const { setNodes } = useReactFlow();

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const color = toVec4(e.target.value);
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id ? { ...node, data: { ...node.data, color } } : node,
        ),
      );
    },
    [id, setNodes],
  );

  return (
    <>
      <NodeContainer heading="Color">
        <div id={labelId} className="flex items-center justify-end gap-2">
          <input
            type="color"
            className="w-8 h-8 rounded nodrag"
            value={toHex(color)}
            onChange={onChange}
          />
          <NodeLabel className="text-right">vec4</NodeLabel>
        </div>
      </NodeContainer>
      <NodeHandle
        htmlFor={labelId}
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </>
  );
};

export default Color;
