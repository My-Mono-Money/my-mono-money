import { IGlobalState } from './global-state.interface';

export interface IGlobalContext extends IGlobalState {
  setTogglePopupAddToken: (isShow: boolean) => void;
}
