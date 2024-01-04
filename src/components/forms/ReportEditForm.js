import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Paper, Button,TextField, Grid,List, ListItem, Divider, ListItemText, ListItemSecondaryAction, IconButton, Card, CardContent, Typography } from '@mui/material';
import ReportService from '../../api/ReportService';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import DateTimePicker from '../common/DateTimePicker';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import PhotoManager from '../common/PhotoManager';
import theme from '../../theme';
import Sidebar from '../layout/Sidebar';
import FeedbackDialog from '../common/FeedbackDialog';
const ReportEditPage = () => {
  const [feedbackDialog, setFeedbackDialog] = useState({ open: false, message: '', severity: '' });
  const { reportId } = useParams();
  const [newPhotos, setNewPhotos] = useState([]);
  const [report, setReport] = useState({ clientPhotos: [], findingsPhotos: [], availableStartingDates: []});
  const [removedPhotos, setRemovedPhotos] = useState([]);
  const [newFindingPhotos, setNewFindingPhotos] = useState([]);
const [removedFindingPhotos, setRemovedFindingPhotos] = useState([]);
const [availableStartingDates, setAvailableStartingDates] = useState([]);
  // Add states for subject and description
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [findings, setFindings] = useState([]);
  const [newFinding, setNewFinding] = useState('');
  const onCloseFeedbackDialog = () => {
    setFeedbackDialog({ ...feedbackDialog, open: false });

    

  };
  const handleFileSelect = (event) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      setNewPhotos([...newPhotos, ...selectedFiles]);
    }
  };
  const fetchReport = async (id) => {
    try {
      const response = await ReportService.getReportById(id);
      setReport(response.data);
  
      const formattedDates = response.data.availableStartingDates.map(dateTimeString => {
        const dateTime = new Date(dateTimeString);
        return {
          date: dateTime.toISOString().split('T')[0], // Extract date part
          time: dateTime.toTimeString().split(' ')[0]  // Extract time part
        };
      });
  
      setFindings(response.data.findings || []);
      setAvailableStartingDates(formattedDates);
      setSubject(response.data.subject);
      setDescription(response.data.description);
    } catch (error) {
      console.error('Error fetching report:', error);
    }
  };
  useEffect(() => {
    if (reportId) {
      fetchReport(reportId);
    }
  }, [reportId]); // fetchReport function shouldn't be in the dependency array
  
  
  const handleDateTimeChange = (event, index, type) => {
    const updatedDates = [...availableStartingDates];
    if (type === 'date') {
      updatedDates[index].date = event.target.value;
    } else if (type === 'time') {
      updatedDates[index].time = event.target.value;
    }
    setAvailableStartingDates(updatedDates);
  };
  
  const handleRemovePhoto = (photo, index, isExistingPhoto) => {
    if (isExistingPhoto) {
      // Remove from existing photos
      const updatedPhotos = report.clientPhotos.filter((_, idx) => idx !== index);
      setReport({ ...report, clientPhotos: updatedPhotos });
      // Optionally, mark the photo URL for removal on the server
      setRemovedPhotos([...removedPhotos, photo]);
    } else {
      // Remove from new photos
      const updatedNewPhotos = newPhotos.filter((_, idx) => idx !== index);
      setNewPhotos(updatedNewPhotos);
    }
  };
  const handleRemoveFindingPhoto = (photoName, index, isExistingPhoto) => {
    if (isExistingPhoto) {
      // Logic for removing existing findings photos
      const updatedPhotos = report.findingsPhotos.filter((_, idx) => idx !== index);
      setReport({ ...report, findingsPhotos: updatedPhotos });
      setRemovedFindingPhotos([...removedFindingPhotos, photoName]);
    } else {
      // Logic for removing new findings photos
      const updatedNewPhotos = newFindingPhotos.filter((_, idx) => idx !== index);
      setNewFindingPhotos(updatedNewPhotos);
    }
  };
  const addDate = () => {
    setAvailableStartingDates([...availableStartingDates, { date: '', time: '' }]);
  };
  
  const removeDate = (index) => {
    const updatedDates = availableStartingDates.filter((_, idx) => idx !== index);
    setAvailableStartingDates(updatedDates);
  };
  
  
const handleFindingPhotoSelect = (event) => {
  if (event.target.files) {
    const selectedFiles = Array.from(event.target.files);
    setNewFindingPhotos([...newFindingPhotos, ...selectedFiles]);
  }
};
const handleAddFinding = () => {
  console.log("Current Findings:", findings); // Log current findings
  console.log("New Finding to Add:", newFinding.trim()); // Log new finding to be added

  if (newFinding.trim()) {
    const updatedFindings = [...findings, newFinding.trim()];
    setFindings(updatedFindings);
    setNewFinding('');

    console.log("Updated Findings:", updatedFindings); // Log updated findings
  }
};


const handleRemoveFinding = (index) => {
  setFindings(findings.filter((_, idx) => idx !== index));
};

  const handleSubmit = async (e) => {
    e.preventDefault();

   if (newFinding.trim()) {
    setFindings(prevFindings => [...prevFindings, newFinding.trim()]);
    setNewFinding('');
  }
  const formattedFindings = findings.map(finding => finding.trim());

  console.log("Findings:", findings); // Log findings
    const formattedDates = availableStartingDates.map(dt => {
      return new Date(dt.date + 'T' + dt.time).toISOString();
    });
    try {
      // Send both new photos and removed photo URLs to the server
      const  response=await ReportService.updateReportPhotos(
        reportId, 
        newPhotos, 
        removedPhotos, 
        newFindingPhotos, 
        removedFindingPhotos, 
        formattedDates,
        subject,
        description,
        formattedFindings 
      );      
      if (response.status === 200) {
        setFeedbackDialog({ open: true, message: 'דוח עודכן בהצלחה', severity: 'success' });
      }
      // Update the report state
      const updatedClientPhotos = [
        ...report.clientPhotos.filter(url => !removedPhotos.includes(url)),
        ...newPhotos.map(photo => URL.createObjectURL(photo))
      ];

      setReport({ ...report, clientPhotos: updatedClientPhotos });
  
      // Clear the newPhotos and removedPhotos states
      setNewPhotos([]);
      setRemovedPhotos([]);
      fetchReport(reportId);
    } catch (error) {
      console.error('Error updating client photos:', error);
    }
  };
  

    return (
      <Box sx={{ display: 'flex' }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 2, backgroundColor: theme.palette.background.default }}>
          <Paper elevation={1} sx={{ maxWidth: 960, mx: 'auto', p: 2, backgroundColor: theme.palette.background.paper, border: '1px solid #e0e0e0' }}>
            <Typography  variant="h4" align='center' gutterBottom color={theme.palette.primary.main}>עדכון דוח</Typography>
            <Typography variant="h6" color={theme.palette.primary.dark}>פרטי לקוח</Typography>

            <Card elevation={0} sx={{height:'10vh', mb: 0.5, border: '1px solid #e0e0e0' }}>

            <CardContent sx={{ p: 2 }}> {/* Reduced padding */}
                <Typography variant="body2">שם: {report.customer?.name}</Typography>
                <Typography variant="body2">נכס: {`${report.property?.cityName} ${report.property?.street} ${report.property?.propertyNumber}`}</Typography>
              </CardContent>
            </Card>
            {report.expert && (<>
                          <Typography variant="h6" color={theme.palette.primary.dark}>טכנאי</Typography>

  <Card elevation={0} sx={{ mb: 0.5, border: '1px solid #e0e0e0' }}>
    <CardContent sx={{ p: 2 }}> {/* Reduced padding */}
      <Typography variant="body2">שם: {report.expert.name}</Typography>
      <Typography variant="body2">טלפון: {report.expert.phone}</Typography>
      <Typography variant="body2">
        תאריך בדיקה: {new Intl.DateTimeFormat('he-IL', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }).format(new Date(report.inspectionDate))}
      </Typography>
    </CardContent>
  </Card>
  </>
)}


            <Typography variant="h6" color={theme.palette.primary.dark}>פירוט הדוח</Typography>

            <Card sx={{ mb: 1, border: '1px solid #e0e0e0', boxShadow: 'none' }}>

  <CardContent>
    <TextField
      fullWidth
      label="Subject"
      value={subject}
      onChange={(e) => setSubject(e.target.value)}
      margin="normal"
    />
    <TextField
      fullWidth
      label="Description"
      value={description}
      multiline
      rows={4}
      onChange={(e) => setDescription(e.target.value)}
      margin="normal"
    />
  </CardContent>
</Card>
<Typography variant="h6"   color={theme.palette.primary.dark}>תאריכי התחלה אפשריים</Typography>

<Card sx={{ mb: 3, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
  <CardContent>
          {availableStartingDates.map((dateTime, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <DateTimePicker
                dateTime={dateTime}
                index={index}
                handleDateTimeChange={handleDateTimeChange}
              />
              {index > 0 && (
                <IconButton onClick={() => removeDate(index)}>
                  <RemoveCircleOutlineIcon />
                </IconButton>
              )}
            </Box>
          ))}
          <Button startIcon={<AddCircleOutlineIcon />} onClick={addDate} sx={{ mb: 2 }}>
              הוסף תאריך
          </Button>

</CardContent>
</Card>
<Typography variant="h6"  color={theme.palette.primary.dark}>תמונות לקוח</Typography>

<Card sx={{ mb: 3, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
  <CardContent>
          <PhotoManager
            photoList={report.clientPhotos}
            photoNames={report.clientPhotoNames}
            newPhotos={newPhotos}
            onPhotoSelect={handleFileSelect}
            onRemovePhoto={handleRemovePhoto}
            uploadButtonLabel="עדכון תמונות לקוח"
          />
          </CardContent>
          </Card>
          <Typography variant="h6" color={theme.palette.primary.dark}>תמונות סיכום בדיקה</Typography>

          <Card sx={{ mb: 3, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
  <CardContent>
          <PhotoManager
            photoList={report.findingsPhotos}
            photoNames={report.findingsPhotoNames}
            newPhotos={newFindingPhotos}
            onPhotoSelect={handleFindingPhotoSelect}
            onRemovePhoto={handleRemoveFindingPhoto}
            uploadButtonLabel="עדכון תמונות בדיקה"
            isFindingPhotos={true}
          />
          </CardContent>
          </Card>
          <Typography variant="h6"  color={theme.palette.primary.dark}>תוצאות בדיקה</Typography>

          <Card sx={{ mb: 3, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
  <CardContent>
          <List>
            {findings.map((finding, index) => (
        <ListItem key={index} sx={{ py: 0.5 }}> {/* Reduced padding */}

        <ListItemText primary={finding} />
                <IconButton onClick={() => handleRemoveFinding(index)}>
                  <DeleteIcon />
                </IconButton>
                <Divider />
              </ListItem>
              
            ))}
          </List>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <TextField
              fullWidth
              label="New Finding"
              value={newFinding}
              onChange={(e) => setNewFinding(e.target.value)}
              variant="outlined"
              size="small"
              sx={{ mr: 2 }}
            />
            <Button variant="contained" onClick={handleAddFinding}>
              הוסף תוצאה
            </Button>
          </Box>
        </CardContent>
      </Card>
      <FeedbackDialog
        open={feedbackDialog.open}
        onClose={onCloseFeedbackDialog}
        message={feedbackDialog.message}
        severity={feedbackDialog.severity}
      />
      <Button variant="contained" color="primary" size="large" onClick={handleSubmit} sx={{ mt: 2 }}>
            עדכן דוח
          </Button>
        </Paper>
      </Box>
    </Box>
  );
};

export default ReportEditPage;