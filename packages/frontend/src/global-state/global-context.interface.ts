import { ISpaceMember } from '../types/space-members.interface';
import { ITokenItem } from '../types/token-item.interface';
import { IGlobalState } from './global-state.interface';

export interface IGlobalContext extends IGlobalState {
  setTogglePopupAddToken: (isShow: boolean) => void;
  setChoiceSettingsPage: (settingPage: string) => void;
  setChangeDefaultUserSpace: (spaceId: string) => void;
  setSpaceMembers: (spaceMembers: ISpaceMember[]) => void;
  setTokenList: (spaces: ITokenItem[]) => void;
}
