import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { notify } from '../../utils/notifications';
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
  const { token, user } = useAuthState();
  const [isTokenSaved, setIsTokenSaved] = useState(false);
  const [response, setResponse] = useState<ITokenResponse>();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    if (!user?.isEmailVerified) navigate('/verify-email');
  }, []);

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

  useEffect(() => {
    if (isTokenSaved) {
      notify('Котики зберегли ваш токен', '🐈');
    }
  }, [isTokenSaved]);

  useEffect(() => {
    if (!token) {
      return;
    }
    if (location.state && location.state === 'confirm-email') {
      notify('Email верифікований', '👌');
      setTimeout(() => notify('Приємного користування', '🙂'), 2000);
    }
  }, [location]);

  return response?.items.length ? (
    <StatementTable />
  ) : (
    <SaveTokenForm setIsTokenSaved={setIsTokenSaved} />
  );
};

export default Statements;
