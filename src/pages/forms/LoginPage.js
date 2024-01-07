import React from 'react';
import LoginForm from '../../components/forms/LoginForm';
import { Box, CssBaseline, createTheme, ThemeProvider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const handleLogin = (username, password) => {
    console.log('Login Credentials:', username, password);
    navigate('/reports');
  };

  return (
      <Box
        sx={{
          
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',

          justifyContent: 'center',

          backgroundImage: 'url(/tt.png)', // Replace with your desired background image
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <CssBaseline />
        <LoginForm onLogin={handleLogin} />
      </Box>
  );
};

export default LoginPage;
