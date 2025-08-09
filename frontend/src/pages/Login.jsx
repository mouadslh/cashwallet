import { useState } from 'react';
import { Container, Paper, Typography, TextField, Button, Stack, Link as MuiLink } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useSnackbar } from 'notistack';

export default function Login() {
  const { login } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try { await login(email, password); enqueueSnackbar('Welcome back!', { variant: 'success' }); navigate('/dashboard'); }
    catch { enqueueSnackbar('Invalid credentials', { variant: 'error' }); }
    finally { setLoading(false); }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Login</Typography>
        <form onSubmit={onSubmit}>
          <Stack spacing={2}>
            <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth />
            <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required fullWidth />
            <Button type="submit" variant="contained" disabled={loading}>Login</Button>
            <Typography variant="body2">No account? <MuiLink component={Link} to="/signup">Sign up</MuiLink></Typography>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}