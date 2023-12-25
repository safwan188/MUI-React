import React,{useState} from 'react';
import {
  TextField, Button, Box, IconButton, List, ListItem, ListItemIcon, 
  ListItemText, ListItemSecondaryAction, Autocomplete 
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import DateTimePicker from '../common/DateTimePicker';
import CustomTextField from '../common/CustomTextField';

const ReportForm = ({ reportData, setReportData, handleSubmit, customers }) => {
  const [errors, setErrors] = useState({ subject: false, description: false });


  // Function to check for Hebrew text
  const isHebrew =(text) => /^[\u0590-\u05FF0-9\s]+$/u.test(text);
  const handleCustomerChange = (event, value) => {
    setReportData({ 
      ...reportData, 
      customer: value ? value._id : null, // Save customer _id
    property  : null // Reset property when customer changes
    });
  };

  const handlePropertyChange = (event, value) => {
    setReportData({
      ...reportData,
      property: value ? value._id : null // Save property _id
    });
  };
  const handleDateTimeChange = (event, index, type) => {
    const newDates = [...reportData.dates];
    if (type === 'date') {
      newDates[index] = { ...newDates[index], date: event.target.value };
    } else if (type === 'time') {
      newDates[index] = { ...newDates[index], time: event.target.value };
    }
    console.log(newDates);
    setReportData({ ...reportData, dates: newDates });
  };
  const handleSubjectChange = (e) => {
    const value = e.target.value;
    setReportData({ ...reportData, subject: value });
    setErrors({ ...errors, subject: !isHebrew(value) });
  };

  // Handler for description change
  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setReportData({ ...reportData, description: value });
    setErrors({ ...errors, description: !isHebrew(value) });
  };
  const handleImageChange = (event) => {
    if (event.target.files) {
      // Add the new files to the existing file array
      setReportData({
        ...reportData,
        photos: [...reportData.photos, ...Array.from(event.target.files)]
      });
    }
    console.log(reportData.photos);
  };
  

  const removePhoto = (index) => {
    const newPhotos = [...reportData.photos];
    newPhotos.splice(index, 1);
    setReportData({ ...reportData, photos: newPhotos });
  };
  
  const addDate = () => {
    setReportData({ ...reportData, dates: [...reportData.dates, ''] });
  };

  const removeDate = index => {
    const newDates = [...reportData.dates];
    newDates.splice(index, 1);
    setReportData({ ...reportData, dates: newDates });
  };

  
  
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Autocomplete
        options={customers}
        getOptionLabel={(option) => option.name || ''}
        onChange={handleCustomerChange}
        fullWidth
        renderInput={(params) => (
          <TextField {...params} label="בחר לקוח" margin="normal" />
        )}
      />

        <Autocomplete
        options={reportData.customer ? customers.find(c => c._id === reportData.customer).properties : []}
        getOptionLabel={(option) => `${option.cityName} ${option.street} ${option.propertyNumber}`}
        onChange={handlePropertyChange}
        fullWidth
        renderInput={(params) => (
          <TextField {...params} label="בחר כתובת" margin="normal" disabled={!reportData.customer} />
        )}
        value={reportData.Property}
      />
      {reportData.dates.map((date, index) => (
        <Box key={index} sx={{ display: 'flex', alignitems: 'center', mb: 2 }}>
         
         <DateTimePicker

            dateTime={date}
            index={index}
            handleDateTimeChange={handleDateTimeChange}
            removeDate={removeDate}
          />
          {index > 0 && (
            <IconButton onClick={() => removeDate(index)}>
              <RemoveCircleOutlineIcon sx={{ color:'red',mb: 1 }} />
            </IconButton>
          )}
        </Box>
      ))}
      <Button startIcon={<AddCircleOutlineIcon />} onClick={addDate} sx={{ mb: 2 }}>
         הוסף תאריך  
      </Button>
      <CustomTextField
        margin="normal"
        required
        fullWidth
        id="subject"
        label="תחום"
        name="subject"
        autoComplete="subject"
        value={reportData.subject}
        onChange={handleSubjectChange}
        // Apply red color if error is true
        error={errors.subject}
        helperText={errors.subject && "תכתוב עברית ומספרים"}
      />
      <TextField
        margin="normal"
        fullWidth
        name="description"
        label="תיאור הבעיה "
        id="description"
        multiline
        rows={4}
        value={reportData.description}
        onChange={handleDescriptionChange}
        error={errors.description}
        // Apply red color if error is true
        helperText={errors.description && "תכתוב עברית ומספרים"}
      />
      <Button variant="contained" component="label" sx={{ mt: 2, mb: 2 }}>
              הוסף תמונה
        <input type="file" hidden onChange={handleImageChange} accept="image/*" />
        <PhotoCamera sx={{ ml: 1 }} />
      </Button>
          <List>
      {reportData.photos.map((photo, index) => (
        <ListItem key={index}>
          <ListItemIcon>
            <img src={URL.createObjectURL(photo)} alt={`upload-${index}`} style={{ maxHeight: '50px', maxWidth: '50px' }} />
          </ListItemIcon>
          <ListItemText primary={`Photo ${index + 1}`} />
          <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="delete" onClick={() => removePhoto(index)}>
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        tex
        sx={{ mt: 3, mb: 2 }}
      >
שמור דוח      </Button>
    </Box>
  );
};

export default ReportForm;
