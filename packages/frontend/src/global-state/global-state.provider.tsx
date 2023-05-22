import React, { useState } from 'react';
import {
  GlobalStateContext,
  INITIAL_GLOBAL_STATE,
} from './global-state.context';
import { IGlobalState } from './global-state.interface';
import { ISpaceMember } from '../types/space-members.interface';
import { ITokenItem } from '../types/token-item.interface';
import { IUserSpace } from '../types/user-space.interface';

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
      spaces,
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
      spaces,
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
      spaces,
      tokenList,
    });
  };

  const setChangeDefaultUserSpace = (spaceId: string) => {
    setGlobalState({
      settingsPageSelected,
      isPopupAddTokenEnable,
      defaultUserSpace: spaceId,
      spaceMembers,
      spaces,
      tokenList,
    });
  };

  const setSpaceMembers = (result: ISpaceMember[]) => {
    setGlobalState({
      settingsPageSelected,
      isPopupAddTokenEnable,
      defaultUserSpace,
      spaceMembers: result,
      spaces,
      tokenList,
    });
  };

  const setSpaces = (result: IUserSpace[]) => {
    setGlobalState({
      settingsPageSelected,
      isPopupAddTokenEnable,
      defaultUserSpace,
      spaceMembers,
      spaces: result,
      tokenList,
    });
  };

  const setTokenList = (result: ITokenItem[]) => {
    setGlobalState({
      settingsPageSelected,
      isPopupAddTokenEnable,
      defaultUserSpace,
      spaceMembers,
      spaces,
      tokenList: result,
    });
  };

  const setClearAllGlobalState = () => {
    setGlobalState({
      settingsPageSelected: 'Item 1',
      isPopupAddTokenEnable,
      defaultUserSpace: '',
      spaceMembers: [],
      spaces: [],
      tokenList: [],
    });
  };

  return (
    <GlobalStateContext.Provider
      value={{
        settingsPageSelected,
        isPopupAddTokenEnable,
        defaultUserSpace,
        spaceMembers,
        spaces,
        tokenList,
        setTogglePopupAddToken,
        setChoiceSettingsPage,
        setChangeDefaultUserSpace,
        setSpaceMembers,
        setSpaces,
        setTokenList,
        setClearAllGlobalState,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};
