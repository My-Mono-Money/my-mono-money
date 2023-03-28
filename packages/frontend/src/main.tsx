import React from 'react';
import moment from 'moment';
import 'moment/locale/uk';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import './index.css';
import App from './App';

moment.locale('uk');

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
  <App />,
  // </React.StrictMode>,
);
