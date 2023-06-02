import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { ITokenItem } from '../types/token-item.interface';
import { useAuthState } from '../auth-state/use-auth-state.hook';

interface ITokenResponse {
  items: ITokenItem[];
}

export const useFetchTokenList = () => {
  const { token } = useAuthState();

  const fetchToken = async () => {
    try {
      const response = await axios.get<ITokenResponse>('/tokens', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.data) {
        throw new Error('Could not get token list');
      }

      return response.data.items;
    } catch (err) {
      console.log('err', err);
    }
  };

  return useQuery(['token-list'], fetchToken);
};
