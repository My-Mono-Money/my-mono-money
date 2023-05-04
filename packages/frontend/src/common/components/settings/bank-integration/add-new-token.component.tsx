import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AddNewTokenalidationSchema } from './add-new-token.validation-schema';
import { GridCloseIcon } from '@mui/x-data-grid';
import {
  Alert,
  AlertTitle,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import InstructionAddToken from '../../instructions/instruction-add-token.component';
import axios, { AxiosError } from 'axios';
import { notify } from '../../../../utils/notifications';
import { useAuthState } from '../../../../auth-state/use-auth-state.hook';

interface IFormData {
  tokenMonobank: string;
}

interface IErrorResponse {
  message: string;
}

const AddNewToken: React.FC = () => {
  const { token } = useAuthState();
  const [openInstruction, setOpenInstruction] = useState(false);
  const [submittingError, setSubmittingError] = useState<string>();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IFormData>({
    resolver: yupResolver(AddNewTokenalidationSchema),
    mode: 'onBlur',
  });

  const onSubmit = async ({ tokenMonobank }: IFormData) => {
    try {
      await axios.post(
        '/tokens',
        {
          token: tokenMonobank,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      notify('Котики зберегли ваш токен', '🐈', 0);
      reset();
    } catch (err) {
      const axiosError = err as unknown as AxiosError<IErrorResponse>;
      if (axiosError.response?.data.message === 'duplicated-entity-error') {
        setSubmittingError('Токен вже доданий');
      } else {
        setSubmittingError('Закрито до додавання або неправильний токен');
      }
      setTimeout(() => setSubmittingError(''), 10000);
    }
  };
  return (
    <>
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: 'flex',
          p: '10px',
          gap: '10px',
          mx: 'auto',
          width: '90%',
          height: '100%',
        }}
      >
        <TextField
          id="tokenMonobank"
          disabled={isSubmitting}
          label="Додати новий токен"
          margin="normal"
          type="text"
          {...register('tokenMonobank')}
          error={errors.tokenMonobank ? true : false}
          helperText={errors.tokenMonobank?.message}
          sx={{
            width: '100%',
            maxWidth: '230px',
          }}
        />
        <Button
          disabled={false}
          size="large"
          type="submit"
          sx={{ height: '40px', mt: '15px' }}
        >
          Додати
        </Button>{' '}
        <Button
          disabled={false}
          size="large"
          onClick={() => setOpenInstruction(!openInstruction)}
          sx={{ height: '40px', mt: '15px' }}
        >
          Інструкція
        </Button>
        {submittingError && (
          <Alert severity="warning">
            <AlertTitle sx={{ width: '200px' }}>Сталася помилка</AlertTitle>
            <Typography sx={{ width: '200px' }}>{submittingError}</Typography>
          </Alert>
        )}
      </Box>
      {openInstruction ? (
        <Dialog
          open={openInstruction}
          onClose={() => setOpenInstruction(false)}
          fullWidth
          PaperProps={{
            style: { position: 'fixed', maxWidth: '700px', padding: '50px' },
          }}
        >
          <DialogTitle variant="h4">Як додати токен monobank</DialogTitle>
          <DialogContent>
            <InstructionAddToken />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenInstruction(!openInstruction)}>
              <GridCloseIcon />
            </Button>
          </DialogActions>
        </Dialog>
      ) : null}
    </>
  );
};

export default AddNewToken;
