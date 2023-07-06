import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { GridCloseIcon } from '@mui/x-data-grid';
import { axiosPrivate } from 'api/axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  IImportAttemptLog,
  ImportAttemptStatusType,
} from 'types/token-item.interface';
import { RotatingLines } from 'react-loader-spinner';

interface IImportAttemptData {
  open: boolean;
  tokenId: string;
  importAttempt: string;
}
interface IImportAttemptLogProps {
  openLogModal: IImportAttemptData;
  setOpenLogModal: (openLogModal: IImportAttemptData) => void;
}

const fetchImportAttempt = async (tokenId: string, importAttemptId: string) => {
  const response = await axiosPrivate.get<IImportAttemptLog>(
    `/tokens/${tokenId}/import-attempts/${importAttemptId}`,
  );

  return response.data;
};

const RotateLines = () => (
  <RotatingLines
    strokeColor="grey"
    strokeWidth="5"
    animationDuration="0.75"
    width="10"
    visible={true}
  />
);
interface LogViewerProps {
  logString: string;
}

const LogViewer: React.FC<LogViewerProps> = ({ logString }) => {
  const logs = logString
    .split('\n')
    .filter((log) => log.trim() !== '')
    .map((log) => {
      let renamedLog = log;

      renamedLog = renamedLog.replace(
        /statement import is queued/g,
        'імпорт поставлено в чергу',
      );
      renamedLog = renamedLog.replace(
        /start of statement import execution/g,
        'початок виконання імпорту',
      );
      renamedLog = renamedLog.replace(
        /The month has been imported/g,
        'Місяць імпортовано',
      );
      renamedLog = renamedLog.replace(
        /fetched transaction count/g,
        'отримана кількість транзакцій',
      );
      renamedLog = renamedLog.replace(
        /successfully import card/g,
        'картка успішно імпортована',
      );
      renamedLog = renamedLog.replace(
        /successfully finished fetch all cards/g,
        'успішно завершено отримання всіх карт',
      );
      renamedLog = renamedLog.replace(/failed/g, 'помилка');

      return renamedLog;
    });

  const logsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logsRef.current) {
      logsRef.current.scrollTop = logsRef.current.scrollHeight;
    }
  }, [logString]);
  return (
    <div
      ref={logsRef}
      style={{
        overflowY: 'scroll',
        maxHeight: '400px',
        backgroundColor: 'rgba(25, 118, 210, 0.08)',
      }}
    >
      {logs.map((log, index) => (
        <Typography
          key={index}
          component="div"
          variant="body1"
          sx={{ paddingX: '5px', paddingY: '1px', fontSize: '12px' }}
          gutterBottom
        >
          {log}
        </Typography>
      ))}
    </div>
  );
};

const LogImportAttemptsModal: React.FC<IImportAttemptLogProps> = ({
  openLogModal,
  setOpenLogModal,
}) => {
  const { data: importAttemptLog } = useQuery(['import-attempt'], () =>
    fetchImportAttempt(openLogModal.tokenId, openLogModal.importAttempt),
  );
  const queryClient = useQueryClient();
  const [intervalStart, setIntervalStart] = useState<NodeJS.Timer | null>(null);
  useEffect(() => {
    return () => {
      clearInterval(intervalStart as NodeJS.Timer);
    };
  }, []);

  useEffect(() => {
    if (
      importAttemptLog?.status === ImportAttemptStatusType.InProgress &&
      !intervalStart
    ) {
      const intervalId = setInterval(() => {
        queryClient.invalidateQueries(['import-attempt']);
      }, 5000);
      setIntervalStart(intervalId);
    } else {
      clearInterval(intervalStart as NodeJS.Timer);
      setIntervalStart(null);
    }
  }, [importAttemptLog?.status]);

  return (
    <>
      <Dialog
        open={openLogModal.open}
        onClose={() =>
          setOpenLogModal({
            importAttempt: '',
            tokenId: '',
            open: false,
          })
        }
        fullWidth
        PaperProps={{
          style: { position: 'fixed', maxWidth: '700px', padding: '20px' },
        }}
      >
        <DialogTitle variant="h6">Логі імпорту транзакцій: </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography sx={{ fontSize: '8px' }}>
              *Транзакції імпортуються декілька місяців в одну хвилину. По всім
              карткам йде імпорт по всім місяцям з моменту відкриття рахунку{' '}
              <br />
              *Після успішного імпорту, ви не зможете більше переглянути логі
            </Typography>

            <LogViewer logString={importAttemptLog?.log ?? ''} />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                fontSize: '8px',
              }}
            >
              <Typography>
                Імпортовано місяців: {importAttemptLog?.fetchedMonths}{' '}
              </Typography>
              {importAttemptLog?.status ===
              ImportAttemptStatusType.InProgress ? (
                <RotateLines />
              ) : null}
              <Typography sx={{ marginLeft: '10px' }}>
                Всі місяці по всім карткам: {importAttemptLog?.totalMonths}{' '}
              </Typography>
              {importAttemptLog?.status ===
                ImportAttemptStatusType.InProgress &&
              importAttemptLog?.totalMonths === 0 ? (
                <RotateLines />
              ) : null}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setOpenLogModal({
                importAttempt: '',
                tokenId: '',
                open: false,
              })
            }
          >
            <GridCloseIcon />
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LogImportAttemptsModal;
