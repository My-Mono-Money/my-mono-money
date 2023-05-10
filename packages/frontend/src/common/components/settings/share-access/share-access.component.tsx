import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import AlertDialog from './alert-confirm-remove.component';
import { AddNewSharinglidationSchema } from './add-new-sharing.validation-schema';
import Status from './status.component';
import { useFetchSpaceMembersList } from '../../../../api/useFetchSpaceMembersList';
import axios, { AxiosError } from 'axios';
import { useAuthState } from '../../../../auth-state/use-auth-state.hook';

interface IFormData {
  email: string;
}

interface IErrorResponse {
  message: string;
}

const ShareAccess = () => {
  const [openAlertRemove, setOpenAlertRemove] = useState('');
  const { token, user } = useAuthState();
  const [spaceMembers, fetchSpaceMembers] = useFetchSpaceMembersList();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IFormData>({
    resolver: yupResolver(AddNewSharinglidationSchema),
    mode: 'onBlur',
  });

  useEffect(() => {
    if (!user || !token) return;

    fetchSpaceMembers();
  }, []);

  const handleRemoveShare = (id: string) => {
    setOpenAlertRemove(id);
  };

  const onSubmit = async ({ email }: IFormData) => {
    try {
      await axios.post(
        `/spaces/${user?.email}/members/invite`,
        { email: email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      await fetchSpaceMembers();
      reset();
    } catch (err) {
      const axiosError = err as unknown as AxiosError<IErrorResponse>;
      alert(axiosError.response?.data.message);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        mt: '10px',
        mb: '20px',
        p: '10px',
        gap: '10px',
        mx: 'auto',
        width: '90%',
      }}
    >
      <Typography>
        Якщо користувач не зареєстрований, йому надійде лист на пошту для
        запрошення
      </Typography>
      <Box
        sx={{ display: 'flex', gap: '10px' }}
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextField
          id="email"
          size="small"
          variant="outlined"
          label="Введіть пошту для запрошення"
          margin="normal"
          type="email"
          {...register('email')}
          disabled={isSubmitting}
          error={errors.email ? true : false}
          helperText={errors.email?.message}
          sx={{ width: '50%' }}
        />
        <Button type="submit" sx={{ height: '40px', mt: '15px' }}>
          Додати до вашого простору
        </Button>
      </Box>

      <TableContainer sx={{ mt: '30px' }}>
        <Typography>Додані користувачі до вашого простору</Typography>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Email</TableCell>
              <TableCell align="left">Дата додавання</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {spaceMembers?.items
              .filter((el) => user?.email === el.owner.email)
              .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
              .map((row) => {
                const formatTime = `${format(
                  new Date(row.updatedAt),
                  'dd.MM.yyyy HH:mm',
                )}`;
                return (
                  <TableRow key={row.id}>
                    <AlertDialog
                      openAlertRemove={openAlertRemove}
                      setOpenAlertRemove={setOpenAlertRemove}
                    ></AlertDialog>
                    <TableCell align="left">
                      <Box sx={{ display: 'flex' }}>
                        {' '}
                        {row.email} <Status statusCode={row.status} />
                      </Box>
                    </TableCell>
                    <TableCell align="left">{formatTime}</TableCell>
                    <TableCell align="center">
                      {row.email !== user?.email ? (
                        <Button
                          sx={{ fontSize: '8px' }}
                          onClick={() => handleRemoveShare(row.id)}
                        >
                          Видалити
                        </Button>
                      ) : (
                        <Typography>Owner</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      <TableContainer sx={{ mt: '30px' }}>
        <Typography>Простори до яких ви додані</Typography>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Ім`я</TableCell>
              <TableCell align="left">Email</TableCell>
              <TableCell align="left">Дата додавання</TableCell>
              <TableCell align="left"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {spaceMembers?.items
              .filter((el) => user?.email !== el.owner.email)
              .filter((el) => el.status !== 'reject')
              .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
              .map((row) => {
                const formatTime = `${format(
                  new Date(row.updatedAt),
                  'dd.MM.yyyy HH:mm',
                )}`;
                const formatName = (str: string) => {
                  const newStr = str.charAt(0).toUpperCase() + str.slice(1);
                  return newStr;
                };
                return (
                  <TableRow key={row.id}>
                    <AlertDialog
                      openAlertRemove={openAlertRemove}
                      setOpenAlertRemove={setOpenAlertRemove}
                    ></AlertDialog>
                    <TableCell align="left">
                      {formatName(row.owner.firstName)}{' '}
                      {formatName(row.owner.lastName)}
                    </TableCell>
                    <TableCell align="left">
                      <Box sx={{ display: 'flex' }}>
                        {row.owner.email} <Status statusCode={row.status} />
                      </Box>
                    </TableCell>
                    <TableCell align="left">{formatTime}</TableCell>
                    <TableCell align="center">
                      <Button
                        sx={{ fontSize: '8px' }}
                        onClick={() => handleRemoveShare(row.id)}
                      >
                        Видалити
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ShareAccess;
