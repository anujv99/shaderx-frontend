import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { App, ICompilationMessage } from "shaderx-wgpu";
import { useWgpu } from "../../context";
import { ITextureSize } from "../../utils/types";
import { getMaxDimension2D } from "shaderx-wgpu";
import { Editor, Monaco, OnMount } from "@monaco-editor/react";

type WgpuAppProps = {};

const defaultShaderCode = `
struct VertexOutput {
  @builtin(position) clip_position: vec4<f32>,
};

@vertex
fn vs_main(
  @builtin(vertex_index) index: u32,
) -> VertexOutput {
  var output: VertexOutput;
  let x = f32(1 - i32(index)) * 0.5;
  let y = f32(i32(index & 1u) * 2 - 1) * 0.5;
  output.clip_position = vec4<f32>(x, y, 0.0, 1.0);
  return output;
}

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
  return vec4<f32>(1.0, 1.0, 0.0, 1.0);
}
`;

const WgpuApp: React.FC<WgpuAppProps> = () => {
  const { initialized } = useWgpu();

  const [maxSize, setMaxSize] = useState<ITextureSize>({
    width: 0,
    height: 0,
  });
  const [shaderCode, setShaderCode] = useState<string>(defaultShaderCode);

  const wgpuApp = useRef<App | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  const id = useId();

  useEffect(() => {
    if (initialized) {
      // @ts-ignore
      new App({ containerId: id }).then((app: App) => {
        wgpuApp.current = app;
      });
      const maxSize = getMaxDimension2D();
      setMaxSize({
        width: maxSize,
        height: maxSize,
      });
    }

    return () => {
      wgpuApp.current?.free();
    };
  }, [initialized]);

  const onMount: OnMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  }, []);

  const onChange = useCallback(
    (newValue: string | undefined) => {
      if (!newValue) return;
      setShaderCode(newValue);

      wgpuApp.current?.compileShader(newValue).then((info) => {
        if (info.isEmpty()) {
          monacoRef.current?.editor.removeAllMarkers("owner");
          return;
        }

        const markers: any[] = [];

        info.forEach((error) => {
          if (!monacoRef.current || !error.location) return;
          console.error(error);

          markers.push({
            message: error.message,
            severity:
              error.type === "error"
                ? monacoRef.current.MarkerSeverity.Error
                : monacoRef.current.MarkerSeverity.Warning,
            startLineNumber: error.location.lineNumber,
            startColumn: error.location.linePosition,
            endLineNumber: error.location.lineNumber,
            endColumn: error.location.linePosition + error.location.length,
          });
        });

        const model = editorRef.current?.getModel();
        if (monacoRef.current && model) {
          monacoRef.current.editor.setModelMarkers(model, "owner", markers);
        }
      });
    },
    [setShaderCode],
  );

  const onRecompile = useCallback(() => {
    wgpuApp.current?.updateShader(shaderCode);
  }, [shaderCode]);

  return (
    <div className="w-full grid grid-cols-2 gap-4 relative">
      <button
        className="absolute left-0 top-0 bg-white text-black"
        onClick={onRecompile}
      >
        Recompile
      </button>
      <div
        id={id}
        className="w-full aspect-video"
        style={{
          maxWidth: maxSize.width,
          maxHeight: maxSize.height,
        }}
      />
      <Editor
        height="100%"
        width="100%"
        defaultLanguage="wgsl"
        theme="vs-dark"
        defaultValue={defaultShaderCode}
        value={shaderCode}
        options={{
          minimap: { enabled: false },
        }}
        onChange={onChange}
        onMount={onMount}
      />
    </div>
  );
};

export default WgpuApp;
