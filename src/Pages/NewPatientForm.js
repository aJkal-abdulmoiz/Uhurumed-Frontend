import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Avatar,
} from '@mui/material';

const PersonalInformationForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    dob: '',
    maritalStatus: '',
    sex: '',
    bloodGroup: '',
    weight: '',
    height: '',
    address: '',
    history: '',
    image: '',
  });

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: URL.createObjectURL(file) });
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1200px', mx: 'auto' }}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Personal Information
      </Typography>

      <Grid container spacing={3}>
        {/* Image Upload */}
        <Grid item xs={12} md={3}>
          <Box
            sx={{
              width: '100%',
              height: 200,
              borderRadius: 2,
              border: '1px dashed #ccc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              cursor: 'pointer',
              bgcolor: '#f9f9ff',
            }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ opacity: 0, width: '100%', height: '100%', position: 'absolute', cursor: 'pointer' }}
            />
            {formData.image ? (
              <Avatar src={formData.image} sx={{ width: 120, height: 120 }} />
            ) : (
              <Typography align="center" color="textSecondary">
                Drop Image Here Or Click To Upload
              </Typography>
            )}
          </Box>
        </Grid>

        {/* Form Fields */}
        <Grid item xs={12} md={9}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="First Name" value={formData.firstName} onChange={handleChange('firstName')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Birthday" type="date" InputLabelProps={{ shrink: true }} value={formData.dob} onChange={handleChange('dob')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Last Name" value={formData.lastName} onChange={handleChange('lastName')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Marital Status</InputLabel>
                <Select value={formData.maritalStatus} onChange={handleChange('maritalStatus')} label="Marital Status">
                  <MenuItem value="single">Single</MenuItem>
                  <MenuItem value="married">Married</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Email" type="email" value={formData.email} onChange={handleChange('email')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Sex</InputLabel>
                <Select value={formData.sex} onChange={handleChange('sex')} label="Sex">
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Mobile No." value={formData.mobile} onChange={handleChange('mobile')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Blood Group</InputLabel>
                <Select value={formData.bloodGroup} onChange={handleChange('bloodGroup')} label="Blood Group">
                  <MenuItem value="A+">A+</MenuItem>
                  <MenuItem value="A-">A-</MenuItem>
                  <MenuItem value="B+">B+</MenuItem>
                  <MenuItem value="B-">B-</MenuItem>
                  <MenuItem value="AB+">AB+</MenuItem>
                  <MenuItem value="AB-">AB-</MenuItem>
                  <MenuItem value="O+">O+</MenuItem>
                  <MenuItem value="O-">O-</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Patient Weight" value={formData.weight} onChange={handleChange('weight')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Patient Height" value={formData.height} onChange={handleChange('height')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Address" multiline rows={3} value={formData.address} onChange={handleChange('address')} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Patient History" multiline rows={3} value={formData.history} onChange={handleChange('history')} />
            </Grid>
          </Grid>
        </Grid>

        {/* Save Button */}
        <Grid item xs={12} textAlign="right">
          <Button variant="contained" sx={{ px: 4 }} color="primary">
            Save
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PersonalInformationForm;
