import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Box } from '@mui/material';
import ShowTokenList from '../../common/components/settings/bank-integration/show-token-list';
import AddNewToken from '../../common/components/settings/bank-integration/add-new-token.component';
import ShareAccess from '../../common/components/settings/share-access/share-access.component';
import { useGlobalState } from '../../global-state/use-global-state.hook';

const drawerWidth = 240;

const Settings: React.FC = () => {
  const { settingsPageSelected, setChoiceSettingsPage } = useGlobalState();
  const handleItemClick = (item: string) => {
    setChoiceSettingsPage(item);
  };

  return (
    <Box sx={{ display: 'flex', position: 'relative' }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            position: 'relative',
            borderRadius: '16px 0 0 16px',
          },
        }}
        variant="permanent"
      >
        <List>
          <ListItemButton
            selected={settingsPageSelected === 'Item 1'}
            onClick={() => handleItemClick('Item 1')}
            sx={{ '&.Mui-selected': { backgroundColor: 'primary.secondary' } }}
          >
            <ListItemText primary="Інтеграція Monobank" />
          </ListItemButton>
          <ListItemButton
            selected={settingsPageSelected === 'Item 2'}
            onClick={() => handleItemClick('Item 2')}
            sx={{ '&.Mui-selected': { backgroundColor: 'primary.secondary' } }}
          >
            <ListItemText primary="Спільний доступ" />
          </ListItemButton>
        </List>
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
        {settingsPageSelected === 'Item 1' ? (
          <>
            <AddNewToken />
            <ShowTokenList />
          </>
        ) : null}
        {settingsPageSelected === 'Item 2' ? <ShareAccess /> : null}
      </Box>
    </Box>
  );
};

export default Settings;
