import React from 'react';
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';

const SearchAppointmentBar = () => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box p={2} bgcolor="white" borderRadius={2} boxShadow={1}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by patient's name or phone number"
            size="small"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            select
            defaultValue=""
            placeholder="Search by city"
          >
            <MenuItem value="">Select City</MenuItem>
            <MenuItem value="newyork">New York</MenuItem>
            <MenuItem value="london">London</MenuItem>
            {/* Add more as needed */}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="05/07/2025 - 05/07/2025"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Button
            variant="contained"
            fullWidth={isSm}
            sx={{ height: '40px', backgroundColor: '#4F5FFF', color: 'white' }}
          >
            New Appointment
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SearchAppointmentBar;
