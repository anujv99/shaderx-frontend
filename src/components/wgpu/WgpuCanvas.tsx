import React, {
  forwardRef,
  Ref,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { IShaderData, ITextureSize } from "../../utils/types";
import {
  getMaxDimension2D,
  InstanceHandle,
  ShaderCompilationInfo,
} from "shaderx-wgpu";
import { useWgpu } from "../../context";

type WgpuCanvasProps = {
  initialData: IShaderData;
};

type WgpuCanvasRef = {
  updateShader: (shaderSource: string) => Promise<ShaderCompilationInfo>;
  compileShader: (shaderSource: string) => Promise<ShaderCompilationInfo>;
};

const WgpuCanvas = forwardRef(
  (props: WgpuCanvasProps, ref: Ref<WgpuCanvasRef>) => {
    const { initialData } = props;

    const id = useId();
    const { eventHandler } = useWgpu();

    const instanceHandleRef = useRef<InstanceHandle | null>(null);
    const createdInstanceRef = useRef(false);

    const [maxSize, setMaxSize] = useState<ITextureSize>({
      width: 0,
      height: 0,
    });

    useEffect(() => {
      if (eventHandler && !createdInstanceRef.current) {
        createdInstanceRef.current = true;
        eventHandler.create_instance({
          containerId: id,
          callback(handle) {
            instanceHandleRef.current = handle;
            eventHandler.update_shader(instanceHandleRef.current, {
              shaderSource: initialData.code,
              callback: () => {},
            });
          },
        });

        const maxSize = getMaxDimension2D();
        setMaxSize({
          width: maxSize,
          height: maxSize,
        });
      }

      return () => {
        if (eventHandler && instanceHandleRef.current) {
          eventHandler.destroy_instance(instanceHandleRef.current);
          instanceHandleRef.current = null;
        }
      };
    }, [eventHandler]);

    const compileShader = useCallback(
      (shaderSource: string) => {
        return new Promise<ShaderCompilationInfo>((resolve, reject) => {
          if (eventHandler && instanceHandleRef.current) {
            eventHandler.compile_shader(instanceHandleRef.current, {
              shaderSource,
              callback: resolve,
            });
          } else {
            reject(
              new Error("[WgpuCanvas.tsx] eventHandler is not initialized"),
            );
          }
        });
      },
      [eventHandler],
    );

    const updateShader = useCallback(
      (shaderSource: string) => {
        return new Promise<ShaderCompilationInfo>((resolve, reject) => {
          if (eventHandler && instanceHandleRef.current) {
            eventHandler.update_shader(instanceHandleRef.current, {
              shaderSource,
              callback: resolve,
            });
          } else {
            reject(
              new Error("[WgpuCanvas.tsx] eventHandler is not initialized"),
            );
          }
        });
      },
      [eventHandler],
    );

    useImperativeHandle(
      ref,
      () => ({
        updateShader,
        compileShader,
      }),
      [updateShader, compileShader],
    );

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
  },
);

export default WgpuCanvas;
export type { WgpuCanvasRef };
