"use client";

import { useAtom } from "jotai";
import { loadable } from "jotai/utils";
import React from "react";

import { archivedShaderAtom } from "../../atoms";
import { ShaderCard } from "../../components/cards";

const loadableShaders = loadable(archivedShaderAtom);

const Page: React.FC = () => {
  const [shaders] = useAtom(loadableShaders);

  return (
    <div className="w-full flex gap-4 flex-wrap p-4">
      {shaders.state === "hasData" && (
        <>
          {(shaders.data || []).map((shader: any) => (
            <ShaderCard key={shader.id} shader={shader} />
          ))}
        </>
      )}
    </div>
  );
};

export default Page;
