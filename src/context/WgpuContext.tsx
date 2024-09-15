"use client";
import React, { useEffect, useRef, useState } from "react";
import { isWasmInitialized, setWasmInitializedCallback } from "./WgpuHelper";
import { EventHandler } from "shaderx-wgpu";

type WgpuContextProps = React.PropsWithChildren;

type WgpuContextState = {
  initialized: boolean;
  eventHandler: EventHandler | null;
};

const defaultState: WgpuContextState = {
  initialized: false,
  eventHandler: null,
};

const WgpuContext = React.createContext(defaultState);

const WgpuContextProvider: React.FC<WgpuContextProps> = (props) => {
  const { children } = props;

  const [initialized, setInitialized] = useState(false);
  const [eventHandler, setEventHandler] = useState<EventHandler | null>(null);

  const eventHandlerRef = useRef(eventHandler);

  useEffect(() => {
    const onInit = () => {
      setInitialized(true);

      if (!eventHandlerRef.current) {
        eventHandlerRef.current = new EventHandler();
        setEventHandler(eventHandlerRef.current);
      }
    };

    if (!isWasmInitialized()) {
      setWasmInitializedCallback(onInit);
    } else {
      onInit();
    }

    return () => {
      setInitialized(false);
    };
  }, []);

  return (
    <WgpuContext.Provider
      value={{
        initialized,
        eventHandler,
      }}
    >
      {children}
    </WgpuContext.Provider>
  );
};

export const useWgpu = () => React.useContext(WgpuContext);
export default WgpuContextProvider;
