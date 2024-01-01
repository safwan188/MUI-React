import React, { useEffect, useState } from 'react';
import { Box, Tooltip, Typography, Button ,Fab} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';

import BasicDataTable from '../../components/dataTables/BasicDataTable';
import DeleteConfirmationDialog from '../../components/common/DeleteConfirmationDialog';
import EditDialog from '../../components/common/EditDialog';
import Sidebar from '../../components/layout/Sidebar';
import CustomerService from '../../api/CustomerService';
import CustomerEditForm from '../../components/forms/CustomerEditForm';
import DataToolbar from '../../components/common/DataToolbar';
import SnackBarComponent from '../../components/common/SnackBarComponent';
import theme from '../../theme';

const CustomerTablePage = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const btn_txt = "לקוח חדש";
  const title = "לקוחות";
  // Define menu items for DataToolbar
  const menuItems = [
    { label: 'תז\\ח.פ', value: 'tz' },
    { label: 'שם לקוח', value: 'name' },
    { label: 'טלפון', value: 'phone' },
    { label: 'נכסים', value: 'properties' }, // Handling nested object
  ];

  useEffect(() => {
    CustomerService.getAllCustomers()
      .then(response => setCustomers(response.data.customers))
      .catch(error => console.error('Error fetching customers:', error));
  }, []);

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const onAddNewClick = () => navigate('/add-customer');

  const handleEdit = (customer) => {
    setCustomerToEdit(customer);
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setCustomerToEdit(null);
  };

  const handleCustomerUpdate = (updatedCustomer) => {
    CustomerService.updateCustomer(updatedCustomer.id, updatedCustomer)
      .then(() => {
        setEditModalOpen(false);
        setSnackbarMessage('לקוח עודכן בהצלחה');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        fetchCustomers(); // Refresh the customers list after updating
      })
      .catch(error => {
        console.error('Error updating customer:', error);
        setSnackbarMessage('שגיאה בעדכון לקוח');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      });
  };

  const renderActionButtons = (customer) => (
   
      <>
        <Tooltip title="Edit">
          <Fab size="small" color="primary" aria-label="edit" onClick={() => handleEdit(customer)}>
            <EditIcon />
          </Fab>
        </Tooltip>
     </>
  );

  const RenderCell = (label, content) => label === 'נכסים' && Array.isArray(content) ? (
    <Tooltip title={<List content={content} />}>
      <Button>{`${content.length} נכסים`}</Button>
    </Tooltip>
  ) : <Typography>{content}</Typography>;

  const List = ({ content }) => (
    <div>
      {content.map((property, index) => (
        <Typography key={index}>{`${property.cityName}, ${property.street}, ${property.propertyNumber}`}</Typography>
      ))}
    </div>
  );
  const fetchCustomers = () => {
    CustomerService.getAllCustomers()
      .then(response => {
        setCustomers(response.data.customers);
      })
      .catch(error => {
        console.error('Error fetching customers:', error);
      });
  };

  const onSearchChange = (query) => {
    setSearchQuery(query);
  };

  // Handle column change
  const onColumnChange = (column) => {
    setSelectedColumn(column);
  };
  const filteredCustomers = customers.filter(customer => {
    if (!searchQuery) return true;
    console.log(searchQuery);

    const query = searchQuery.textQuery.toLowerCase();
    const cellValue = customer[selectedColumn]?.toString().toLowerCase() || '';
    return selectedColumn === 'properties' ? customer.properties.some(prop => 
      `${prop.cityName} ${prop.street} ${prop.propertyNumber}`.toLowerCase().includes(query)
    ) : cellValue.includes(query);
  });

  return (
    <Box sx={{ display: 'flex', bgcolor: theme.palette.background.default }}>
      <Sidebar />
      <Box component="main" sx={{
    flexGrow: 1,
    height: '100%',
    p: 3,
    bgcolor: 'background.paper', // Consider a lighter shade that contrasts well with the content
    boxShadow: '0px 3px 6px rgba(0,0,0,0.1)', // A subtle shadow for depth
    borderRadius: '4px', // Optional rounded corners
    border: '1px solid rgba(0,0,0,0.12)', // Optional light border
    '& > *': { // Apply consistent spacing between child elements
      marginBottom: 2,
    },
    // Further style adjustments can be made here
  }}>
        <DataToolbar {...{ menuItems, onAddNewClick, onSearchChange, onColumnChange, selectedColumn, searchQuery , title,btn_txt}} />
        <BasicDataTable {...{ data: filteredCustomers, columns: menuItems, renderCell: RenderCell, renderActionButtons }} />
        <EditDialog {...{ open: editModalOpen, onClose: handleEditModalClose, title: "ערוך לקוח", FormComponent: CustomerEditForm, formProps: { customer: customerToEdit }, formId: "customer-edit-form", onSubmit: handleCustomerUpdate }} />
        <SnackBarComponent {...{ open: snackbarOpen, handleClose: handleSnackbarClose, message: snackbarMessage, severity: snackbarSeverity }} />
        
      </Box>
    </Box>
  );
};

export default CustomerTablePage;
