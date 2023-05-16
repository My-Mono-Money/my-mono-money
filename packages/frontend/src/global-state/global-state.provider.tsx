import React, { useState } from 'react';
import {
  GlobalStateContext,
  INITIAL_GLOBAL_STATE,
} from './global-state.context';
import { IGlobalState } from './global-state.interface';
import { ISpaceMember } from '../types/space-members.interface';
import { ITokenItem } from '../types/token-item.interface';

interface IGlobalStateProviderProps {
  children: React.ReactNode;
}

export const GlobalStateProvider: React.FC<IGlobalStateProviderProps> = ({
  children,
}) => {
  const [
    {
      isPopupAddTokenEnable,
      settingsPageSelected,
      defaultUserSpace,
      spaceMembers,
      tokenList,
    },
    setGlobalState,
  ] = useState<IGlobalState>(INITIAL_GLOBAL_STATE);

  const setTogglePopupAddToken = (isShow: boolean) => {
    setGlobalState({
      isPopupAddTokenEnable: isShow,
      settingsPageSelected,
      defaultUserSpace,
      spaceMembers,
      tokenList,
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
      spaceMembers,
      tokenList,
    });
  };

  const setChangeDefaultUserSpace = (spaceId: string) => {
    setGlobalState({
      settingsPageSelected,
      isPopupAddTokenEnable,
      defaultUserSpace: spaceId,
      spaceMembers,
      tokenList,
    });
  };

  const setSpaceMembers = (result: ISpaceMember[]) => {
    setGlobalState({
      settingsPageSelected,
      isPopupAddTokenEnable,
      defaultUserSpace,
      spaceMembers: result,
      tokenList,
    });
  };

  const setTokenList = (result: ITokenItem[]) => {
    setGlobalState({
      settingsPageSelected,
      isPopupAddTokenEnable,
      defaultUserSpace,
      spaceMembers,
      tokenList: result,
    });
  };

  return (
    <GlobalStateContext.Provider
      value={{
        settingsPageSelected,
        isPopupAddTokenEnable,
        defaultUserSpace,
        spaceMembers,
        tokenList,
        setTogglePopupAddToken,
        setChoiceSettingsPage,
        setChangeDefaultUserSpace,
        setSpaceMembers,
        setTokenList,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};
