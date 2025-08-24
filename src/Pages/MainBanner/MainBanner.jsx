// import React from "react";
// import {
//   Box,
//   Typography,
//   Grid,
//   Avatar,
//   useTheme,
//   useMediaQuery,
// } from "@mui/material";
// import Btn from "../../CommonComponenet/CommonButtons/Btn";
// import CountUp from "react-countup";

// const stats = [
//   { label: "Years of Experience", value: 30, suffix: "+", color: "#FFC107" },
//   { label: "Numbers of Clinic", value: 15, suffix: "+", color: "#7C4DFF" },
//   { label: "Patient Believe!", value: 100, suffix: "%", color: "#00C853" },
// ];

// const DoctorCard = ({ img, bg }) => (
//   <Box
//     sx={{
//       borderRadius: 3,
//       overflow: "hidden",
//       backgroundColor: bg,
//       p: 2,
//       display: "flex",
//       justifyContent: "center",
//       alignItems: "center",
//       height: 200,
//     }}
//   >
//     <Avatar src={img} alt="doctor" sx={{ width: 120, height: 120 }} />
//   </Box>
// );

// export default function MainBanner() {
//   const theme = useTheme();
//   const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         px: { xs: 2, md: 8 },
//         py: 6,
//         display: "flex",
//         alignItems: "center",
//         marginTop: "3rem",
//       }}
//     >
//       <Grid
//         container
//         spacing={4}
//         alignItems="center"
//         direction={isSmall ? "column" : "row"}
//       >
//         {/* Left Column */}
//         <Grid item xs={12} md={6}>
//           <Typography variant="h9" fontWeight="bold" gutterBottom>
//             We help patients <br />
//             live a healthy, <br />
//             longer life.
//           </Typography>
//           <Typography
//             variant="body1"
//             color="text.secondary"
//             mb={3}
//             sx={{ width: { xs: "100%", md: 685 } }}
//           >
//             Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus
//             quaerat cumque fugit, perspiciatis cum nemo aperiam, aut quia earum
//             amet architecto, modi odio. Soluta unde ducimus perferendis?
//           </Typography>

//           <Btn label="Request an Appointment" />

//           {/* Stats */}
//           <Grid container spacing={3} mt={5}>
//             {stats.map((stat) => (
//               <Grid item xs={4} key={stat.label}>
//                 <Typography variant="h5" fontWeight="bold">
//                   <Box component="span" sx={{ color: stat.color }}>
//                     <CountUp end={stat.value} duration={1.5} />
//                     {stat.suffix}
//                   </Box>
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   {stat.label}
//                 </Typography>
//               </Grid>
//             ))}
//           </Grid>
//         </Grid>

//         {/* Right Column */}
//         <Grid item xs={12} md={6}>
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={6}>
//               <Box>
//                 <img
//                   src="/Images/doctor1.png"
//                   style={{ width: "100%", borderRadius: 8, height: "auto" }}
//                 />
//               </Box>
//             </Grid>

//             {/* This spacer Grid can be hidden on xs/sm screens */}
//             <Grid
//               item
//               xs={false}
//               sm={6}
//               display={{ xs: "none", sm: "block" }}
//             />

//             <Grid item xs={12} sm={6}>
//               <Box>
//                 <img
//                   src="/Images/doctor2.png"
//                   style={{
//                     width: "100%",
//                     marginTop: 30,
//                     borderRadius: 8,
//                     height: "auto",
//                   }}
//                 />
//               </Box>
//               <Box>
//                 <img
//                   src="/Images/doctor3.png"
//                   style={{
//                     width: "100%",
//                     marginTop: 30,
//                     borderRadius: 8,
//                     height: "auto",
//                   }}
//                 />
//               </Box>
//             </Grid>
//           </Grid>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// }

import React, { useContext } from 'react';
import {
  Box,
  Typography,
  Grid,
  Avatar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import Btn from '../../CommonComponenet/CommonButtons/Btn';
import CountUp from 'react-countup';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/Auth';

const stats = [
  { label: 'Years of Experience', value: 30, suffix: '+', color: '#FFC107' },
  { label: 'Numbers of Clinic', value: 15, suffix: '+', color: '#7C4DFF' },
  { label: 'Patient Believe!', value: 100, suffix: '%', color: '#00C853' },
];

const DoctorCard = ({ img, bg }) => (
  <Box
    sx={{
      borderRadius: 3,
      overflow: 'hidden',
      backgroundColor: bg,
      p: 2,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: 200,
    }}
  >
    <Avatar src={img} alt="doctor" sx={{ width: 120, height: 120 }} />
  </Box>
);

export default function MainBanner() {
  const Navigate = useNavigate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const { userLoggedIn } = useContext(AuthContext); // Assuming you provide this from context

  return (
    <Box
      sx={{
        minHeight: '100vh',
        px: { xs: 4, sm: 5, md: 6 },
        py: { xs: 4, sm: 5, md: 6 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mt: '3rem',
      }}
    >
      <Grid
        container
        spacing={4}
        alignItems="center"
        direction={isSmall ? 'column' : 'row'}
      >
        {/* Left Column */}
        <Grid item xs={12} md={6}>
          <Typography
            sx={{
              fontSize: {
                xs: '28px',
                sm: '65px',
                md: '2.2rem',
                lg: '5.2rem',
              },
              color: '#000',
              fontWeight: 'bold',
              lineHeight: 1.1,
              mb: 2,
            }}
          >
            We help patients
            <Box component="br" sx={{ display: { xs: 'none', sm: 'block' } }} />
            live a healthy,
            <Box component="br" sx={{ display: { xs: 'none', sm: 'block' } }} />
            longer life.
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            mb={3}
            sx={{ width: { xs: '100%', md: 685 } }}
          >
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus
            quaerat cumque fugit, perspiciatis cum nemo aperiam, aut quia earum
            amet architecto, modi odio. Soluta unde ducimus perferendis?
          </Typography>

          <Btn
            label="Request an Appointment"
            onClick={() => Navigate(userLoggedIn ? '/dashboard' : '/login')}
          />

          {/* Stats */}
          <Grid container spacing={2} mt={4}>
            {stats.map((stat) => (
              <Grid item xs={6} sm={4} key={stat.label}>
                <Typography variant="h5" fontWeight="bold">
                  <Box component="span" sx={{ color: stat.color }}>
                    <CountUp end={stat.value} duration={1.5} />
                    {stat.suffix}
                  </Box>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box>
                <img
                  src="/Images/doctor1.png"
                  alt="doctor1"
                  style={{
                    width: '100%',
                    borderRadius: 8,
                    height: 'auto',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box>
                <img
                  src="/Images/doctor2.png"
                  alt="doctor2"
                  style={{
                    width: '100%',
                    borderRadius: 8,
                    height: 'auto',
                    objectFit: 'cover',
                    marginTop: isMedium ? 0 : 30,
                  }}
                />
              </Box>
              <Box>
                <img
                  src="/Images/doctor3.png"
                  alt="doctor3"
                  style={{
                    width: '100%',
                    borderRadius: 8,
                    height: 'auto',
                    objectFit: 'cover',
                    marginTop: 30,
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
