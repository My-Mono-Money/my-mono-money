import { ISpaceMember } from '../types/space-members.interface';
import { ITokenItem } from '../types/token-item.interface';

export interface IGlobalState {
  isPopupAddTokenEnable: boolean;
  settingsPageSelected: string;
  defaultUserSpace: string;
  spaceMembers: ISpaceMember[];
  tokenList: ITokenItem[];
}
