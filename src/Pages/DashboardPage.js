import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function DashboardPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography>
        This is the dashboard page. You can display key metrics or widgets here.
      </Typography>
    </Box>
  );
}

export default DashboardPage;
