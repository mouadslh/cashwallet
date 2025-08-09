import { Stack, TextField, MenuItem, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { CATEGORIES } from '../../constants';

export default function TransactionFilters({ filters, onChange }) {
  const update = (patch) => onChange({ ...filters, ...patch });
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
      <ToggleButtonGroup value={filters.type || ''} exclusive onChange={(e, v) => update({ type: v || undefined })} size="small">
        <ToggleButton value="income">Income</ToggleButton>
        <ToggleButton value="expense">Expense</ToggleButton>
      </ToggleButtonGroup>
      <TextField select label="Category" value={filters.category || ''} onChange={(e) => update({ category: e.target.value || undefined })} size="small" sx={{ minWidth: 160 }}>
        <MenuItem value="">All</MenuItem>
        {CATEGORIES.map((c) => (<MenuItem key={c} value={c}>{c}</MenuItem>))}
      </TextField>
      <DatePicker label="Start" value={filters.start || null} onChange={(v) => update({ start: v || undefined })} slotProps={{ textField: { size: 'small' } }} />
      <DatePicker label="End" value={filters.end || null} onChange={(v) => update({ end: v || undefined })} slotProps={{ textField: { size: 'small' } }} />
      <TextField label="Min" type="number" value={filters.minAmount || ''} onChange={(e) => update({ minAmount: e.target.value || undefined })} size="small" sx={{ width: 120 }} />
      <TextField label="Max" type="number" value={filters.maxAmount || ''} onChange={(e) => update({ maxAmount: e.target.value || undefined })} size="small" sx={{ width: 120 }} />
      <TextField select label="Sort" value={filters.sortBy || 'date'} onChange={(e) => update({ sortBy: e.target.value })} size="small" sx={{ minWidth: 160 }}>
        <MenuItem value="date">Date</MenuItem>
        <MenuItem value="amount">Amount</MenuItem>
        <MenuItem value="category">Category</MenuItem>
        <MenuItem value="type">Type</MenuItem>
      </TextField>
      <TextField select label="Order" value={filters.sortOrder || 'desc'} onChange={(e) => update({ sortOrder: e.target.value })} size="small" sx={{ minWidth: 120 }}>
        <MenuItem value="desc">Desc</MenuItem>
        <MenuItem value="asc">Asc</MenuItem>
      </TextField>
    </Stack>
  );
}