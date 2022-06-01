import { Box, Button, TextField, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import React from 'react';

const LeftSide = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      pt: '27px',
      px: '70px',
      color: 'whitesmoke',
      background:
        'linear-gradient(164deg, rgba(97,123,227,1) 0%, rgba(97,121,227,1) 15%, rgba(111,37,220,1) 70%, rgba(112,28,219,1) 100%)',
    }}
  >
    <Typography variant="h6" letterSpacing={3}>
      My Mono Money
    </Typography>

    <Box
      sx={{
        pt: '100px',
      }}
    >
      <Typography variant="h3" fontWeight={600}>
        Найкращий застосунок, для ведення домашньої бухгалтерії
      </Typography>
    </Box>
  </Box>
);

const RightSide = () => (
  <Box
    sx={{
      display: 'flex',
      pt: 7.5,
    }}
  >
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
  </Box>
);

const SignUp: React.FC = () => {
  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridAutoFlow: 'column',
          gridAutoColumns: '1fr',
          height: '100%',
        }}
      >
        <LeftSide />
        <RightSide />
      </Box>
    </>
  );
};

export default SignUp;
