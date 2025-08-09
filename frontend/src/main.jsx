import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { createAppTheme, getStoredMode } from './theme.js';

function Root() {
  const [mode, setMode] = React.useState(getStoredMode());
  const theme = React.useMemo(() => createAppTheme(mode), [mode]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3} autoHideDuration={2500}>
        <AuthProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <BrowserRouter>
              <App mode={mode} setMode={setMode} />
            </BrowserRouter>
          </LocalizationProvider>
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);