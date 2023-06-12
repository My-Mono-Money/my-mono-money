import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { useGlobalState } from 'global-state/use-global-state.hook';
import { useMutation, useQuery } from '@tanstack/react-query';
import { UpdatingIndicator } from 'common/components/updating-indicator/updating-indicator.component';
import api from 'api/axios';

interface IGetUserResponse {
  firstName: string;
  lastName: string;
  email: string;
}
interface IAccepteInvite {
  spaceOwnerEmail: string;
}

const fetchUser = async (spaceOwnerEmail: string) => {
  try {
    const response = await api.get(`user/${spaceOwnerEmail}`);

    return response.data;
  } catch (err) {
    console.log('err', err);
  }
};

const fetchAcceptInviteHandle = async ({ spaceOwnerEmail }: IAccepteInvite) => {
  try {
    const result = await api.post(`invites/${spaceOwnerEmail}/accept`, null);
    return result;
  } catch (error) {
    throw new Error(`Failed to fetch data: ${error}`);
  }
};
export const InvitationPage: React.FC = () => {
  const { setChangeDefaultUserSpace } = useGlobalState();
  const location = useLocation();
  const navigate = useNavigate();
  const [response, setResponse] = useState<IGetUserResponse>();
  const searchParams = new URLSearchParams(location.search);
  const spaceOwnerEmail = decodeURIComponent(
    searchParams.get('spaceOwnerEmail') || '',
  );

  const {
    mutate: mutateAcceptInviteHandle,
    isError,
    isLoading,
  } = useMutation({
    mutationFn: ({ spaceOwnerEmail }: IAccepteInvite) =>
      fetchAcceptInviteHandle({ spaceOwnerEmail }),

    onSuccess: () => {
      navigate('/');
    },
  });
  const { data: userData } = useQuery(['user-inviter'], () =>
    fetchUser(spaceOwnerEmail),
  );
  useEffect(() => {
    if (userData) {
      setResponse(userData);
      setChangeDefaultUserSpace(userData.email);
    }
  }, [userData, isLoading]);

  const acceptInviteHandle = () => {
    mutateAcceptInviteHandle({ spaceOwnerEmail });
  };

  if (!spaceOwnerEmail) {
    return <Navigate to="/" />;
  }

  return (
    <>
      {isLoading && <UpdatingIndicator />}
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
        {isError && (
          <Typography>Помилка. Будь ласка, спробуйте пізніше</Typography>
        )}
      </Box>
    </>
  );
};
