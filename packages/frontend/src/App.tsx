import React from 'react';
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

  const publicRoutes = (
    <Route element={<OnlyPublic />}>
      <Route element={<AuthLayout />}>
        <Route path="sign-in" element={<SignInPage />} />
        <Route path="sign-up" element={<SignUpPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="verify-email" element={<VerifyEmail />} />
      </Route>
    </Route>
  );

  const privateRoutes = (
    <Route element={<Private />}>
      <Route element={<StatementLayout />}>
        <Route index element={<StatementsPage />} />
      </Route>
    </Route>
  );

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <AuthStateProvider>
          <Routes>
            <Route element={<WaitForAuthResolve />}>
              {publicRoutes}
              {privateRoutes}
            </Route>
          </Routes>
        </AuthStateProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
