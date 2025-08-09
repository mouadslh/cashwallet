import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format } from 'date-fns';

export default function BalanceLine({ data }) {
  const formatted = (data || []).map((p) => ({ ...p, dateLabel: format(new Date(p.date), 'MMM d') }));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={formatted} margin={{ left: 20, right: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="dateLabel" />
        <YAxis />
        <Tooltip formatter={(v) => `$${Number(v).toFixed(2)}`} />
        <Line type="monotone" dataKey="balance" stroke="#1976d2" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}