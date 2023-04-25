import React, { useCallback, useState } from 'react';
import {
  GlobalStateContext,
  INITIAL_GLOBAL_STATE,
} from './global-state.context';
import { IGlobalState } from './global-state.interface';

interface IGlobalStateProviderProps {
  children: React.ReactNode;
}

export const GlobalStateProvider: React.FC<IGlobalStateProviderProps> = ({
  children,
}) => {
  const [{ isPopupAddTokenEnable }, setIsPopupAddTokenEnable] =
    useState<IGlobalState>(INITIAL_GLOBAL_STATE);

  const setTogglePopupAddToken = useCallback(
    (isShow: boolean) => {
      setIsPopupAddTokenEnable({ isPopupAddTokenEnable: isShow });
      isShow
        ? localStorage.setItem('popupAddToken', 'true')
        : localStorage.removeItem('popupAddToken');
    },
    [setIsPopupAddTokenEnable],
  );

  return (
    <GlobalStateContext.Provider
      value={{
        isPopupAddTokenEnable,
        setTogglePopupAddToken,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};
