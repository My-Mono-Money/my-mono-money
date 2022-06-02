import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, TextField, Typography } from '@mui/material';
import AuthLayout from '../../layouts/auth.layout';

const SignUp: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        pt: '100px',
        mx: 'auto',
        width: '285px',
      }}
    >
      <Typography variant="h5" fontWeight={500}>
        Реєстрація
      </Typography>
      <TextField label="Імʼя" size="small" margin="normal" color="primary" />
      <TextField label="Прізвище" size="small" margin="normal" />
      <TextField label="Пошта" size="small" margin="normal" />
      <TextField label="Пароль" type="password" size="small" margin="normal" />
      <TextField
        label="Повторіть пароль"
        type="password"
        size="small"
        margin="normal"
      />
      <Button size="large" sx={{ mt: 3 }}>
        Продовжити
      </Button>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          p: 2,
        }}
      >
        <Typography>Вже маєте аккаунт?</Typography>
        <Typography pl={1}>
          <Link to="/sign-in">Увійти</Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default SignUp;
