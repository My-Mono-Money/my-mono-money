import { createContext } from 'react';
import { IAuthContext } from './auth-context.interface';
import jwt_decode from 'jwt-decode';
import { IUser } from './auth-state.interface';

const token = localStorage.getItem('token') ?? undefined;

export const INITIAL_AUTH_STATE = {
  token,
  isAuthResolved: Boolean(token),
  user: token ? (jwt_decode(token) as IUser) : undefined,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setToken: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  clearToken: () => {},
};

export const AuthStateContext = createContext<IAuthContext>(INITIAL_AUTH_STATE);
