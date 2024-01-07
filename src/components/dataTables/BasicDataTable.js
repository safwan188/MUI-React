import React from 'react';
import PropTypes from 'prop-types';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, useMediaQuery, useTheme, styled, Button,Box
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DataToolbar from '../common/DataToolbar';
const primaryColor = '#253291'; // Example primary color
const borderColor = '#d0d0d0'; // Border color for inputs and toolbar
const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: primaryColor,
  color: 'white',
  '&:hover': {
    backgroundColor: '#1b237e',
  },
  [theme.breakpoints.down('sm')]: {
    marginTop: '10px', // Adds margin at the top on smaller screens
  }
}));

const BasicDataTable = ({ data, columns, renderCell, renderActionButtons, getStatusIcon, title ,onAddNewClick,  toolbarProps, }) => {
  const theme = useTheme();

  const isXSmall = useMediaQuery(theme.breakpoints.down('xs'));

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(isXSmall ? 3 : 5);
  const {
    toolbarTitle,
    menuItems,
    selectedColumn,
    includeDateRange,
    onSearchChange,
    onColumnChange,
  } = toolbarProps || {};


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const dataSlice = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, overflowX: 'auto' }}>
        
      <Table sx={{ minWidth: isXSmall ? 300 : 650 }} aria-label="simple table">
        <TableHead>
     

<TableRow>
  <TableCell colSpan={columns.length + 1} sx={{
    fontSize: '1.5rem',
    padding: '5px',
    bgcolor: 'white'
  }}>
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
       {toolbarProps && (
        <Box sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px', 
          width: '100%', // Changed to 100% for better control
          backgroundColor: 'WHITE', // Adjust as per theme
          color: 'white',
        }}>
          <DataToolbar
            title={toolbarTitle}
            menuItems={menuItems}
            selectedColumn={selectedColumn}
            includeDateRange={includeDateRange}
            onSearchChange={onSearchChange}
            onColumnChange={onColumnChange}
            // ... other props ...
          />
        </Box>
      )}
      
      <Box sx={{ flex:1, textAlign: 'center' }}>
        {title}
      </Box>
      <Box sx={{ flex:1, textAlign: 'end' }}>
      <StyledButton variant="contained" startIcon={<AddIcon />} onClick={onAddNewClick}>
          {/* Optional button label */}
        </StyledButton>
          </Box>
    </Box>
  </TableCell>
</TableRow>

          <TableRow sx={{ bgcolor: 'primary.main' }}>
            {columns.map((column) => (
              <TableCell key={column.value} sx={{ color: 'primary.contrastText', padding: isXSmall ? '8px' : '16px', fontSize: isXSmall ? '0.8rem' : '1rem' }}>
                {column.label}
              </TableCell>
            ))}
            <TableCell sx={{ color: 'primary.contrastText', padding: '16px' }}>פעולות</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dataSlice.map((row) => (
            <TableRow key={row.id} sx={{ '&:nth-of-type(odd)': { bgcolor: 'action.hover' }, '&:hover': { bgcolor: 'action.selected' } }}>
              {columns.map((column) => (
                <TableCell key={`${row.id}-${column.value}`} sx={{ padding: '16px', fontSize: '1.2rem' }}>
                  {column.value === 'status' ? getStatusIcon(row[column.value]) :
                    (renderCell ? renderCell(column.label, row[column.value], row) : row[column.value])}
                </TableCell>
              ))}
              <TableCell sx={{ padding: '1px', width: '10%' }}>
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
  title: PropTypes.string,
};

BasicDataTable.defaultProps = {
  renderCell: null,
  renderActionButtons: null,
  getStatusIcon: null,
  title: '',
};

export default BasicDataTable;
