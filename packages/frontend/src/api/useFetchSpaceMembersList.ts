import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useAuthState } from '../auth-state/use-auth-state.hook';
import { ISpaceMember } from '../types/space-members.interface';

interface ISpaceMembersResponse {
  items: ISpaceMember[];
}

export const useFetchSpaceMembersList = () => {
  const { token, user } = useAuthState();

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
      if (!response.data) {
        throw new Error('Could not get space members');
      }

      return response.data.items;
    } catch (err) {
      console.log('err', err);
    }
  };
  return useQuery(['space-members'], fetchSpaceMembers);
};
