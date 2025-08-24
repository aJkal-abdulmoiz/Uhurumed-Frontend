import React from 'react';
import { Box, Button } from '@mui/material';

const Btn = ({label='login',onClick,backgroundColor,disabled,padding,type = 'button', ...props }) => {
  return (
    <Box>
      <Button
        onClick={onClick}
        variant="contained"
        disabled={disabled}
        sx={{
          // backgroundColor:backgroundColor ?? "#14B8A6",
          backgroundColor:backgroundColor ?? '#2e5ad5',
          fontWeight: 'bold',
          borderRadius: '9999px',
          textTransform: 'none',
          padding:padding ?? '6px 54px',
          '&:hover': {
            backgroundColor: '#0088CC',
          },
        }}
      >
        {label}
      </Button>
    </Box>
  );
};

export default Btn;
