import React, { useCallback } from "react";
import { INodeModuleProps } from "../../../../utils/types";
import { useReactFlow } from "@xyflow/react";
import { NodeLabel } from "../Common";
import { TextField } from "@radix-ui/themes";

const NumberInput: React.FC<INodeModuleProps> = ({
  id,
  module,
  data,
  dataId,
}) => {
  const { setNodes } = useReactFlow();

  const number = data[dataId] as number | undefined;

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const number = parseFloat(e.target.value);
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, [dataId]: number } }
            : node,
        ),
      );
    },
    [id, dataId, setNodes],
  );

  return (
    <div className="flex items-center w-full gap-2">
      {module.label && <NodeLabel>{module.label}</NodeLabel>}
      <TextField.Root type="number" value={number || ""} onChange={onChange}>
        <TextField.Slot />
      </TextField.Root>
    </div>
  );
};

export default NumberInput;
