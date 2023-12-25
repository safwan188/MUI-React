import React, { useState } from 'react';
import { TextField, Button, Box, IconButton, Typography } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CustomerService from '../../api/CustomerService';
import { useNavigate } from 'react-router-dom';
import SnackBarComponent from '../common/SnackBarComponent';
import CustomTextField from '../common/CustomTextField';
import FeedbackDialog from '../common/FeedbackDialog';
const AddCustomerForm = () => {
  const [feedbackDialog, setFeedbackDialog] = useState({ open: false, message: '', severity: '' });
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState({
    tz: '',
    name: '',
    phone: '',
    properties: [{ city: '', street: '', houseNumber: '' }],
  });
  
const handleCloseDialog = () => {
  setFeedbackDialog({ ...feedbackDialog, open: false });
  if (feedbackDialog.severity === 'success'){
  navigate('/customers');
  }
};

  const validate = (name, value) => {
    if (value.trim() === '') {
      switch (name) {
        case 'tz':
          return 'עליך להזין תעודת זהות '
        case 'name':
          return 'עליך להזין שם';
        case 'phone':
          return 'עליך להזין מספר טלפון';
        default:
          return '';
      }
    }
  
    switch (name) {
      case 'tz':
        return /^[0-9]+$/.test(value) ? '' : 'הזן מספרים בלבד';
      case 'name':
        return /^[\u0590-\u05FF0-9 ]+$/.test(value) ? '' : 'הזן רק אותיות עבריות ומספרים';
    
      case 'phone':
        return /^[0-9]+$/.test(value) ? '' : 'הזן מספר טלפון תקין';
      default:
        return '';
    }
  };
  
  const handleInputChange = (e) => {
    setCustomerData({ ...customerData, [e.target.name]: e.target.value });
  };

  const handlePropertyChange = (e, index, field) => {
    const updatedProperties = [...customerData.properties];
    updatedProperties[index] = { ...updatedProperties[index], [field]: e.target.value };
    setCustomerData({ ...customerData, properties: updatedProperties });
  };

  const addProperty = () => {
    setCustomerData({ ...customerData, properties: [...customerData.properties, { city: '', street: '', houseNumber: '' }] });
  };

  const removeProperty = (index) => {
    const updatedProperties = [...customerData.properties];
    updatedProperties.splice(index, 1);
    setCustomerData({ ...customerData, properties: updatedProperties });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(customerData); // Handle the form submission here
    const newerrors=
    {
      tz: validate('tz', customerData.tz),
      name: validate('name', customerData.name),
      phone: validate('phone', customerData.phone),
    };
    const firstError = Object.values(newerrors).find(error => error !== '');
    if (firstError) {
      setFeedbackDialog({ open: true, message: firstError, severity: 'error' });
    } else {
    try {
      await CustomerService.createCustomer(customerData);
     
      setFeedbackDialog({ open: true, message: 'הלקוח נוסף בהצלחה', severity: 'success' });

      // Add any additional logic or UI updates after successfully adding the customer
    } catch (error) {


      console.error('Error adding customer:', error);
      // Handle the error and display an error message to the user
    }
  }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500, margin: 'auto', }}>
      <CustomTextField
        label="תעודה מזהה"
        name="tz"
        value={customerData.tz}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />

      <CustomTextField
        label="שם לקוח"
        name="name"
        value={customerData.name}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />

      <CustomTextField
        label="מספר טלפון"
        name="phone"
        value={customerData.phone}
        onChange={handleInputChange}
      />

      <Typography variant="subtitle1" sx={{ mt: 2,fontSize:'1.5rem' }}>נכסים</Typography>
      {customerData.properties.map((property, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <TextField
            label="עיר"
            value={property.city}
            onChange={(e) => handlePropertyChange(e, index, 'city')}
            margin="normal"
            sx={defaultTextFieldStyle}
          />
          <TextField
            label="רחוב"
            value={property.street}
            onChange={(e) => handlePropertyChange(e, index, 'street')}
            margin="normal"
            sx={defaultTextFieldStyle}
          />
          <TextField
            label="מספר בית"
            value={property.houseNumber}
            onChange={(e) => handlePropertyChange(e, index, 'houseNumber')}
            margin="normal"
            sx={defaultTextFieldStyle}
          />
          {index > 0 && (
            <IconButton onClick={() => removeProperty(index)}>
              <RemoveCircleIcon />
            </IconButton>
          )}
          {index === customerData.properties.length - 1 && (
            <IconButton onClick={addProperty}>
              <AddCircleIcon />
            </IconButton>
          )}
        </Box>
      ))}

      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        שמור
      </Button>
      <FeedbackDialog
        open={feedbackDialog.open}
        onClose={handleCloseDialog}
        severity={feedbackDialog.severity}
        message={feedbackDialog.message}
      />
    </Box>
  );
};

export default AddCustomerForm;
const defaultTextFieldStyle = {
  
  flex: 1,
  mx: 1,
  '& .MuiInputBase-root': {
    fontSize: '1.1rem',
    height: '3.5rem',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'darkblue',
    },
  },
  '& .MuiInputLabel-root': {
    fontSize: '1.3rem',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'darkblue',
  },
};
