import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

interface IAlertRemove {
  openAlertRemove: string;
  setOpenAlertRemove: (alertRemoveId: string) => void;
}
const AlertDialog: React.FC<IAlertRemove> = ({
  openAlertRemove,
  setOpenAlertRemove,
}) => {
  const handleClose = () => {
    setOpenAlertRemove('');
  };
  const handleConfirm = () => {
    setOpenAlertRemove('');
  };
  return (
    <>
      <Dialog
        open={Boolean(openAlertRemove)}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Ви впевнені, що хочете видалити спільний перегляд?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>Ні</Button>
          <Button onClick={handleConfirm} autoFocus>
            Так
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default AlertDialog;
