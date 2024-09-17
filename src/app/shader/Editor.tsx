"use client";
import React from "react";

import { WgpuApp } from "../../components/wgpu";
import { IShaderData } from "../../utils/types";

type EditorProps = {
  data: IShaderData;
};

const Editor: React.FC<EditorProps> = ({ data }) => {
  return (
    <div className="w-full">
      <WgpuApp shader={data} />
    </div>
  );
};

export default Editor;
