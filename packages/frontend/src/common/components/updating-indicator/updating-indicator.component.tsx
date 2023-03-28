import React from 'react';
import ReactDOM from 'react-dom';
import { LinearProgress } from '@mui/material';

export const UpdatingIndicator: React.FC = () => {
  const portalRoot = document.querySelector('#under-header');

  return portalRoot
    ? ReactDOM.createPortal(<LinearProgress />, portalRoot)
    : null;
};
