import React, { useId } from "react";
import { NodeProps, Position } from "@xyflow/react";

import { NodeContainer, NodeHandle, NodeLabel } from "./Common";

type CombineNodeProps = NodeProps;

const Combine: React.FC<CombineNodeProps> = ({ isConnectable }) => {
  const labelId = useId();
  const xId = useId();
  const yId = useId();
  const zId = useId();
  const wId = useId();

  return (
    <>
      <NodeContainer heading="Combine">
        <div className="grid grid-cols-2 items-center gap-2">
          <div className="flex flex-col gap-1">
            <NodeLabel id={xId}>X</NodeLabel>
            <NodeLabel id={yId}>Y</NodeLabel>
            <NodeLabel id={zId}>Z</NodeLabel>
            <NodeLabel id={wId}>W</NodeLabel>
          </div>
          <NodeLabel id={labelId} className="text-right">
            vec4
          </NodeLabel>
        </div>
      </NodeContainer>
      <NodeHandle
        htmlFor={labelId}
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
      <NodeHandle
        htmlFor={xId}
        id={xId}
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      <NodeHandle
        htmlFor={yId}
        id={yId}
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      <NodeHandle
        htmlFor={zId}
        id={zId}
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      <NodeHandle
        htmlFor={wId}
        id={wId}
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
    </>
  );
};

export default Combine;
