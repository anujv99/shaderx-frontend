import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { App, ShaderCompilationInfo, getMaxDimension2D } from "shaderx-wgpu";
import { Editor, Monaco, OnMount } from "@monaco-editor/react";
import { Martian_Mono as CustomFont } from "next/font/google";

const editorFont = CustomFont({ subsets: ["latin"] });

import { useWgpu } from "../../context";
import { ITextureSize } from "../../utils/types";

type WgpuAppProps = {};

const defaultShaderCode = `
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
  let color = 0.5f + in.vert_position.xyz * 0.5f;
  return vec4<f32>(color, 1.0);
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
  const shaderCodeRef = useRef<string>(shaderCode);

  const id = useId();

  useEffect(() => {
    shaderCodeRef.current = shaderCode;
  }, [shaderCode]);

  useEffect(() => {
    if (initialized) {
      App.new({ containerId: id }).then((app: App) => {
        wgpuApp.current = app;
        wgpuApp.current.updateShader(defaultShaderCode);
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

  const onAddMarker = useCallback((info: ShaderCompilationInfo) => {
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
  }, []);

  const onChange = useCallback(
    (newValue: string | undefined) => {
      if (!newValue) return;
      setShaderCode(newValue);

      wgpuApp.current?.compileShader(newValue).then((info) => {
        onAddMarker(info);
      });
    },
    [setShaderCode, onAddMarker],
  );

  const onRecompile = useCallback(() => {
    wgpuApp.current?.updateShader(shaderCodeRef.current).then((info) => {
      onAddMarker(info);
    });
  }, [onAddMarker]);

  const onMount: OnMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    monaco.editor.addCommand({
      id: "recompile-shader",
      run: onRecompile,
    });

    const recompileShortcut = monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter;

    monaco.editor.addKeybindingRules([
      {
        keybinding: recompileShortcut,
        command: "recompile-shader",
      },
      {
        keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyG,
        command: "editor.action.quickCommand",
      },
    ]);

    editor.addAction({
      id: "recompile-shader",
      label: "Recompile Shader",
      keybindings: [recompileShortcut],
      run: onRecompile,
    });
  }, []);

  return (
    <div className="w-full grid grid-cols-2 gap-4 relative">
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
          fontFamily: editorFont.style.fontFamily,
          fontSize: 13,
        }}
        onChange={onChange}
        onMount={onMount}
      />
    </div>
  );
};

export default WgpuApp;
