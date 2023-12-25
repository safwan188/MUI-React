import React from 'react';
import AddExpertForm from '../../components/forms/AddExpertForm';
import { Container, Paper, Typography } from '@mui/material';
import Sidebar from '../../components/layout/Sidebar';

const ExpertFormPage = () => {
  return (
    <Container component="main" maxWidth="md" sx={{ p:1 }}>
<Paper elevation={3} sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderWidth: '1px', // Sets the width of the border
        borderStyle: 'solid', // Required to show the border
        borderColor: 'darkblue', // Sets the border color
      }}>        <Sidebar />
        <Typography component="h1" variant="h4" color="primary" gutterBottom >
          קבלן חדש {/* Replace with translation if needed */}
        </Typography>
        <AddExpertForm />
      </Paper>
    </Container>
  );
};

export default ExpertFormPage;
