import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { notify } from '../../utils/notifications';
import { useAuthState } from '../../auth-state/use-auth-state.hook';
import SaveTokenForm from './save-token-form.component';
import StatementTable from './statements-table.component';
import { useFetchTokenList } from '../../api/useFetchTokenList';

const Statements: React.FC = () => {
  const { token, user } = useAuthState();
  const [isTokenSaved, setIsTokenSaved] = useState(false);
  const [tokenList, fetchTokenList] = useFetchTokenList();
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
    fetchTokenList();
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

  return tokenList?.items.length ? (
    <StatementTable />
  ) : (
    <SaveTokenForm setIsTokenSaved={setIsTokenSaved} />
  );
};

export default Statements;
