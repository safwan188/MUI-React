import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button ,styled} from '@mui/material';
const primaryColor = '#253291'; // Example primary color

const StyledButton = styled(Button)({
  backgroundColor: primaryColor,
  color: 'white',
  '&:hover': {
    backgroundColor: '#1b237e', // Darker shade for hover state
  },
});
const EditDialog = ({ open, onClose, title, FormComponent, formProps, formId, onSubmit ,experts}) => {
  return (
    <Dialog open={open} onClose={onClose}
    fullWidth={true} // Make the dialog take full width of the container
    maxWidth="md" // You can choose between 'xs', 'sm', 'md', 'lg', 'xl'
  >
      <DialogTitle style={{ color: '#020681', textAlign: 'right' }}>{title}</DialogTitle>
      <DialogContent>
        <FormComponent 
          {...formProps} 
          onSubmit={onSubmit} 
          experts={experts}
        />
      </DialogContent>
      <DialogActions style={{ justifyContent: 'right' }}>
       
        <Button 
          form={formId} // Use the passed formId
          type="submit" 
          variant="contained"
          color="primary"
          sx={{ mt: 2, ml: 2 }}
        >
          שמור
        </Button>
        <Button 
          onClick={onClose}
          sx={{ mt: 2, color: 'white', backgroundColor: '#ff1111', '&:hover': { backgroundColor: '#dd0000' } }}
        >
          ביטול
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDialog;
