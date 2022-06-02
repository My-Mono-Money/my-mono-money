import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import React from 'react';

const SignIn: React.FC = () => {
  return (
    <Typography>
      <Link to="/sign-up">До сторінки реєстрації</Link>
    </Typography>
  );
};

export default SignIn;
