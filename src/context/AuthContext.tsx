"use client";
import React, { useCallback, useEffect, useState } from "react";
import { IUserProfile } from "../utils/types";
import { AuthRoutes } from "../api/routes";

type AuthContextProps = React.PropsWithChildren;

type AuthContextState = {
  authenticated: boolean;
  user: IUserProfile | undefined;
  logout: () => Promise<void>;
};

const defaultState: AuthContextState = {
  authenticated: false,
  user: undefined,
  logout: async () => {},
};

const AuthContext = React.createContext(defaultState);

const AuthContextProvider: React.FC<AuthContextProps> = (props) => {
  const { children } = props;

  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<IUserProfile | undefined>(undefined);

  useEffect(() => {
    AuthRoutes.validate().then((response) => {
      if (response) {
        setAuthenticated(true);
        setUser(response);
      }
    });
  }, []);

  const logout = useCallback(async () => {
    await AuthRoutes.logout();
    setAuthenticated(false);
  }, [setAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        user,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
export default AuthContextProvider;
