import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { LineChart, Line } from 'recharts';

// // Example chart data
// const dummyData = Array.from({ length: 10 }, (_, i) => ({
//   value: Math.floor(10 + Math.random() * 10),
// }));

const IconBox = styled(Box)(({ theme, bgcolor }) => ({
  backgroundColor: bgcolor,
  width: 40,
  height: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 10,
  boxShadow: theme.shadows[3],
  color: '#fff',
}));

const ChartContainer = styled(Box)(({ color }) => ({
  height: 40,
  width: '100%',
  overflow: 'hidden',
  paddingTop: 10,
  '.recharts-line': {
    stroke: color,
    strokeWidth: 2,
  },
  '.recharts-area-area': {
    fill: color,
    fillOpacity: 0.1,
  },
}));

const DashboardCard = ({ icon, title, value, color, data = '' }) => {
  return (
    <Paper elevation={2}  sx={{
      p: 2,
      borderRadius: 3,
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 6, // or any higher elevation
      },
    }}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <IconBox bgcolor={color}>{icon}</IconBox>
        <Box textAlign="right">
          <Typography variant="subtitle2">{title}</Typography>
          <Typography variant="h6">{value}</Typography>
        </Box>
      </Box>
      <ChartContainer color={color}>
        <LineChart width={200} height={50} data={data}>
          <Line type="monotone" dataKey="value" stroke={color} dot={false} />
        </LineChart>
      </ChartContainer>
    </Paper>
  );
};

export default DashboardCard;
