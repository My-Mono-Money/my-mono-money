import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  TextField,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { SignInValidationSchema } from './sign-in.validation-schema';

interface IFormData {
  email: string;
  password: string;
}

interface IErrorResponse {
  message: string;
}

const SignIn: React.FC = () => {
  const [submittingError, setSubmittingError] = useState<string>();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IFormData>({
    resolver: yupResolver(SignInValidationSchema),
    mode: 'onBlur',
  });

  const onSubmit = async ({ email, password }: IFormData) => {
    try {
      await axios.post('/auth/sign-in', {
        email,
        password,
      });
    } catch (err) {
      const axiosError = err as unknown as AxiosError<IErrorResponse>;
      if (axiosError.response?.data.message === 'unauthorized-error') {
        setSubmittingError('Неправильний пароль або пошта');
      } else {
        setSubmittingError(`Будь-ласка, спробуйте повторити пізніше`);
      }
    }
  };

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
      {submittingError && (
        <Alert severity="warning">
          <AlertTitle>Сталася помилка</AlertTitle>
          {submittingError}
        </Alert>
      )}
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
