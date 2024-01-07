import React, { useState } from 'react';
import { useMediaQuery, useTheme, IconButton } from '@mui/material';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'; // Import the Menu icon
import ReportIcon from '@mui/icons-material/Report';
import PeopleIcon from '@mui/icons-material/People';
import EngineeringIcon from '@mui/icons-material/Engineering';
import { useNavigate } from 'react-router-dom';
const drawerWidth = 170;

const Sidebar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  console.log(isMobile); // Should be true on mobile screens


  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'דוחות', icon: <ReportIcon />, path: '/reports' },
    { text: 'לקוחות', icon: <PeopleIcon />, path: '/customers' },
    { text: 'קבלנים', icon: <EngineeringIcon />, path: '/experts' },
  ];

  const handleListItemClick = (path) => {
    navigate(path);
    if (isMobile) setMobileOpen(false); // Close the drawer when a menu item is clicked on mobile
  };

  return (
    <>
    {isMobile && (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          p: 1,
          bgcolor: theme.palette.primary.main,
        }}
      >
        <IconButton
          onClick={handleDrawerToggle}
          sx={{ color: 'white' }}
        >
          <MenuIcon />
        </IconButton>
      </Box>
    )}

    <Drawer
    variant={isMobile ? 'temporary' : 'permanent'}
    open={isMobile ? mobileOpen : true}
    onClose={handleDrawerToggle}
    sx={{
      width: drawerWidth,
      '& .MuiDrawer-paper': {
        width: drawerWidth,
        boxSizing: 'border-box',
        backgroundColor: theme.palette.primary.main,
        color: '#ffffff',
      },
    }}
  >
      
      <Box
        sx={{
          p: 3,
          pt: 5,
          textAlign: 'center',
          bgcolor: theme.palette.primary.main,
          color: '#ffffff'
        }}
      >
        <Typography variant="h6" component="div" sx={{ color: 'secondary.main' }}>
          <img src="/logo.png" alt="Company Logo" style={{ width: '100%', height: 'auto', marginBottom: '15px' }} />
        </Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem button key={item.text} onClick={() => handleListItemClick(item.path)}>
            <ListItemIcon sx={{ color: 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} sx={{ '.MuiTypography-body1': { fontSize: '1.5rem' } }} />
          </ListItem>
        ))}
      </List>
    </Drawer>
    </>
  );
};

export default Sidebar;