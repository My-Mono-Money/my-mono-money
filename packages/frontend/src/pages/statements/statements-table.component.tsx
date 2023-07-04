import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from 'use-debounce';
import { fromUnixTime, format } from 'date-fns';
import {
  Box,
  Divider,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { IStatementItem } from 'types/statement-item.interface';
import { IPagingState } from 'types/statement-paging.interface';
import { usePagination } from './use-pagination.hook';
import { useAuthState } from 'auth-state/use-auth-state.hook';
import { UpdatingIndicator } from 'common/components/updating-indicator/updating-indicator.component';
import PeriodFilter from './period-filter.component';
import { useGlobalState } from 'global-state/use-global-state.hook';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosPrivate } from 'api/axios';

interface IStatementsResponse {
  items: IStatementItem[];
  paging: IPagingState;
}

const fetchStatements = async (
  spaceOwnerEmail: string,
  page: number,
  period: string,
  search: string,
) => {
  const response = await axiosPrivate.get<IStatementsResponse>(
    `/spaces/${spaceOwnerEmail}/statements?from=${
      page * 10
    }&limit=10&period=${period}&search=${search}`,
  );

  return response.data;
};

const formatAmountCurrency = (num: number) => {
  const hasMinus = num < 0;
  const numStr = String(Math.trunc(Math.abs(num) / 100));
  let result = '';
  let count = 0;

  for (let i = numStr.length - 1; i >= 0; i--) {
    result = numStr.charAt(i) + result;
    count = count + 1;
    if (count === 3 && i > 0) {
      result = ' ' + result;
      count = 0;
    }
  }
  return [hasMinus ? '-' : '', result].join('');
};

const formatAmountCents = (num: number) => {
  return '.' + String(Math.abs(num) % 100).padStart(2, '0');
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
      <TableCell>
        <Skeleton />
      </TableCell>
    </TableRow>
  ));
};

const StatementTable = () => {
  const { user } = useAuthState();
  const { defaultUserSpace } = useGlobalState();
  const [page, setPage] = usePagination();
  const [clearInput, setClearInput] = useState(false);
  const [searchField, setSearchField] = useState('');
  const [searchFieldRequest, setSearchFieldRequest] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const period = searchParams.get('period') ?? 'day';

  const changePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    page: number,
  ) => {
    setPage(page);
  };
  const {
    data: statements,
    isLoading,
    isFetching,
    isError,
  } = useQuery(['statements', page, period, searchField], () =>
    fetchStatements(
      defaultUserSpace || (user?.email ?? ''),
      page,
      period,
      searchField,
    ),
  );
  const [debouncedIsLoading] = useDebounce(isLoading, 150);
  const [debouncedIsUpdating] = useDebounce(isFetching && statements, 500);

  useEffect(() => {
    if (statements) {
      queryClient.setQueryData(
        ['statements', page, period, searchField],
        statements,
      );
    }
  }, [statements, searchFieldRequest, page, period]);

  useEffect(() => {
    clearStatements();
  }, []);

  useEffect(() => {
    clearStatements();
  }, [defaultUserSpace]);

  const clearStatements = () => {
    changePage(null, 0);
    setSearchField('');
    setSearchFieldRequest('');
    setClearInput(true);
    searchParams.set('period', 'day');
    setSearchParams(searchParams);
    queryClient.invalidateQueries(['statements']);
  };

  return (
    <>
      {debouncedIsUpdating && <UpdatingIndicator />}
      <Box
        sx={{
          margin: '0 auto',
          borderRadius: '16px',
          border: '1px solid',
          borderColor: 'lightgray',
          boxShadow: '3px 3px 3px 3px lightgray',
          px: '40px',
        }}
      >
        <Box sx={{ p: 3, display: 'flex' }}>
          <PeriodFilter
            searchField={searchField}
            setSearchField={setSearchField}
            clearInput={clearInput}
            setClearInput={setClearInput}
            setSearchFieldRequest={setSearchFieldRequest}
          />
          {isError && (
            <Typography sx={{ pl: '10px', pt: '8px' }}>
              Помилка. Будь ласка, спробуйте пізніше
            </Typography>
          )}
        </Box>
        <Divider />
        <TableContainer>
          <Table
            aria-label="statement table"
            sx={{ borderRadius: '16px', tableLayout: 'fixed' }}
          >
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '115px' }} align="left">
                  Дата та час
                </TableCell>
                <TableCell align="center">Деталі транзкції</TableCell>
                <TableCell align="center">Категорія</TableCell>
                <TableCell sx={{ width: '115px' }} align="right">
                  Сума
                </TableCell>
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
                statements?.items.map((row) => {
                  const formatTime = `${format(
                    fromUnixTime(row.time),
                    'dd.MM.yyyy HH:mm',
                  )}`;
                  return (
                    <TableRow key={row.id}>
                      <TableCell align="left">{formatTime}</TableCell>
                      <TableCell align="center">{row.description}</TableCell>
                      <TableCell align="center">{row.category}</TableCell>
                      <TableCell align="right">
                        <span>{formatAmountCurrency(row.amount)}</span>
                        <span style={{ fontSize: '0.6rem' }}>
                          {formatAmountCents(row.amount)}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10]}
          component="div"
          count={statements?.paging.total ?? 0}
          rowsPerPage={10}
          page={statements?.paging.total ? page : 0}
          onPageChange={changePage}
        />
      </Box>
    </>
  );
};

export default StatementTable;
