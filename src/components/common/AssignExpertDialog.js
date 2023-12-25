import React from 'react';
import { Dialog, DialogTitle, CircularProgress,DialogContent, Snackbar,DialogActions, Button, Autocomplete, TextField, List, ListItem, Typography, useMediaQuery, useTheme } from '@mui/material';
import ReportService from '../../api/ReportService';

const AssignExpertDialog = ({ open, onClose, experts, report, onAssign, onAssignmentComplete }) => {
  const [selectedExpert, setSelectedExpert] = React.useState(null);
  const [selectedDate, setSelectedDate] = React.useState(null);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [loading, setLoading] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({ open: false, message: 'test', severity: 'info' });
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
{new Date(date).toLocaleDateString()} {new Date(date).toLocaleTimeString()}
          </ListItem>
        ))}
      </List>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} fullScreen={fullScreen} fullWidth maxWidth="sm">
    <DialogTitle sx={{ bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText }}>בחר טכנאי</DialogTitle>
    <DialogContent>
        <Autocomplete
          options={experts}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => <TextField {...params} label="בחר טכנאי" variant="outlined" margin="dense" />}
          onChange={(event, newValue) => setSelectedExpert(newValue)}
          sx={{ mt: 2 }}
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
