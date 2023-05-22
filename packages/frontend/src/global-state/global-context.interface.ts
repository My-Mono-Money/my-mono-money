import { ISpaceMember } from '../types/space-members.interface';
import { ITokenItem } from '../types/token-item.interface';
import { IUserSpace } from '../types/user-space.interface';
import { IGlobalState } from './global-state.interface';

export interface IGlobalContext extends IGlobalState {
  setTogglePopupAddToken: (isShow: boolean) => void;
  setChoiceSettingsPage: (settingPage: string) => void;
  setChangeDefaultUserSpace: (spaceId: string) => void;
  setSpaceMembers: (spaceMembers: ISpaceMember[]) => void;
  setSpaces: (spaces: IUserSpace[]) => void;
  setTokenList: (result: ITokenItem[]) => void;
  setClearAllGlobalState: () => void;
}
