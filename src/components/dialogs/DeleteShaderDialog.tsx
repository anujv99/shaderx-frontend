import React, { useCallback, useState } from "react";
import { Button, Dialog, Flex, Spinner } from "@radix-ui/themes";

import { IShader } from "../../utils/types";

type DeleteShaderDialogProps = {
  shader: IShader;
  deleteShader: (shader: IShader) => Promise<void>;
  close: () => void;
};

const DeleteShaderDialog: React.FC<DeleteShaderDialogProps> = ({
  shader,
  deleteShader,
  close,
}) => {
  const [call, setCall] = useState(false);

  const onDelete = useCallback(async () => {
    setCall(true);
    await deleteShader(shader);
    close();
  }, [deleteShader, shader, close]);

  return (
    <Dialog.Root open onOpenChange={close}>
      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Delete shader {shader.name}?</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to delete this shader? This action cannot be
          undone.
        </Dialog.Description>
        <Flex className="justify-end gap-3">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Button color="red" onClick={onDelete} disabled={call}>
            <Spinner loading={call} />
            Delete
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default DeleteShaderDialog;
