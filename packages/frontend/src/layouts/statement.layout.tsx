import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  Typography,
  IconButton,
  Menu,
  useMediaQuery,
  Theme,
  Popover,
  Button,
} from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Logout, Settings, Home } from '@mui/icons-material';
import { MenuItem, ListItemIcon } from '@mui/material';
import { useAuthState } from '../auth-state/use-auth-state.hook';
import PopupAddToken from '../common/components/popup-add-token/popup-add-token';
import SwitchingSpaces from '../common/switching-spaces/switching-spaces.component';
import { useGlobalState } from '../global-state/use-global-state.hook';
import FeedbackIcon from '@mui/icons-material/Feedback';
import CloseIcon from '@mui/icons-material/Close';
import PopupFailedIntegration from 'common/components/popup-failed-integration/popup-failed-integration';

const Header = () => {
  const { user, clearToken } = useAuthState();
  const { settingsPageSelected, setClearAllGlobalState } = useGlobalState();
  const isMd = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const isXs = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [anchorElpopover, setAnchorElpopover] =
    useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorElpopover);
  const id = open ? 'simple-popover' : undefined;
  const handleClickPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElpopover(event.currentTarget);
  };

  const [copied, setCopied] = useState(false);
  const emailFeedback = 'support@my-mono-money.app';
  const handleClosePopover = () => {
    setAnchorElpopover(null);
  };

  const handleCopyToClipboard = (text: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => {
          setAnchorElpopover(null);
          setCopied(false);
        }, 10000);
      });
    } else {
      prompt('Скопіюйте пошту для зв`язку з нами', text);
    }
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

        ...(isXs && {
          height: '116px',
        }),
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
        <Typography
          variant="h6"
          sx={{
            ...(isXs && {
              display: 'none',
            }),
          }}
          letterSpacing={3}
        >
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
          ...(isXs && {
            paddingRight: '10px',
            owerflowX: 'hidden',
          }),
        }}
      >
        <Box
          sx={{
            mr: 4,
          }}
        >
          <Button
            aria-describedby={id}
            variant="contained"
            onClick={handleClickPopover}
            sx={{
              display: 'flex',
              gap: 1,
              ...(isMd && { minWidth: '40px', p: 0, ml: 1 }),
            }}
          >
            {' '}
            {!isMd && 'Звʼязатися з нами '}
            <FeedbackIcon
              sx={{
                ...(isMd && { width: '10px' }),
              }}
            />
          </Button>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorElpopover}
            onClose={handleClosePopover}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            sx={{ position: 'absolute' }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                padding: 2,
                ...(isMd && { flexDirection: 'column' }),
              }}
            >
              {' '}
              <Typography
                sx={{
                  textDecoration: 'underline',

                  cursor: 'pointer',
                  ...(isMd && { fontSize: '10px' }),
                }}
                onClick={() => handleCopyToClipboard(emailFeedback)}
              >
                {emailFeedback}
              </Typography>
              {copied && (
                <Typography
                  sx={{
                    ...(isMd && { fontSize: '8px' }),
                  }}
                >
                  Скопійовано
                </Typography>
              )}
            </Box>
            <Typography
              sx={{
                position: 'absolute',
                top: '1px',
                right: '5px',
                cursor: 'pointer',
              }}
              onClick={() => setAnchorElpopover(null)}
            >
              <CloseIcon
                sx={{
                  width: '15px',
                  height: '15px',
                }}
              />
            </Typography>
          </Popover>
        </Box>
        <Typography
          variant="h6"
          sx={{
            ...(isXs && {
              display: 'none',
            }),
          }}
        >
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
      <PopupFailedIntegration />
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
