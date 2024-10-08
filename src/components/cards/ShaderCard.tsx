import React from "react";
import moment from "moment";

import { IShader } from "../../utils/types";
import { AspectRatio, Box, Card, Text } from "@radix-ui/themes";

type ShaderCardProps = {
  shader: IShader;
};

const ShaderCard: React.FC<ShaderCardProps> = ({ shader }) => {
  return (
    <Box maxWidth="256px" minWidth="256px">
      <Card asChild>
        <div className="w-full flex flex-col gap-2">
          <AspectRatio
            ratio={280 / 212}
            className="overflow-hidden"
            style={{ borderRadius: "var(--radius-1)" }}
          >
            <img
              src={`https://images.unsplash.com/photo-1725714834562-8095c2038f0c?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`}
              alt={shader.name}
            />
          </AspectRatio>
          <div className="flex items-center gap-2 justify-between">
            <div className="flex flex-col flex-1 truncate">
              <Text truncate size="1" weight="bold">
                {shader.name}
              </Text>
              <Text truncate color="gray" size="1">
                Created {moment(shader.created_at).fromNow()}
              </Text>
            </div>
          </div>
        </div>
      </Card>
    </Box>
  );
};

export default ShaderCard;
