import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Avatar,
  Button,
  Grid,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CancelBtn from './CancelBtn';
import moment from 'moment';

const patientData = {
  firstName: 'Ashton',
  lastName: 'Cox',
  email: 'test@gmail.com',
  mobile: '658543469',
  birthday: '2011/04/25',
  maritalStatus: 'Maried',
  sex: 'Male',
  bloodGroup: 'A +',
  weight: '61',
  height: '41',
  address: 'lorem ipsum kwjhdkj jkdhjkfds',
  history: 'lorem ipsum kwjhdkj jkdhjkfds',
  doctor: {
    name: 'Tiger Nixon',
    avatar: 'https://i.pravatar.cc/150?img=12',
  },
};

export default function MedicalReportView({ open, onClose }) {
  console.log('DSagsadgasdgas', open);

  const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];

  const imageUrls = open?.fileUrls?.filter((url) =>
    imageExtensions.some((ext) => url.toLowerCase().endsWith(ext))
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'space-between' }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar src={open?.patient?.profilePic ?? patientData.doctor.avatar} />
          <Typography variant="h6">
            {open?.patient?.firstName} {open?.patient?.lastName}
          </Typography>
        </Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ px: 3 }}>
        <Box sx={{}}>
          {[
            ['Blood Group', open?.patient?.bloodGroup],
            ['Medical History', open?.patient?.medicalHistory],
            ['Address', open?.patient?.address],
            ['Record Type', open?.recordType],
            ['Title', open?.title],
            ['Description', open?.description],
          ].map(([label, value]) => (
            <Grid
              container
              key={label}
              sx={{
                bgcolor: '#f5f5f5',
                borderRadius: 1,
                px: 2,
                py: 1.5,
                mb: 1.2,
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Grid item xs={5} justifyContent={'space-between'}>
                <Typography variant="subtitle2" color="text.secondary">
                  {label}
                </Typography>
              </Grid>
              <Grid item xs={7} justifyContent={'space-between'}>
                <Typography variant="subtitle2">{value}</Typography>
              </Grid>
            </Grid>
          ))}
        </Box>
        <Typography
          style={{
            color: '#000',
            fontSize: '17px',
            paddingBottom: '12px',
            paddingTop: '10px',
          }}
        >
          Medical Report Documents
        </Typography>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {open?.fileUrl?.map((url, index) => {
            const isPdf = url.toLowerCase().endsWith('.pdf');

            return (
              <a
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={
                    isPdf
                      ? 'https://cdn-icons-png.flaticon.com/512/337/337946.png' // Dummy PDF icon
                      : url
                  }
                  alt={`preview-${index}`}
                  style={{
                    width: '150px',
                    height: '150px',
                    objectFit: 'cover',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                  }}
                />
              </a>
            );
          })}
        </div>
      </DialogContent>

      {/* <DialogActions sx={{ px: 3, py: 2 }}>
        <CancelBtn label="Close" onClick={onClose} />

        <Button
          onClick={onClose}
          variant="contained"
          sx={{ backgroundColor: '#14B8A6', '&:hover': { backgroundColor: '#14B8A6' }, color: '#fff' }}

        >
          Save Changes
        </Button>
       
      </DialogActions> */}
    </Dialog>
  );
}
