import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Typography, IconButton, Menu } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Logout, Settings, Home } from '@mui/icons-material';
import { MenuItem, ListItemIcon } from '@mui/material';
import { useAuthState } from '../auth-state/use-auth-state.hook';
import PopupAddToken from '../common/components/popup-add-token/popup-add-token';
import SwitchingSpaces from '../common/switching-spaces/switching-spaces.component';
import { useGlobalState } from '../global-state/use-global-state.hook';

const Header = () => {
  const { user, clearToken } = useAuthState();
  const { settingsPageSelected, setClearAllGlobalState } = useGlobalState();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();

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
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" letterSpacing={3}>
          My Mono Money
        </Typography>
        <SwitchingSpaces />
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
          <MenuItem onClick={() => navigate('/')}>
            <ListItemIcon>
              <Home fontSize="small" />
            </ListItemIcon>
            Home
          </MenuItem>
          <MenuItem
            onClick={() => navigate('/settings/' + settingsPageSelected)}
          >
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
          <MenuItem
            onClick={() => {
              setClearAllGlobalState();
              clearToken();
            }}
          >
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

const StatementLayout: React.FC = () => {
  return (
    <Box>
      <Header />
      <PopupAddToken />
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
