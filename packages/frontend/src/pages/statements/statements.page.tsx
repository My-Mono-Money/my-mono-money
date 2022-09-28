import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useAuthState } from '../../auth-state/use-auth-state.hook';
import StatementTable from '../../common/components/statement-table/statement-table.component';
import axios, { AxiosError } from 'axios';
import { IStatementItem } from '../../types/statement-item.interface';

interface IStatementsState {
  isLoading?: boolean;
  data: IStatementItem[];
  error?: Error;
}

interface IStatementsResponse {
  items: IStatementItem[];
}

interface IErrorResponse {
  message: string;
}

const fetchStatements = async (token: string) => {
  try {
    const response = await axios.get<IStatementsResponse>(
      '/statement?from=0&limit=0&period=month:-3',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (err) {
    const axiosError = err as unknown as AxiosError<IErrorResponse>;
    console.log('error', axiosError.response?.data.message);
  }
};

const Statements: React.FC = () => {
  const { user, token, clearToken } = useAuthState();
  const [{ isLoading, data, error }, setStatementsState] =
    useState<IStatementsState>({
      data: [],
    });

  useEffect(() => {
    if (!token) {
      // clearToken();
      return;
    }
    setStatementsState({ isLoading: true, data: [] });
    fetchStatements(token)
      .then((data) => setStatementsState({ data: data?.items || [] }))
      .catch((error) => setStatementsState({ data: [], error }));
  }, []);

  if (isLoading) {
    return <>Ya zagruzhayus</>;
  }

  if (error) {
    return <>Ya dybil {error.message}</>;
  }

  console.log('data', data);

  return (
    <Box>
      <Typography>
        Привіт, {user?.firstName} {user?.lastName}
      </Typography>
      <Button onClick={clearToken}>Вийти</Button>
      <StatementTable data={data} />
    </Box>
  );
};

export default Statements;
