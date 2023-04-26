import { useContext } from 'react';
import { GlobalStateContext } from './global-state.context';

export const useGlobalState = () => {
  return useContext(GlobalStateContext);
};
