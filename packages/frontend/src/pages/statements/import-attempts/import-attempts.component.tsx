import React, { useState } from 'react';
import { format } from 'date-fns';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import { useFetchTokenList } from 'api/useFetchTokenList';
import { ImportAttemptStatusType } from 'types/token-item.interface';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import PendingIcon from '@mui/icons-material/Pending';
import QuizIcon from '@mui/icons-material/Quiz';
import { RotatingLines } from 'react-loader-spinner';
import './style.css';
import LogImportAttemptsModal from './log-import-attempts.component';
import { useMediaQuery } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosPrivate } from 'api/axios';

type Anchor = 'top';

const ImportAttempts = () => {
  const tokenList = useFetchTokenList();
  const queryClient = useQueryClient();
  const [state, setState] = useState({
    top: false,
  });
  const [openAccordionIndex, setOpenAccordionIndex] = useState(-1);
  const [openLogModal, setOpenLogModal] = useState({
    open: false,
    tokenId: '',
    importAttempt: '',
  });
  const isMd = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const isXs = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  const { mutate: mutateRetryImportAttempt } = useMutation({
    mutationFn: (tokenMonobank: string) =>
      axiosPrivate.post(`/tokens/${tokenMonobank}/retry-import`),
    onSuccess: () => {
      queryClient.invalidateQueries(['token-list']);
      setTimeout(() => {
        queryClient.invalidateQueries(['token-list']);
      }, 2000);
    },
  });

  const handleRetryImportAttempt = (token: string) => {
    mutateRetryImportAttempt(token);
  };

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  const removeSuccessfulImportTokenList = tokenList?.data?.filter(
    (token) =>
      !token?.importAttempts?.some(
        (importAttempt) => importAttempt.status === 'successful',
      ),
  );

  const hideButton = isXs ? <ExpandLessIcon /> : 'Сховати';
  const unfoldButton = isXs ? <ExpandMoreIcon /> : 'Детальніше';

  function tokenImportStatus(status: string) {
    switch (status) {
      case ImportAttemptStatusType.Successful:
        return {
          text: 'Завантажено',
          icon: <CheckIcon />,
          color: 'green',
        };
      case ImportAttemptStatusType.Failed:
        return {
          text: 'Помилка',
          icon: <CloseIcon />,
          color: 'red',
        };

      case ImportAttemptStatusType.NotStarted:
        return {
          text: 'Імпорт не почався',
          icon: <PendingIcon />,
          color: 'blue',
        };
      case ImportAttemptStatusType.InProgress:
        return {
          text: 'Імпорт у процесі',
          icon: (
            <RotatingLines
              strokeColor="grey"
              strokeWidth="5"
              animationDuration="0.75"
              width="26"
              visible={true}
            />
          ),
        };
      case ImportAttemptStatusType.Staled:
        return {
          text: 'staled',
          icon: <QuizIcon />,
          color: 'yellow',
        };
      default:
        return {
          text: '',
          icon: <QuizIcon />,
          color: 'yellow',
        };
    }
  }

  if (
    removeSuccessfulImportTokenList &&
    removeSuccessfulImportTokenList.length < 1
  ) {
    return null;
  }

  const list = (anchor: Anchor) => (
    <Box
      sx={{
        positinon: 'relative',
        marginBottom: '50px',
        width: anchor === 'top' ? 'auto' : 250,
        owerflowY: 'scroll',
      }}
      role="presentation"
    >
      <List sx={{ backgroundColor: 'rgba(25, 118, 210, 0.08)' }}>
        <ListItem
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            paddingX: '10%',
          }}
        >
          <ListItemText
            sx={{
              maxWidth: '25%',
              display: 'flex',
              justifyContent: 'flex-start',
            }}
            primary="Імʼя токену"
          />
          <ListItemText
            sx={{
              maxWidth: '25%',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            Статус
          </ListItemText>
          <ListItemText
            sx={{ maxWidth: '25%', display: 'flex', justifyContent: 'center' }}
          ></ListItemText>
          <ListItemText
            sx={{
              maxWidth: '25%',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            {' '}
            <Button onClick={toggleDrawer(anchor, false)}>
              <CloseIcon />
            </Button>
          </ListItemText>
        </ListItem>
      </List>
      <Divider />

      {removeSuccessfulImportTokenList?.map((token, index) => {
        const lastImportAttemptStatus = token.importAttempts.sort(
          (a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt),
        )[0].status;

        return (
          <Accordion
            key={index}
            expanded={openAccordionIndex === index}
            sx={{
              '&:hover': {
                cursor: 'default',
              },
              width: '100%',
            }}
          >
            <AccordionSummary
              sx={{
                '&:hover': {
                  cursor: 'default',
                },
                backgroundColor: '#EAECEE',
              }}
            >
              <ListItem
                sx={{
                  paddingX: '9%',
                  '&:hover': {
                    cursor: 'default',
                  },
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <ListItemText
                  sx={{
                    width: '25%',
                    display: 'flex',
                    justifyContent: 'flex-start',
                  }}
                  primary={token.monobankUserName}
                />
                <ListItemText
                  sx={{
                    display: 'flex',
                    width: '25%',
                    color: tokenImportStatus(lastImportAttemptStatus).color,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    {tokenImportStatus(lastImportAttemptStatus).icon}
                    <Typography sx={{ marginLeft: '4px' }}>
                      {tokenImportStatus(lastImportAttemptStatus).text}
                    </Typography>
                  </Box>
                </ListItemText>
                <ListItemText
                  sx={{
                    width: '25%',
                    display: 'flex',
                    justifyContent: 'right',
                  }}
                >
                  {lastImportAttemptStatus ===
                  ImportAttemptStatusType.Failed ? (
                    <Button
                      onClick={() => {
                        handleRetryImportAttempt(token.token);
                      }}
                      sx={{
                        ...(isXs && {
                          height: '30px',
                          minWidth: '40px',
                          padding: '7px',
                        }),
                      }}
                    >
                      {isXs ? <RefreshIcon /> : 'Повторити спробу'}
                    </Button>
                  ) : null}
                </ListItemText>
                <ListItemText
                  sx={{
                    width: '25%',
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <Button
                    onClick={(event) => {
                      event.stopPropagation();
                      setOpenAccordionIndex(
                        openAccordionIndex === index ? -1 : index,
                      );
                    }}
                    sx={{
                      maxWidth: '150px',
                       ...(isMd && {
                        maxWidth: '50px',
                        fontSize: '7px',
                      }),
                    }}
                  >
                    {openAccordionIndex === index ? hideButton : unfoldButton}
                  </Button>
                </ListItemText>
              </ListItem>
            </AccordionSummary>
            <AccordionDetails>
              <ListItem
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padingLeft: '20px',
                }}
              >
                <ListItemText
                  sx={{
                    width: '25%',
                    float: 'left',
                    ...(isMd && {
                      display: 'none',
                    }),
                  }}
                  primary={'Дата створення'}
                />
                <ListItemText
                  sx={{
                    width: '25%',
                    float: 'left',
                  }}
                  primary={'Дата оновлення'}
                />
                <ListItemText
                  sx={{
                    width: '25%',
                    float: 'left',
                  }}
                >
                  Статус
                </ListItemText>
                <ListItemText
                  sx={{
                    width: '10%',
                    float: 'left',
                  }}
                ></ListItemText>
              </ListItem>
              {token?.importAttempts?.map((importAttempt, i) => (
                <ListItem
                  key={i}
                  sx={{
                    width: '100%',
                    display: 'flex',
                    borderColor: 'primary.main',
                    border: 1,
                    borderRadius: '16px',
                    marginBottom: '10px',
                    backgroundColor: '#AED6F1',

                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <ListItemText
                    sx={{
                      width: '25%',
                      float: 'left',
                      ...(isMd && {
                        display: 'none',
                      }),
                    }}
                    primary={format(
                      new Date(importAttempt.createdAt),
                      'dd.MM.yyyy HH:mm',
                    )}
                  />
                  <ListItemText
                    sx={{
                      width: '25%',
                      float: 'left',
                    }}
                    primary={format(
                      new Date(importAttempt.updatedAt),
                      'dd.MM.yyyy HH:mm',
                    )}
                  />
                  <ListItemText
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      width: '25%',
                      gap: '5px',
                      color: tokenImportStatus(importAttempt.status).color,
                      float: 'left',
                      fontSize: '6px',
                      flexWrap: 'nowrap',
                    }}
                  >
                    <Box
                      sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      {tokenImportStatus(importAttempt.status).icon}
                      <Typography sx={{ marginLeft: '4px' }}>
                        {tokenImportStatus(importAttempt.status).text}
                      </Typography>
                    </Box>
                  </ListItemText>
                  <ListItemText
                    sx={{
                      width: '10%',
                      float: 'left',
                    }}
                  >
                    <Button
                      sx={{
                        paddingX: 1,
                        ...(isMd && {
                          fontSize: '7px',
                          height: '30px',
                          minWidth: '40px',
                          padding: '7px',
                        }),
                      }}
                      onClick={() =>
                        setOpenLogModal({
                          open: true,
                          tokenId: token.id,
                          importAttempt: importAttempt.id,
                        })
                      }
                    >
                      {isXs ? <MoreHorizIcon /> : 'Подивитись логі'}
                    </Button>
                  </ListItemText>
                </ListItem>
              ))}
            </AccordionDetails>
          </Accordion>
        );
      })}
      {openLogModal.open ? (
        <LogImportAttemptsModal
          openLogModal={openLogModal}
          setOpenLogModal={setOpenLogModal}
        />
      ) : null}
    </Box>
  );

  return (
    <div>
      {(['top'] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          <Button
            sx={{
              ...(isMd && {
                fontSize: '6px',
                paddingX: '4px',
                paddingY: '3px',
              }),
            }}
            onClick={toggleDrawer(anchor, true)}
          >
            Спроба імпорту
          </Button>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
};

export default ImportAttempts;
