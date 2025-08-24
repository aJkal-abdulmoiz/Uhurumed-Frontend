// import React from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Typography,
//   IconButton,
//   Avatar,
//   Button,
//   Grid,
//   Box,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import CancelBtn from "./CancelBtn";
// import moment from "moment/moment";

// const patientData = {
//   firstName: "Ashton",
//   lastName: "Cox",
//   email: "test@gmail.com",
//   mobile: "658543469",
//   birthday: "2011/04/25",
//   countryCode: "91",
//   sex: "Male",
//   doctor: {
//     name: "Tiger Nixon",
//     avatar: "https://i.pravatar.cc/150?img=12",
//   },
// };

// export default function PatientDetailsDialog({ open, onClose }) {
//   console.log("DSagsadgasdgas",open);
//   return (
//     <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm"
//      PaperProps={{
//             sx: {
//               borderRadius: "10px", // Set border radius
//               // Add padding (optional, adjust as needed)
//             },
//           }}
//     >
//       <DialogTitle
//         sx={{ px: 3, py: 2, display: "flex", justifyContent: "space-between" }}
//       >
//         <Box display="flex" alignItems="center" gap={2}>
//           <Avatar src={patientData.doctor.avatar} />
//           <Typography variant="h6">{open?.firstName} {open?.lastName}</Typography>
//         </Box>
//         <IconButton onClick={onClose}>
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>

//       <DialogContent dividers sx={{ px: 3 }}>
//         <Box sx={{}}>
//           {[
//             ["First Name", open.firstName],
//             ["Last Name", open?.lastName],
//             ["Email", open?.email],
//             ["Mobile No.", open?.phone],
//             ["Birthday", moment(open?.dateOfBirth).format("DD-MM-YYYY")],
//             ["Country Code", open?.countryCode],
//             ["Gender", open?.gender],

//           ].map(([label, value]) => (
//             <Grid
//               container
//               key={label}
//               sx={{
//                 bgcolor: "#f5f5f5",
//                 borderRadius: 1,
//                 px: 2,
//                 py: 1.5,
//                 mb: 1.2,
//                 alignItems: "center",
//                 justifyContent: "space-between",
//               }}
//             >
//               <Grid item xs={5} justifyContent={"space-between"}>
//                 <Typography variant="subtitle2" color="text.secondary">
//                   {label}
//                 </Typography>
//               </Grid>
//               <Grid item xs={7} justifyContent={"space-between"}>
//                 <Typography variant="subtitle2">{value}</Typography>
//               </Grid>
//             </Grid>
//           ))}
//         </Box>
//       </DialogContent>

//       {/* <DialogActions sx={{ px: 3, py: 2 }}>
//         <CancelBtn label="Close" onClick={onClose} />

//         <Button
//           onClick={onClose}
//           variant="contained"
//           sx={{ backgroundColor: '#14B8A6', '&:hover': { backgroundColor: '#14B8A6' }, color: '#fff' }}

//         >
//           Save Changes
//         </Button>

//       </DialogActions> */}
//     </Dialog>
//   );
// }

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
import moment from 'moment/moment';

export default function ViewDoctorAppointment({ open, onClose }) {
  console.log('DSagsadgasdgas', open);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'space-between' }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            src={
              open?.patient?.profilePic ||
              'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?ga=GA1.1.406090842.1746782723&semt=ais_hybrid&w=740'
            }
          />
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
            ['First Name', open.patient?.firstName],
            ['Last Name', open.patient?.lastName],
            ['Email', open?.patient?.email],
            ['Mobile No.', open?.patient?.phone],
            [
              'Birthday',
              moment(open?.patient?.dateOfBirth).format('DD-MM-YYYY'),
            ],
            ['Gender', open?.patient?.gender],
            ['Blood Group', open?.patient?.bloodGroup],
            ['Patient Weight', open?.patient?.weight],
            ['Patient Height', open?.patient?.height],
            ['Address', open?.patient?.address],
            [
              'follow Up Date',
              moment(open?.consultation?.followUpDate).format('lll'),
            ],
            ['Prescription', open?.consultation?.prescription],
            ['Notes', open?.consultation?.notes],
            // ["Specialization", open?.specialization],
            // ["Department", open?.department],
            // ["License Number", open?.licenseNumber],
            // ["Experience", open?.experience],
            // ["Consultation Fee", open?.consultationFee],
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
        <Box mt={2} sx={{ display: 'flex', justifyContent: 'center' }}>
          {open?.consultation?.diagnosis && (
            <a
              href={open?.consultation?.diagnosis}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Avatar
                src={
                  open?.consultation?.diagnosis?.toLowerCase().endsWith('.pdf')
                    ? 'https://cdn-icons-png.flaticon.com/512/337/337946.png' // Dummy PDF icon
                    : open?.consultation?.diagnosis ||
                      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJlks1ylqkT3dB4gIp_uVe6a-OfgOgH6RFFg&s'
                }
                // src={open?.consultation?.diagnosis}
                alt="User"
                sx={{
                  width: 220,
                  height: 120,
                  objectFit: 'fill',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              />
            </a>
          )}
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
