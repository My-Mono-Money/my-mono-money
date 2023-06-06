import { useContext } from 'react';
import { AuthStateContext } from './auth-state.context';
import { IAuthContext } from './auth-context.interface';

export const useAuthState = () => {
  return useContext(AuthStateContext);
};

export const useSignedInAuthState = (): Required<IAuthContext> => {
  const authContext = useAuthState();
  const { user, token } = authContext;

  if (!user || !token) {
    throw new Error('Not allowed');
  }

  return {
    ...authContext,
    user,
    token,
  };
};
