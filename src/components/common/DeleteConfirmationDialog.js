import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button,styled } from '@mui/material';
const primaryColor = '#253291'; // Example primary color


const DeleteConfirmationDialog = ({ open, onClose, onConfirm ,item}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      
>
      <DialogTitle id="alert-dialog-title">{"אישור מחיקה"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
      {item} יימחק מהמערכת
        </DialogContentText>
      </DialogContent>
      <DialogActions>
      <Button onClick={onConfirm} color="primary" autoFocus
                  sx={{ mt: 2, ml: 2,backgroundColor: primaryColor,color: 'white', '&:hover': { backgroundColor: '#1b237e' } }}

        >
          אישור
        </Button>
        <Button onClick={onClose} color="primary"
                  sx={{ mt: 2, color: 'white', backgroundColor: '#ff1111', '&:hover': { backgroundColor: '#dd0000' } }}
                  >
          ביטול
        </Button>
       
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
