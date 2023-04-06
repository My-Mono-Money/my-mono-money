import { Box, Typography, Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LogoutUser from '../../common/components/logout/logout';
import { IUser } from '../../auth-state/auth-state.interface';
import { useAuthState } from '../../auth-state/use-auth-state.hook';
import { CountDownLocalStorage } from '../../common/components/count-down/count-down';
interface IHistoryState {
  email: string;
  firstName: string;
  lastName: string;
}

const fetchResendMailVerification = async (code: string) => {
  try {
    const response = await axios.get(`/auth/resend-email`, {
      headers: {
        Authorization: `Bearer ${code}`,
      },
    });

    return response.data;
  } catch (err) {
    throw new Error(`Failed to resend verification on email: ${err}`);
  }
};

const fetchCheckMailVerification = async (code: string) => {
  try {
    const response = await axios.get(`/auth/check-verify-email`, {
      headers: {
        Authorization: `Bearer ${code}`,
      },
    });
    return response;
  } catch (err) {
    throw new Error(`Failed to resend verification on email: ${err}`);
  }
};

export const VerifyEmail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, token, clearToken, setToken } = useAuthState();
  const { email, firstName, lastName } = user as IUser;
  const [emailSendedCountDown, setEmailSendedCountDown] = useState(true);
  // const { email, firstName, lastName } = location.state as IHistorySlocation.statetate;
  const { from } = (location.state as { from: string }) || '';
  useEffect(() => {
    if (localStorage.getItem('email_sended') != null || from === 'sign-up') {
      setEmailSendedCountDown(true);
    } else {
      setEmailSendedCountDown(false);
    }
    checkUserMailVerify();
  }, []);
  const emailText = (
    <Typography variant="h6" component="span" color="violet">
      {email}
    </Typography>
  );

  const checkUserMailVerify = async () => {
    if (token) {
      let result = false;
      await fetchCheckMailVerification(token)
        .then((res) => {
          if (res) {
            setToken(res.data.accessToken);
            localStorage.removeTtem('email_sended');
            navigate('/');
            result = true;
          }
        })
        .catch(() => {
          result = false;
        });
      return result;
    }
  };
  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    clearToken();
    navigate('/sign-up');
  };

  const handleEmailSended = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (token) {
      checkUserMailVerify().then((result) => {
        if (!result) {
          setEmailSendedCountDown(true);
          fetchResendMailVerification(token).catch((err) => {
            alert('Server unavailable, please try again later');
            console.log('err', err);
          });
        }
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
          Дякуємо за реєстрацію, {firstName} {lastName}!
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
            <Link to="/sign-up" onClick={handleLinkClick}>
              Неправильна пошта?
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
                <CountDownLocalStorage
                  seconds={60000}
                  storageKey={'email_sended'}
                  onComplete={() => {
                    if (localStorage.getItem('email_sended') != null)
                      localStorage.removeItem('email_sended');
                    setEmailSendedCountDown(false);
                  }}
                ></CountDownLocalStorage>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};
