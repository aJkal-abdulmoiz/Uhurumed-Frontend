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

export default function DoctorView({ open, onClose }) {
  console.log('DSagsadgasdgas',open);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'space-between' }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar src={open?.profilePic ?? 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?ga=GA1.1.406090842.1746782723&semt=ais_hybrid&w=740'} />
          <Typography variant="h6">{open?.firstName} {open?.lastName}</Typography>
        </Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ px: 3 }}>
        <Box sx={{}}>
          {[
            ['First Name', open.firstName],
            ['Last Name', open?.lastName],
            ['Email', open?.email],
            ['Mobile No.', open.phone ? `+${open.phone}` : ''],
            ['Birthday', moment(open?.dateOfBirth).format('DD-MM-YYYY')],
            // ["Marital status", open?.meritalStatus],
            ['Gender', open?.gender],
            ['Blood Group', open?.bloodGroup],
            // ["Patient Weight", open?.weight],
            // ["Patient Height", open?.height],
            ['Address', open?.address],
            ['Medical History', open?.medicalHistory],
            ['Qualification', open?.qualification],
            ['Specialization', open?.specialization],
            ['Department', open?.department],
            ['License Number', open?.licenseNumber],
            ['Experience', open?.experience],
            ['Consultation Fee', open?.consultationFee],
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
