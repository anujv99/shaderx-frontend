import React, { useCallback, useState } from "react";
import { DropdownMenu, Spinner } from "@radix-ui/themes";
import {
  CheckIcon,
  CountdownTimerIcon,
  Pencil1Icon,
  ResumeIcon,
  Share2Icon,
  TrashIcon,
} from "@radix-ui/react-icons";

import { IShader, TShaderAccess } from "../../utils/types";
import { cx } from "../../utils";

type MyShaderMenuProps = {
  shader: IShader;
  archived?: boolean;
  children: React.ReactNode;
  onOpen: (shader: IShader) => void;
  onArchive: (shader: IShader) => Promise<void>;
  onRestore: (shader: IShader) => Promise<void>;
  onChangeAccess: (shader: IShader, access: TShaderAccess) => Promise<void>;
  onDelete: (shader: IShader) => void;
  onEdit: (shader: IShader) => void;
};

const MyShaderMenu: React.FC<MyShaderMenuProps> = ({
  shader,
  archived = false,
  children,
  onOpen,
  onArchive,
  onRestore,
  onChangeAccess,
  onDelete,
  onEdit,
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

  const editShader = useCallback(() => {
    onEdit(shader);
  }, [shader, onEdit]);

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
            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger>
                <Share2Icon />
                Access
              </DropdownMenu.SubTrigger>
              <DropdownMenu.SubContent className="w-48">
                <DropdownMenu.Item
                  onClick={() => onChangeAccess(shader, "Public")}
                >
                  <CheckIcon
                    className={cx({ "opacity-0": shader.access !== "Public" })}
                  />
                  Public
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onClick={() => onChangeAccess(shader, "Unlisted")}
                >
                  <CheckIcon
                    className={cx({
                      "opacity-0": shader.access !== "Unlisted",
                    })}
                  />
                  Unlisted
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onClick={() => onChangeAccess(shader, "Private")}
                >
                  <CheckIcon
                    className={cx({ "opacity-0": shader.access !== "Private" })}
                  />
                  Private
                </DropdownMenu.Item>
              </DropdownMenu.SubContent>
            </DropdownMenu.Sub>
            <DropdownMenu.Item onClick={editShader}>
              <Pencil1Icon />
              Edit
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
