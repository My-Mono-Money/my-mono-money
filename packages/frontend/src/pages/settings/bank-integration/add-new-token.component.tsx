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
import InstructionAddToken from 'common/components/instructions/instruction-add-token.component';
import { notify } from 'utils/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdatingIndicator } from 'common/components/updating-indicator/updating-indicator.component';
import { axiosPrivate } from 'api/axios';
import { AxiosError } from 'axios';

interface IFormData {
  tokenMonobank: string;
}

interface IErrorResponse {
  message: string;
}

const AddNewToken: React.FC = () => {
  const [openInstruction, setOpenInstruction] = useState(false);
  const [submittingError, setSubmittingError] = useState<string>();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IFormData>({
    resolver: yupResolver(AddNewTokenalidationSchema),
    mode: 'onBlur',
  });

  const { mutate: mutateAddNewToken, isLoading } = useMutation({
    mutationFn: ({ tokenMonobank }: IFormData) =>
      axiosPrivate.post('/tokens', {
        token: tokenMonobank,
      }),

    onError: (error) => {
      const axiosError = error as unknown as AxiosError<IErrorResponse>;
      if (axiosError.response?.data.message === 'duplicated-entity-error') {
        setSubmittingError('Токен вже доданий');
      } else {
        setSubmittingError('Закрито до додавання або неправильний токен');
      }
      setTimeout(() => setSubmittingError(''), 10000);
    },
    onSuccess: () => {
      notify('Котики зберегли ваш токен', '🐈', 0);
      queryClient.invalidateQueries(['token-list']);
      reset();
    },
  });

  const onSubmit = ({ tokenMonobank }: IFormData) => {
    mutateAddNewToken({ tokenMonobank });
  };
  return (
    <>
      {isLoading && <UpdatingIndicator />}
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
