import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Box, Typography } from '@mui/material';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import theme from '../../theme';
import ReportIcon from '@mui/icons-material/Report';
import PeopleIcon from '@mui/icons-material/People';
import EngineeringIcon from '@mui/icons-material/Engineering';
import RequestPageIcon from '@mui/icons-material/RequestPage';

const drawerWidth = 170;

const Sidebar = () => {
  const navigate = useNavigate();
  const menuItems = [
    { text: 'דוחות', icon: <ReportIcon />, path: '/reports' },
    { text: 'לקוחות', icon: <PeopleIcon />, path: '/customers' },
    { text: 'קבלנים', icon: <EngineeringIcon />, path: '/experts' },
    { text: 'בקשות', icon: <RequestPageIcon />, path: '/expertrequests' },
  ];

  const handleListItemClick = (path) => {
    navigate(path);
  };
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        overflowY: 'hidden', // Hide vertical scrollbar
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: theme.palette.primary.main,
          color: '#ffffff',
          maxHeight: '100vh',
          overflowY: 'hidden', // Hide vertical scrollbar
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
  );
};

export default Sidebar;
