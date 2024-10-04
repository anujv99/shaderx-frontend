import React, { useCallback, useMemo, useState } from "react";
import {
  Badge,
  Button,
  Dialog,
  Flex,
  SegmentedControl,
  Spinner,
  Text,
  TextArea,
  TextField,
} from "@radix-ui/themes";

import {
  IShader,
  ShaderAccessValues,
  TUpdateShaderParams,
} from "../../utils/types";

type UpdateShaderDialogProps = {
  shader: IShader;
  close: () => void;
  updateShader: (shader: IShader, params: TUpdateShaderParams) => Promise<void>;
};

const UpdateShaderDialog: React.FC<UpdateShaderDialogProps> = ({
  shader,
  close,
  updateShader,
}) => {
  const [name, setName] = useState(shader.name);
  const [desc, setDesc] = useState(shader.description);
  const [tags, setTags] = useState(Object.values(shader.tags || {}).join(","));
  const [access, setAccess] = useState<string>(shader.access);
  const [call, setCall] = useState(false);

  const parsedTags = useMemo(() => {
    return tags
      .split(",")
      .map((t) => t.trim().replaceAll("#", "").replaceAll(" ", ""))
      .filter((t) => t.length > 0);
  }, [tags]);

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

  const onTagsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTags(e.target.value);
    },
    [setTags],
  );

  const onConfirm = useCallback(async () => {
    setCall(true);
    await updateShader(shader, {
      name,
      description: desc,
      tags: parsedTags.reduce(
        (acc, tag) => {
          acc[tag] = tag;
          return acc;
        },
        {} as typeof shader.tags,
      ),
      access: access as typeof shader.access,
    });
    setCall(false);
  }, [shader, name, desc, parsedTags, access, updateShader]);

  return (
    <Dialog.Root open={!!shader} onOpenChange={close}>
      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Update shader</Dialog.Title>
        <Dialog.Description size="2" className="mb-2">
          Update shader details.
        </Dialog.Description>
        <Flex className="flex-col gap-3 my-4">
          <div>
            <Text as="div" size="2" className="mb-2" weight="bold">
              Access
            </Text>
            <SegmentedControl.Root
              className="w-full"
              value={access}
              onValueChange={setAccess}
            >
              {ShaderAccessValues.map((value) => (
                <SegmentedControl.Item key={value} value={value}>
                  {value}
                </SegmentedControl.Item>
              ))}
            </SegmentedControl.Root>
          </div>
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
          <div>
            <Text as="div" size="2" className="mb-2" weight="bold">
              Tags (comma separated)
            </Text>
            <TextField.Root
              className="mb-2"
              value={tags}
              onChange={onTagsChange}
              placeholder="Tags"
              maxLength={255}
            />
            {parsedTags.length > 0 && (
              <Flex className="gap-2" wrap="wrap">
                {parsedTags.map((tag, i) => (
                  <Badge key={i}>#{tag}</Badge>
                ))}
              </Flex>
            )}
          </div>
        </Flex>
        <Flex className="justify-end gap-3">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Button onClick={onConfirm} disabled={call}>
            <Spinner loading={call} />
            Confirm
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default UpdateShaderDialog;
