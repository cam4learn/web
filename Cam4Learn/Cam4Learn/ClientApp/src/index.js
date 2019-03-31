import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { indigo, amber } from '@material-ui/core/colors';
import { BrowserRouter } from 'react-router-dom';

import App from './App';

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');

const theme = createMuiTheme({
    palette: {
        primary: indigo,
        secondary: amber
    },
    typography: {
        useNextVariants: true
    }
});

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <BrowserRouter basename={baseUrl}>
      <App basename={baseUrl} />
    </BrowserRouter>
  </MuiThemeProvider>, rootElement);