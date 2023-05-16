import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { notify } from '../../utils/notifications';
import { useAuthState } from '../../auth-state/use-auth-state.hook';
import SaveTokenForm from './save-token-form.component';
import StatementTable from './statements-table.component';
import { useFetchSpaceMembersList } from '../../api/useFetchSpaceMembersList';

const Statements: React.FC = () => {
  const { token, user } = useAuthState();
  const [isTokenSaved, setIsTokenSaved] = useState(false);
  const [spaceMembers, fetchSpaceMembers] = useFetchSpaceMembersList();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    if (!user?.isEmailVerified) navigate('/verify-email');
    fetchSpaceMembers();
  }, []);

  useEffect(() => {
    if (isTokenSaved) {
      notify('Котики зберегли ваш токен', '🐈');
      fetchSpaceMembers();
      setIsTokenSaved(false);
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

  return spaceMembers.length >= 1 ? (
    <StatementTable />
  ) : (
    <SaveTokenForm setIsTokenSaved={setIsTokenSaved} />
  );
};

export default Statements;
