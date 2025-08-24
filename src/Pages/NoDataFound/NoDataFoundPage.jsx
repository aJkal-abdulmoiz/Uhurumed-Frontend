import React from 'react';
import { Box, Typography, Button, Container, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function NoDataFoundPage() {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        background: '#000',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        p: 3,
      }}
    >
      <Container maxWidth="sm">
        <img
          src="https://img.freepik.com/premium-photo/3d-rendering-error-404-text-with-screen-effects-technological-glitches_232104-10989.jpg?ga=GA1.1.1825963648.1747401291&semt=ais_hybrid&w=740"
          alt="404"
          style={{ maxWidth: '100%', marginBottom: '2rem' }}
        />
        <Typography variant="h5" sx={{ mb: 0, color: '#fff' }}>
          Page Not Found
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: '#fff' }}>
          Sorry, we couldn’t find the page you’re looking for.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/')}
          sx={{
            background: 'linear-gradient(45deg, #6b5bfa, #3e2bff)',
            borderRadius: 8,
            px: 4,
            py: 1.5,
            fontWeight: 600,
          }}
        >
          Back to Home
        </Button>
      </Container>
    </Box>
  );
}
