import { useContext } from 'react';
import { AuthStateContext } from './auth-state.context';

export const useAuthState = () => {
  return useContext(AuthStateContext);
};
