import React, { useEffect, useRef } from "react";
import { App } from "shaderx-wgpu";
import { useWgpu } from "../../context";

type WgpuAppProps = {};

const WgpuApp: React.FC<WgpuAppProps> = () => {
  const { initialized } = useWgpu();

  const wgpuApp = useRef<App | null>(null);

  useEffect(() => {
    if (initialized) {
      wgpuApp.current = new App();
    }

    return () => {
      wgpuApp.current?.free();
    };
  }, [initialized]);

  return <div id="wasm-canvas" className="w-full aspect-video" />;
};

export default WgpuApp;
