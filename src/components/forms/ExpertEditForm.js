import React, { useState, useEffect } from 'react';
import { TextField, Box, Button } from '@mui/material';

const ExpertEditForm = ({ expert, onSubmit }) => {
  const [formData, setFormData] = useState({
    id: '',
    tz: '',
    name: '',
    phone: '',
    education: [''],
    experience: ['']
  });

  useEffect(() => {
    if (expert) {
      setFormData({
        id: expert._id || '',
        tz: expert.tz || '',
        name: expert.name || '',
        phone: expert.phone || '',
        education: expert.education.length ? expert.education : [''],
        experience: expert.experience.length ? expert.experience : ['']
      });
    }
  }, [expert]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleArrayChange = (index, value, arrayName) => {
    const updatedArray = [...formData[arrayName]];
    updatedArray[index] = value;
    setFormData({ ...formData, [arrayName]: updatedArray });
  };

  const handleAddToArray = (arrayName) => {
    setFormData({ ...formData, [arrayName]: [...formData[arrayName], ''] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form id="expert-edit-form" onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, m: 1 }}>
        {/* TextFields for tz, name, phone */}
        <TextField label="תז" name="tz" value={formData.tz} onChange={handleChange} />
        <TextField label="שם" name="name" value={formData.name} onChange={handleChange} />
        <TextField label="טלפון" name="phone" value={formData.phone} onChange={handleChange} />

        {/* Dynamic fields for education */}
        {formData.education.map((item, index) => (
          <TextField
            key={index}
            label={`השכלה #${index + 1}`}
            value={item}
            onChange={(e) => handleArrayChange(index, e.target.value, 'education')}
            multiline
            rows={3} // Adjust the number of rows as needed
          />
        ))}
        <Button onClick={() => handleAddToArray('education')} variant="contained" sx={{ mt: 1 }}>
          הוסף השכלה
        </Button>

        {/* Dynamic fields for experience */}
        {formData.experience.map((item, index) => (
          <TextField
            key={index}
            label={`ניסיון #${index + 1}`}
            value={item}
            onChange={(e) => handleArrayChange(index, e.target.value, 'experience')}
            multiline
            rows={3} // Adjust the number of rows as needed
          />
        ))}
        <Button onClick={() => handleAddToArray('experience')} variant="contained" sx={{ mt: 1 }}>
            הוסף ניסיון
        </Button>
      </Box>
     
    </form>
  );
};

export default ExpertEditForm;
