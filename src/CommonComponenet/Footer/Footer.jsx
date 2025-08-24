// import React from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   Link,
//   Grid,
//   Container,
//   IconButton,
// } from "@mui/material";
// import { Facebook, Twitter, Instagram } from "@mui/icons-material";
// import { FaFacebookF } from "react-icons/fa";
// import WhatsAppIcon from "@mui/icons-material/WhatsApp";
// import { Link as RouterLink } from "react-router-dom";
// const items = [
//   { label: "Privacy Policy", to: "/privacy" },
//   { label: "Terms and Conditions", to: "/terms" },
//   { label: "FAQs", to: "" },
// ];
// const Footer = () => {
//   return (
//     <Box
//       sx={{
//         position: "relative",
//         backgroundColor: "#003366",
//         color: "#ffffff",
//         py: { xs: 5, md: 8 },
//         overflow: "hidden",
//         width: "100%",
//       }}
//     >
//       {/* Background Circles */}
//       <Box
//         sx={{
//           position: "absolute",
//           width: 300,
//           height: 300,
//           borderRadius: "50%",
//           background: "linear-gradient(to bottom, #0077CC, #0077CC)",
//           bottom: "-100px",
//           left: "20%",
//           opacity: 0.3,
//         }}
//       />
//       <Box
//         sx={{
//           position: "absolute",
//           width: 120,
//           height: 120,
//           borderRadius: "50%",
//           // background: "linear-gradient(to bottom, #0077CC, #0077CC)",
//           background:"#fff",
//           bottom: "40px",
//           right: "5%",
//           opacity: 0.3,
//         }}
//       />
//       <Box
//         sx={{
//           position: "absolute",
//           width: 180,
//           height: 180,
//           borderRadius: "50%",
//           background: "linear-gradient(to bottom,  #0077CC, #0077CC )",
//           top: "-80px",
//           right: "-80px",
//           opacity: 0.3,
//         }}
//       />

//       {/* Main Footer Content */}
//       <Container maxWidth="lg">
//         <Grid container spacing={6} justifyContent="space-between">
//           {/* Left Column */}
//           <Grid item xs={12} md={4}>
//             <Box display="flex" alignItems="center" mb={2}>
//               <Box
//                 component="img"
//                 src="Images/transparentUhuru.png"
//                 alt="UhuruCare Logo"
//                 sx={{ width: 60, height: 60, mr: 1 }}
//               />
//               <Typography variant="h5" fontWeight="bold" color="#fff">
//                 UhuruMed
//               </Typography>
//             </Box>
//             <Typography variant="body2" color="#fff" mb={2}>
//               Join UhuruMed’s affordable private health insurance plans,
//               specially<br /> designed for Ghanaians. Experience freedom, empowerment,
//               and<br /> a healthier community today.
//             </Typography>
//             <Box sx={{ display: "flex", gap: "12px", mt: 1 }}>
//               <IconButton
//                 href="https://www.facebook.com/"
//                 target="_blank"
//                 sx={{ background: "#fff", width: 40, height: 40 }}
//               >
//                 <FaFacebookF style={{ color: "#03A7E5" }} />
//               </IconButton>
//               <IconButton
//                 href="https://x.com/"
//                 target="_blank"
//                 sx={{ background: "#fff", width: 40, height: 40 }}
//               >
//                 <Twitter fontSize="small" sx={{ color: "#03A7E5" }} />
//               </IconButton>
//               <IconButton
//                 href="https://www.instagram.com/"
//                 target="_blank"
//                 sx={{ background: "#fff", width: 40, height: 40 }}
//               >
//                 <Instagram fontSize="small" sx={{ color: "#03A7E5" }} />
//               </IconButton>
//               <IconButton
//                 href="https://web.whatsapp.com/"
//                 target="_blank"
//                 sx={{ background: "#fff", width: 40, height: 40 }}
//               >
//                 <WhatsAppIcon fontSize="small" sx={{ color: "#03A7E5" }} />
//               </IconButton>
//             </Box>
//             {/* <Typography variant="caption" mt={2} color="#fff" display="block">
//               ©2025 UhuruCare
//             </Typography> */}
//           </Grid>

//           {/* Center Links */}
//           <Grid item xs={6} sm={4} md={3}>
//             <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
//               Quick Links
//             </Typography>
//             {/* {["Home", "About Us", "Specialties"].map((item) => (
//               <Link
//                 href="/"
//                 key={item}
//                 underline="none"
//                 color="#fff"
//                 display="block"
//                 sx={{ mb: 0.8, fontSize: "18px" }}
//               >
//                 {item}
//               </Link>
//             ))} */}
//             <Link
//               href="/"
//               key={"item"}
//               underline="none"
//               color="#fff"
//               display="block"
//               sx={{ mb: 0.8, fontSize: "18px" }}
//             >
//               Home
//             </Link>
//             <Link
//               href="/about"
//               key={"item"}
//               underline="none"
//               color="#fff"
//               display="block"
//               sx={{ mb: 0.8, fontSize: "18px" }}
//             >
//               How it Works
//             </Link>
//             <Link
//               href="/expert"
//               key={"item"}
//               underline="none"
//               color="#fff"
//               display="block"
//               sx={{ mb: 0.8, fontSize: "18px" }}
//             >
//               Specialties
//             </Link>
//             <Link
//               href="/contact"
//               key={"item"}
//               underline="none"
//               color="#fff"
//               display="block"
//               sx={{ mb: 0.8, fontSize: "18px" }}
//             >
//               Contact Us
//             </Link>
//           </Grid>

//           {/* Right Links */}

//           <Grid item xs={6} sm={4} md={3}>
//             <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
//               Company
//             </Typography>
//             {items.map(({ label, to }) => (
//               <Link
//                 key={label}
//                 component={RouterLink}
//                 to={to}
//                 underline="hover"
//                 color="#fff"
//                 sx={{ display: "block", mb: 0.8, fontSize: "18px" }}
//               >
//                 {label}
//               </Link>
//             ))}
//           </Grid>
//         </Grid>
//       </Container>
//     </Box>
//   );
// };

// export default Footer;

import React from 'react';
import {
  Box,
  Typography,
  Button,
  Link,
  Grid,
  Container,
  IconButton,
} from '@mui/material';
import { Facebook, Twitter, Instagram } from '@mui/icons-material';
import { FaFacebookF } from 'react-icons/fa';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Link as RouterLink } from 'react-router-dom';

const items = [
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms and Conditions', to: '/terms' },
  // { label: "FAQs", to: "" },
];

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        color: '#000',
        py: { xs: 5, md: 8 },
        borderTop: '1px solid #e0e0e0',
        mt: 6,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6} justifyContent="space-between">
          {/* Left Column */}
          <Grid item xs={12} md={4}>
            <Box display="flex" alignItems="center" mb={2}>
              <Box
                component="img"
                src="Images/transparentUhuru.png"
                alt="UhuruCare Logo"
                sx={{ width: 75, height: 75, mr: 1 }}
              />
              <Typography variant="h1" fontWeight="bold" color="#000">
                UhuruMed
              </Typography>
            </Box>
            {/* <Typography variant="body2" color="text.secondary" mb={2}>
              Join UhuruMed’s affordable private health insurance plans,
              specially designed for Ghanaians. Experience freedom, empowerment,
              and a healthier community today.
            </Typography> */}
            <Box sx={{ display: 'flex', gap: '12px', mt: 1 }}>
              <IconButton
                href="https://www.facebook.com/"
                target="_blank"
                sx={{
                  background: '#000',
                  color: '#fff',
                  width: 40,
                  height: 40,
                  '&:hover': {
                    backgroundColor: '#000',
                    color: '#fff',
                  },
                }}
              >
                <FaFacebookF />
              </IconButton>
              <IconButton
                href="https://x.com/"
                target="_blank"
                sx={{
                  background: '#000',
                  color: '#fff',
                  width: 40,
                  height: 40,
                  '&:hover': {
                    backgroundColor: '#000',
                    color: '#fff',
                  },
                }}
              >
                <Twitter fontSize="small" />
              </IconButton>
              <IconButton
                href="https://www.instagram.com/"
                target="_blank"
                sx={{
                  background: '#000',
                  color: '#fff',
                  width: 40,
                  height: 40,
                  '&:hover': {
                    backgroundColor: '#000',
                    color: '#fff',
                  },
                }}
              >
                <Instagram fontSize="small" />
              </IconButton>
              <IconButton
                href="https://web.whatsapp.com/"
                target="_blank"
                sx={{
                  background: '#000',
                  color: '#fff',
                  width: 40,
                  height: 40,
                  '&:hover': {
                    backgroundColor: '#000',
                    color: '#fff',
                  },
                }}
              >
                <WhatsAppIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>

          {/* Center Links */}
          <Grid item xs={6} sm={4} md={3}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom fontSize="22px">
              Quick Links
            </Typography>
            {[
              { label: 'Home', to: '/' },
              { label: 'About Us', to: '/about' },
              { label: 'Specialist', to: '/specialist' },
              { label: 'Contact Us', to: '/contact' },
            ].map(({ label, to }) => (
              <Link
                key={label}
                href={to}
                underline="hover"
                color="text.primary"
                display="block"
                sx={{ mb: 1, fontSize: '17px' , fontWeight: 500,  fontFamily: '\'Poppins\', sans-serif', }}
              >
                {label}
              </Link>
            ))}
          </Grid>

          {/* Right Links */}
          <Grid item xs={6} sm={4} md={3}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom fontSize="22px">
              Company
            </Typography>
            {items.map(({ label, to }) => (
              <Link
                key={label}
                component={RouterLink}
                to={to}
                underline="hover"
                color="text.primary"
                display="block"
                sx={{ mb: 1, fontSize: '17px', fontWeight: 500,  fontFamily: '\'Poppins\', sans-serif',  }}
              >
                {label}
              </Link>
            ))}
          </Grid>
        </Grid>

        <Box textAlign="center" mt={6}>
          <Typography variant="caption" color="text.secondary">
            ©2025 UhuruMed. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
