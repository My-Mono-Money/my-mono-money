import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import AuthLayout from './layouts/auth.layout';
import { AuthStateProvider } from './auth-state/auth-state.provider';
import { Private } from './auth-state/route-wrappers/private';
import { WaitForAuthResolve } from './auth-state/route-wrappers/wait-for-auth-resolve';
import { OnlyPublic } from './auth-state/route-wrappers/only-public';
import ForgotPasswordPage from './pages/forgot-password/forgot-password.page';
import SignInPage from './pages/sign-in/sign-in.page';
import SignUpPage from './pages/sign-up/sign-up.page';
import StatementsPage from './pages/statements/statements.page';
import { VerifyEmail } from './pages/verify-email/verify-email.page';
import StatementLayout from './layouts/statement.layout';
import { ToastContainer } from 'react-toastify';
import { ConfirmEmail } from './pages/confirm-email/confirm-email.page';
import Settings from './pages/settings/settings-page';
import { GlobalStateProvider } from './global-state/global-state.provider';
import { InvitationPage } from './pages/invitation/invitation.page';

function App() {
  const theme = createTheme({
    components: {
      MuiButton: {
        defaultProps: {
          variant: 'contained',
        },
        styleOverrides: {
          root: {
            borderRadius: 28,
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          size: 'small',
        },
      },
    },
  });

  const queryClient = new QueryClient();

  const publicRoutes = (
    <>
      <Route element={<OnlyPublic />}>
        <Route element={<AuthLayout />}>
          <Route path="sign-in" element={<SignInPage />} />
          <Route path="sign-up" element={<SignUpPage />} />
          <Route path="accept-invite" element={<SignUpPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="confirm-email" element={<ConfirmEmail />} />
        </Route>
      </Route>
      <Route element={<AuthLayout />}>
        <Route path="verify-email" element={<VerifyEmail />} />
      </Route>
    </>
  );

  const privateRoutes = (
    <Route element={<Private />}>
      <Route element={<StatementLayout />}>
        <Route index element={<StatementsPage />} />
        <Route path="settings" element={<Settings />} />
        <Route path="invitation" element={<InvitationPage />} />
      </Route>
    </Route>
  );

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <AuthStateProvider>
            <GlobalStateProvider>
              <Routes>
                <Route element={<WaitForAuthResolve />}>
                  {publicRoutes}
                  {privateRoutes}
                </Route>
              </Routes>
              <ToastContainer />
            </GlobalStateProvider>
          </AuthStateProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
