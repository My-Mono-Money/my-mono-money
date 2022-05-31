import React from 'react';
import { AccessAlarm, ThreeDRotation } from '@mui/icons-material';
import logo from './logo.svg';
import './App.css';
import { Typography } from '@mui/material';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Typography>Hello MUI</Typography>
        <AccessAlarm />
        <ThreeDRotation />
        <p>Hello production (test actions! try 1)!</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
