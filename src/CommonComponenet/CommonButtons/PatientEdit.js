import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  MenuItem,
  Typography,
  Button,
  IconButton,
  Avatar,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const maritalOptions = ['Single', 'Married', 'Divorced'];
const sexOptions = ['Male', 'Female', 'Other'];
const bloodGroups = ['A +', 'A -', 'B +', 'B -', 'O +', 'O -', 'AB +', 'AB -'];

export default function PatientEdit({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">Angelica Ramos</Typography>
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Left Column - Avatar Upload */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                width: '100%',
                height: '100%',
                minHeight: 470,
                bgcolor: '#f5f5fc',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                border: '2px dashed #ccc',
                cursor: 'pointer',
                p: 2,
              }}
            >
              <Avatar
                src=""
                sx={{ width: 100, height: 100, mb: 2 }}
              />
              <Typography align="center" fontWeight="500">
                Drop Image Here Or Click<br />To Upload.
              </Typography>
            </Box>
          </Grid>

          {/* Right Column - Form Fields */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              {[
                { label: 'First Name' },
                { label: 'Birthday', type: 'date', shrink: true },
                { label: 'Last Name' },
                { label: 'Marital Status', select: true, options: maritalOptions },
                { label: 'Email' },
                { label: 'Sex', select: true, options: sexOptions },
                { label: 'Mobile No.' },
                { label: 'Blood Group', select: true, options: bloodGroups },
                { label: 'Patient Weight' },
                { label: 'Patient Height' },
              ].map((field, index) => (
                <Grid key={index} item xs={12} sm={6}>
                  <TextField
                    label={field.label}
                    fullWidth
                    select={field.select || false}
                    type={field.type || 'text'}
                    InputLabelProps={field.shrink ? { shrink: true } : undefined}
                  >
                    {field.select &&
                      field.options.map((option) => (
                        <MenuItem key={option} value={option}>{option}</MenuItem>
                      ))}
                  </TextField>
                </Grid>
              ))}

              <Grid item xs={12} sm={6}>
                <TextField label="Address" fullWidth multiline minRows={3} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Patient History" fullWidth multiline minRows={3} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="contained" color="error">
          Close
        </Button>
        <Button variant="contained" color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
