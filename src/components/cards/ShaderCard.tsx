import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import moment from "moment";

import { IShader } from "../../utils/types";
import {
  AspectRatio,
  Box,
  Card,
  DropdownMenu,
  IconButton,
  Spinner,
  Text,
} from "@radix-ui/themes";
import {
  DotsVerticalIcon,
  PlusIcon,
  ResumeIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { ShaderRoutes } from "../../api/routes";

type ShaderCardProps = {
  shader: IShader;
};

const ShaderCard: React.FC<ShaderCardProps> = ({ shader }) => {
  const [calling, setCalling] = useState("");

  const router = useRouter();

  const openShader = useCallback(() => {
    router.push(`/shader/${shader.id}`);
  }, [shader.id, router]);

  const deleteShader = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      setCalling("delete");
      await ShaderRoutes.deleteShader(shader.id);
      setCalling("");
    },
    [shader.id],
  );

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
            <DropdownMenu.Root>
              <DropdownMenu.Trigger className="cursor-pointer">
                <IconButton size="1" variant="soft" color="gray">
                  <DotsVerticalIcon width={16} height={16} />
                </IconButton>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content variant="soft" className="w-48">
                <DropdownMenu.Item onClick={openShader}>
                  <ResumeIcon />
                  Open
                </DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item
                  color="plum"
                  onClick={deleteShader}
                  disabled={calling === "delete"}
                >
                  <Spinner loading={calling === "delete"}>
                    <TrashIcon />
                  </Spinner>
                  Delete
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
        </div>
      </Card>
    </Box>
  );
};

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

export { ShaderCard, NewShaderCard };
