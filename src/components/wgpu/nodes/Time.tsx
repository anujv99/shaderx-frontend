import React, { useId } from "react";
import { NodeProps, Position } from "@xyflow/react";

import { NodeContainer, NodeHandle, NodeLabel } from "./Common";

type TimeProps = NodeProps;

const Time: React.FC<TimeProps> = ({ isConnectable }) => {
  const labelId = useId();

  return (
    <>
      <NodeContainer heading="Time">
        <NodeLabel id={labelId} className="text-right">
          float
        </NodeLabel>
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

export default Time;
