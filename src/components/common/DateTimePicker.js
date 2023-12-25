import React from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const DateTimePicker = ({ dateTime, index, handleDateTimeChange, removeDate }) => {
  return (
    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <TextField
        margin="normal"
        label="תאריך"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={dateTime.date}
        onChange={(e) => handleDateTimeChange(e, index, 'date')}
        sx={{ mr: 1 }}
      />
      <TextField
        margin="normal"
        label="שעה"
        type="time"
        InputLabelProps={{ shrink: true }}
        value={dateTime.time}
        onChange={(e) => handleDateTimeChange(e, index, 'time')}
        sx={{ mr: 1 }}
      />
  
    </Box>
  );
};

export default DateTimePicker;
