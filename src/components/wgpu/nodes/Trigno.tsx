import React, { useCallback, useId } from "react";
import { Node, NodeProps, Position, useReactFlow } from "@xyflow/react";
import { Select, Separator, Text } from "@radix-ui/themes";

import { NodeContainer, NodeHandle, NodeLabel } from "./Common";
import { TrignoOp } from "../../../utils/types";

function mapOp(op: TrignoOp) {
  const idx = Object.values(TrignoOp).indexOf(op);
  if (idx < 0) return "Unknown";
  return Object.keys(TrignoOp)[idx];
}

type TrignoProps = NodeProps<
  Node<{
    op: string;
  }>
>;

const Trigno: React.FC<TrignoProps> = ({ id, isConnectable, data }) => {
  const { op } = data;
  const { setNodes } = useReactFlow();

  const inId = useId();
  const outId = useId();

  const onChange = useCallback(
    (newOp: TrignoOp) => {
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
      <NodeContainer heading="Trigonometry" style={{ minWidth: 190 }}>
        <div className="w-full flex items-center justify-between gap-2">
          <Text size="1">Opration({op})</Text>
          <Select.Root size="1" value={op || "add"} onValueChange={onChange}>
            <Select.Trigger />
            <Select.Content>
              <Select.Group>
                {Object.values(TrignoOp).map((op) => (
                  <Select.Item key={op} value={op}>
                    {mapOp(op)}
                  </Select.Item>
                ))}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>
        <Separator className="w-full my-1" />
        <div className="flex items-center gap-2 justify-between w-full">
          <NodeLabel id={inId}>in</NodeLabel>
          <NodeLabel id={outId} className="text-right">
            out
          </NodeLabel>
        </div>
      </NodeContainer>
      <NodeHandle
        htmlFor={inId}
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      <NodeHandle
        htmlFor={outId}
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </>
  );
};

export default Trigno;
