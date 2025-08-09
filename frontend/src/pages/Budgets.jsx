import { useEffect, useState } from 'react';
import { Paper, Stack, TextField, MenuItem, Button, LinearProgress, Typography, Grid } from '@mui/material';
import api from '../api/client';
import { CATEGORIES } from '../constants';
import { useSnackbar } from 'notistack';

export default function Budgets() {
  const { enqueueSnackbar } = useSnackbar();
  const [budgets, setBudgets] = useState([]);
  const [category, setCategory] = useState('Food');
  const [monthlyLimit, setMonthlyLimit] = useState('');

  async function load() { const { data } = await api.get('/budgets'); setBudgets(data); }
  useEffect(() => { load(); }, []);

  const onSave = async (e) => {
    e.preventDefault();
    try { await api.post('/budgets', { category, monthlyLimit: Number(monthlyLimit) }); enqueueSnackbar('Budget saved', { variant: 'success' }); setMonthlyLimit(''); load(); }
    catch { enqueueSnackbar('Failed to save', { variant: 'error' }); }
  };

  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 2 }}>
        <form onSubmit={onSave}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField select label="Category" value={category} onChange={(e) => setCategory(e.target.value)} size="small" sx={{ minWidth: 160 }}>
              {CATEGORIES.filter((c) => c !== 'Salary').map((c) => (<MenuItem key={c} value={c}>{c}</MenuItem>))}
            </TextField>
            <TextField label="Monthly limit" type="number" value={monthlyLimit} onChange={(e) => setMonthlyLimit(e.target.value)} size="small" sx={{ width: 200 }} required />
            <Button type="submit" variant="contained">Save</Button>
          </Stack>
        </form>
      </Paper>
      <Grid container spacing={2}>
        {budgets.map((b) => (
          <Grid item xs={12} md={6} key={b._id || b.category}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1">{b.category}</Typography>
              <Typography variant="body2" color="text.secondary">${b.spent?.toFixed(2)} / ${b.monthlyLimit?.toFixed(2)}</Typography>
              <LinearProgress variant="determinate" value={b.percent || 0} color={b.percent >= 100 ? 'error' : b.percent >= 80 ? 'warning' : 'primary'} sx={{ height: 10, borderRadius: 5, mt: 1 }} />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}