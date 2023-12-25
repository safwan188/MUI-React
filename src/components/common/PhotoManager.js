import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, IconButton, Button } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';

const PhotoManager = ({
  photoList,
  photoNames,
  newPhotos,
  onPhotoSelect,
  onRemovePhoto,
  uploadButtonLabel,
  isFindingPhotos = false
}) => {
  return (
    <>
      <List sx={{ display: 'flex', flexWrap: 'wrap' }}>
        {photoList.map((photoUrl, index) => (
          <ListItem key={`${isFindingPhotos ? 'finding-' : 'client-'}${index}`} sx={{ width: 'auto', m: 1 }}>
            <ListItemText primary={photoNames[index]} />
            <ListItemIcon>
              <img src={photoUrl} alt={`Photo ${index}`} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
            </ListItemIcon>
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete" onClick={() => onRemovePhoto(photoNames[index], index, true)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
        {newPhotos.map((photo, index) => (
          <ListItem key={`${isFindingPhotos ? 'new-finding-' : 'new-client-'}${index}`} sx={{ width: 'auto', m: 1 }}>
            <ListItemText primary={photo.name} />
            <ListItemIcon>
              <img src={URL.createObjectURL(photo)} alt={`New Photo ${index}`} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
            </ListItemIcon>
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete" onClick={() => onRemovePhoto(photo.name, index, false)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Button variant="contained" component="label" sx={{ mt: 2, mb: 2 }}>
        {uploadButtonLabel}
        <input type="file" hidden accept="image/*" multiple onChange={onPhotoSelect} />
        <PhotoCamera sx={{ ml: 1 }} />
      </Button>
    </>
  );
};

export default PhotoManager;
