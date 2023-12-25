// Layout_table.js
import React from 'react';
import { ThemeProvider, Box } from '@mui/material';
import Sidebar from './Sidebar'; // Update the import path as needed
import theme from '../../theme';
const Layout_table = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', bgcolor: theme.palette.background.default }}>
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            height: '100%',
            p: 3,
            bgcolor: 'background.paper',
            boxShadow: '0px 3px 6px rgba(0,0,0,0.1)',
            borderRadius: '4px',
            border: '1px solid rgba(0,0,0,0.12)',
            '& > *': {
              marginBottom: 2,
            },
          }}
        >
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Layout_table;
