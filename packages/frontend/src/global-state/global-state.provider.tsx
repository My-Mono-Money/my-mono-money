import React, { useState } from 'react';
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
  const [
    { isPopupAddTokenEnable, settingsPageSelected, defaultUserSpace },
    setGlobalState,
  ] = useState<IGlobalState>(INITIAL_GLOBAL_STATE);

  const setTogglePopupAddToken = (isShow: boolean) => {
    setGlobalState({
      isPopupAddTokenEnable: isShow,
      settingsPageSelected,
      defaultUserSpace,
    });
    isShow
      ? localStorage.setItem('popupAddToken', 'true')
      : localStorage.removeItem('popupAddToken');
  };

  const setChoiceSettingsPage = (settingPage: string) => {
    setGlobalState({
      settingsPageSelected: settingPage,
      isPopupAddTokenEnable,
      defaultUserSpace,
    });
  };

  const setChangeDefaultUserSpace = (spaceId: string) => {
    setGlobalState({
      settingsPageSelected,
      isPopupAddTokenEnable,
      defaultUserSpace: spaceId,
    });
  };

  const setClearAllGlobalState = () => {
    setGlobalState({
      settingsPageSelected: 'integration',
      isPopupAddTokenEnable,
      defaultUserSpace: '',
    });
  };

  return (
    <GlobalStateContext.Provider
      value={{
        settingsPageSelected,
        isPopupAddTokenEnable,
        defaultUserSpace,
        setTogglePopupAddToken,
        setChoiceSettingsPage,
        setChangeDefaultUserSpace,
        setClearAllGlobalState,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};
