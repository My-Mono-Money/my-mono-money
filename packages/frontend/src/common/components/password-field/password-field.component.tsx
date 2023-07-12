import { VisibilityOff, Visibility } from '@mui/icons-material';
import {
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps,
  Theme,
  useMediaQuery,
} from '@mui/material';
import React, { useState } from 'react';

interface IShowPassword {
  isShowingPassword: boolean;
}

const PasswordField: React.FC<TextFieldProps> = React.forwardRef(
  (props, ref) => {
    const [showPassword, setShowPassword] = useState<IShowPassword>({
      isShowingPassword: false,
    });
    const isXs = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    const handleClickShowPassword = () => {
      setShowPassword({
        isShowingPassword: !showPassword.isShowingPassword,
      });
    };

    const handleMouseDownPassword = (
      event: React.MouseEvent<HTMLButtonElement>,
    ) => {
      event.preventDefault();
    };

    return (
      <TextField
        ref={ref}
        {...props}
        type={showPassword.isShowingPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword.isShowingPassword ? (
                  <VisibilityOff />
                ) : (
                  <Visibility />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
        margin={isXs ? 'dense' : 'normal'}
      />
    );
  },
);

PasswordField.displayName = 'PasswordField';

export default PasswordField;
