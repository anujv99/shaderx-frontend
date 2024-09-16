import React from "react";
import moment from "moment";

import { Box, Card, Text } from "@radix-ui/themes";
import { PlusIcon } from "@radix-ui/react-icons";

const NewShaderCard: React.FC = () => {
  return (
    <Box maxWidth="256px" minWidth="256px">
      <Card asChild>
        <button
          className="w-full h-full cursor-pointer flex items-center justify-center gap-1"
          style={{
            minHeight: 60,
          }}
        >
          <PlusIcon className="w-4 h-4" />
          <Text color="gray" size="2">
            New shader
          </Text>
        </button>
      </Card>
    </Box>
  );
};

export default NewShaderCard;
