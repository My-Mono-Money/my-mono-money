import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAuthState } from 'auth-state/use-auth-state.hook';
import { Box, Typography } from '@mui/material';
import axiosPublic from 'axios';

const fetchMailVerification = async (code: string) => {
  try {
    const response = await axiosPublic.post(`/auth/verify-email`, null, {
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
  const { mutate: mutateMailVerification } = useMutation({
    mutationFn: (code: string) => fetchMailVerification(code),
    onError: () => {
      navigate('/sign-in');
    },
    onSuccess: ({ accessToken }) => {
      setToken(accessToken);
      navigate('/', { replace: true, state: 'confirm-email' });
    },
  });
  useEffect(() => {
    if (!code) {
      navigate('/sign-in');
      return;
    }
    mutateMailVerification(code);
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
