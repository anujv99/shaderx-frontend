"use client";

import { useAtom } from "jotai";
import React from "react";

import { ShaderCard } from "../components/cards";
import { IShader } from "../utils/types";
import { ShadersAtom } from "../atoms";

const Page: React.FC = () => {
  const [shaders] = useAtom(ShadersAtom.shaderAtom);

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
