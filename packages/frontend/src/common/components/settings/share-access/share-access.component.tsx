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
} from '@mui/material';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import AlertDialog from './alert-confirm-remove.component';
import { AddNewSharinglidationSchema } from './add-new-sharing.validation-schema';
import Status from './status.component';
import { useFetchSpaceMembersList } from '../../../../api/useFetchSpaceMembersList';

interface IFormData {
  email: string;
}

const ShareAccess = () => {
  const [openAlertRemove, setOpenAlertRemove] = useState('');
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
    fetchSpaceMembers();
  }, []);

  const handleRemoveShare = (id: string) => {
    setOpenAlertRemove(id);
  };

  const onSubmit = async ({ email }: IFormData) => {
    console.log(email);

    reset();
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
          label="Пошта"
          margin="normal"
          type="email"
          {...register('email')}
          disabled={isSubmitting}
          error={errors.email ? true : false}
          helperText={errors.email?.message}
          sx={{ width: '50%' }}
        />
        <Button type="submit" sx={{ height: '40px', mt: '15px' }}>
          Додати
        </Button>
      </Box>

      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Email</TableCell>
              <TableCell align="center">Дата додавання</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {spaceMembers?.items.map((row) => {
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
                      {row.email} <Status statusCode={row.status} />
                    </Box>
                  </TableCell>
                  <TableCell align="center">{formatTime}</TableCell>
                  <TableCell align="right">
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
