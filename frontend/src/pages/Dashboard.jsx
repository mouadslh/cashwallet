import { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Stack } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import api from '../api/client';
import ExpensesPie from '../components/Charts/ExpensesPie.jsx';
import BalanceLine from '../components/Charts/BalanceLine.jsx';
import MonthlyBar from '../components/Charts/MonthlyBar.jsx';

export default function Dashboard() {
  const [overview, setOverview] = useState({ totalIncome: 0, totalExpense: 0, balance: 0, expensesByCategory: [] });
  const [line, setLine] = useState({ startingBalance: 0, points: [] });
  const [monthly, setMonthly] = useState([]);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);

  useEffect(() => {
    async function load() {
      const params = {}; if (start) params.start = start; if (end) params.end = end;
      const [ovRes, lnRes, moRes] = await Promise.all([
        api.get('/stats/overview', { params }),
        api.get('/stats/line-balance', { params }),
        api.get('/stats/monthly'),
      ]);
      setOverview(ovRes.data); setLine(lnRes.data); setMonthly(moRes.data);
    }
    load();
  }, [start, end]);

  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}><KPI title="Total Balance" value={overview.balance} color="#1976d2" /></Grid>
          <Grid item xs={12} sm={6} md={3}><KPI title="Total Income" value={overview.totalIncome} color="#4caf50" /></Grid>
          <Grid item xs={12} sm={6} md={3}><KPI title="Total Expenses" value={overview.totalExpense} color="#ef5350" /></Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Stack direction="row" spacing={2} alignItems="center">
              <DatePicker label="Start" value={start} onChange={setStart} slotProps={{ textField: { size: 'small', fullWidth: true } }} />
              <DatePicker label="End" value={end} onChange={setEnd} slotProps={{ textField: { size: 'small', fullWidth: true } }} />
            </Stack>
          </Grid>
        </Grid>
      </Paper>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}><Paper sx={{ p: 2 }}><Typography variant="h6" gutterBottom>Expenses by Category</Typography><ExpensesPie data={overview.expensesByCategory} /></Paper></Grid>
        <Grid item xs={12} md={6}><Paper sx={{ p: 2 }}><Typography variant="h6" gutterBottom>Balance Over Time</Typography><BalanceLine data={line.points} /></Paper></Grid>
        <Grid item xs={12}><Paper sx={{ p: 2 }}><Typography variant="h6" gutterBottom>Monthly Income vs Expenses</Typography><MonthlyBar data={monthly} /></Paper></Grid>
      </Grid>
    </Stack>
  );
}

function KPI({ title, value, color }) {
  return (
    <Paper sx={{ p: 2, borderLeft: `5px solid ${color}` }}>
      <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
      <Typography variant="h5">${Number(value).toFixed(2)}</Typography>
    </Paper>
  );
}