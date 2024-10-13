import React, { useCallback } from "react";
import { INodeModuleProps, IVec4 } from "../../../../utils/types";
import { NodeLabel } from "../Common";
import { useReactFlow } from "@xyflow/react";

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

const ColorInput: React.FC<INodeModuleProps> = ({
  id,
  module,
  data,
  dataId,
}) => {
  const { setNodes } = useReactFlow();

  const color = data[dataId] as IVec4 | undefined;

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const color = toVec4(e.target.value);
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, [dataId]: color } }
            : node,
        ),
      );
    },
    [id, dataId, setNodes],
  );

  return (
    <div className="flex items-center w-full gap-2">
      {module.label && <NodeLabel>{module.label}</NodeLabel>}
      <input
        type="color"
        className="w-8 h-8 rounded nodrag"
        value={toHex(color)}
        onChange={onChange}
      />
    </div>
  );
};

export default ColorInput;
