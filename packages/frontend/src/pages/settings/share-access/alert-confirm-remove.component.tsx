import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { ISpaceMember } from 'types/space-members.interface';
import { AxiosError } from 'axios';
import { IErrorResponse } from 'types/error-response.interface';
import { useFetchSpaceMembersList } from 'api/useFetchSpaceMembersList';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosPrivate } from 'api/axios';

interface IAlertRemove {
  openAlertRemove: { rowId: string; table: string };
  setOpenAlertRemove: (memberId: { rowId: string; table: string }) => void;
  userEmail?: string;
}

interface IUserDeleteFromSpace {
  userOwnerEmail: string;
  memberEmail: string;
}

const AlertDialog = ({
  openAlertRemove,
  setOpenAlertRemove,
  userEmail,
}: IAlertRemove) => {
  const spaceMembers = useFetchSpaceMembersList();
  const queryClient = useQueryClient();
  const spaceMember = spaceMembers?.data?.find(
    (member: ISpaceMember) => member.id === openAlertRemove.rowId,
  );
  const { mutate: mutateDeleteInvite } = useMutation({
    mutationFn: ({ userOwnerEmail, memberEmail }: IUserDeleteFromSpace) =>
      axiosPrivate.delete(`/spaces/${userOwnerEmail}/members/${memberEmail}`),

    onError: (err) => {
      const axiosError = err as unknown as AxiosError<IErrorResponse>;
      alert(axiosError.response?.data.message);
    },

    onSuccess: () => {
      queryClient.invalidateQueries(['space-members']);
      setOpenAlertRemove({ rowId: '', table: '' });
    },
  });
  const handleClose = () => {
    setOpenAlertRemove({ rowId: '', table: '' });
  };

  const handleConfirm = async () => {
    let userOwnerEmail;
    let memberEmail;
    if (openAlertRemove.table === 'userSpace') {
      userOwnerEmail = userEmail;
      memberEmail = spaceMember?.email;
    } else {
      userOwnerEmail = spaceMember?.owner.email;
      memberEmail = userEmail;
    }
    mutateDeleteInvite({ userOwnerEmail, memberEmail } as IUserDeleteFromSpace);
  };
  return (
    <>
      <Dialog
        open={Boolean(openAlertRemove.rowId === spaceMember?.id)}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {openAlertRemove.table === 'userSpace' ? (
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
