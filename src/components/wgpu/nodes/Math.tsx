import React, { useCallback, useId } from "react";
import { Node, NodeProps, Position, useReactFlow } from "@xyflow/react";
import { Select, Separator, Text } from "@radix-ui/themes";

import { NodeContainer, NodeHandle, NodeLabel } from "./Common";
import { MathOp } from "../../../utils/types";

function mapOp(op: MathOp) {
  const idx = Object.values(MathOp).indexOf(op);
  if (idx < 0) return "Unknown";
  return Object.keys(MathOp)[idx];
}

type MathProps = NodeProps<
  Node<{
    op: MathOp;
  }>
>;

const Math: React.FC<MathProps> = ({ id, isConnectable, data }) => {
  const { op } = data;
  const { setNodes } = useReactFlow();

  const in1Id = useId();
  const in2Id = useId();
  const outId = useId();

  const onChange = useCallback(
    (newOp: MathOp) => {
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, op: newOp } }
            : node,
        ),
      );
    },
    [id, setNodes],
  );

  return (
    <>
      <NodeContainer heading="Math" style={{ minWidth: 190 }}>
        <div className="w-full flex items-center justify-between gap-2">
          <Text size="1">Opration({op})</Text>
          <Select.Root size="1" value={op || "add"} onValueChange={onChange}>
            <Select.Trigger />
            <Select.Content>
              <Select.Group>
                {Object.values(MathOp).map((op) => (
                  <Select.Item key={op} value={op}>
                    {mapOp(op)}
                  </Select.Item>
                ))}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>
        <Separator className="w-full my-1" />
        <div className="grid grid-cols-2 items-center gap-2">
          <div className="flex flex-col gap-1">
            <NodeLabel id={in1Id}>in1</NodeLabel>
            <NodeLabel id={in2Id}>in2</NodeLabel>
          </div>
          <NodeLabel id={outId} className="text-right">
            out
          </NodeLabel>
        </div>
      </NodeContainer>
      <NodeHandle
        id={in1Id}
        htmlFor={in1Id}
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      <NodeHandle
        id={in2Id}
        htmlFor={in2Id}
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      <NodeHandle
        id={outId}
        htmlFor={outId}
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </>
  );
};

export default Math;
