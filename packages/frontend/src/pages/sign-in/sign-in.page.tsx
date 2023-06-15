import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosPublic, { AxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';
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
import { useAuthState } from 'auth-state/use-auth-state.hook';
import PasswordField from 'common/components/password-field/password-field.component';

interface IFormData {
  email: string;
  password: string;
}

interface IErrorResponse {
  message: string;
}

export const signIn = async ({ email, password }: IFormData) => {
  const response = await axiosPublic.post('/auth/sign-in', { email, password });
  if (!response?.data.isSuccessful) {
    throw new Error("Can't recognize response as successful");
  }
  return response;
};

const SignIn: React.FC = () => {
  const { setToken } = useAuthState();
  const [submittingError, setSubmittingError] = useState<string>();
  const { mutate } = useMutation({
    mutationFn: ({ email, password }: IFormData) => signIn({ email, password }),
    onError: (error) => {
      const err = error as unknown as AxiosError<IErrorResponse>;
      if (err.response?.data.message === 'unauthorized-error') {
        setSubmittingError('Неправильний пароль або пошта');
        throw new Error('unauthorized-error');
      } else {
        setSubmittingError(`Будь-ласка, спробуйте повторити пізніше`);
        throw new Error('unknown error');
      }
    },
    onSuccess: (response) => {
      if (!response?.data.isSuccessful) {
        throw new Error("Can't recognize response as successful");
      }
      setToken(response.data.accessToken);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IFormData>({
    resolver: yupResolver(SignInValidationSchema),
    mode: 'onBlur',
  });

  const onSubmit = async ({ email, password }: IFormData) => {
    mutate({ email, password });
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
      <PasswordField
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
          justifyContent: 'space-between',
          pt: 2,
        }}
      >
        <Typography>
          <Link to="/sign-up">Створити аккаунт</Link>
        </Typography>
        <Typography>
          <Link to="/forgot-password">Забули пароль?</Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default SignIn;
