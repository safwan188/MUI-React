import React, { useState, useEffect } from 'react';
import BasicDataTable from '../../components/dataTables/BasicDataTable';
import { Box ,Snackbar, Toolti,Fab,Tooltip} from '@mui/material';
import Sidebar from '../../components/layout/Sidebar';
import theme from '../../theme';
import { ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import ExpertService from '../../api/ExpertService';
import EditDialog from '../../components/common/EditDialog';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import ReportService from '../../api/ReportService';
import DeleteConfirmationDialog from '../../components/common/DeleteConfirmationDialog';
import ExpertEditForm from '../../components/forms/ExpertEditForm';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DataToolbar from '../../components/common/DataToolbar';

const ExpertTablePage = () => {
  const navigate = useNavigate();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [expertToEdit, setExpertToEdit] = useState(null);
  const [experts, setExperts] = useState([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [expertToDelete, setExpertToDelete] = useState(null);
  const [error, setError] = useState(''); // State to store error message
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadExperts();
  }, []);

  const loadExperts = async () => {
    try {
      const data = await ExpertService.loadExperts();
      setExperts(data);
    } catch (error) {
      console.error('Error loading experts:', error);
      setError('Failed to load experts'); // Set the error message state
    }
  };
  const renderActionButtons = (row) => {
    return (
      <>
      <Box sx={{ display: 'flex', }}>
        <Tooltip title="עדכון">
          <Fab size="small"  sx={{bgcolor:'white'}} aria-label="edit" onClick={() => handleEdit(row)}>
            <EditIcon sx={{color:'darkblue'}} />
          </Fab>
        </Tooltip>
        <Box sx={{width:'10px'}}></Box>
      <Tooltip title="מחק">
      <Fab size="small" sx={{bgcolor:'white'}} aria-label="delete" onClick={() => handleDelete(row)} >
        <DeleteIcon  sx={{color:'red'}}/>
      </Fab>
      </Tooltip>
      </Box>
</>
    );
  };
  const handleExpertUpdate = async (updatedExpert) => {
    try {
      await ExpertService.updateExpertData(updatedExpert.id, updatedExpert);
      loadExperts();
      setEditModalOpen(false);
      
    } catch (error) {
      setError(error.response?.data.message || 'Error updating expert');
      setIsErrorDialogOpen(true);
    }
  };

  const filteredExperts = experts.filter(expert => {
    // Add filtering logic here
    // Example:
    if (!searchQuery) return true;
    console.log(selectedColumn);
    console.log(searchQuery);
    if (selectedColumn === 'name' && expert.name) {
      return expert.name.toLowerCase().includes(searchQuery.textQuery.toLowerCase());
    }
    if (selectedColumn === 'tz' && expert.tz) {
      return expert.tz.toLowerCase().includes(searchQuery.textQuery.toLowerCase());
    }
    if (selectedColumn === 'phone' && expert.phone) {
      return expert.phone.toLowerCase().includes(searchQuery.textQuery.toLowerCase());
    }
    
    // ... handle other columns
    return true;
  });
  // Define menu items for DataToolbar
  const menuItems = [
    { label: 'תז', value: 'tz' },
    { label: 'שם', value: 'name' },
    { label: 'טלפון נייד', value: 'phone' },
    // Add other menu items as needed
  ];

  // Handle search change
  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  // Handle column change
  const handleColumnChange = (column) => {
    setSelectedColumn(column);
  };

  const handleEdit = (expert) => {
    setExpertToEdit(expert);
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setExpertToEdit(null);
  };
  const handleDelete = (expert) => {
    setExpertToDelete(expert);
    setDeleteConfirmOpen(true);

  };

  const confirmDelete = async () => {
    if (expertToDelete) {
      try {
        await ExpertService.deleteExpertData(expertToDelete._id);
        loadExperts();
        setDeleteConfirmOpen(false);
        setExpertToDelete(null);
      } catch (error) {
        setError('Error deleting expert');
        setDeleteConfirmOpen(false);
      }
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setExpertToDelete(null);
  };
  const handleAddNew = () => {
    console.log('Navigating to add expert page');
    navigate('/add-expert');
  };
  const toolbarProps = {
    menuItems,
    selectedColumn,
    searchQuery,
    onSearchChange: handleSearchChange,
    onColumnChange: handleColumnChange,
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', bgcolor: theme.palette.background.default ,height:'100%'}}>
        <Sidebar />
        <Box component="main" sx={{
    flexGrow: 1,
    height: '100%',
    overflow: 'auto',
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
         
          <BasicDataTable
            toolbarProps={toolbarProps}
                      title={'קבלנים'}

            renderActionButtons={renderActionButtons}
            data={filteredExperts}
            columns={menuItems.map(item => ({ label: item.label, value: item.value }))} // Pass only the label and value properties
            onAddNewClick={handleAddNew}
            onEdit={handleEdit}
            onDelete={handleDelete}
            

          />
            <DeleteConfirmationDialog
        open={deleteConfirmOpen}
        onClose={handleCancelDelete}
        onConfirm={confirmDelete}
        item={expertToDelete?.name}
      />
          <EditDialog
            open={editModalOpen}
            onClose={handleEditModalClose}
            title="ערוך פרטי טכנאי"
            FormComponent={ExpertEditForm}
            formProps={{
              expert: expertToEdit
            }}
            
            formId="expert-edit-form"
            onSubmit={handleExpertUpdate}
          />
        </Box>
      

      </Box>
    </ThemeProvider>
  );
};

export default ExpertTablePage;
