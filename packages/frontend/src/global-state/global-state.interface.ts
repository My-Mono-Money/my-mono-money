import { ISpaceMember } from '../types/space-members.interface';
import { ITokenItem } from '../types/token-item.interface';
import { IUserSpace } from '../types/user-space.interface';

export interface IGlobalState {
  isPopupAddTokenEnable: boolean;
  settingsPageSelected: string;
  defaultUserSpace: string;
  spaceMembers: ISpaceMember[];
  spaces: IUserSpace[];
  tokenList: ITokenItem[];
}
