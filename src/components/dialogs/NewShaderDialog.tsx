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

type NewShaderDialogProps = {
  children: React.ReactNode;
};

const newShaderCode = `
struct CommonBuffer {
  time: f32,
  delta_time: f32,
  // padding
  pad0: f32,
  pad1: f32,
}

@group(0) @binding(0)
var<uniform> buffer: CommonBuffer;

struct VertexOutput {
  @builtin(position) clip_position: vec4<f32>,
  @location(0) vert_position: vec4<f32>,
};

@vertex
fn vs_main(
  @builtin(vertex_index) index: u32,
) -> VertexOutput {
  // https://randallr.wordpress.com/2014/06/14/rendering-a-screen-covering-triangle-in-opengl/
  var output: VertexOutput;
  let x = -1.0f + f32((index & 1u) << 2u);
  let y = -1.0f + f32((index & 2u) << 1u);
  output.clip_position = vec4<f32>(x, y, 0.0, 1.0);
  output.vert_position = output.clip_position;
  return output;
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
  let uv = vec2<f32>(in.vert_position.xy);
  let col = 0.5f + 0.5f * cos(buffer.time + uv.xyx + vec3(0.0f, 2.0f, 4.0f));
  return vec4<f32>(col, 1.0);
}
`;

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
