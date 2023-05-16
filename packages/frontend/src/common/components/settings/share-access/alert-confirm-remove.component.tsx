import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { ISpaceMember } from '../../../../types/space-members.interface';
import axios, { AxiosError } from 'axios';
import { IErrorResponse } from '../../../../types/error-response.interface';

interface IAlertRemove {
  openAlertRemove: string;
  table: string;
  setOpenAlertRemove: (memberId: string) => void;
  fetchSpaceMembers: () => void;
  spaceMembers: ISpaceMember[];
  userEmail?: string;
  token?: string;
}

const AlertDialog = ({
  openAlertRemove,
  setOpenAlertRemove,
  fetchSpaceMembers,
  table,
  spaceMembers,
  userEmail,
  token,
}: IAlertRemove) => {
  const spaceMember = spaceMembers?.find(
    (member: ISpaceMember) => member.id === openAlertRemove,
  );
  const handleClose = () => {
    setOpenAlertRemove('');
  };
  const handleConfirm = async () => {
    let userOwnerEmail;
    let memberEmail;
    if (table === 'userSpace') {
      userOwnerEmail = userEmail;
      memberEmail = spaceMember?.email;
    } else {
      userOwnerEmail = spaceMember?.owner.email;
      memberEmail = userEmail;
    }
    try {
      await axios.delete(`/spaces/${userOwnerEmail}/members/${memberEmail}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchSpaceMembers();
      setOpenAlertRemove('');
    } catch (err) {
      const axiosError = err as unknown as AxiosError<IErrorResponse>;
      alert(axiosError.response?.data.message);
    }
  };
  return (
    <>
      <Dialog
        open={Boolean(openAlertRemove === spaceMember?.id)}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {table === 'userSpace' ? (
          <DialogTitle id="alert-dialog-title">
            Ви впевнені, що хочете видалити спільний перегляд для{' '}
            {spaceMember?.email} зі свого простору ?
          </DialogTitle>
        ) : (
          <DialogTitle id="alert-dialog-title">
            Ви впевнені, що хочете видалити себе зі спільного доступу до
            користувача: {spaceMember?.owner.firstName}{' '}
            {spaceMember?.owner.lastName}, {spaceMember?.owner.email}?
          </DialogTitle>
        )}
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
