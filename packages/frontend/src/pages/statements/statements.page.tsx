import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { notify } from 'utils/notifications';
import { useAuthState } from 'auth-state/use-auth-state.hook';
import SaveTokenForm from './save-token-form.component';
import StatementTable from './statements-table.component';
import { useFetchSpaces } from 'api/useFetchSpaces';
import { useFetchTokenList } from 'api/useFetchTokenList';
import { useGlobalState } from 'global-state/use-global-state.hook';

const Statements: React.FC = () => {
  const { token, user } = useAuthState();
  const [isTokenSaved, setIsTokenSaved] = useState(false);
  const { setChangeDefaultUserSpace } = useGlobalState();
  const tokenList = useFetchTokenList();
  const spaces = useFetchSpaces();
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user?.isEmailVerified) navigate('/verify-email');
    setChangeDefaultUserSpace(
      spaces?.data?.find((space) => space.isDefault === true)
        ?.spaceOwnerEmail || '',
    );
  }, []);
  useEffect(() => {
    if (isTokenSaved) {
      notify('Котики зберегли ваш токен', '🐈');

      setChangeDefaultUserSpace(
        spaces?.data?.find((space) => space.isDefault === true)
          ?.spaceOwnerEmail || '',
      );
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
  const isTokenListEmpty = Boolean(
    !tokenList?.data || tokenList.data.length <= 0,
  );
  const filteredSpaces = isTokenListEmpty
    ? spaces.data?.filter((space) => space.spaceOwnerEmail !== user?.email)
    : spaces.data;

  return filteredSpaces && filteredSpaces.length >= 1 ? (
    <StatementTable />
  ) : (
    <SaveTokenForm setIsTokenSaved={setIsTokenSaved} />
  );
};

export default Statements;
