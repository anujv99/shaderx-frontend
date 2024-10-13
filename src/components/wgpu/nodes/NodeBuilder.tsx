import React, { useId } from "react";
import { INodeSpec, NodeModuleType } from "../../../utils/types";
import { NodeContainer, NodeHandle, NodeLabel } from "./Common";
import { NodeProps, Position } from "@xyflow/react";
import { Separator } from "@radix-ui/themes";
import ColorInput from "./modules/ColorInput";
import EnumSelect from "./modules/EnumSelect";
import { getHandleId } from "../../../utils/helper";
import NumberInput from "./modules/NumberInput";

function getNodeModuleComp(module: NodeModuleType) {
  switch (module) {
    case NodeModuleType.ColorInput:
      return ColorInput;
    case NodeModuleType.EnumSelect:
      return EnumSelect;
    case NodeModuleType.NumberInput:
      return NumberInput;
    default:
      break;
  }

  return null;
}

const BuildNode = (spec: INodeSpec): React.FC<NodeProps> => {
  const columns =
    Math.min(Object.keys(spec.input).length, 1) +
    Math.min(Object.keys(spec.output).length, 1);

  const handlesJsx = (
    <div
      className="grid items-center gap-2"
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
      }}
    >
      {Object.keys(spec.input).length > 0 && (
        <div className="flex flex-col gap-1">
          {Object.keys(spec.input).map((key) => {
            const handle = spec.input[key];

            return (
              <NodeLabel key={key} id={getHandleId(key, "target")}>
                {handle.label || handle.type}
              </NodeLabel>
            );
          })}
        </div>
      )}
      {Object.keys(spec.output).length > 0 && (
        <div className="flex flex-col gap-1">
          {Object.keys(spec.output).map((key) => {
            const handle = spec.output[key];

            return (
              <NodeLabel
                key={key}
                id={getHandleId(key, "source")}
                className="text-right"
              >
                {handle.label || handle.type}
              </NodeLabel>
            );
          })}
        </div>
      )}
    </div>
  );

  return (props) => {
    const { id, isConnectable, data } = props;
    const modules = Object.keys(spec.modules);

    const containerId = useId();

    return (
      <>
        <NodeContainer id={containerId} heading={spec.title}>
          {modules.map((mod) => {
            const module = spec.modules[mod];
            const Comp = getNodeModuleComp(module.type);

            if (!Comp) return null;

            return (
              <Comp
                key={mod}
                id={id}
                module={module}
                data={data}
                dataId={mod}
              />
            );
          })}
          {modules.length > 0 && <Separator className="w-full my-1" />}
          {handlesJsx}
        </NodeContainer>
        {Object.keys(spec.input).map((key) => (
          <NodeHandle
            key={key}
            htmlFor={key}
            containerId={containerId}
            id={key}
            type="target"
            position={Position.Left}
            isConnectable={isConnectable}
          />
        ))}
        {Object.keys(spec.output).map((key) => (
          <NodeHandle
            key={key}
            htmlFor={key}
            containerId={containerId}
            id={key}
            type="source"
            position={Position.Right}
            isConnectable={isConnectable}
          />
        ))}
      </>
    );
  };
};

export default BuildNode;
