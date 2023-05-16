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
import { useGlobalState } from '../../../../global-state/use-global-state.hook';

const ShowTokenList: React.FC = () => {
  const [, fetchTokenList] = useFetchTokenList();
  const { tokenList } = useGlobalState();
  useEffect(() => {
    fetchTokenList();
  }, []);

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
            {tokenList && tokenList?.length < 1 && (
              <TableRow sx={{ width: 'full' }}>
                <TableCell>
                  {' '}
                  Щоб додати інших користувачів до свого простору, спочатку
                  додайте монобанк токен
                </TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            )}
            {tokenList?.map((row) => {
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
