import React from "react";
import moment from "moment";

import { IShader, TShaderAccess } from "../../utils/types";
import { AspectRatio, Box, Card, IconButton, Text } from "@radix-ui/themes";
import { DotsVerticalIcon, PlusIcon } from "@radix-ui/react-icons";
import { MyShaderMenu } from "../menu";

type MyShaderCardProps = {
  shader: IShader;
  archived?: boolean;
  openShader: (shader: IShader) => void;
  archiveShader: (shader: IShader) => Promise<void>;
  restoreShader: (shader: IShader) => Promise<void>;
  changeAccess: (shader: IShader, access: TShaderAccess) => Promise<void>;
  deleteShader: (shader: IShader) => void;
  editShader: (shader: IShader) => void;
};

const MyShaderCard: React.FC<MyShaderCardProps> = ({
  shader,
  archived,
  openShader,
  archiveShader,
  restoreShader,
  changeAccess,
  deleteShader,
  editShader,
}) => {
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
            <MyShaderMenu
              shader={shader}
              archived={archived}
              onOpen={openShader}
              onArchive={archiveShader}
              onRestore={restoreShader}
              onChangeAccess={changeAccess}
              onDelete={deleteShader}
              onEdit={editShader}
            >
              <IconButton size="1" variant="soft" color="gray">
                <DotsVerticalIcon width={16} height={16} />
              </IconButton>
            </MyShaderMenu>
          </div>
        </div>
      </Card>
    </Box>
  );
};

export default MyShaderCard;
