import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import ShowTokenList from '../../common/components/settings/show-token-list';

const drawerWidth = 240;

const Settings: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<string>('Item 1');

  const handleItemClick = (item: string) => {
    setSelectedItem(item);
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
            selected={selectedItem === 'Item 1'}
            onClick={() => handleItemClick('Item 1')}
            sx={{ '&.Mui-selected': { backgroundColor: 'primary.secondary' } }}
          >
            <ListItemText primary="Інтеграція Monobank" />
          </ListItemButton>
          <ListItemButton
            selected={selectedItem === 'Item 2'}
            onClick={() => handleItemClick('Item 2')}
            sx={{ '&.Mui-selected': { backgroundColor: 'primary.secondary' } }}
          >
            <ListItemText primary="Item 2" />
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
        {selectedItem === 'Item 1' ? <ShowTokenList /> : null}
        {selectedItem === 'Item 2' ? (
          <Typography variant="h5" sx={{ marginTop: '5%' }}>
            Далі буде реалізовано...
          </Typography>
        ) : null}
      </Box>
    </Box>
  );
};

export default Settings;
