import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container, CssBaseline, Avatar } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import UserService from '../../api/UserService'
const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    UserService.login(username, password)
      .then(data => {
        console.log('Login successful', data);
        const token = data.token;
        localStorage.setItem('token', token);
        onLogin(username, password);
      })
      .catch(err => {
        if (err.response) {
          console.error('Login error', err.response);
          const status = err.response.status;
          if (status === 404) {
            setError('משתמש לא נמצא. אנא בדוק את שם המשתמש שלך.');
          } else if (status === 401) {
            setError('סיסמה שגויה. אנא נסה שוב.');
          } else if (status === 500) {
            setError('שגיאת שרת. אנא נסה שוב מאוחר יותר.');
          } else {
            setError('התחברות נכשלה. אנא בדוק את אישורי הכניסה שלך.');
          }
        } else {
          console.error('Login failed', err);
          setError('התחברות נכשלה. אנא בדוק את רשתך ונסה שוב.');
        }
      });
      
  };
  

  return (
    <Container component="main" maxWidth="xs" dir="rtl"> {/* Ensure RTL direction */}
    <CssBaseline />
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        bgcolor: 'white',
        py: 3,
        px: 3,
        borderRadius: 2,
        boxShadow: 3,
        color: 'primary.contrastText',
        direction: 'rtl' // Ensure RTL for the text fields
      }}
    >
         {/* Logo Image */}
        

         <img src="/Picture2.png" alt="Company Logo" style={{ maxWidth:'100%', height: 'auto', marginBottom: '15px' }} />
        
        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="שם משתמש"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ '.MuiInputBase-root': { bgcolor: 'background.paper' } }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="סיסמה"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ '.MuiInputBase-root': { bgcolor: 'background.paper' } }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary" // Deep blue button
            sx={{ mt: 3, mb: 2 }}
          >
            התחבר
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginForm;
