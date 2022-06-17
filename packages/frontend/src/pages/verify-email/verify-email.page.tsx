import { Box, Typography } from '@mui/material';
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface IHistoryState {
  email: string;
  firstName: string;
  lastName: string;
}

export const VerifyEmail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, firstName, lastName } = location.state as IHistoryState;
  const emailText = (
    <Typography variant="h6" component="span" color="violet">
      {email}
    </Typography>
  );

  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    navigate(-1);
  };

  return (
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
        <Typography>Відправити лист знов</Typography>
      </Box>
    </Box>
  );
};
