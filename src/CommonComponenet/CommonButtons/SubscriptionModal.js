import React, { useState } from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import Btn from './Btn';
import { useNavigate } from 'react-router-dom';

const SubscriptionModal = ({ open, onClose, onPurchase }) => {
  const navigate = useNavigate();

  return (
    <Modal open={open}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography
          variant="h6"
          mb={2}
          textAlign="center"
          color="#0077CC"
          fontSize="20px"
          fontWeight={'bold'}
        >
          Subscription Required
        </Typography>
        <Typography
          variant="body1"
          mb={3}
          textAlign="center"
          color="#000"
          fontSize="17px"
        >
          Please purchase a subscription to continue accessing hospital
          services.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          {/* <Button variant="contained" color="primary" onClick={onPurchase}>
            Okay
          </Button> */}
          <Btn label="Okay" onClick={() => navigate('/user-subscription')} />
        </Box>
      </Box>
    </Modal>
  );
};

export default SubscriptionModal;
