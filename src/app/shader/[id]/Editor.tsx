"use client";

import { atom, useAtom, useSetAtom } from "jotai";
import React, { useEffect } from "react";

import { ShaderRoutes } from "../../../api/routes";
import { WgpuApp } from "../../../components/wgpu";

type EditorProps = {
  id: string;
};

const shaderIdAtom = atom<string | null>(null);
const shaderData = atom((get) => {
  const shaderId = get(shaderIdAtom);
  if (!shaderId) return null;
  const data = ShaderRoutes.getShader(shaderId);
  return data;
});

const Editor: React.FC<EditorProps> = ({ id: shaderId }) => {
  const setShaderId = useSetAtom(shaderIdAtom);
  const [shader] = useAtom(shaderData);

  useEffect(() => {
    setShaderId(shaderId);
  }, []);

  if (!shader) return null;

  return (
    <div className="w-full">
      <WgpuApp shader={shader.data} />
    </div>
  );
};

export default Editor;
