import React, { useCallback, useId } from "react";
import { Node, NodeProps, Position, useReactFlow } from "@xyflow/react";

import { NodeContainer, NodeHandle, NodeLabel } from "./Common";
import { TextField } from "@radix-ui/themes";

type NumberProps = NodeProps<
  Node<{
    number?: number;
  }>
>;

const Number: React.FC<NumberProps> = ({ id, isConnectable, data }) => {
  const { number } = data;
  const labelId = useId();
  const { setNodes } = useReactFlow();

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const number = parseFloat(e.target.value);
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id ? { ...node, data: { ...node.data, number } } : node,
        ),
      );
    },
    [id, setNodes],
  );

  return (
    <>
      <NodeContainer heading="Number">
        <div id={labelId} className="flex items-center justify-end gap-2">
          <TextField.Root
            type="number"
            value={number || ""}
            onChange={onChange}
          >
            <TextField.Slot />
          </TextField.Root>
          <NodeLabel className="text-right">float</NodeLabel>
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

export default Number;
