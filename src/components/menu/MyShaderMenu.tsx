import React, { useCallback, useState } from "react";
import { DropdownMenu, Spinner } from "@radix-ui/themes";
import {
  CountdownTimerIcon,
  ResumeIcon,
  TrashIcon,
} from "@radix-ui/react-icons";

import { IShader } from "../../utils/types";

type MyShaderMenuProps = {
  shader: IShader;
  archived?: boolean;
  children: React.ReactNode;
  onOpen: (shader: IShader) => void;
  onArchive: (shader: IShader) => Promise<void>;
  onRestore: (shader: IShader) => Promise<void>;
  onDelete: (shader: IShader) => void;
};

const MyShaderMenu: React.FC<MyShaderMenuProps> = ({
  shader,
  archived = false,
  children,
  onOpen,
  onArchive,
  onRestore,
  onDelete,
}) => {
  const [calling, setCalling] = useState("");

  const openShader = useCallback(() => {
    onOpen(shader);
  }, [shader, onOpen]);

  const deleteShader = useCallback(async () => {
    onDelete(shader);
  }, [shader, onDelete]);

  const archiveShader = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      setCalling("archive");
      await onArchive(shader);
      setCalling("");
    },
    [shader, onArchive],
  );

  const restoreShader = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      setCalling("restore");
      await onRestore(shader);
      setCalling("");
    },
    [shader, onRestore],
  );

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="cursor-pointer">
        {children}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content variant="soft" className="w-48">
        {!archived ? (
          <>
            <DropdownMenu.Item onClick={openShader}>
              <ResumeIcon />
              Open
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item
              onClick={archiveShader}
              disabled={calling === "archive"}
            >
              <Spinner loading={calling === "archive"}>
                <CountdownTimerIcon />
              </Spinner>
              Archive
            </DropdownMenu.Item>
          </>
        ) : (
          <DropdownMenu.Item
            onClick={restoreShader}
            disabled={calling === "restore"}
          >
            <Spinner loading={calling === "restore"}>
              <CountdownTimerIcon />
            </Spinner>
            Restore
          </DropdownMenu.Item>
        )}
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
  );
};

export default MyShaderMenu;
