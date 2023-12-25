import { createTheme } from '@mui/material/styles';

// Define custom breakpoints if needed
const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
  },
};

// Define the color palette
const palette = {
  primary: {
    main: '#253291',
    light: '#5359af',
    dark: '#1b237e',
  },
  secondary: {
    main: '#f4f4f4',
    contrastText: '#333333',
  },
  background: {
    default: '#F0F2F5',
    paper: '#ffffff',
  },
  error: {
    main: '#ff0000',
  },
  // ... other colors
};

// Define typography settings
const typography = {
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  fontSize: 14,
  h1: {
    fontSize: '2.125rem',
  },
  button: {
    textTransform: 'none',
    fontWeight: 500,
  },
  // ... other typography settings
};

// Component customization
const components = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 4,
      },
    },
  },
  // ... other component customizations
};

// Create the theme with organized structure
const theme = createTheme({
  direction: 'rtl',
  palette,
  typography,
  breakpoints,
  spacing: 8,
  components,
});

export default theme;
