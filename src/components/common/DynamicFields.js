// DynamicFields.jsx
import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CustomTextField from '../common/CustomTextField'; // Adjust the import path as necessary

const DynamicFields = ({ type, data, onChange, onAdd, onRemove, label }) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1"  sx={{fontSize:'1.5rem'}}>{label}</Typography>
      {data.map((item, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <CustomTextField
             name={type}
            value={item}
            onChange={(e) => onChange(e, type, index)}
            label={`${label} ${index + 1}`}
          />
          {index > 0 && (
            <IconButton onClick={() => onRemove(type, index)}>
              <RemoveCircleIcon  sx={{color:'red'}}/>
            </IconButton>
          )}
          {index === data.length - 1 && (
            <IconButton onClick={() => onAdd(type)}>
              < AddCircleIcon sx={{ color: 'darkblue' }} />
              </IconButton>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default DynamicFields;
