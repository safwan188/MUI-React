import React, { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
const defaultTextFieldStyle = {
  '& .MuiInputBase-root': {
    fontSize: '1.3rem',
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


const CustomTextField = ({ label, name, value, onChange }) => {
  const [errorText, setErrorText] = useState('');
  const [isError, setIsError] = useState(false);

  const validate = (name, value) => {
    if (value.trim() === '') {
      return '';
    }

    switch (name) {
      case 'subject':
        // Assuming you want the same validation as previously in ReportForm
        return /^[\u0590-\u05FF0-9\s]+$/u.test(value) ? '' : 'תכתוב עברית ומספרים';
      
      case 'tz':
        return /^[0-9]+$/.test(value) ? '' : 'הזן מספרים בלבד';
      case 'name':
        return /^[\u0590-\u05FF0-9 ]+$/.test(value) ? '' : 'הזן רק אותיות עבריות ומספרים';
      case 'education':
        return /^[\u0590-\u05FF0-9 ]+$/.test(value) ? '' : 'הזן רק אותיות עבריות ומספרים';
      case 'experience':
        return /^[\u0590-\u05FF0-9 ]+$/.test(value) ? '' : 'הזן רק אותיות עבריות ומספרים';
      case 'phone':
        return /^[0-9]+$/.test(value) ? '' : 'הזן מספר טלפון תקין';
      default:
        return '';
    }
  };

  useEffect(() => {
    const error = validate(name, value);
    setErrorText(error);
    setIsError(error !== '');
  }, [name, value]);

  const handleLocalChange = (e) => {
    onChange(e); // propagate changes up
  };

  return (
    <TextField
    sx={defaultTextFieldStyle}
      label={label}
      name={name}
      value={value}
      onChange={handleLocalChange}
      fullWidth
      margin="normal"
      error={isError}
      helperText={errorText}
    />
  );
};

export default CustomTextField;
