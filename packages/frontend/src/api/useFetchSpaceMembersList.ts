import axios from 'axios';
import { useAuthState } from '../auth-state/use-auth-state.hook';
import { ISpaceMember } from '../types/space-members.interface';
import { useGlobalState } from '../global-state/use-global-state.hook';

interface ISpaceMembersResponse {
  items: ISpaceMember[];
}

export const useFetchSpaceMembersList = (): [
  ISpaceMember[],
  () => Promise<ISpaceMember[] | undefined>,
] => {
  const { token, user } = useAuthState();
  const { spaceMembers, setSpaceMembers } = useGlobalState();

  const fetchSpaceMembers = async () => {
    try {
      const response = await axios.get<ISpaceMembersResponse>(
        `/spaces/${user?.email}/members`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setSpaceMembers(response.data.items);

      return response.data.items;
    } catch (err) {
      console.log('err', err);
    }
  };

  return [spaceMembers, fetchSpaceMembers];
};
