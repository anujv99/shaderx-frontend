import React, { useEffect, useState } from "react";
import { isWasmInitialized, setWasmInitializedCallback } from "./WgpuHelper";

type WgpuContextProps = React.PropsWithChildren;

type WgpuContextState = {
  initialized: boolean;
};

const defaultState: WgpuContextState = {
  initialized: false,
};

const WgpuContext = React.createContext(defaultState);

const WgpuContextProvider: React.FC<WgpuContextProps> = (props) => {
  const { children } = props;

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const onInit = () => {
      setInitialized(true);
    };

    if (!isWasmInitialized()) {
      setWasmInitializedCallback(onInit);
    } else {
      onInit();
    }
  }, []);

  return (
    <WgpuContext.Provider
      value={{
        initialized,
      }}
    >
      {children}
    </WgpuContext.Provider>
  );
};

export const useWgpu = () => React.useContext(WgpuContext);
export default WgpuContextProvider;
