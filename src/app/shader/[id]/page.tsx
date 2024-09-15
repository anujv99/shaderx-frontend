"use client";

import { atom, useAtom, useSetAtom } from "jotai";
import React, { useEffect } from "react";

import { ShaderRoutes } from "../../../api/routes";
import { WgpuApp } from "../../../components/wgpu";

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

export function generateStaticParams() {
  return {
    params: {
      id: "1",
    },
  };
}

const Page: React.FC<PageProps> = ({ params }) => {
  const { id: shaderId } = params;
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

export default Page;
