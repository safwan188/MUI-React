import React from 'react';
import PropTypes from 'prop-types';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,TablePagination
} from '@mui/material';

const BasicDataTable = ({ data, columns, renderCell, renderActionButtons,getStatusIcon }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const dataSlice = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, overflow: 'hidden' }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
        <TableRow sx={{ bgcolor: 'primary.main', '& th': { } }}>
            {columns.map((column) => (
              <TableCell key={column.value}sx={{ color: 'primary.contrastText', padding: '10px' ,fontSize:'1.3rem'}}>
                {column.label}
              </TableCell>
            ))}
            <TableCell sx={{ color: 'primary.contrastText', padding: '16px' }}>פעולות</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dataSlice.map((row) => (
            <TableRow key={row.id} sx={{ '&:nth-of-type(odd)': { bgcolor: 'action.hover' }, '&:hover': { bgcolor: 'action.selected' },  }}>
            {columns.map((column) => (
                <TableCell key={`${row.id}-${column.value}`} sx={{ padding: '16px',  fontSize:'1.2rem'}}>
                {column.value === 'status' ? getStatusIcon(row[column.value]) :
                    (renderCell ? renderCell(column.label, row[column.value], row) : row[column.value])}
                </TableCell>
              ))}
              <TableCell sx={{ padding: '1px',width:'10%' }}>
                {renderActionButtons && renderActionButtons(row)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
  rowsPerPageOptions={[5, 10, 25]}
  component="div"
  count={data.length}
  rowsPerPage={rowsPerPage}
  page={page}
  onPageChange={handleChangePage}
  onRowsPerPageChange={handleChangeRowsPerPage}
/>
    </TableContainer>
  );
};
BasicDataTable.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  })).isRequired,
  renderCell: PropTypes.func,
  renderActionButtons: PropTypes.func,
  getStatusIcon: PropTypes.func,
};

BasicDataTable.defaultProps = {
  renderCell: null,
  renderActionButtons: null,
  getStatusIcon: null,
};

export default BasicDataTable;