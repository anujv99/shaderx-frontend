import React, { useEffect, useId, useRef, useState } from "react";
import { App } from "shaderx-wgpu";
import { useWgpu } from "../../context";
import { ITextureSize } from "../../utils/types";
import { getMaxDimension2D } from "shaderx-wgpu";

type WgpuAppProps = {};

const WgpuApp: React.FC<WgpuAppProps> = () => {
  const { initialized } = useWgpu();

  const [maxSize, setMaxSize] = useState<ITextureSize>({
    width: 0,
    height: 0,
  });

  const wgpuApp = useRef<App | null>(null);
  const id = useId();

  useEffect(() => {
    if (initialized) {
      wgpuApp.current = new App({
        containerId: id,
      });
      const maxSize = getMaxDimension2D();
      setMaxSize({
        width: maxSize,
        height: maxSize,
      });
    }

    return () => {
      wgpuApp.current?.free();
    };
  }, [initialized]);

  return (
    <div
      id={id}
      className="w-full aspect-video"
      style={{
        maxWidth: maxSize.width,
        maxHeight: maxSize.height,
      }}
    />
  );
};

export default WgpuApp;
