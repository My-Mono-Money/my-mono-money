import axios from 'axios';
import { ITokenItem } from '../types/token-item.interface';
import { useAuthState } from '../auth-state/use-auth-state.hook';
import { useCallback, useState } from 'react';

interface ITokenResponse {
  items: ITokenItem[];
}

export const useFetchTokenList = (): [
  ITokenResponse | undefined,
  () => Promise<ITokenResponse | undefined>,
] => {
  const { token } = useAuthState();
  const [response, setResponse] = useState<ITokenResponse>();

  const fetchToken = useCallback(async () => {
    try {
      const response = await axios.get<ITokenResponse>('/tokens', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResponse(response.data);

      return response.data;
    } catch (err) {
      console.log('err', err);
    }
  }, [token]);

  return [response, fetchToken];
};
