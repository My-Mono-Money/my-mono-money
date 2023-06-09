import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { useAuthState } from 'auth-state/use-auth-state.hook';
import { useGlobalState } from 'global-state/use-global-state.hook';
import { useMutation, useQuery } from '@tanstack/react-query';
import { IErrorResponse } from 'types/error-response.interface';

interface IGetUserResponse {
  firstName: string;
  lastName: string;
  email: string;
}
interface IAccepteInvite {
  token: string;
  spaceOwnerEmail: string;
}

const fetchUser = async (spaceOwnerEmail: string, token: string) => {
  try {
    const response = await axios.get(`user/${spaceOwnerEmail}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (err) {
    console.log('err', err);
  }
};

const fetchAcceptInviteHandle = async ({
  token,
  spaceOwnerEmail,
}: IAccepteInvite) => {
  try {
    const result = await axios.post(`invites/${spaceOwnerEmail}/accept`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return result;
  } catch (error) {
    throw new Error(`Failed to fetch data: ${error}`);
  }
};
export const InvitationPage: React.FC = () => {
  const { token } = useAuthState();
  const { setChangeDefaultUserSpace } = useGlobalState();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState<IGetUserResponse>();
  const searchParams = new URLSearchParams(location.search);
  const spaceOwnerEmail = decodeURIComponent(
    searchParams.get('spaceOwnerEmail') || '',
  );

  const { mutate: mutateAcceptInviteHandle } = useMutation({
    mutationFn: ({ token, spaceOwnerEmail }: IAccepteInvite) =>
      fetchAcceptInviteHandle({ token, spaceOwnerEmail }),
    onError: (error) => {
      const err = error as unknown as AxiosError<IErrorResponse>;
      console.log(err);
    },
    onSuccess: () => {
      navigate('/');
    },
  });
  const { data: userData, isLoading } = useQuery(['user-default-space'], () =>
    fetchUser(spaceOwnerEmail, token ?? ''),
  );

  useEffect(() => {
    if (!token) {
      return;
    }
    if (isLoading) {
      setLoading(true);
    }

    if (userData) {
      setResponse(userData);
      setChangeDefaultUserSpace(userData.email);
      setLoading(false);
    }
  }, [userData, isLoading]);

  const acceptInviteHandle = () => {
    if (!token) return;
    mutateAcceptInviteHandle({ token, spaceOwnerEmail });
  };

  if (!spaceOwnerEmail) {
    return <Navigate to="/" />;
  }

  if (loading) {
    return null;
  }

  return (
    <Box
      sx={{
        margin: '0 auto',
        borderRadius: '16px',
        border: '1px solid',
        borderColor: 'lightgray',
        boxShadow: '3px 3px 3px 3px lightgray',
        px: '40px',
        height: '500px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'center',
      }}
    >
      <Typography variant="h4">
        {response?.firstName} {response?.lastName} запрошує вас до свого
        простору
      </Typography>
      <Typography variant="h5">
        Вам буде доступний спільний перегляд виписки
      </Typography>
      <Box
        sx={{
          mt: '30px',
          width: '270px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Button onClick={acceptInviteHandle}>Прийняти</Button>
        <Button>Відхилити</Button>
      </Box>
    </Box>
  );
};
