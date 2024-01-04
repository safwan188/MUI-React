import React from 'react';
import { Dialog, DialogTitle, CircularProgress,DialogContent, Snackbar,DialogActions, Button,Divider, Autocomplete, TextField, List, ListItem, Typography, useMediaQuery, useTheme } from '@mui/material';
import ReportService from '../../api/ReportService';

const AssignExpertDialog = ({ open, onClose, experts, report, onAssign, onAssignmentComplete }) => {
  const [selectedExpert, setSelectedExpert] = React.useState(null);
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [requests, setRequests] = React.useState([]); // Add this line
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [loading, setLoading] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({ open: false, message: 'test', severity: 'info' });
  const handleAccept = async (request) => {
    setSelectedExpert(request.expert);
    setSelectedDate(request.date);
  };
  React.useEffect(() => {
    if (report) {
      const response = ReportService.getreportrequests(report._id);
      response.then((res) => {
        setRequests(res.data);
      });
    }
  }, [report]);

const handleAssign = async () => {
  if (!selectedExpert || !selectedDate) {
    console.log("Expert and Date are required.");
    return;
  }

  setLoading(true);
  try {
    const response = await ReportService.assignExpert(report._id, {
      expert: selectedExpert._id,
      inspectionDate: selectedDate,
      expertRequest: report.expertRequest?._id
    });

    if (response.status === 200) {
      setSnackbar({ open: true, message: 'טכנאי עודכן בהצלחה', severity: 'success' });

      // Delay execution of the following code
      setTimeout(() => {
        if (onAssign) {
          onAssign(response.data);
        }
        onClose(); // Close the dialog after the delay
      }, 1000); // Delay of 1000 milliseconds (1 second)

      onAssignmentComplete();

    } else {
      setSnackbar({ open: true, message: 'שגיאה', severity: 'error' });
      setTimeout(onClose, 1000); // Delay closing the dialog if assignment failed
    }
  } catch (error) {
    console.error('Error assigning expert:', error);
    setSnackbar({ open: true, message: 'שגיאה', severity: 'error' });
    setTimeout(onClose, 1000); // Delay closing the dialog in case of an error
  } finally {
    setLoading(false);
  }
};
const renderRequestsList = () => {
  if (requests.length === 0) {
    return <Typography sx={{ mt: 2 }}>No requests available</Typography>;
  }

  return (
    <>
      <Typography sx={{ mt: 2 }}>בקשות טכנאים לדוח</Typography>
      <List sx={{ maxHeight: 200, overflow: 'auto', bgcolor: 'background.paper', mt: 2, border: 1, borderColor: 'divider' }}>
        {requests.map((request, index) => (
          <ListItem 
            key={index} 
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', '&:hover': { bgcolor: 'action.hover' } }}
          >
            <div>
              <Typography variant="body1">טכנאי: {request.expert.name}</Typography>
              <Typography variant="body2">תאריך בדיקה:
              {new Intl.DateTimeFormat('he-IL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(new Date(request.date))}
              </Typography> 
       
            </div>
            {request.status === 'pending' && (
              <div>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  onClick={() => handleAccept(request)}

                  sx={{ mr: 1 }}
                >
                  בחר
                </Button>
       
              </div>
            )}
                     <Divider />

          </ListItem>

        ))}
      </List>
    </>
  );
};


  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const renderDateList = () => {
    if (!report || !report.availableStartingDates || report.availableStartingDates.length === 0) {
      return <Typography sx={{ mt: 2 }}>No available dates</Typography>;
    }

    return (
      <List sx={{ maxHeight: 200, overflow: 'auto', bgcolor: 'background.paper', mt: 2, border: 1, borderColor: 'divider' }}>
        {report.availableStartingDates.map((date, index) => (
          <ListItem 
            key={index} 
            button 
            selected={selectedDate === date} 
            onClick={() => setSelectedDate(date)}
            sx={{ '&.Mui-selected, &.Mui-selected:hover': { bgcolor: 'primary.main', color: 'primary.contrastText' } }}
          >
   {new Intl.DateTimeFormat('he-IL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(new Date(date))}
          </ListItem>
        ))}
      </List>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} fullScreen={fullScreen} fullWidth maxWidth="sm">
    <DialogTitle sx={{ bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText }}>בחר טכנאי</DialogTitle>
    <DialogContent>
    {renderRequestsList()}  {/* Render the requests list here */}

        <Autocomplete
          options={experts}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => <TextField {...params} label="בחר טכנאי" variant="outlined" margin="dense" />}
          value={selectedExpert}

          onChange={(event, newValue) => {
            setSelectedExpert(newValue);
          }}          sx={{ mt: 2 }}
        />
        {renderDateList()}
      </DialogContent>
      <DialogActions sx={{ bgcolor: 'background.paper' }}>
        <Button onClick={onClose} variant="outlined" color="primary">ביטול</Button>
        <Button onClick={handleAssign} disabled={!selectedExpert || !selectedDate || loading} variant="contained" color="primary">
          {loading ? <CircularProgress size={24} /> : 'שמור'}
        </Button>
      </DialogActions>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      
/>
    </Dialog>
  );
};

export default AssignExpertDialog;
