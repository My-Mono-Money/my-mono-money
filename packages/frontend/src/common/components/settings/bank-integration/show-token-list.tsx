import React, { useEffect } from 'react';
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
import { useFetchTokenList } from '../../../../api/useFetchTokenList';

const ShowTokenList: React.FC = () => {
  const [tokenList, fetchTokenList] = useFetchTokenList();

  useEffect(() => {
    fetchTokenList();
  }, []);

  tokenList?.items[0].token;

  return (
    <Box sx={{ mb: '20px' }}>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Токен</TableCell>
              <TableCell align="right">Дата створення</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tokenList?.items.map((row) => {
              const formatTime = `${format(
                new Date(row.createdAt),
                'dd.MM.yyyy HH:mm',
              )}`;
              return (
                <TableRow key={row.token}>
                  <TableCell align="left">{row.token}</TableCell>
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
