"use client";

import React from "react";
import { WgpuContextProvider } from "../context";
import { WgpuApp } from "../components/wgpu";

const Page: React.FC = () => {
  return (
    <WgpuContextProvider>
      <div className="page">
        <WgpuApp />
      </div>
    </WgpuContextProvider>
  );
};

export default Page;
