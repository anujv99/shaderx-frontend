import React, { useId } from "react";
import { NodeProps, Position } from "@xyflow/react";

import { NodeContainer, NodeHandle, NodeLabel } from "./Common";

type SplitNodeProps = NodeProps;

const Split: React.FC<SplitNodeProps> = ({ isConnectable }) => {
  const labelId = useId();
  const xId = useId();
  const yId = useId();
  const zId = useId();
  const wId = useId();

  return (
    <>
      <NodeContainer heading="Split">
        <div className="grid grid-cols-2 items-center gap-2">
          <NodeLabel id={labelId} className="text-left">
            vec4
          </NodeLabel>
          <div className="flex flex-col gap-1">
            <NodeLabel className="text-right" id={xId}>
              X
            </NodeLabel>
            <NodeLabel className="text-right" id={yId}>
              Y
            </NodeLabel>
            <NodeLabel className="text-right" id={zId}>
              Z
            </NodeLabel>
            <NodeLabel className="text-right" id={wId}>
              W
            </NodeLabel>
          </div>
        </div>
      </NodeContainer>
      <NodeHandle
        htmlFor={labelId}
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      <NodeHandle
        htmlFor={xId}
        id={xId}
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
      <NodeHandle
        htmlFor={yId}
        id={yId}
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
      <NodeHandle
        htmlFor={zId}
        id={zId}
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
      <NodeHandle
        htmlFor={wId}
        id={wId}
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </>
  );
};

export default Split;
