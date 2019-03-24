import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { createMuiTheme } from '@material-ui/core/styles';
import indigo from '@material-ui/core/colors/indigo';

import App from './App';

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');

const theme = createMuiTheme({
    palette: {
        primary: indigo,
        secondary: {
            main: '#00bcd4',
        },
    },
    typography: {
        useNextVariants: true
    }
});

var axios = require('axios');
var axiosInstance = axios.create({
  baseURL: 'https://some-domain.com/api/'
});

ReactDOM.render( <App basename={baseUrl} />, rootElement);