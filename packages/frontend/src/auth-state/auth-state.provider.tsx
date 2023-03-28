import React, { useCallback, useEffect, useState } from 'react';
import { AuthStateContext, INITIAL_AUTH_STATE } from './auth-state.context';
import { IAuthState, IUser } from './auth-state.interface';
import jwt_decode from 'jwt-decode';

interface IAuthStateProviderProps {
  children: React.ReactNode;
}

export const AuthStateProvider: React.FC<IAuthStateProviderProps> = ({
  children,
}) => {
  const [{ user, isAuthResolved, token }, setAuthState] =
    useState<IAuthState>(INITIAL_AUTH_STATE);

  const setToken = useCallback(
    (token: string) => {
      const user = jwt_decode(token) as IUser;
      sessionStorage.setItem('token', token);
      setAuthState({
        token,
        user,
        isAuthResolved: true,
      });
    },
    [setAuthState],
  );

  const clearToken = useCallback(() => {
    setAuthState({ isAuthResolved: true });
    sessionStorage.removeItem('token');
  }, [setAuthState]);

  useEffect(() => {
    if (!isAuthResolved) {
      setTimeout(() => setAuthState({ isAuthResolved: true }), 0);
    }
  }, []);

  return (
    <AuthStateContext.Provider
      value={{ user, isAuthResolved, token, setToken, clearToken }}
    >
      {children}
    </AuthStateContext.Provider>
  );
};
