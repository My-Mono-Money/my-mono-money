import axios, { AxiosError } from 'axios';
import { useAuthState } from '../auth-state/use-auth-state.hook';
import { useGlobalState } from '../global-state/use-global-state.hook';
import { IUserSpace } from '../types/user-space.interface';
import { IErrorResponse } from '../types/error-response.interface';

interface IUserSpaceResponse {
  items: IUserSpace[];
}

export const useFetchSpaces = (): [
  IUserSpace[] | undefined,
  () => Promise<IUserSpace[] | undefined>,
] => {
  const { token } = useAuthState();
  const { spaces, setSpaces } = useGlobalState();

  const fetchSpaces = async () => {
    try {
      const response = await axios.get<IUserSpaceResponse>(`/spaces`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSpaces(response.data.items);
      return response.data.items;
    } catch (err) {
      const axiosError = err as unknown as AxiosError<IErrorResponse>;
      alert(axiosError.response?.data.message);
    }
  };

  return [spaces, fetchSpaces];
};
