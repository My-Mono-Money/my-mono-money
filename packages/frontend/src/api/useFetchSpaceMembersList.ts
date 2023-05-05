import axios from 'axios';
import { useAuthState } from '../auth-state/use-auth-state.hook';
import { useCallback, useState } from 'react';
import { ISpaceMembers } from '../types/space-members.interface';

interface ISpaceMembersResponse {
  items: ISpaceMembers[];
}

export const useFetchSpaceMembersList = (): [
  ISpaceMembersResponse | undefined,
  () => Promise<ISpaceMembersResponse | undefined>,
] => {
  const { token, user } = useAuthState();
  const [response, setResponse] = useState<ISpaceMembersResponse>();

  const fetchSpaceMembers = useCallback(async () => {
    try {
      const response = await axios.get<ISpaceMembersResponse>(
        `/spaces/${user?.email}/members`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setResponse(response.data);

      return response.data;
    } catch (err) {
      console.log('err', err);
    }
  }, [token, user]);

  return [response, fetchSpaceMembers];
};
