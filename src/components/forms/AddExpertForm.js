import React, { useState } from 'react';
import { TextField, Button, Box, IconButton, Typography, Snackbar, Alert } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { useNavigate } from 'react-router-dom';
import ExpertService from '../../api/ExpertService';
import FeedbackDialog from '../common/FeedbackDialog';
import CustomTextField from '../common/CustomTextField';
import DynamicFields from '../common/DynamicFields';
const AddExpertForm = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [feedbackDialog, setFeedbackDialog] = useState({ open: false, message: '', severity: '' });
  const handleCloseDialog = () => {
    setFeedbackDialog({ ...feedbackDialog, open: false });
    if (feedbackDialog.severity === 'success'){
    navigate('/experts');
    }
  };
  const [expertData, setExpertData] = useState({
    tz: '',
    name: '',
    phone: '',
    education: [''],
    experience: [''],
  });

const validate = (name, value) => {
  if ( name !== 'education' && name !== 'experience' && value.trim() === '') {
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
    case 'education':
    case 'experience':
      return value.every(item => /^[\u0590-\u05FF0-9 ]*$/.test(item)) ? '' : 'הזן רק אותיות עבריות ומספרים';
    case 'phone':
      return /^[0-9]+$/.test(value) ? '' : 'הזן מספר טלפון תקין';
    default:
      return '';
  }
};


  const handleInputChange = (e) => {
    setExpertData({ ...expertData, [e.target.name]: e.target.value });
  };

  const handleDynamicChange = (e, type, index) => {
    const updatedArray = [...expertData[type]];
    updatedArray[index] = e.target.value;
    setExpertData({ ...expertData, [type]: updatedArray });
  };

  const addField = (type) => {
    setExpertData({ ...expertData, [type]: [...expertData[type], ''] });
  };

  const removeField = (type, index) => {
    const updatedArray = [...expertData[type]];
    updatedArray.splice(index, 1);
    setExpertData({ ...expertData, [type]: updatedArray });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newerrors=
    {
      tz: validate('tz', expertData.tz),
      name: validate('name', expertData.name),
      phone: validate('phone', expertData.phone),
      education: validate('education', expertData.education),
      experience: validate('experience', expertData.experience),
    };
    console.log(newerrors);

    const firstError = Object.values(newerrors).find(error => error !== '');
    if (firstError) {
      setFeedbackDialog({ open: true, message: firstError, severity: 'error' });
    } else {
      ExpertService.createExpert(expertData)
        .then(response => {
          if (response.status === 201) {
            setFeedbackDialog({ open: true, message: "Expert created successfully.", severity: "success" });
            // navigate to another page or reset the form if necessary
          } else {
            // This assumes response.data.message exists. Handle accordingly if this might not be the case.
            const errorMsg = response.data.message || "An unexpected error occurred";
            console.log(errorMsg);
            setFeedbackDialog({ open: true, message: errorMsg, severity: "error" });
          }
        })
        .catch(error => {
          console.error(error);
          // It's important to check if error.response exists and has a meaningful message
          const errorMsg = (error.response && error.response.data && error.response.data.message) ? 
                            error.response.data.message  : 
                            "An error occurred while processing your request.";
          console.error(errorMsg);
          setFeedbackDialog({ open: true, message: errorMsg, severity: "error" });
        });
    }
  };    
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500, margin: 'auto' }}>
      
      <CustomTextField
        label="תעודה מזהה"
        name="tz"
        value={expertData.tz}
        onChange={handleInputChange}
    
      />

      <CustomTextField
        label="שם"
        name="name"
        value={expertData.name}
        onChange={handleInputChange}
      
      />

      <CustomTextField
        label="מספר טלפון"
        name="phone"
        value={expertData.phone}
        onChange={handleInputChange}
      
      />

      <DynamicFields 
        type="education"
        data={expertData.education}
        onChange={handleDynamicChange}
        onAdd={addField}
        onRemove={removeField}
        label="השכלה"
      />

      <DynamicFields 
        type="experience"
        data={expertData.experience}
        onChange={handleDynamicChange}
        onAdd={addField}
        onRemove={removeField}
        label="ניסיון מקצועי"
      />

      <Button type="submit" variant="contained" color="primary" sx={{ mt: 1 , fontSize: '1.2rem' }}>
        שמור
      </Button>
      <FeedbackDialog
        title={""}
        open={feedbackDialog.open}
        onClose={handleCloseDialog}
        severity={feedbackDialog.severity}
        message={feedbackDialog.message}
      />
    </Box>
  );
};

export default AddExpertForm;
