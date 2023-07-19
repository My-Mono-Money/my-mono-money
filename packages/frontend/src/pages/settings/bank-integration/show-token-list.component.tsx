import React, { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  Theme,
  Chip,
} from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { format } from 'date-fns';
import {
  ITokenItem,
  ImportAttemptStatusType,
  LastWebhookValidationStatusType,
} from 'types/token-item.interface';
import { useFetchTokenList } from 'api/useFetchTokenList';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosPrivate } from 'api/axios';
import { AxiosError } from 'axios';
import { IErrorResponse } from 'types/error-response.interface';
import { UpdatingIndicator } from 'common/components/updating-indicator/updating-indicator.component';

interface IAlertRemoveToken {
  tokenId: string;
}
const ShowTokenList: React.FC = () => {
  const isMd = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const tokenList = useFetchTokenList();
  const queryClient = useQueryClient();
  const [openAlertRemoveToken, setOpenAlertRemoveToken] = useState('');

  const handleDeleteToken = (tokeId: string) => {
    setOpenAlertRemoveToken(tokeId);
  };

  const { mutate: mutateDeleteInvite, isLoading } = useMutation({
    mutationFn: ({ tokenId }: IAlertRemoveToken) =>
      axiosPrivate.delete(`/tokens/${tokenId}/delete`),

    onError: (err) => {
      const axiosError = err as unknown as AxiosError<IErrorResponse>;
      alert(axiosError.response?.data.message);
    },

    onSuccess: () => {
      queryClient.invalidateQueries(['token-list']);
    },
  });
  const handleClose = () => {
    setOpenAlertRemoveToken('');
  };

  const handleConfirm = async () => {
    if (!isLoading) {
      mutateDeleteInvite({
        tokenId: openAlertRemoveToken,
      } as IAlertRemoveToken);
      setOpenAlertRemoveToken('');
    }
  };
  return (
    <Box sx={{ mb: '20px' }}>
      {isLoading && <UpdatingIndicator />}
      <>
        {!tokenList?.data ||
          (tokenList.data.length < 1 ? (
            <Box sx={{ width: 'full' }}>
              <p>
                Щоб додати інших користувачів до свого простору, спочатку
                додайте монобанк токен
              </p>
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table
                  sx={{
                    minWidth: 650,
                    ...(isMd && { minWidth: '100%', overflowX: 'auto' }),
                  }}
                  aria-label="simple table"
                >
                  <TableHead>
                    <TableRow
                      sx={{
                        ...(isMd && {
                          pr: 1,
                        }),
                      }}
                    >
                      <TableCell
                        align="left"
                        sx={{
                          ...(isMd && {
                            fontSize: '1.5vw',
                            fontWeight: 'bold',
                            display: 'none',
                          }),
                        }}
                      >
                        Токен
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          ...(isMd && {
                            fontSize: '1.5vw',
                            fontWeight: 'bold',
                            lineHeight: 1.2,
                          }),
                        }}
                      >
                        Імʼя користувача
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          ...(isMd && {
                            fontSize: '1.5vw',
                            fontWeight: 'bold',
                            lineHeight: 1.2,
                          }),
                        }}
                      >
                        Кількість рахунків
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          ...(isMd && {
                            fontSize: '1.5vw',
                            fontWeight: 'bold',
                            lineHeight: 1.2,
                          }),
                        }}
                      >
                        Дата створення
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          ...(isMd && {
                            fontSize: '1.5vw',
                            fontWeight: 'bold',
                            lineHeight: 1.2,
                          }),
                        }}
                      >
                        Статус
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tokenList?.data?.map((row: ITokenItem) => {
                      const formatTime = `${format(
                        new Date(row.createdAt),
                        'dd.MM.yyyy HH:mm',
                      )}`;
                      return (
                        <TableRow key={row.token}>
                          <TableCell
                            align="left"
                            sx={{
                              ...(isMd && {
                                fontSize: '1.5vw',
                                fontWeight: 'bold',
                                display: 'none',
                              }),
                            }}
                          >
                            {row.token}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              ...(isMd && {
                                fontSize: '1.5vw',
                                fontWeight: 'bold',
                              }),
                            }}
                          >
                            {row.monobankUserName}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              ...(isMd && {
                                fontSize: '1.5vw',
                                fontWeight: 'bold',
                              }),
                            }}
                          >
                            {row.totalAccounts}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              ...(isMd && {
                                fontSize: '1.5vw',
                                fontWeight: 'bold',
                              }),
                            }}
                          >
                            {formatTime}
                          </TableCell>
                          <TableCell align="center">
                            <Box
                              sx={{
                                display: 'flex',
                                gap: '1px',
                                alignItems: 'center',
                              }}
                            >
                              <Chip
                                size={isMd ? 'small' : 'medium'}
                                sx={{
                                  ...(isMd && {
                                    height: '15px',
                                    fontSize: '1.5vw',
                                  }),
                                }}
                                label={row.lastWebhookValidationStatus}
                                color={
                                  row.lastWebhookValidationStatus ===
                                  LastWebhookValidationStatusType.Active
                                    ? 'success'
                                    : 'error'
                                }
                              />
                              {row.importAttempts.find(
                                (importAttempt) =>
                                  importAttempt.status !==
                                  ImportAttemptStatusType.InProgress,
                              ) ? (
                                <DeleteForeverIcon
                                  sx={{
                                    cursor: !isLoading ? 'pointer' : 'default',
                                    ...(isMd && {
                                      height: '15px',
                                      fontSize: '3.5vw',
                                    }),
                                  }}
                                  color={'error'}
                                  onClick={() => handleDeleteToken(row.id)}
                                />
                              ) : null}
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              {openAlertRemoveToken && (
                <Dialog
                  open={Boolean(openAlertRemoveToken)}
                  onClose={handleClose}
                  aria-labelledby="alert-dialog-delete-token"
                  aria-describedby="alert-dialog-description--delete-token"
                >
                  <DialogTitle id="alert-dialog-title-delete-token">
                    Ви впевнені, що хочете видалити токен?
                  </DialogTitle>
                  <DialogActions>
                    <Button onClick={handleClose}>Ні</Button>
                    <Button onClick={handleConfirm} autoFocus>
                      Так
                    </Button>
                  </DialogActions>
                </Dialog>
              )}
            </>
          ))}
      </>
    </Box>
  );
};

export default ShowTokenList;
