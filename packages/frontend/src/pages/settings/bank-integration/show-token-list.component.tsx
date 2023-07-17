import React from 'react';
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
import { format } from 'date-fns';
import {
  ITokenItem,
  LastWebhookValidationStatusType,
} from 'types/token-item.interface';
import { useFetchTokenList } from 'api/useFetchTokenList';

const ShowTokenList: React.FC = () => {
  const isMd = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const tokenList = useFetchTokenList();
  return (
    <Box sx={{ mb: '20px' }}>
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
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          ))}
      </>
    </Box>
  );
};

export default ShowTokenList;
