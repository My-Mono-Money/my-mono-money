import React, { useState } from 'react';
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
  useMediaQuery,
  Theme,
} from '@mui/material';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import AlertDialog from './alert-confirm-remove.component';
import { AddNewSharinglidationSchema } from './add-new-sharing.validation-schema';
import Status from './status.component';
import { useFetchSpaceMembersList } from 'api/useFetchSpaceMembersList';
import { AxiosError } from 'axios';
import { useAuthState } from 'auth-state/use-auth-state.hook';
import { IErrorResponse } from 'types/error-response.interface';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosPrivate } from 'api/axios';
import { UpdatingIndicator } from 'common/components/updating-indicator/updating-indicator.component';

interface IFormData {
  email: string;
}

const ShareAccessPage = () => {
  const { user } = useAuthState();
  const queryClient = useQueryClient();
  const [openAlertRemove, setOpenAlertRemove] = useState<{
    rowId: string;
    table: string;
  }>({ rowId: '', table: '' });
  const spaceMembers = useFetchSpaceMembersList();
  const [submittingError, setSubmittingError] = useState<string>('');
  const isMd = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IFormData>({
    resolver: yupResolver(AddNewSharinglidationSchema),
    mode: 'onBlur',
  });

  const handleRemoveShare = (rowId: string, table: string) => {
    setOpenAlertRemove({ rowId, table });
  };

  const { mutate: mutateInvite, isLoading } = useMutation({
    mutationFn: ({ email }: IFormData) =>
      axiosPrivate.post(`/spaces/${user?.email}/members/invite`, {
        email,
      }),

    onError: (error) => {
      const axiosError = error as unknown as AxiosError<IErrorResponse>;
      if (axiosError.response?.data.message === 'duplicated-entity-error') {
        setSubmittingError('Юзер вже доданий');
      } else {
        setSubmittingError('Помилка. Спробуйте пізніше');
      }
      setTimeout(() => setSubmittingError(''), 10000);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['space-members']);
      reset();
    },
  });
  const onSubmit = async ({ email }: IFormData) => {
    mutateInvite({ email });
  };

  return (
    <>
      {isLoading && <UpdatingIndicator />}
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
        <Typography sx={{ ...(isMd && { width: '90%' }) }}>
          {submittingError
            ? submittingError
            : ' Якщо користувач не зареєстрований, йому надійде лист на пошту для запрошення'}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: '10px',
            ...(isMd && { flexDirection: 'column', gap: 1 }),
          }}
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
            sx={{ width: '90%', ...(isMd && { width: '80%' }) }}
          />
          <Button
            type="submit"
            sx={{
              height: '40px',
              mt: '15px',
              ...(isMd && { fontSize: '5x', width: '80%' }),
            }}
          >
            Додати до вашого простору
          </Button>
        </Box>

        <TableContainer sx={{ mt: '30px' }}>
          <Typography sx={{ ...(isMd && { width: '90%' }) }}>
            Додані користувачі до вашого простору
          </Typography>
          <Table
            sx={{ minWidth: 650, ...(isMd && { minWidth: '90%' }) }}
            aria-label="simple table"
          >
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ ...(isMd && { display: 'none' }) }}
                  align="left"
                >
                  Email
                </TableCell>
                <TableCell
                  sx={{ ...(isMd && { display: 'none' }) }}
                  align="left"
                >
                  Дата додавання
                </TableCell>
                <TableCell align="right"></TableCell>
                {isMd && <TableCell align="right"></TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {spaceMembers?.data
                ?.filter((el) => user?.email === el.owner.email)
                .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
                .map((row) => {
                  const formatTime = `${format(
                    new Date(row.updatedAt),
                    'dd.MM.yyyy HH:mm',
                  )}`;
                  return (
                    <TableRow key={row.id} sx={{ width: '90%' }}>
                      <AlertDialog
                        openAlertRemove={openAlertRemove}
                        setOpenAlertRemove={setOpenAlertRemove}
                        userEmail={user?.email}
                      ></AlertDialog>
                      <TableCell
                        align="left"
                        sx={{
                          ...(isMd && { fontSize: '10px', px: 0, width: 50 }),
                        }}
                      >
                        <Box sx={{ display: 'flex' }}>
                          {' '}
                          {row.email} <Status statusCode={row.status} />
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{ ...(isMd && { display: 'none' }) }}
                        align="left"
                      >
                        {formatTime}
                      </TableCell>
                      <TableCell align="center" sx={{ px: 0 }}>
                        {row.email !== user?.email ? (
                          <Button
                            sx={{
                              fontSize: '8px',
                              ...(isMd && {
                                fontSize: '6px',
                                minWidth: '40px',
                                p: 0,
                              }),
                            }}
                            onClick={() =>
                              handleRemoveShare(row.id, 'userSpace')
                            }
                          >
                            Видалити
                          </Button>
                        ) : (
                          <Typography sx={{ ...(isMd && { fontSize: '8px' }) }}>
                            Owner
                          </Typography>
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
          <Table
            sx={{ minWidth: 650, ...(isMd && { minWidth: '90%' }) }}
            aria-label="simple table"
          >
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    ...(isMd && { display: 'none' }),
                  }}
                  align="left"
                >
                  Ім`я
                </TableCell>
                <TableCell
                  sx={{
                    ...(isMd && {
                      fontSize: '10px',
                      px: 0,
                      width: 50,
                      display: 'none',
                    }),
                  }}
                  align="left"
                >
                  Email
                </TableCell>
                <TableCell
                  sx={{
                    ...(isMd && { display: 'none' }),
                  }}
                  align="left"
                >
                  Дата додавання
                </TableCell>
                <TableCell align="left"></TableCell>
                {isMd && <TableCell align="right"></TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {spaceMembers?.data
                ?.filter((el) => user?.email !== el.owner.email)
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
                        userEmail={user?.email}
                      ></AlertDialog>
                      <TableCell
                        sx={{
                          ...(isMd && { display: 'none' }),
                        }}
                        align="left"
                      >
                        {formatName(row.owner.firstName)}{' '}
                        {formatName(row.owner.lastName)}
                      </TableCell>
                      <TableCell
                        sx={{
                          ...(isMd && { fontSize: '10px', px: 0, width: 50 }),
                        }}
                        align="left"
                      >
                        <Box sx={{ display: 'flex' }}>
                          {row.owner.email} <Status statusCode={row.status} />
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          ...(isMd && { display: 'none' }),
                        }}
                        align="left"
                      >
                        {formatTime}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          sx={{
                            fontSize: '8px',
                            ...(isMd && {
                              fontSize: '6px',
                              minWidth: '40px',
                              p: 0,
                            }),
                          }}
                          onClick={() =>
                            handleRemoveShare(row.id, 'otherSpace')
                          }
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
    </>
  );
};

export default ShareAccessPage;
