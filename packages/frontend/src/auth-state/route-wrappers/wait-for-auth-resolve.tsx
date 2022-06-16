import React from 'react';
import { Outlet } from 'react-router-dom';
import { PageLoading } from '../../common/page-loading/page-loading';
import { useAuthState } from '../use-auth-state.hook';

export const WaitForAuthResolve = () => {
  const { isAuthResolved } = useAuthState();

  if (!isAuthResolved) {
    return <PageLoading />;
  }

  return <Outlet />;
};
