import React, { useId } from "react";
import { NodeProps, Position } from "@xyflow/react";

import { NodeContainer, NodeHandle, NodeLabel } from "./Common";

type FragPosProps = NodeProps;

const FragPos: React.FC<FragPosProps> = ({ isConnectable }) => {
  const labelId = useId();

  return (
    <>
      <NodeContainer heading="Fragment position">
        <NodeLabel id={labelId} className="text-right">
          vec2
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

export default FragPos;
