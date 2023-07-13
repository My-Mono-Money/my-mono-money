import { Box, Typography, Button, Theme, useMediaQuery } from '@mui/material';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Countdown from 'react-countdown';
import { useSignedInAuthState } from 'auth-state/use-auth-state.hook';
import { useMutation } from '@tanstack/react-query';
import axiosPublic from 'axios';

const fetchResendMailVerification = async (code: string) => {
  const response = await axiosPublic.post(`/auth/resend-email`, null, {
    headers: {
      Authorization: `Bearer ${code}`,
    },
  });

  return response.data;
};

export const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const { user, token, clearToken } = useSignedInAuthState();
  const [emailSendedCountDown, setEmailSendedCountDown] = useState(true);
  const { mutate: resendMailVerification } = useMutation({
    mutationFn: () => fetchResendMailVerification(token),
    onSettled: () => setEmailSendedCountDown(true),
    onError: () => {
      clearToken();
      navigate('/sign-in');
    },
  });
  const isMd = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const isXs = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  const emailText = (
    <Typography
      variant="h6"
      component="span"
      color="violet"
      sx={{
        ...(isXs && { fontSize: '15px' }),
      }}
    >
      {user.email}
    </Typography>
  );

  const handleResendEmailClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();

    resendMailVerification();
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          pt: '100px',
          mx: 'auto',
          width: '500px',
          ...(isXs && { width: '280px', pt: '30px' }),
          ...(isMd && { width: '320px', pt: '50px' }),
        }}
      >
        <Typography
          variant="h5"
          fontWeight={500}
          sx={{
            ...(isXs && { fontSize: '18px' }),
          }}
        >
          Дякуємо за реєстрацію, {user?.firstName} {user?.lastName}!
        </Typography>

        <Typography
          sx={{ py: 2, ...(isXs && { fontSize: '15px' }) }}
          variant="h6"
          fontWeight={400}
        >
          На вашу пошту {emailText} було відправленно лист з посиланням.
        </Typography>

        <Typography
          variant="h6"
          fontWeight={400}
          sx={{
            ...(isXs && { fontSize: '15px' }),
          }}
        >
          Перевірте будь ласка вашу пошту, та перейдіть за посиланням.
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            pt: 5,
          }}
        >
          <Typography
            sx={{
              ...(isXs && { fontSize: '10px' }),
            }}
          >
            <Link
              to="/sign-up"
              onClick={() => {
                clearToken();
                navigate('/sign-up');
              }}
            >
              Неправильна пошта?
            </Link>
            <Link
              to="/sign-in"
              onClick={() => {
                clearToken();
                navigate('/sign-in');
              }}
            >
              Вийти
            </Link>
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '300px',
              ...(isXs && { width: '200px' }),
            }}
          >
            <Button
              variant="outlined"
              onClick={handleResendEmailClick}
              disabled={emailSendedCountDown}
              sx={{
                ...(isMd && { fontSize: '13px' }),
                ...(isXs && { fontSize: '10px' }),
              }}
            >
              Відправити лист знов
            </Button>
            <Box
              sx={{
                mt: '5px',
                mb: '10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                ...(isMd && { fontSize: '15px', pl: '10px' }),
                ...(isXs && { fontSize: '10px', pl: '10px' }),
              }}
            >
              {emailSendedCountDown && (
                <Countdown
                  date={Date.now() + 59000}
                  renderer={({ seconds }) => {
                    return (
                      <span>
                        Надіслати повторно через {seconds < 10 ? '0' : ''}
                        {seconds} секунд
                      </span>
                    );
                  }}
                  onComplete={() => setEmailSendedCountDown(false)}
                />
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};
