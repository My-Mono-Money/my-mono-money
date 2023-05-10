import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useGlobalState } from '../../../global-state/use-global-state.hook';

const PopupAddToken = () => {
  const {
    isPopupAddTokenEnable,
    setTogglePopupAddToken,
    setChoiceSettingsPage,
  } = useGlobalState();
  if (!isPopupAddTokenEnable) {
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
        justifyContent: 'space-around',
        padding: '2px',
        backgroundColor: 'white',
      }}
    >
      <Typography
        variant="h5"
        align="center"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Link to="/settings"> Додати інший токен</Link>
      </Typography>
      <Button
        sx={{ margin: '5px' }}
        onClick={() => {
          setChoiceSettingsPage('Item 1');
          setTogglePopupAddToken(false);
        }}
      >
        <CloseIcon />
      </Button>
    </Box>
  );
};

export default PopupAddToken;
