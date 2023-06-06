import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { format } from 'date-fns';
import { ITokenItem } from 'types/token-item.interface';
import { useFetchTokenList } from 'api/useFetchTokenList';

const ShowTokenList: React.FC = () => {
  const tokenList = useFetchTokenList();
  return (
    <Box sx={{ mb: '20px' }}>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Токен</TableCell>
              <TableCell align="right">Імʼя користувача</TableCell>
              <TableCell align="right">Кількість рахунків</TableCell>
              <TableCell align="right">Дата створення</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!tokenList?.data ||
              (tokenList.data.length < 1 && (
                <TableRow sx={{ width: 'full' }}>
                  <TableCell>
                    {' '}
                    Щоб додати інших користувачів до свого простору, спочатку
                    додайте монобанк токен
                  </TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              ))}
            {tokenList?.data?.map((row: ITokenItem) => {
              const formatTime = `${format(
                new Date(row.createdAt),
                'dd.MM.yyyy HH:mm',
              )}`;
              return (
                <TableRow key={row.token}>
                  <TableCell align="left">{row.token}</TableCell>
                  <TableCell align="left">{row.monobankUserName}</TableCell>
                  <TableCell align="left">{row.totalAccounts}</TableCell>
                  <TableCell align="right">{formatTime}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ShowTokenList;
