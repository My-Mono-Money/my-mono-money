import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthState } from '../../auth-state/use-auth-state.hook';
import { Box, Typography } from '@mui/material';

const fetchMailVerification = async (code: string) => {
  try {
    const response = await axios.post(`/auth/verify-email`, null, {
      headers: {
        Authorization: `Bearer ${code}`,
      },
    });

    return response.data;
  } catch (err) {
    throw new Error(`Failed to fetch data: ${err}`);
  }
};
export const ConfirmEmail: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const { setToken } = useAuthState();
  const navigate = useNavigate();
  const code = queryParams.get('code');
  useEffect(() => {
    if (!code) {
      navigate('/sign-in');
      return;
    }
    fetchMailVerification(code)
      .then(({ accessToken }) => {
        setToken(accessToken);
        navigate('/', { replace: true, state: 'confirm-email' });
      })
      .catch(() => {
        navigate('/sign-in');
      });
  }, []);

  return (
    <Box
      sx={{
        pt: '100px',
        mx: 'auto',
      }}
    >
      <Typography variant="h3" fontWeight={600}>
        Перевірка пошти...
      </Typography>
    </Box>
  );
};
