import React, { useState } from 'react';
import { Toolbar, Typography, Button, InputBase, MenuItem, Select, TextField, IconButton, styled, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useTheme, useMediaQuery } from '@mui/material';
const primaryColor = '#253291'; // Example primary color
const borderColor = '#d0d0d0'; // Border color for inputs and toolbar

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  padding: '10px',
  maxWidth: '100%',
  
  

  [theme.breakpoints.down('sm')]: {

    maxWidth: '100%',
    flexDirection: 'column',
    alignItems: 'stretch',
  }


}));

const SearchAndSelectWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  width: '100%', // Changed from 50% for better responsiveness
  alignItems: 'center', 
  justifyContent: 'space-between',
  
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    width: '100%',
    alignItems: 'stretch',
  }
}));

const StyledSelect = styled(Select)({
    
  marginRight: '10px',
  border: `1px solid ${borderColor}`,
  borderRadius: '4px',
  height: '40px',
  maxWidth: '100%',
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
  border: `1px solid ${borderColor}`,
  width: '100%', // Changed to 100% for better control
});

const StyledInputBase = styled(InputBase)({
  color: 'black',
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

const DataToolbar = ({  menuItems, onSearchChange, onColumnChange, selectedColumn ,includeDateRange,}) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const theme = useTheme();
  const isXSmall = useMediaQuery(theme.breakpoints.down('xs'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    const formattedStartDate = formatDate(start);
    const formattedEndDate = formatDate(end);
    onSearchChange({ startDate: formattedStartDate, endDate: formattedEndDate });
    
  };
  const selectStyle = {
    width: includeDateRange ? '100%' : '100%', // Adjust these values as needed
    marginBottom: 2, // Ensure some margin at the bottom
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
      <Grid container spacing={1} alignItems="center">
      <Grid item xs={12} sm={6} md={4}>
              {includeDateRange && (
              <DatePicker
                selected={startDate}
                
        onChange={(date) => handleDateChange(date, endDate)}
        dateFormat="dd-MM-yyyy"
        customInput={<TextField label="מ תאריך" />}
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
                 {includeDateRange && (
              <DatePicker
                selected={endDate}
                  
                onChange={(date) => handleDateChange(startDate, date)}
                dateFormat="dd-MM-yyyy"
                customInput={<TextField label="עד תאריך" />}
                
              />
              )}
              
            </Grid>


    

            <Grid item xs={12} sm={6} md={includeDateRange ? 6 : 12}>
  <StyledSelect
    defaultValue=""
    displayEmpty
    onChange={(e) => onColumnChange(e.target.value)}
    sx={{ width: '100%', marginBottom: 2 }} // Ensure full width and add some margin at the bottom
  >
    <MenuItem value="" disabled>
      בחר עמודה
    </MenuItem>
    {menuItems.map((item, index) => (
      <MenuItem key={index} value={item.value}>{item.label}</MenuItem>
    ))}
  </StyledSelect>

  <SearchWrapper sx={{ position: 'relative', width: '100%' }}> {/* Ensure full width */}
    <SearchIcon sx={{ position: 'absolute',  }} />
    <StyledInputBase
      placeholder="חיפוש"
      inputProps={{ 'aria-label': 'search' }}
      sx={{ width: '100%', paddingRight: '1rem' }} // Ensure full width and padding for the icon
      onChange={(e) => handleTextSearchChange(e.target.value)}
    />
  </SearchWrapper>
</Grid>

        </Grid>
      </SearchAndSelectWrapper>

    </StyledToolbar>
  );
};

export default DataToolbar;