import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  TextField,
  Typography,
} from '@mui/material';
import { SignUpValidationSchema } from './sign-up.validation-schema';
import PasswordField from '../../common/components/password-field/password-field.component';

interface IFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

type IHistoryState = Omit<IFormData, 'confirmPassword'>;

interface IErrorResponse {
  message: string;
}

const SignUp: React.FC = () => {
  const [submittingError, setSubmittingError] = useState<string>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as IHistoryState;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IFormData>({
    defaultValues: {
      ...state,
      confirmPassword: state?.password,
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
    try {
      const response = await axios.post('/auth/sign-up', {
        firstName,
        lastName,
        email,
        password,
      });
      if (!response.data.isSuccessful) {
        throw new Error("Can't recognize response as successful");
      }
      navigate('/sign-up', {
        replace: true,
        state: {
          email,
          firstName,
          lastName,
          password,
        },
      });
      navigate('/verify-email', {
        state: {
          email,
          firstName,
          lastName,
        },
      });
    } catch (err) {
      const axiosError = err as unknown as AxiosError<IErrorResponse>;
      if (axiosError.response?.data.message === 'duplicated-entity-error') {
        setSubmittingError(`Користувач з поштою "${email}" уже зареєстрований`);
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
        Реєстрація
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
        <Typography>Вже маєте аккаунт?</Typography>
        <Typography pl={1}>
          <Link to="/sign-in">Увійти</Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default SignUp;
