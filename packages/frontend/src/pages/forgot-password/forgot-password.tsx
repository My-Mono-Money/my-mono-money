import React from 'react';
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
  return (
    <Typography>
      <Link to="/sign-up">До сторінки реєстрації</Link>
    </Typography>
  );
};

export default ForgotPassword;
