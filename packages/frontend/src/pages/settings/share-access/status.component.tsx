import React from 'react';
import PendingIcon from '@mui/icons-material/Pending';
import CheckIcon from '@mui/icons-material/Check';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import { Typography } from '@mui/material';

interface StatusProps {
  statusCode: string;
}
const status = [
  { name: 'Активний', icon: <CheckIcon fontSize="small" /> },
  {
    name: 'Очікування на підтвердження',
    icon: <PendingIcon fontSize="small" />,
  },
  { name: 'Відхилено', icon: <NotInterestedIcon fontSize="small" /> },
];

const Status: React.FC<StatusProps> = ({ statusCode }) => {
  let num = 0;
  let color = '';
  if (statusCode === 'accept') {
    num = 0;
    color = '#00ff00';
  } else if (statusCode === 'new') {
    num = 1;
    color = '#00FFFF';
  } else if (statusCode === 'reject') {
    num = 2;
    color = '#FF0000';
  } else {
    return null;
  }

  return (
    <Typography
      sx={{
        display: 'flex',
        gap: '5px',
        color: color,
        float: 'left',
        fontSize: '8px',
        ml: '10px',
        alignItems: 'center',
      }}
    >
      {status[num].name} {status[num].icon}
    </Typography>
  );
};

export default Status;
