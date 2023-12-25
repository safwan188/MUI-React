import React from 'react';
import AddCustomerForm from '../../components/forms/AddCustomerForm';
import { Container, Paper, Typography } from '@mui/material';
import Sidebar from '../../components/layout/Sidebar';

const CustomerFormPage = () => {
  return (
    <Container component="main" maxWidth="md" sx={{ py: 5,height:'100%',overflowY:'none' }}>
 <Paper elevation={3} sx={{
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderWidth: '1px', // Sets the width of the border
        borderStyle: 'solid', // Required to show the border
        borderColor: 'darkblue', // Sets the border color
      }}>
                <Sidebar />
        <Typography component="h1" variant="h4" color="primary" gutterBottom>
          הוספת לקוח חדש {/* Translated to "Add New Customer" */}
        </Typography>
        <AddCustomerForm />
      </Paper>
    </Container>
  );
};

export default CustomerFormPage;
