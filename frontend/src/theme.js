import { createTheme } from '@mui/material/styles';

export function getStoredMode() { return localStorage.getItem('colorMode') || 'light'; }
export function setStoredMode(mode) { localStorage.setItem('colorMode', mode); }
export function createAppTheme(mode) {
  return createTheme({
    palette: { mode, primary: { main: mode === 'light' ? '#1976d2' : '#90caf9' } },
    shape: { borderRadius: 10 },
  });
}