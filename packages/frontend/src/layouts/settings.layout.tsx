import React, { useEffect } from 'react';
import Drawer from '@mui/material/Drawer';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useGlobalState } from 'global-state/use-global-state.hook';

const drawerWidth = 240;

const SettingsLayout: React.FC = () => {
  const { settingsPageSelected, setChoiceSettingsPage } = useGlobalState();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    navigate(settingsPageSelected);
  }, []);
  const handleItemClick = (item: string) => {
    setChoiceSettingsPage(item);
    <Link to={item} />;
  };

  return (
    <Box sx={{ display: 'flex', position: 'relative' }}>
      <Drawer
        sx={{
          width: drawerWidth,
          height: 150,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            position: 'relative',
            borderRadius: '16px 0 0 16px',
          },
        }}
        variant="permanent"
      >
        <ListItemButton
          sx={{ '&.Mui-selected': { backgroundColor: 'primary.secondary' } }}
          component={Link}
          to="integration"
          selected={location.pathname === '/settings/integration'}
          onClick={() => handleItemClick('integration')}
        >
          <ListItemText primary="Інтеграція Monobank" />
        </ListItemButton>
        <ListItemButton
          sx={{ '&.Mui-selected': { backgroundColor: 'primary.secondary' } }}
          component={Link}
          to="shareaccess"
          selected={location.pathname === '/settings/shareaccess'}
          onClick={() => handleItemClick('shareaccess')}
        >
          <ListItemText primary="Спільний доступ" />
        </ListItemButton>
      </Drawer>
      <Box
        sx={{
          flexGrow: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default SettingsLayout;
