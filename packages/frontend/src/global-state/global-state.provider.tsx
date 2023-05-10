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
  const [{ isPopupAddTokenEnable, settingsPageSelected }, setGlobalState] =
    useState<IGlobalState>(INITIAL_GLOBAL_STATE);

  const setTogglePopupAddToken = useCallback(
    (isShow: boolean) => {
      setGlobalState({ isPopupAddTokenEnable: isShow, settingsPageSelected });
      isShow
        ? localStorage.setItem('popupAddToken', 'true')
        : localStorage.removeItem('popupAddToken');
    },
    [setGlobalState],
  );

  const setChoiceSettingsPage = (settingPage: string) => {
    setGlobalState({
      settingsPageSelected: settingPage,
      isPopupAddTokenEnable,
    });
  };

  return (
    <GlobalStateContext.Provider
      value={{
        settingsPageSelected,
        isPopupAddTokenEnable,
        setTogglePopupAddToken,
        setChoiceSettingsPage,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};
