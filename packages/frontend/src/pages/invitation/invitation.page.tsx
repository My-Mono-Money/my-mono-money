import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { useAuthState } from '../../auth-state/use-auth-state.hook';
import { useGlobalState } from '../../global-state/use-global-state.hook';

interface IGetUserResponse {
  firstName: string;
  lastName: string;
  email: string;
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

  useEffect(() => {
    if (!token) {
      return;
    }
    fetchUser(spaceOwnerEmail, token).then((result) => {
      if (result) {
        setResponse(result);
        setChangeDefaultUserSpace(result.email);
      }
      setLoading(false);
    });
  }, []);

  if (!spaceOwnerEmail) {
    return <Navigate to="/" />;
  }

  const acceptInviteHandle = async () => {
    try {
      const result = await axios.post(
        `invites/${spaceOwnerEmail}/accept`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (result) {
        navigate('/');
      }
    } catch (err) {
      throw new Error(`Failed to fetch data: ${err}`);
    }
  };

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
