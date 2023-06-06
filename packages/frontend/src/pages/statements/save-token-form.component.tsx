import React from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from '@mui/material';
import { useAuthState } from 'auth-state/use-auth-state.hook';
import { SaveTokenValidationSchema } from './save-token.validation-schema';
import { useGlobalState } from 'global-state/use-global-state.hook';
import InstructionAddToken from 'common/components/instructions/instruction-add-token.component';
import { useQueryClient } from '@tanstack/react-query';

interface IFormData {
  tokenMonobank: string;
}

interface ISaveTokenFormProps {
  setIsTokenSaved: (isTokenSaved: boolean) => void;
}

const SaveTokenForm: React.FC<ISaveTokenFormProps> = ({ setIsTokenSaved }) => {
  const { token } = useAuthState();
  const { setTogglePopupAddToken } = useGlobalState();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<IFormData>({
    resolver: yupResolver(SaveTokenValidationSchema),
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

      setTogglePopupAddToken(true);
      setIsTokenSaved(true);
      queryClient.invalidateQueries(['token-list']);
      queryClient.invalidateQueries(['spaces']);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Box>
        <Card
          sx={{
            height: '700px',
            borderRadius: '16px',
            boxShadow: '3px 3px 3px 3px lightgray',
          }}
        >
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              pl: '200px',
              pt: '100px',
            }}
          >
            <Typography sx={{ pb: '20px' }} variant="h4">
              Додайте свій monobank токен
            </Typography>
            <InstructionAddToken />
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              sx={{
                p: '10px',
                display: 'flex',
                alignItems: 'center',
                mt: '30px',
              }}
            >
              <TextField
                disabled={isSubmitting}
                id="tokenMonobank"
                label="Токен monobank"
                variant="outlined"
                {...register('tokenMonobank')}
              />
              <Button
                sx={{ borderRadius: '4px', ml: '20px' }}
                size="medium"
                variant="outlined"
                disabled={isSubmitting}
                type="submit"
              >
                Зберегти
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default SaveTokenForm;
