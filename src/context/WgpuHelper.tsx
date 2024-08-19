import init from "shaderx-wgpu";

const setWasmInitialized = (initialized: boolean) => {
  // @ts-ignore
  window.wasmInitialized = initialized;
};

const setWasmInitializedCallback = (callback: () => void) => {
  // @ts-ignore
  window.wasmInitializedCallback = callback;
};

const isWasmInitialized = () => {
  // @ts-ignore
  return !!window.wasmInitialized;
};

if (typeof window !== "undefined") {
  window.addEventListener("load", () => {
    init().then(() => {
      setWasmInitialized(true);
      // @ts-ignore
      window.wasmInitializedCallback?.();
      console.info("[WgpuHelper] wasm initialized");
    });
  });
}

export { setWasmInitialized, setWasmInitializedCallback, isWasmInitialized };
