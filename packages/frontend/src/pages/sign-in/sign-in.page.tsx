import { Box, Button, TextField, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { SignInValidationSchema } from './sign-in.validation-schema';

interface IFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IFormData>({
    resolver: yupResolver(SignInValidationSchema),
    mode: 'onBlur',
  });

  const onSubmit = () => console.log('Усе чікі пікі');

  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        pt: '100px',
        mx: 'auto',
        width: '285px',
      }}
    >
      <Typography variant="h5" fontWeight={500}>
        Вхід у кабінет
      </Typography>
      <TextField
        id="email"
        disabled={isSubmitting}
        label="Пошта"
        margin="normal"
        type="email"
        {...register('email')}
        error={errors.email ? true : false}
        helperText={errors.email?.message}
      />
      <TextField
        id="password"
        disabled={isSubmitting}
        label="Пароль"
        type="password"
        margin="normal"
        {...register('password')}
        error={errors.password ? true : false}
        helperText={errors.password?.message}
      />
      <Button disabled={isSubmitting} size="large" sx={{ mt: 3 }} type="submit">
        Увійти
      </Button>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          pt: 2,
        }}
      >
        <Typography>
          <Link to="/sign-up">Створити аккаунт</Link>
        </Typography>
        <Typography pl={2}>
          <Link to="/forgot-password">Забули пароль?</Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default SignIn;
