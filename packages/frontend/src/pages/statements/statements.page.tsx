import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { notify } from 'utils/notifications';
import { useAuthState } from 'auth-state/use-auth-state.hook';
import SaveTokenForm from './save-token-form.component';
import StatementTable from './statements-table.component';
import { useFetchSpaceMembersList } from 'api/useFetchSpaceMembersList';
import { useFetchSpaces } from 'api/useFetchSpaces';
import { useGlobalState } from 'global-state/use-global-state.hook';
import { useFetchTokenList } from 'api/useFetchTokenList';

const Statements: React.FC = () => {
  const { token, user } = useAuthState();
  const { spaces, setChangeDefaultUserSpace } = useGlobalState();
  const [isTokenSaved, setIsTokenSaved] = useState(false);
  const [, fetchSpaceMembers] = useFetchSpaceMembersList();
  const [, fetchToken] = useFetchTokenList();
  const [, fetchSpaces] = useFetchSpaces();
  const [tokenList, setTokenList] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.isEmailVerified) navigate('/verify-email');

    if (!isTokenSaved) {
      fetchSpaceMembers();
      fetchSpaces();
      fetchToken().then((tokenLists) => setTokenList(tokenLists as never[]));
    }
  }, []);

  useEffect(() => {
    if (isTokenSaved) {
      notify('Котики зберегли ваш токен', '🐈');
      fetchSpaces();
      fetchToken().then((tokenLists) => setTokenList(tokenLists as never[]));

      setChangeDefaultUserSpace(
        spaces.find((space) => space.isDefault === true)?.spaceOwnerEmail || '',
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
  const isTokenListEmpty = Boolean(tokenList && tokenList?.length <= 0);
  const filteredSpaces = isTokenListEmpty
    ? spaces.filter((space) => space.spaceOwnerEmail !== user?.email)
    : spaces;

  return filteredSpaces?.length >= 1 ? (
    <StatementTable />
  ) : (
    <SaveTokenForm setIsTokenSaved={setIsTokenSaved} />
  );
};

export default Statements;
