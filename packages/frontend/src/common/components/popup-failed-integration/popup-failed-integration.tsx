import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, useMediaQuery, Theme } from '@mui/material';
import { useFetchTokenList } from 'api/useFetchTokenList';
import { LastWebhookValidationStatusType } from 'types/token-item.interface';

const PopupFailedIntegration = () => {
  const tokenList = useFetchTokenList();
  const isXs = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const tryFindFailedToken = tokenList.data?.find(
    (token) =>
      token.lastWebhookValidationStatus ===
      LastWebhookValidationStatusType.Error,
  );

  if (!tryFindFailedToken) {
    return null;
  }
  return (
    <Box
      sx={{
        margin: '0 auto',
        border: '0 0 1px 0 solid',
        borderColor: 'lightgray',
        boxShadow: '3px 3px 3px 3px lightgray',
        width: 'auto',
        height: 'auto',
        display: 'flex',
        justifyContent: 'center',
        padding: '2px',
        backgroundColor: 'white',
        gap: 4,
      }}
    >
      <Typography
        variant="h5"
        align="center"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          ...(isXs && {
            fontSize: '10px',
          }),
        }}
      >
        Інтеграція з monobank була порушена.
      </Typography>
      <Typography
        variant="h5"
        align="center"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          ...(isXs && {
            fontSize: '10px',
          }),
        }}
      >
        <Link to="/settings/integration">Виправити інтеграцію</Link>
      </Typography>
    </Box>
  );
};

export default PopupFailedIntegration;
