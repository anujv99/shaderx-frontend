"use client";

import { useAtom } from "jotai";
import { loadable } from "jotai/utils";
import React from "react";

import { shaderAtom } from "../atoms";
import { ShaderCard } from "../components/cards";
import { IShader } from "../utils/types";

const loadableShaders = loadable(shaderAtom);

const Page: React.FC = () => {
  const [shaders] = useAtom(loadableShaders);

  return (
    <div className="w-full flex gap-4 flex-wrap p-4">
      {shaders.state === "hasData" && (
        <>
          {(shaders.data || []).map((shader: IShader) => (
            <ShaderCard key={shader.id} shader={shader} />
          ))}
        </>
      )}
    </div>
  );
};

export default Page;
