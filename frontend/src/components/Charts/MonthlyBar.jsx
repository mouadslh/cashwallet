import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function MonthlyBar({ data }) {
  const chartData = (data || []).map((d) => ({ month: d.month, Income: d.income, Expenses: d.expense }));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ left: 20, right: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(v) => `$${Number(v).toFixed(2)}`} />
        <Legend />
        <Bar dataKey="Income" fill="#4caf50" />
        <Bar dataKey="Expenses" fill="#ef5350" />
      </BarChart>
    </ResponsiveContainer>
  );
}