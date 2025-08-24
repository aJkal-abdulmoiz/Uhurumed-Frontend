import { Box, Container, Typography } from '@mui/material';
import React from 'react';
import Btn from '../../CommonComponenet/CommonButtons/Btn';

const GetUrgent = () => {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: 'flex',
          justifyContent: { xs: 'center', md: 'space-between' },
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          marginTop: '5rem',
          padding: '0 1rem',
          gap: 3,
          textAlign: { xs: 'center', md: 'left' },
        }}
      >
        <Box sx={{ marginLeft: { xs: '0px', md: '-1.4rem' } }}>
          <Typography
            sx={{
              fontSize: { xs: '1.5rem', md: '2rem' },
              color: '#000',
              fontWeight: 700,
            }}
          >
            Already a UhuruCare Member?
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: '1rem', md: '1.2rem' },
              color: '#000',
              fontWeight: 500,
            }}
          >
            Get your free annual physical, exclusive access to top specialists,
            and continuous care.
          </Typography>
        </Box>
        <Box>
          <a
            href="https://wa.me/420775151097"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Box sx={{ borderRadius: '9999px', overflow: 'hidden' }}>
              <Btn label="Get Urgent Care Now" backgroundColor={'#2e5ad5'} />
            </Box>
          </a>
        </Box>
      </Box>
    </Container>
  );
};

export default GetUrgent;
