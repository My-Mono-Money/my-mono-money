import axios from 'axios';
import { ITokenItem } from '../types/token-item.interface';
import { useAuthState } from '../auth-state/use-auth-state.hook';
import { useGlobalState } from '../global-state/use-global-state.hook';

interface ITokenResponse {
  items: ITokenItem[];
}

export const useFetchTokenList = (): [
  ITokenItem[] | undefined,
  () => Promise<ITokenItem[] | undefined>,
] => {
  const { token } = useAuthState();
  const { tokenList, setTokenList } = useGlobalState();

  const fetchToken = async () => {
    try {
      const response = await axios.get<ITokenResponse>('/tokens', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTokenList(response.data.items);

      return response.data.items;
    } catch (err) {
      console.log('err', err);
    }
  };

  return [tokenList, fetchToken];
};
