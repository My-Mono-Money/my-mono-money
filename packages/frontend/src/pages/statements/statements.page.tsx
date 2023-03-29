import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useAuthState } from '../../auth-state/use-auth-state.hook';
import { ITokenItem } from '../../types/token-item.interface';
import SaveTokenForm from './save-token-form.component';
import StatementTable from './statements-table.component';

interface ITokenResponse {
  items: ITokenItem[];
}

const fetchToken = async (token: string) => {
  try {
    const response = await axios.get<ITokenResponse>('/tokens', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (err) {
    console.log('err', err);
  }
};
const Statements: React.FC = () => {
  const { token } = useAuthState();
  const [isTokenSaved, setIsTokenSaved] = useState(false);
  const [response, setResponse] = useState<ITokenResponse>();

  useEffect(() => {
    if (!token) {
      return;
    }
    fetchToken(token).then((result) => {
      if (result) {
        setResponse(result);
      }
    });
  }, [isTokenSaved]);

  return response?.items.length ? (
    <StatementTable />
  ) : (
    <SaveTokenForm setIsTokenSaved={setIsTokenSaved} />
  );
};

export default Statements;
