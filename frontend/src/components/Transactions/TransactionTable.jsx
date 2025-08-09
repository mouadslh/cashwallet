import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Chip } from '@mui/material';
import { format } from 'date-fns';

export default function TransactionTable({ rows, total, page, rowsPerPage, onChangePage }) {
  return (
    <Paper>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row._id} hover>
                <TableCell>{format(new Date(row.date), 'yyyy-MM-dd')}</TableCell>
                <TableCell><Chip label={row.type} color={row.type === 'income' ? 'success' : 'error'} size="small" /></TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell align="right">${row.amount.toFixed(2)}</TableCell>
                <TableCell>{row.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination component="div" count={total} page={page - 1} onPageChange={(e, newPage) => onChangePage(newPage + 1)} rowsPerPage={rowsPerPage} rowsPerPageOptions={[rowsPerPage]} />
    </Paper>
  );
}