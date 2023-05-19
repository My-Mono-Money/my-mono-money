import { Box, Typography, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Countdown from 'react-countdown';
import { useAuthState } from '../../auth-state/use-auth-state.hook';

const fetchResendMailVerification = async (code: string) => {
  const response = await axios.post(`/auth/resend-email`, null, {
    headers: {
      Authorization: `Bearer ${code}`,
    },
  });

  return response.data;
};

export const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const { user, token, clearToken } = useAuthState();
  const [emailSendedCountDown, setEmailSendedCountDown] = useState(true);
  const [userData, setUserData] = useState({
    email: '',
    firstName: '',
    lastName: '',
  });
  const [userToken, setUserToken] = useState('');
  useEffect(() => {
    if (!user || !token) return;
    setUserData({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });
    setUserToken(token);
  }, []);
  useEffect(() => {
    localStorage.removeItem('token');
  }, [userData]);

  const emailText = (
    <Typography variant="h6" component="span" color="violet">
      {userData.email}
    </Typography>
  );

  const handleEmailSended = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (userToken) {
      fetchResendMailVerification(userToken)
        .then(() => setEmailSendedCountDown(true))
        .catch(() => {
          // clearToken();
          navigate('/sign-in');
        });
    }
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
        }}
      >
        <Typography variant="h5" fontWeight={500}>
          Дякуємо за реєстрацію, {userData.firstName} {userData.lastName}!
        </Typography>

        <Typography sx={{ py: 2 }} variant="h6" fontWeight={400}>
          На вашу пошту {emailText} було відправленно лист з посиланням.
        </Typography>

        <Typography variant="h6" fontWeight={400}>
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
          <Typography>
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
            }}
          >
            <Button
              variant="outlined"
              onClick={handleEmailSended}
              disabled={emailSendedCountDown}
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
