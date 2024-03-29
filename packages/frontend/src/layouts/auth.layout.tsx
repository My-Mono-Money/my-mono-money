import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Typography, useMediaQuery, Theme } from '@mui/material';

const LeftSide = () => {
  const isMd = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const isXs = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        pt: '27px',
        px: '70px',
        color: 'whitesmoke',
        background:
          'linear-gradient(164deg, rgba(97,123,227,1) 0%, rgba(97,121,227,1) 15%, rgba(111,37,220,1) 70%, rgba(112,28,219,1) 100%)',
        ...(isXs && { display: 'none' }),
      }}
    >
      <Typography
        variant="h6"
        letterSpacing={3}
        sx={{
          ...(isMd && { fontSize: '3vw' }),
        }}
      >
        My Mono Money
      </Typography>

      <Box
        sx={{
          pt: '100px',
        }}
      >
        <Typography
          variant="h3"
          fontWeight={600}
          sx={{
            ...(isMd && { fontSize: '25px' }),
          }}
        >
          Найкращий застосунок, для ведення домашньої бухгалтерії
        </Typography>
      </Box>
    </Box>
  );
};

const AuthLayout: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridAutoFlow: 'column',
        gridAutoColumns: '1fr',
        height: '100%',
      }}
    >
      <LeftSide />
      <Box
        sx={{
          display: 'flex',
          pt: 7.5,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AuthLayout;
