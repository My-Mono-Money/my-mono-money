import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Typography, IconButton, Menu } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { Outlet } from 'react-router-dom';
import LogoutUser from '../common/components/logout/logout';
import { useAuthState } from '../auth-state/use-auth-state.hook';

const Header = () => {
  const { user } = useAuthState();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '76px',
        width: '100%',
        backgroundColor: 'white',
      }}
    >
      <Box
        sx={{
          pl: '40px',
        }}
      >
        <Typography variant="h6" letterSpacing={3}>
          My Mono Money
        </Typography>
      </Box>
      <Box
        sx={{
          pr: '40px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6">
          {user?.firstName} {user?.lastName}
        </Typography>
        <IconButton size="large" onClick={handleMenu} color="inherit">
          <KeyboardArrowDownIcon />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <LogoutUser />
        </Menu>
      </Box>
    </Box>
  );
};

const StatementLayout: React.FC = () => {
  return (
    <Box>
      <Header />
      <Box
        id="under-header"
        sx={{
          height: 0,
          mb: '50px',
        }}
      ></Box>
      <Box
        sx={{
          maxWidth: '1100px',
          margin: '0 auto',
          backgroundColor: 'white',
          borderRadius: '16px',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default StatementLayout;
