import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, TextField, Typography } from '@mui/material';
import { SignUpValidationSchema } from './sign-up.validation-schema';

interface IFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUp: React.FC = () => {
  const validationSchema = SignUpValidationSchema;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormData>({
    resolver: yupResolver(validationSchema),
    mode: 'onBlur',
  });

  const onSubmit = (data: IFormData) => {
    console.log(JSON.stringify(data, null, 2));
    alert('Всьо топчік 🐈 ');
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
      <TextField
        id="firstName"
        label="Імʼя"
        margin="normal"
        color="primary"
        {...register('firstName')}
        error={errors.firstName ? true : false}
        helperText={errors.firstName?.message}
      />
      <TextField
        id="lastName"
        label="Прізвище"
        margin="normal"
        {...register('lastName')}
        error={errors.lastName ? true : false}
        helperText={errors.lastName?.message}
      />
      <TextField
        id="email"
        label="Пошта"
        margin="normal"
        type="email"
        {...register('email')}
        error={errors.email ? true : false}
        helperText={errors.email?.message}
      />
      <TextField
        id="password"
        label="Пароль"
        type="password"
        margin="normal"
        {...register('password')}
        error={errors.password ? true : false}
        helperText={errors.password?.message}
      />
      <TextField
        id="confirmPassword"
        label="Повторіть пароль"
        type="password"
        margin="normal"
        {...register('confirmPassword')}
        error={errors.confirmPassword ? true : false}
        helperText={errors.confirmPassword?.message}
      />
      <Button size="large" sx={{ mt: 3 }} type="submit">
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
