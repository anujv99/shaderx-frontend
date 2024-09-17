"use client";
import React, { useCallback, useEffect, useState } from "react";
import { IUserProfile } from "../utils/types";
import { AuthRoutes } from "../api/routes";
import { atom, useAtom, useSetAtom } from "jotai";

type AuthContextProps = React.PropsWithChildren;

type AuthContextState = {
  authenticated: boolean;
  user: IUserProfile | undefined;
  login: () => void;
  logout: () => Promise<void>;
};

const defaultState: AuthContextState = {
  authenticated: false,
  user: undefined,
  login: () => {},
  logout: async () => {},
};

const AuthContext = React.createContext(defaultState);

const handlePopupMessage = async (e: MessageEvent) => {
  if (e.origin !== window.location.origin) return false;

  const code = e.data?.authCode;
  if (!code) return false;

  await AuthRoutes.passCallbackToken(code);
  return true;
};

const loginUrlAtom = atom(async () => {
  const response = await AuthRoutes.getLoginUrl();
  return response;
});

const authenticatedAtom = atom(false);

const userAtom = atom<IUserProfile | undefined>(undefined);

const checkAuthAtom = atom(null, async (_, set) => {
  const user = await AuthRoutes.validate();
  if (!user) {
    set(authenticatedAtom, false);
    set(userAtom, undefined);
  } else {
    set(authenticatedAtom, true);
    set(userAtom, user);
  }
});

const AuthContextProvider: React.FC<AuthContextProps> = (props) => {
  const { children } = props;

  const checkAuth = useSetAtom(checkAuthAtom);
  const [loginUrl] = useAtom(loginUrlAtom);
  const [user] = useAtom(userAtom);
  const [authenticated, setAuthenticated] = useAtom(authenticatedAtom);

  const [popup, setPopup] = useState<Window | undefined>(undefined);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!popup) return;

    const channel = new BroadcastChannel("popup-channel");
    channel.onmessage = async (e) => {
      let res = await handlePopupMessage(e);
      if (res) checkAuth();
    };

    return () => {
      channel.close();
      setPopup(undefined);
    };
  }, [popup]);

  const logout = useCallback(async () => {
    await AuthRoutes.logout();
    setAuthenticated(false);
  }, [setAuthenticated]);

  const login = useCallback(() => {
    if (!loginUrl) return;

    const width = 500;
    const height = 600;
    const left = window.screenX + window.innerWidth / 2 - width / 2;
    const top = window.screenY + window.innerHeight / 2 - height / 2;

    const windowFeatures = `scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`;

    const win = window.open(loginUrl, "popup", windowFeatures);
    if (win) {
      win.focus();
      win.onclose = () => setPopup(undefined);
      setPopup(win);
    }
  }, [loginUrl]);

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        user,
        logout,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
export default AuthContextProvider;
