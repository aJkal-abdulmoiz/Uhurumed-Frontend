import { Box, Container, Typography } from '@mui/material';
import React from 'react';
import Btn from '../../CommonComponenet/CommonButtons/Btn';
import { useNavigate } from 'react-router-dom';

export const Members = () => {
  const navigate = useNavigate();
  const handleLogin = () =>{
    navigate('/login');
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ backgroundColor: '#f7fbfc', borderRadius: '10px' }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',

          alignItems: 'center',
          gap: { xs: '0.8rem', sm: '1rem' },
          flexDirection: 'column',
          marginTop: { xs: '3rem', sm: '5rem' },
          px: { xs: 2, sm: 0 }, // horizontal padding on small devices
          maxWidth: 600, // optional max width for better readability on large screens
          mx: 'auto', // center horizontally
          textAlign: 'center',
          py:{xs:4,md:3}
          // center text for small screens
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: '1.5rem', sm: '2rem' },
            color: '#000',
            fontWeight: 700,
          }}
        >
          Already a UhuruCare Member?
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: '1rem', sm: '1.2rem' },
            color: '#000',
            fontWeight: 500,
          }}
        >
          Get your free annual physical, exclusive access to top specialists,
          and continuous care.
        </Typography>
        <Box sx={{ mt: 1.5}}>
          <Box sx={{ borderRadius: '9999px', overflow: 'hidden' }}>
            <Btn label="Get Urgent Care Now" backgroundColor={'#2e5ad5'} />
          </Box>
        </Box>
      </Box>
    </Container>
  );
};
