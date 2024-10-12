import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { DropdownMenu, Flex, Separator, TextField } from "@radix-ui/themes";
import React, { useCallback, useState } from "react";
import { stopPropagation } from "../../utils/helper";

type NodeMenuProps = {
  nodes: { [key: string]: any };
  position: { x: number; y: number };
  onNodeSelect: (node: string) => void;
  onNodeCopy: () => void;
  onNodePaste: () => void;
  close: () => void;
};

const NodeMenu: React.FC<NodeMenuProps> = ({
  nodes,
  position,
  onNodeSelect,
  onNodeCopy,
  onNodePaste,
  close,
}) => {
  const [search, setSearch] = useState("");

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    },
    [setSearch],
  );

  return (
    <DropdownMenu.Root open onOpenChange={close}>
      <DropdownMenu.Trigger>
        <div
          className="w-px h-px opacity-0"
          style={{ position: "fixed", top: position.y, left: position.x }}
        />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="p-0" size="1">
        <Flex className="flex-col">
          <div onKeyDown={stopPropagation}>
            <TextField.Root
              placeholder="Search nodes..."
              size="1"
              autoFocus
              value={search}
              onChange={onChange}
            >
              <TextField.Slot>
                <MagnifyingGlassIcon className="w-4 h-4" />
              </TextField.Slot>
            </TextField.Root>
          </div>
          <Separator className="w-full my-2" />
          <Flex className="flex-col">
            {Object.keys(nodes)
              .filter((key) => key.toLowerCase().includes(search.toLowerCase()))
              .map((key) => (
                <DropdownMenu.Item key={key} onClick={() => onNodeSelect(key)}>
                  {key}
                </DropdownMenu.Item>
              ))}
          </Flex>
          <Separator className="w-full my-2" />
          <DropdownMenu.Item onClick={onNodeCopy}>Copy</DropdownMenu.Item>
          <DropdownMenu.Item onClick={onNodePaste}>Paste</DropdownMenu.Item>
        </Flex>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default NodeMenu;
