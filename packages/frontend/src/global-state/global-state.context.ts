import { createContext } from 'react';
import { IGlobalContext } from './global-context.interface';

const isShow = localStorage.getItem('popupAddToken') ?? undefined;
export const INITIAL_GLOBAL_STATE = {
  isPopupAddTokenEnable: Boolean(isShow),
  settingsPageSelected: 'Item 1',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setTogglePopupAddToken: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setChoiceSettingsPage: () => {},
};

export const GlobalStateContext =
  createContext<IGlobalContext>(INITIAL_GLOBAL_STATE);
