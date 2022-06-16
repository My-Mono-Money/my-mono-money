import { IAuthState } from './auth-state.interface';

export interface IAuthContext extends IAuthState {
  setToken: (token: string) => void;
  clearToken: () => void;
}
