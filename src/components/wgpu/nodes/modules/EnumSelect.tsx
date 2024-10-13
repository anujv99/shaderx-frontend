import React, { useCallback } from "react";
import { useReactFlow } from "@xyflow/react";
import { Select } from "@radix-ui/themes";

import { INodeModuleProps, NodeModuleType } from "../../../../utils/types";
import { NodeLabel } from "../Common";

const EnumSelect: React.FC<INodeModuleProps> = ({
  id,
  module,
  data,
  dataId,
}) => {
  const { setNodes } = useReactFlow();

  const op = data[dataId] as string | undefined;

  const onChange = useCallback(
    (newOp: string) => {
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, [dataId]: newOp } }
            : node,
        ),
      );
    },
    [id, dataId, setNodes],
  );

  if (module.type !== NodeModuleType.EnumSelect) return null;

  return (
    <div className="w-full flex items-center justify-between gap-2">
      <NodeLabel>Opration({op})</NodeLabel>
      <Select.Root size="1" value={op || "add"} onValueChange={onChange}>
        <Select.Trigger />
        <Select.Content>
          <Select.Group>
            {module.options.map((op) => (
              <Select.Item key={op} value={op}>
                {op}
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </div>
  );
};

export default EnumSelect;
