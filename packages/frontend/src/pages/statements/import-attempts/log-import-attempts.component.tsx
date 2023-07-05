import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { GridCloseIcon } from '@mui/x-data-grid';

interface IImportAttemptLog {
  open: boolean;
  token: string;
  importAttempt: string;
}
interface IImportAttemptLogProps {
  openLogModal: IImportAttemptLog;
  setOpenLogModal: (openLogModal: IImportAttemptLog) => void;
}

const LogImportAttemptsModal: React.FC<IImportAttemptLogProps> = ({
  openLogModal,
  setOpenLogModal,
}) => {
  return (
    <>
      <Dialog
        open={openLogModal.open}
        onClose={() =>
          setOpenLogModal({
            importAttempt: '',
            token: '',
            open: false,
          })
        }
        fullWidth
        PaperProps={{
          style: { position: 'fixed', maxWidth: '700px', padding: '50px' },
        }}
      >
        <DialogTitle variant="h4">Modal</DialogTitle>
        <DialogContent>
          token id opened: {openLogModal.token},<br /> importAttempt opened:{' '}
          {openLogModal.importAttempt}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setOpenLogModal({
                importAttempt: '',
                token: '',
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
