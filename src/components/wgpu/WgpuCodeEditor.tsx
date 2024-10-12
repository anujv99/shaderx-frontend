import React, { useCallback, useEffect, useRef, useState } from "react";
import { ShaderCompilationInfo } from "shaderx-wgpu";
import { Editor, Monaco, OnMount } from "@monaco-editor/react";
import { Martian_Mono as CustomFont } from "next/font/google";

import { IShaderData } from "../../utils/types";
import WgpuCanvas, { WgpuCanvasRef } from "./WgpuCanvas";

type WgpuCodeEditorProps = {
  shader: IShaderData;
};

const editorFont = CustomFont({ subsets: ["latin"] });

const WgpuCodeEditor: React.FC<WgpuCodeEditorProps> = (props) => {
  const { shader } = props;

  const [shaderCode, setShaderCode] = useState<string>(shader.code);

  const wgpuCanvasRef = useRef<WgpuCanvasRef>(null);

  const monacoRef = useRef<Monaco | null>(null);
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const shaderCodeRef = useRef<string>(shaderCode);

  useEffect(() => {
    shaderCodeRef.current = shaderCode;
  }, [shaderCode]);

  const onAddMarker = useCallback((info: ShaderCompilationInfo) => {
    if (info.isEmpty()) {
      monacoRef.current?.editor.removeAllMarkers("owner");
      return;
    }

    const markers: any[] = [];

    info.forEach((error) => {
      if (!monacoRef.current || !error.location) return;
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
    async (newValue: string | undefined) => {
      if (!newValue) return;
      setShaderCode(newValue);

      if (!wgpuCanvasRef.current) return;

      const res = await wgpuCanvasRef.current.compileShader(newValue);
      onAddMarker(res);
    },
    [setShaderCode, onAddMarker],
  );

  const onRecompile = useCallback(async () => {
    if (!shaderCodeRef.current) return;

    const res = await wgpuCanvasRef.current?.updateShader(
      shaderCodeRef.current,
    );
    if (res) onAddMarker(res);
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
      <WgpuCanvas ref={wgpuCanvasRef} initialData={shader} />
      <Editor
        height="100%"
        width="100%"
        defaultLanguage="wgsl"
        theme="vs-dark"
        defaultValue={shaderCode}
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

export default WgpuCodeEditor;
