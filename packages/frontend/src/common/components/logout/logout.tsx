import React from 'react';
import { Logout } from '@mui/icons-material';
import { MenuItem, ListItemIcon } from '@mui/material';
import { useAuthState } from '../../../auth-state/use-auth-state.hook';
const LogoutUser = () => {
  const { clearToken } = useAuthState();
  return (
    <MenuItem onClick={clearToken}>
      <ListItemIcon>
        <Logout fontSize="small" />
      </ListItemIcon>
      Logout
    </MenuItem>
  );
};

export default LogoutUser;
