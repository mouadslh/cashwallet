import { useState } from 'react';
import { Container, Paper, Typography, TextField, Button, Stack, Link as MuiLink } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useSnackbar } from 'notistack';

export default function Signup() {
  const { signup } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try { await signup(email, password, name); enqueueSnackbar('Account created!', { variant: 'success' }); navigate('/dashboard'); }
    catch { enqueueSnackbar('Could not sign up', { variant: 'error' }); }
    finally { setLoading(false); }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Sign up</Typography>
        <form onSubmit={onSubmit}>
          <Stack spacing={2}>
            <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
            <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth />
            <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required fullWidth />
            <Button type="submit" variant="contained" disabled={loading}>Create account</Button>
            <Typography variant="body2">Have an account? <MuiLink component={Link} to="/login">Login</MuiLink></Typography>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}