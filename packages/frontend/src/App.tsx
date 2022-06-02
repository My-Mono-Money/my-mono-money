import React, { Suspense } from 'react';
import { ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AuthLayout from './layouts/auth.layout';

const SignInPage = React.lazy(() => import('./pages/sign-in/sign-in.page'));
const SignUpPage = React.lazy(() => import('./pages/sign-up/sign-up.page'));

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

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Suspense fallback={<div>Завантаження...</div>}>
          <Routes>
            <Route element={<AuthLayout />}>
              <Route index element={<Navigate to="sign-in" replace />} />
              <Route path="sign-in" element={<SignInPage />} />
              <Route path="sign-up" element={<SignUpPage />} />
            </Route>
          </Routes>
        </Suspense>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
