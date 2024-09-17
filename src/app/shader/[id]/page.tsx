"use client";
import React, { useEffect } from "react";
import { atom, useAtom, useSetAtom } from "jotai";

import Editor from "../Editor";
import { ShaderRoutes } from "../../../api/routes";

type PageProps = {
  params: {
    id: string;
  };
};

const shaderIdAtom = atom<string | null>(null);
const shaderData = atom((get) => {
  const shaderId = get(shaderIdAtom);
  if (!shaderId) return null;
  const data = ShaderRoutes.getShader(shaderId);
  return data;
});

const Page: React.FC<PageProps> = ({ params }) => {
  const { id: shaderId } = params;

  const setShaderId = useSetAtom(shaderIdAtom);
  const [shader] = useAtom(shaderData);

  useEffect(() => {
    setShaderId(shaderId);
  }, [shaderId]);

  if (!shader) return null;

  return <Editor data={shader.data} />;
};

export default Page;
