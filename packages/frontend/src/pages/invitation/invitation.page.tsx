import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { useGlobalState } from 'global-state/use-global-state.hook';
import { useMutation, useQuery } from '@tanstack/react-query';
import { UpdatingIndicator } from 'common/components/updating-indicator/updating-indicator.component';
import { axiosPrivate } from 'api/axios';

interface IGetUserResponse {
  firstName: string;
  lastName: string;
  email: string;
}
interface IResponseInvite {
  spaceOwnerEmail: string;
}

const fetchUser = async (spaceOwnerEmail: string) => {
  try {
    const response = await axiosPrivate.get(`user/${spaceOwnerEmail}`);

    return response.data;
  } catch (err) {
    console.log('err', err);
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
    isError: mutateErrorHandleAccept,
    isLoading: mutateLoadingAccept,
  } = useMutation({
    mutationFn: ({ spaceOwnerEmail }: IResponseInvite) =>
      axiosPrivate.post(`invites/${spaceOwnerEmail}/accept`, null),

    onSuccess: () => {
      navigate('/');
    },
  });

  const {
    mutate: mutateRejectInviteHandle,
    isError: mutateErrorHandleReject,
    isLoading: mutateLoadingReject,
  } = useMutation({
    mutationFn: ({ spaceOwnerEmail }: IResponseInvite) =>
      axiosPrivate.post(`invites/${spaceOwnerEmail}/reject`, null),

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
  }, [userData, mutateErrorHandleAccept]);

  const acceptInviteHandle = () => {
    mutateAcceptInviteHandle({ spaceOwnerEmail });
  };

  const rejectInviteHandle = () => {
    mutateRejectInviteHandle({ spaceOwnerEmail });
  };

  if (!spaceOwnerEmail) {
    return <Navigate to="/" />;
  }

  return (
    <>
      {(mutateLoadingAccept || mutateLoadingReject) && <UpdatingIndicator />}
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
          <Button onClick={rejectInviteHandle}>Відхилити</Button>
        </Box>
        {(mutateErrorHandleAccept || mutateErrorHandleReject) && (
          <Typography>Помилка. Будь ласка, спробуйте пізніше</Typography>
        )}
      </Box>
    </>
  );
};
