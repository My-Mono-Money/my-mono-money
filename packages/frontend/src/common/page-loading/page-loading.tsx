import { Box } from '@mui/material';
import React from 'react';
import { InfinitySpin } from 'react-loader-spinner';
export const PageLoading = () => (
  <Box
    sx={{
      width: '100%',
      height: '90%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <InfinitySpin width="200" color="#4fa94d" />
  </Box>
);
