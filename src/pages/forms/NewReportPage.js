import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import ReportForm from '../../components/forms/ReportForm';
import theme from '../../theme';
import CustomerService from '../../api/CustomerService';
import Sidebar from '../../components/layout/Sidebar';
import ReportService from '../../api/ReportService';
import { useNavigate } from 'react-router-dom';
import FeedbackDialog from '../../components/common/FeedbackDialog';
const NewReportPage = () => {
  const [feedbackDialog, setFeedbackDialog] = useState({ open: false, message: '', severity: '' });
  const handleCloseDialog = () => {
    setFeedbackDialog({ ...feedbackDialog, open: false });

    if (feedbackDialog.severity === 'success') {
      navigate('/reports');
    }
    setFeedbackDialog({ ...feedbackDialog, open: false });
  };
  const validateDate = (datesArray) => {
    if (datesArray.length === 0) return 'עליך לבחור לפחות תאריך אחד';
    for (let dateObj of datesArray) {
      // Assuming each dateObj is { date: 'yyyy-mm-dd', time: 'HH:MM' }
      if (!dateObj.date || !Date.parse(dateObj.date)) {
        return 'אחד או יותר מהתאריכים שגויים';
      }
    }
    return ''; // No errors
  };
  const validate = (name, value) => {
    if (value.trim() === '') {
      switch (name) {
       
      case 'description':
        return 'עליך להזין תיאור';
      case 'subject':
        return 'עליך להזין תחום';
      }
    }
    switch (name) {
      case 'description':
        return /^[\u0590-\u05FF0-9 ]+$/.test(value) ? '' : 'הזן רק אותיות עבריות ומספרים';
      case 'subject':
        return /^[\u0590-\u05FF0-9 ]+$/.test(value) ? '' : 'הזן רק אותיות עבריות ומספרים';
     
    }
    
  };
  const [reportData, setReportData] = useState({
    dates: [''],
    subject: '',
    description: '',
    photos: [],
    customer: null,
    property: null,
  });

const navigate = useNavigate();
  const [customers, setCustomers] = useState([]); // State for storing customers

  useEffect(() => {
    CustomerService.getAllCustomers()
      .then(response => {
        // Update state with fetched customers
        setCustomers(response.data.customers); // Assuming response.data.customers is the array of customers
      })
      .catch(error => {
        console.error('Error fetching customers:', error);
      });
  }, []);
  const handleSubmit = (event) => {
    event.preventDefault();
    // Validate form data
    const errors = {
   
      customer: reportData.customer ? '' : 'עליך לבחור לקוח',
      property: reportData.property ? '' : 'עליך לבחור נכס',
      dates: validateDate(reportData.dates),
      subject: validate('subject', reportData.subject),
      description: validate('description', reportData.description),
    };

    const firstError = Object.values(errors).find(error => error !== '');
    if (firstError) {
      setFeedbackDialog({ open: true, message: firstError, severity: 'error' });
    } else{
 

    // Create a new FormData object
    const formData = new FormData();
  
    // Append all non-file data
    Object.keys(reportData).forEach(key => {
      if (key === 'dates') {
        // Combine date and time and append
        reportData[key].forEach(dateTimeObj => {
          const combinedDateTime = `${dateTimeObj.date}T${dateTimeObj.time}`;
          formData.append('availableStartingDates', combinedDateTime);
        });
      } else if (key !== 'photos') {
        formData.append(key, reportData[key]);
      }
    });
    // Append photos under the 'customerPhotos' key
    reportData.photos.forEach((photo) => {
      formData.append('customerPhotos', photo, photo.name);
    });
    console.log(formData);

    // Send formData to the server
    ReportService.createReport(formData)
      .then(response => {
        console.log('Report created successfully:', response);
        setFeedbackDialog({ open: true, message: 'דוח נוצר בהצלחה', severity: 'success' });
      })
      .catch(error => {
        console.error('Error creating report:', error);
      });
    }
  };
  
  
  

  return (
    <Container component="main" maxWidth="md" sx={{ py: 4,bgcolor:'',width:'150' }}>
<Paper elevation={3} sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderWidth: '1px', // Sets the width of the border
        borderStyle: 'solid', // Required to show the border
        borderColor: 'darkblue', // Sets the border color
      }}>          <Sidebar />
        <Typography component="h1" variant="h4" color="primary" gutterBottom>
          צור דוח חדש {/* Translated to Hebrew */}
        </Typography>
        <ReportForm 
          reportData={reportData}
          setReportData={setReportData}
          handleSubmit={handleSubmit}
          customers={customers} // Pass the fetched customers to the ReportForm
        />
        <FeedbackDialog
          open={feedbackDialog.open}
          onClose={handleCloseDialog}
          message={feedbackDialog.message}
          severity={feedbackDialog.severity}
        />
      </Paper>
    </Container>
  );
};

export default NewReportPage;