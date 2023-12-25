import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';

const FeedbackDialog = ({ open, onClose, severity, message,title }) => {
  const getIcon = () => {
    switch (severity) {
      case 'error': return <ErrorIcon color="error" />;
      case 'success': return <CheckCircleIcon color="success" />;
      case 'warning': return <WarningIcon color="warning" />;
      default: return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          {getIcon()} {message}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeedbackDialog;
