import React, { useId } from "react";
import { NodeProps, Position } from "@xyflow/react";

import { NodeContainer, NodeHandle, NodeLabel } from "./Common";

type FragColorProps = NodeProps;

const FragColor: React.FC<FragColorProps> = ({ isConnectable }) => {
  const labelId = useId();

  return (
    <>
      <NodeContainer heading="Fragment color">
        <NodeLabel id={labelId} className="text-left">
          vec4
        </NodeLabel>
      </NodeContainer>
      <NodeHandle
        htmlFor={labelId}
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
    </>
  );
};

export default FragColor;
