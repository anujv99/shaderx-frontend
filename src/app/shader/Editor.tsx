"use client";
import React from "react";

import { WgpuNodeEditor } from "../../components/wgpu";
import { IShaderData } from "../../utils/types";

type EditorProps = {
  data: IShaderData;
};

const Editor: React.FC<EditorProps> = ({ data }) => {
  return <WgpuNodeEditor shader={data} />;
};

export default Editor;
