import { createContext } from 'react';
import { IAuthContext } from './auth-context.interface';

export const INITIAL_AUTH_STATE = {
  isAuthResolved: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setToken: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  clearToken: () => {},
};

export const AuthStateContext = createContext<IAuthContext>(INITIAL_AUTH_STATE);
