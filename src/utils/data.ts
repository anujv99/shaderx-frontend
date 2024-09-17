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

export { newShaderCode };
