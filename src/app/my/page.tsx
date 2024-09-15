"use client";

import { useAtom } from "jotai";
import { loadable } from "jotai/utils";
import React from "react";

import { myShaderAtom } from "../../atoms";
import { NewShaderCard, ShaderCard } from "../../components/cards";
import { NewShaderDialog } from "../../components/dialogs";

const loadableShaders = loadable(myShaderAtom);

const Page: React.FC = () => {
  const [shaders] = useAtom(loadableShaders);

  return (
    <div className="w-full flex gap-4 flex-wrap p-4">
      <NewShaderDialog>
        <NewShaderCard />
      </NewShaderDialog>
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
