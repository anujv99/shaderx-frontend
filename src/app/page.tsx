"use client";

import React from "react";
import { WgpuContextProvider } from "../context";
import { WgpuApp } from "../components/wgpu";

const Page: React.FC = () => {
  return (
    <WgpuContextProvider>
      <div className="mt-4">
        <WgpuApp />
      </div>
    </WgpuContextProvider>
  );
};

export default Page;
