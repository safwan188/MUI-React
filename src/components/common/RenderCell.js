// RenderCell.js
import React, { useState } from 'react';
import { Button, Popover, List, ListItem, Typography } from '@mui/material';

const RenderCell1 = ({ label, content }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  if (label === 'נכסים' && Array.isArray(content)) {
    return (
      <div>
        <Button onClick={handlePopoverOpen}>
          {`${content.length} נכסים`}
        </Button>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <List>
            {content.map((property, index) => (
              <ListItem key={index}>
                <Typography>{`${property.cityName}, ${property.street}, ${property.propertyNumber}`}</Typography>
              </ListItem>
            ))}
          </List>
        </Popover>
      </div>
    );
  }
  return <Typography>{content}</Typography>;
};

export default RenderCell1;
