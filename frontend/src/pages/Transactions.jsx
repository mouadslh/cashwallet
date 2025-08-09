import { useEffect, useState } from 'react';
import { Paper, Stack } from '@mui/material';
import api from '../api/client';
import TransactionForm from '../components/Transactions/TransactionForm.jsx';
import TransactionFilters from '../components/Transactions/TransactionFilters.jsx';
import TransactionTable from '../components/Transactions/TransactionTable.jsx';
import { useSnackbar } from 'notistack';

export default function Transactions() {
  const { enqueueSnackbar } = useSnackbar();
  const [filters, setFilters] = useState({ sortBy: 'date', sortOrder: 'desc' });
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  async function load(pageToLoad = page) {
    setLoading(true);
    try {
      const params = { ...filters, page: pageToLoad, limit: 10 };
      const { data } = await api.get('/transactions', { params });
      setRows(data.docs); setTotal(data.total); setPage(data.page);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(1); }, [JSON.stringify(filters)]);

  const onAdd = async (payload, reset) => {
    try { await api.post('/transactions', payload); enqueueSnackbar('Transaction added', { variant: 'success' }); reset(); load(1); }
    catch { enqueueSnackbar('Failed to add', { variant: 'error' }); }
  };

  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 2 }}><TransactionForm onAdd={onAdd} loading={loading} /></Paper>
      <Paper sx={{ p: 2 }}><TransactionFilters filters={filters} onChange={setFilters} /></Paper>
      <TransactionTable rows={rows} total={total} page={page} rowsPerPage={10} onChangePage={(p) => load(p)} />
    </Stack>
  );
}