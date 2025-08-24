import React from 'react';
import { Box, Button } from '@mui/material';

const CancelBtn = ({label='login',onClick,backgroundColor}) => {
  return (
    <Box>
      <Button
        onClick={onClick}
        variant="contained"
        sx={{
          backgroundColor:backgroundColor ?? '#b2b2b2',
          fontWeight: 'bold',
          borderRadius: '10px',
          textTransform: 'none',
          padding: '6px 54px',
          '&:hover': {
            backgroundColor: '#b2b2b2',
          },
        }}
      >
        {label}
      </Button>
    </Box>
  );
};

export default CancelBtn;
