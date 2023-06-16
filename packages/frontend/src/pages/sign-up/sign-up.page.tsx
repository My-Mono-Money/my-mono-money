import React, { useState } from 'react';
import axiosPublic, { AxiosError } from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuthState } from 'auth-state/use-auth-state.hook';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  TextField,
  Typography,
} from '@mui/material';
import { SignUpValidationSchema } from './sign-up.validation-schema';
import PasswordField from 'common/components/password-field/password-field.component';
import { useGlobalState } from 'global-state/use-global-state.hook';

interface IFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}
type IFormDataFromEmail = Partial<IFormData>;

type IHistoryState = Omit<IFormData, 'confirmPassword'>;

interface IErrorResponse {
  message: string;
}

const fetchSignUp = async (
  { firstName, lastName, email, password }: IFormDataFromEmail,
  spaceOwnerEmail: string,
) => {
  const response = await axiosPublic.post('/auth/sign-up', {
    firstName,
    lastName,
    email,
    spaceOwnerEmail,
    password,
  });
  if (!response?.data.isSuccessful) {
    throw new Error("Can't recognize response as successful");
  }
  return response;
};

const SignUp: React.FC = () => {
  //register by invitation
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const invitedEmail = decodeURIComponent(
    searchParams.get('invitedEmail') || '',
  );
  const spaceOwnerEmail = decodeURIComponent(
    searchParams.get('spaceOwnerEmail') || '',
  );

  const [submittingError, setSubmittingError] = useState<string>();

  const { setToken } = useAuthState();
  const { setTogglePopupAddToken } = useGlobalState();
  const state = location.state as IHistoryState;

  const { mutate } = useMutation({
    mutationFn: ({
      firstName,
      lastName,
      email,
      password,
    }: IFormDataFromEmail) =>
      fetchSignUp({ firstName, lastName, email, password }, spaceOwnerEmail),

    onError: (error, variables) => {
      const axiosError = error as unknown as AxiosError<IErrorResponse>;
      if (axiosError.response?.data.message === 'duplicated-entity-error') {
        setSubmittingError(
          `Користувач з поштою "${variables.email}" уже зареєстрований`,
        );
      } else {
        setSubmittingError(`Будь-ласка, спробуйте повторити пізніше`);
      }
    },
    onSuccess: (response) => {
      if (!response.data.isSuccessful) {
        throw new Error("Can't recognize response as successful");
      }
      if (invitedEmail) setTogglePopupAddToken(true);
      setToken(response.data.accessToken);
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IFormData>({
    defaultValues: {
      ...state,
      confirmPassword: state?.password,
      email: invitedEmail || undefined,
    },
    resolver: yupResolver(SignUpValidationSchema),
    mode: 'onBlur',
  });
  const onSubmit = async ({
    firstName,
    lastName,
    email,
    password,
  }: IFormData) => {
    if (invitedEmail) email = invitedEmail;

    mutate({
      firstName,
      lastName,
      email,
      password,
    });
  };

  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        pt: `${invitedEmail ? '50px' : '100px'}`,
        mx: 'auto',
        width: '285px',
      }}
    >
      <Typography variant="h5" fontWeight={500}>
        {invitedEmail
          ? 'Щоб продовжити, заповніть будь ласка наступні дані про себе'
          : 'Реєстрація'}
      </Typography>
      {submittingError && (
        <Alert severity="warning">
          <AlertTitle>Сталася помилка</AlertTitle>
          {submittingError}
        </Alert>
      )}
      <TextField
        id="firstName"
        disabled={isSubmitting}
        label="Імʼя"
        margin="normal"
        color="primary"
        {...register('firstName')}
        error={errors.firstName ? true : false}
        helperText={errors.firstName?.message}
      />
      <TextField
        id="lastName"
        disabled={isSubmitting}
        label="Прізвище"
        margin="normal"
        {...register('lastName')}
        error={errors.lastName ? true : false}
        helperText={errors.lastName?.message}
      />
      <TextField
        id="email"
        disabled={isSubmitting || invitedEmail ? true : false}
        label="Пошта"
        margin="normal"
        type="email"
        {...register('email')}
        error={!invitedEmail && errors.email ? true : false}
        helperText={!invitedEmail && errors.email?.message}
      />
      <PasswordField
        id="password"
        disabled={isSubmitting}
        label="Пароль"
        {...register('password')}
        error={errors.password ? true : false}
        helperText={errors.password?.message}
      />
      <PasswordField
        id="confirmPassword"
        disabled={isSubmitting}
        label="Повторіть пароль"
        type="password"
        margin="normal"
        {...register('confirmPassword')}
        error={errors.confirmPassword ? true : false}
        helperText={errors.confirmPassword?.message}
      />
      <Button disabled={isSubmitting} size="large" sx={{ mt: 3 }} type="submit">
        Продовжити
      </Button>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          p: 2,
        }}
      >
        {invitedEmail ? null : (
          <>
            <Typography>Вже маєте аккаунт?</Typography>
            <Typography pl={1}>
              <Link to="/sign-in">Увійти</Link>
            </Typography>
          </>
        )}
      </Box>
    </Box>
  );
};

export default SignUp;
