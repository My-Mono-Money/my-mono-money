import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import { IStatementItem } from '../../types/statement-item.interface';
import { IPagingState } from '../../types/statement-paging.interface';
import { usePagination } from './use-pagination.hook';
import { useAuthState } from '../../auth-state/use-auth-state.hook';
import { UpdatingIndicator } from '../../common/components/updating-indicator/updating-indicator.component';
import { useDebounce } from 'use-debounce';

interface IStatementsResponse {
  items: IStatementItem[];
  paging: IPagingState;
}

const fetchStatements = async (token: string, page: number) => {
  try {
    const response = await axios.get<IStatementsResponse>(
      `/statement?from=${page * 10}&limit=10&period=month:-3`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (err) {
    console.log('err', err);
  }
};

const renderLoadingSkeleton = () => {
  return Array.from({ length: 10 }).map((__, index) => (
    <TableRow key={index}>
      <TableCell>
        <Skeleton />
      </TableCell>
      <TableCell>
        <Skeleton />
      </TableCell>
      <TableCell>
        <Skeleton />
      </TableCell>
    </TableRow>
  ));
};

const StatementTable: React.FC = () => {
  const { token } = useAuthState();
  const [page, setPage] = usePagination();
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState<IStatementsResponse>();
  const [debouncedIsLoading] = useDebounce(loading && !response, 150);
  const [debouncedIsUpdating] = useDebounce(loading && response, 500);

  const changePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    page: number,
  ) => {
    setPage(page);
  };

  useEffect(() => {
    if (!token) {
      return;
    }

    setLoading(true);
    fetchStatements(token, page).then((result) => {
      if (result) {
        setResponse(result);
      }
      setLoading(false);
    });
  }, [page]);

  return (
    <>
      {debouncedIsUpdating && <UpdatingIndicator />}
      <Box
        sx={{
          width: '100%',
          margin: '0 auto',
          borderRadius: '16px',
          border: '1px solid',
          borderColor: 'lightgray',
          boxShadow: '3px 3px 3px 3px lightgray',
        }}
      >
        <TableContainer>
          <Table
            aria-label="statement table"
            sx={{ borderRadius: '16px', tableLayout: 'fixed' }}
          >
            <TableHead>
              <TableRow>
                <TableCell>Дата та час</TableCell>
                <TableCell>Деталі транзкції</TableCell>
                <TableCell>Сума</TableCell>
              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                maxHeight: '200px',
                overflow: 'scroll',
              }}
            >
              {debouncedIsLoading && renderLoadingSkeleton()}
              {!debouncedIsLoading &&
                response?.items.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.time}</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>{row.amount}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10]}
          component="div"
          count={response?.paging.total ?? 0}
          rowsPerPage={10}
          page={response?.paging.total ? page : 0}
          onPageChange={changePage}
        />
      </Box>
    </>
  );
};

export default StatementTable;