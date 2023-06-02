import axios, { AxiosError } from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useAuthState } from '../auth-state/use-auth-state.hook';
import { IUserSpace } from '../types/user-space.interface';
import { IErrorResponse } from '../types/error-response.interface';

interface IUserSpaceResponse {
  items: IUserSpace[];
}

export const useFetchSpaces = () => {
  const { token } = useAuthState();

  const fetchSpaces = async () => {
    try {
      const response = await axios.get<IUserSpaceResponse>(`/spaces`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.items;
    } catch (err) {
      const axiosError = err as unknown as AxiosError<IErrorResponse>;
      alert(axiosError.response?.data.message);
    }
  };

  return useQuery(['spaces'], fetchSpaces);
};
