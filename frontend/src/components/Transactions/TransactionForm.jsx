import { useState } from 'react';
import { Stack, TextField, Button, MenuItem, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { CATEGORIES } from '../../constants';

export default function TransactionForm({ onAdd, loading }) {
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Food');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [description, setDescription] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    const payload = { type, category, amount: Number(amount), date, description };
    onAdd(payload, () => { setAmount(''); setDescription(''); });
  };

  return (
    <form onSubmit={onSubmit}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
        <ToggleButtonGroup value={type} exclusive onChange={(e, v) => v && setType(v)} size="small">
          <ToggleButton value="income">Income</ToggleButton>
          <ToggleButton value="expense">Expense</ToggleButton>
        </ToggleButtonGroup>
        <TextField select label="Category" value={category} onChange={(e) => setCategory(e.target.value)} size="small" sx={{ minWidth: 160 }}>
          {CATEGORIES.map((c) => (<MenuItem key={c} value={c}>{c}</MenuItem>))}
        </TextField>
        <TextField label="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} size="small" sx={{ width: 160 }} required />
        <DatePicker label="Date" value={date} onChange={setDate} slotProps={{ textField: { size: 'small' } }} />
        <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} size="small" sx={{ flex: 1 }} />
        <Button type="submit" variant="contained" disabled={loading}>Add</Button>
      </Stack>
    </form>
  );
}