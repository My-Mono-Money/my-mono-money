import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useAuthState } from '../../auth-state/use-auth-state.hook';

const Statements: React.FC = () => {
  const { user, clearToken } = useAuthState();

  return (
    <Box>
      <Typography>
        Привіт, {user?.firstName} {user?.lastName}
      </Typography>
      <Button onClick={clearToken}>Вийти</Button>
    </Box>
  );
};

export default Statements;
