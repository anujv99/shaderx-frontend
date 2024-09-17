import {
  Button,
  Dialog,
  Flex,
  Spinner,
  Text,
  TextArea,
  TextField,
} from "@radix-ui/themes";
import React, { useCallback, useState } from "react";
import { ShaderRoutes } from "../../api/routes";
import { newShaderCode } from "../../utils/data";

type NewShaderDialogProps = {
  children: React.ReactNode;
};

const NewShaderDialog: React.FC<NewShaderDialogProps> = ({ children }) => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [open, setOpen] = useState(false);
  const [call, setCall] = useState(false);

  const onNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value);
    },
    [setName],
  );

  const onDescChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setDesc(e.target.value);
    },
    [setDesc],
  );

  const onCreate = useCallback(async () => {
    setCall(true);
    await ShaderRoutes.createNewShader({
      name,
      description: desc,
      data: {
        code: newShaderCode,
      },
    });
    setCall(false);
    setOpen(false);
  }, [name, desc, setCall, setOpen]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <div>{children}</div>
      </Dialog.Trigger>
      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Create new shader</Dialog.Title>
        <Dialog.Description size="2" className="mb-2">
          Create a new shader with default code.
        </Dialog.Description>
        <Flex className="flex-col gap-3 my-4">
          <label>
            <Text as="div" size="2" className="mb-2" weight="bold">
              Name
            </Text>
            <TextField.Root
              value={name}
              onChange={onNameChange}
              placeholder="Shader name"
              maxLength={255}
            />
          </label>
          <label>
            <Text as="div" size="2" className="mb-2" weight="bold">
              Description
            </Text>
            <TextArea
              value={desc}
              onChange={onDescChange}
              placeholder="Shader description"
              maxLength={8192}
            />
          </label>
        </Flex>
        <Flex className="justify-end gap-3">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Button onClick={onCreate} disabled={call}>
            <Spinner loading={call} />
            Create
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default NewShaderDialog;
