const vertexShaderCode = `
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
`;

const newShaderCode = `
${vertexShaderCode}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
  let uv = vec2<f32>(in.vert_position.xy);
  let col = 0.5f + 0.5f * cos(buffer.time + uv.xyx + vec3(0.0f, 2.0f, 4.0f));
  return vec4<f32>(col, 1.0);
}
`;

const newShaderNodes = {
  nodes: [
    {
      id: "1",
      position: { x: 426.2030250742937, y: -161.53236496247186 },
      data: {},
      type: "fragPos",
      measured: { width: 133, height: 55 },
      selected: false,
      dragging: false,
    },
    {
      id: "3",
      position: { x: 598.0109785725049, y: -189.8986476200038 },
      data: {},
      type: "split",
      measured: { width: 79, height: 113 },
      selected: false,
      dragging: false,
    },
    {
      id: "5",
      position: { x: 714.7114293658365, y: -189.50257428096134 },
      data: {},
      type: "combine",
      measured: { width: 79, height: 113 },
      selected: false,
      dragging: false,
    },
    {
      id: "7",
      position: { x: 482.85787836598956, y: -96.00715208784283 },
      data: {
        color: { x: 0, y: 0.3568627450980392, z: 0.7294117647058823, w: 1 },
      },
      type: "color",
      measured: { width: 83, height: 72 },
      selected: true,
      dragging: false,
    },
    {
      id: "9",
      position: { x: 830.8056361961549, y: -147.54191415282656 },
      data: { op: "+" },
      type: "math",
      measured: { width: 190, height: 114 },
      selected: false,
      dragging: false,
    },
    {
      id: "11",
      position: { x: 518.4584794237653, y: -14.848722752225925 },
      data: {},
      type: "time",
      measured: { width: 50, height: 55 },
      selected: false,
      dragging: false,
    },
    {
      id: "13",
      position: { x: 1045.3907442099417, y: -70.16558142345977 },
      data: { op: "+" },
      type: "math",
      measured: { width: 190, height: 114 },
      selected: false,
      dragging: false,
    },
    {
      id: "15",
      position: { x: 1264.9288593825386, y: -53.20284068179211 },
      data: { op: "cos" },
      type: "trigno",
      measured: { width: 190, height: 95 },
      selected: false,
      dragging: false,
    },
    {
      id: "17",
      position: { x: 335.12859536050064, y: 48.19519042531262 },
      data: { number: 0.5 },
      type: "number",
      measured: { width: 236, height: 70 },
      selected: false,
      dragging: false,
    },
    {
      id: "19",
      position: { x: 1476.2725492042614, y: 1.793148441045318 },
      data: { op: "*" },
      type: "math",
      measured: { width: 190, height: 114 },
      selected: false,
      dragging: false,
    },
    {
      id: "21",
      position: { x: 1928.4661323930877, y: 171.23431840024398 },
      data: {},
      type: "fragColor",
      measured: { width: 112, height: 55 },
      selected: false,
      dragging: false,
    },
    {
      id: "23",
      position: { x: 1710.957728101545, y: 123.53436848839218 },
      data: { op: "+" },
      type: "math",
      measured: { width: 190, height: 114 },
      selected: false,
      dragging: false,
    },
  ],
  edges: [
    { source: "1", target: "3", id: "xy-edge__1-3", selected: false },
    {
      source: "3",
      sourceHandle: ":rg:",
      target: "5",
      targetHandle: ":r12:",
      id: "xy-edge__3:rg:-5:r12:",
      selected: false,
    },
    {
      source: "3",
      sourceHandle: ":rh:",
      target: "5",
      targetHandle: ":r13:",
      id: "xy-edge__3:rh:-5:r13:",
      selected: false,
    },
    {
      source: "3",
      sourceHandle: ":rg:",
      target: "5",
      targetHandle: ":r14:",
      id: "xy-edge__3:rg:-5:r14:",
      selected: false,
    },
    {
      source: "3",
      sourceHandle: ":rj:",
      target: "5",
      targetHandle: ":r15:",
      id: "xy-edge__3:rj:-5:r15:",
      selected: false,
    },
    {
      source: "5",
      target: "9",
      targetHandle: ":r21:",
      id: "xy-edge__5-9:r21:",
      selected: false,
    },
    {
      source: "7",
      target: "9",
      targetHandle: ":r22:",
      id: "xy-edge__7-9:r22:",
      selected: false,
    },
    {
      source: "11",
      target: "13",
      targetHandle: ":r3j:",
      id: "xy-edge__11-13:r3j:",
      selected: false,
    },
    {
      source: "9",
      sourceHandle: ":r23:",
      target: "13",
      targetHandle: ":r3i:",
      id: "xy-edge__9:r23:-13:r3i:",
      selected: false,
    },
    {
      source: "13",
      sourceHandle: ":r3k:",
      target: "15",
      id: "xy-edge__13:r3k:-15",
      selected: false,
    },
    {
      source: "15",
      target: "19",
      targetHandle: ":r68:",
      id: "xy-edge__15-19:r68:",
      selected: false,
    },
    {
      source: "17",
      target: "19",
      targetHandle: ":r69:",
      id: "xy-edge__17-19:r69:",
      selected: false,
    },
    {
      source: "19",
      sourceHandle: ":r6a:",
      target: "23",
      targetHandle: ":r7d:",
      id: "xy-edge__19:r6a:-23:r7d:",
      selected: false,
    },
    {
      source: "17",
      target: "23",
      targetHandle: ":r7e:",
      id: "xy-edge__17-23:r7e:",
      selected: false,
    },
    {
      source: "23",
      sourceHandle: ":r7f:",
      target: "21",
      id: "xy-edge__23:r7f:-21",
      selected: false,
    },
  ],
};

export { newShaderCode, vertexShaderCode, newShaderNodes };
