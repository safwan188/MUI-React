import React, { useState } from 'react';
import { Toolbar, Typography, Button, InputBase, MenuItem, Select, TextField, IconButton, styled, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const primaryColor = '#253291'; // Example primary color
const borderColor = '#d0d0d0'; // Border color for inputs and toolbar

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '10px 20px',
  bgcolor: 'background.paper', // Consider a lighter shade that contrasts well with the content
  borderBottom: `1px solid ${borderColor}`,
    borderRadius: '4px',
  
  border: `1px solid ${borderColor}`,
  boxShadow: '1px 1px 1px rgba(0, 0, 0, 0.1)',
});

const SearchAndSelectWrapper = styled('div')({
  display: 'flex',
  width: '50%',
  alignItems: 'center',
});

const StyledSelect = styled(Select)({
  marginRight: '10px',
  border: `1px solid ${borderColor}`,
  borderRadius: '4px',
  height: '40px',
  backgroundColor: 'white',
  '&:before, &:after': {
    display: 'none',
  },
});

const SearchWrapper = styled('div')({
  height: '40px',
  position: 'relative',
  backgroundColor: '#ffffff',
  borderRadius: '4px',
  marginLeft: '1rem',
  border: `1px solid ${borderColor}`,
  width: 'auto',
});

const StyledInputBase = styled(InputBase)({
  paddingLeft: `calc(1em + ${10}px)`,
  width: '100%',
});

const StyledButton = styled(Button)({
  backgroundColor: primaryColor,
  color: 'white',
  '&:hover': {
    backgroundColor: '#1b237e', // Darker shade for hover state
  },
});


const formatDate = (dateString) => {
  // Check if dateString is already in DD-MM-YYYY format
  const alreadyFormatted = /^\d{2}-\d{2}-\d{4}$/.test(dateString);
  console.log(dateString)
  if (alreadyFormatted) return dateString;

  if (!dateString) return 'Date not set'; // Placeholder for undefined or null dates

  const date = new Date(dateString);
  if (isNaN(date)) {
    return 'Invalid Date1'; // Check for invalid date
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${day}-${month}-${year}`; // Format: DD-MM-YYYY
};

const DataToolbar = ({ title, menuItems, onAddNewClick, onSearchChange, onColumnChange, selectedColumn ,includeDateRange,btn_txt}) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    const formattedStartDate = formatDate(start);
    const formattedEndDate = formatDate(end);
    onSearchChange({ startDate: formattedStartDate, endDate: formattedEndDate });
    
  };
  const datePickerStyle = {
    // Add your custom styles here
    color: primaryColor, // Example to change text color
    // Note: You can't style nested components (like .react-datepicker__header) directly here
};
  // For text search
  const handleTextSearchChange = (text) => {
    onSearchChange({ textQuery: text });
  };

  return (
    <StyledToolbar>
      <SearchAndSelectWrapper>
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              {includeDateRange && (
              <DatePicker
                selected={startDate}
                
        onChange={(date) => handleDateChange(date, endDate)}
        dateFormat="dd-MM-yyyy"
        customInput={<TextField label="Start Date" />}
        popperPlacement="bottom-start"
        popperModifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 10], // Moves the DatePicker 10px down from the input field
            },
          },
          {
            name: 'preventOverflow',
            options: {
              rootBoundary: 'viewport',
              tether: false,
              altAxis: true,
            },
          },
        ]}
                
              />
              )}
              
                <SearchWrapper>
              <SearchIcon sx={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)' }} />
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
                onChange={(e) => handleTextSearchChange(e.target.value)}
              />
            </SearchWrapper>
            </Grid>


            <Grid item xs={12} sm={6} md={4}>
              {includeDateRange && (
              <DatePicker
                selected={endDate}
                  
                onChange={(date) => handleDateChange(startDate, date)}
                dateFormat="dd-MM-yyyy"
                customInput={<TextField label="End Date" />}
              />
              )}
              <StyledSelect defaultValue="" displayEmpty onChange={(e) => onColumnChange(e.target.value)}>
                <MenuItem value="" disabled>
                  בחר עמודה
                </MenuItem>
                {menuItems.map((item, index) => (
                  <MenuItem key={index} value={item.value}>{item.label}</MenuItem>
                ))}
              </StyledSelect>
            </Grid>
        </Grid>
      </SearchAndSelectWrapper>

      <Typography variant="h6" color="primary" component="div" sx={{ flexGrow: 1, textAlign: 'center', fontSize:30, marginRight: 50 }}>
        {title}
      </Typography>

      <StyledButton variant="contained" startIcon={<AddIcon />} onClick={onAddNewClick}>
                  {btn_txt}
      </StyledButton>
    </StyledToolbar>
  );
};

export default DataToolbar;