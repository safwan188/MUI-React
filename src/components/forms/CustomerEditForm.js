import React, { useState, useEffect } from 'react';
import { TextField, Box, Button, Typography, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import DeleteIcon from '@mui/icons-material/Delete'; // Import DeleteIcon
import HomeIcon from '@mui/icons-material/Home'; // New import
import AddCircleIcon from '@mui/icons-material/AddCircle'; // New import

const CustomerEditForm = ({ customer, onSubmit }) => {
  const [formData, setFormData] = useState({
    id: '',
    tz: '',
    name: '',
    phone: '',
    properties: []
  });
  const [editStates, setEditStates] = useState([]);

  useEffect(() => {
    if (customer) {
      setFormData({
        id: customer._id || '',
        tz: customer.tz || '',
        name: customer.name || '',
        phone: customer.phone || '',
        properties: customer.properties || []
      });
      // Initialize all edit states to false
      setEditStates(customer.properties.map(() => false));
    }
  }, [customer]);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name.startsWith('property-')) {
      const propertyFields = [...formData.properties];
      const fieldName = name.split('-')[1];
      propertyFields[index] = { ...propertyFields[index], [fieldName]: value };
      setFormData({ ...formData, properties: propertyFields });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  const handleRemoveProperty = (index) => {
    const newProperties = formData.properties.filter((_, i) => i !== index);
    setFormData({ ...formData, properties: newProperties });
    const newEditStates = editStates.filter((_, i) => i !== index);
    setEditStates(newEditStates);
  };
  const handleAddProperty = () => {
    setFormData({ ...formData, properties: [...formData.properties, { street: '', cityName: '' }] });
    setEditStates([...editStates, true]); // Set the edit state of the new property to true
  };

  const toggleEdit = (index) => {
    const newEditStates = [...editStates];
    newEditStates[index] = !newEditStates[index];
    setEditStates(newEditStates);
  };
  const editableFieldStyle = {
    backgroundColor: 'white', // Example style for editable fields
    borderColor: 'primary.main',
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    onSubmit(formData);
  };

  return (
    <form id="customer-edit-form" onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, m: 1 }}>
        {/* TextFields for tz, name, phone, etc. */}
          {/* TextFields for tz, name, phone, etc. */}
          <TextField
          label="תז\ח.פ"
          name="tz"
          value={formData.tz}
          onChange={handleChange}
        />
        <TextField
          label="שם"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <TextField
          label="טלפון"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />

            {/* Dynamic fields for properties */}
           {/* Dynamic fields for properties */}
           {formData.properties.map((property, index) => (
          <Box key={index} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton size="small">
                <HomeIcon />
              </IconButton>
              <Typography variant="subtitle2">
                {property.cityName || ''}{property.street ? `, ${property.street}` : ''}
                {property.propertyNumber ? `, ${property.propertyNumber}` : ''}
              </Typography>
              <IconButton onClick={() => toggleEdit(index)} size="small">
                {editStates[index] ? <LockIcon /> : <EditIcon />}
              </IconButton>
            </Box>
            {editStates[index] && (
              <>
              <TextField
                  label="עיר"
                  name={`property-cityName`}
                  value={property.cityName || ''}
                  onChange={(e) => handleChange(e, index)}
                  sx={editableFieldStyle}
                />
                <TextField
                  label="רחוב"
                  name={`property-street`}
                  value={property.street || ''}
                  onChange={(e) => handleChange(e, index)}
                  sx={editableFieldStyle}
                />
                
                  <TextField
                  label="מספר בית\דירה"
                  name={`property-propertyNumber`}
                  value={property.propertyNumber || ''}
                  onChange={(e) => handleChange(e, index)}
                  sx={editableFieldStyle}
                />
                    <IconButton onClick={() => handleRemoveProperty(index)} size="small">
                <DeleteIcon />
              </IconButton>
              </>
            )}
          </Box>
        ))}
        {/* Add Button to add new property */}
       {/* Add Button to add new property */}
         {/* Add Button to add new property */}
         <IconButton 
          onClick={handleAddProperty}
          color="primary"
          sx={{ mt: 1 }}
        >
        הוסף נכס
          <AddCircleIcon />
          
        </IconButton>
      </Box>
   
    </form>
  );
};

export default CustomerEditForm;
