

import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  CircularProgress,
  Skeleton,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { AuthContext } from '../../Context/Auth';
import axios from 'axios';
import ApiConfig from '../../ApiConfig/ApiConfig';
// import LungsIcon from '@mui/icons-material/Lungs'; // Optional custom icon
import { FaCircle } from 'react-icons/fa6';
import PaymentIcon from '@mui/icons-material/Payment'; // Optional icon if you don't use PayPal logo
import { Link } from 'react-router-dom';
import moment from 'moment';

const DoctorNewSection = ({ allDashData }) => {
  const auth = useContext(AuthContext);
  const userData = auth.userData;
  const [loading, setLoading] = useState(false);
  const [chatList, setChatList] = useState({});
  console.log('adgsadgs', chatList);
  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return 'Good Morning';
    else if (hour < 17) return 'Good Afternoon';
    else return 'Good Evening';
  };

  return (
    <Box
      sx={{
        borderRadius: 3,
        p: 3,
        backgroundImage: 'url("Images/banner3.svg")', // Place image in public/ folder
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        minHeight: 250,
        color: '#fff',
      }}
    >
      {/* Left Section */}
      <Box sx={{ maxWidth: 400 }}>
        <Typography variant="subtitle1"> {getGreeting()},</Typography>
        <Typography variant="h4" fontWeight="bold" style={{ color: '#fff' }}>
          Dr. {userData?.firstName} {userData?.lastName}
        </Typography>
        <Typography
          variant="body1"
          style={{ color: '#fff', fontSize: '15px' }}
          mt={1}
        >
          Your schedule today.
        </Typography>

        <Box
          mt={3}
          sx={{
            border: '1px solid #eeeeee60',
            borderRadius: 3,
            p: 2,
            backgroundColor: '#ffffff39',
            boxShadow: 1,
            width: '100%',
            maxWidth: 900,
            mx: 'auto',
          }}
        >
          {loading ? (
            <Grid container spacing={3}>
              {/* Simulate skeletons for each grid column */}

              <Grid item xs={12} sm={3}>
                <Skeleton variant="circular" width={50} height={50} />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Skeleton variant="text" width={100} />
                <Skeleton variant="text" width="80%" />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Skeleton variant="text" width={120} />
                <Skeleton variant="text" width="70%" />
              </Grid>
            </Grid>
          ) : (
            <Grid container alignItems="center" spacing={3} flexWrap="wrap">
              <Grid item xs={12} sm={3}>
                <img src="https://cdn-icons-png.freepik.com/256/8422/8422463.png?uid=R192298274&ga=GA1.1.406090842.1746782723&semt=ais_hybrid" style={{width:'50px',height:'50px'}} />
              </Grid>

              {/* Expiration */}
              <Grid item xs={12} sm={3} md={3}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  style={{ color: '#022562',paddingBottom:'10px',fontSize:'16px'}}
                >
                  Appointment
                </Typography>
                <Typography
                  style={{ color: '#fff', fontSize: '22px' }}
                  fontWeight={700}
                >
                  {allDashData?.appointmentCount ?? 0}
                </Typography>
              </Grid>

              {/* Payment method */}
              <Grid item xs={12} sm={3} md={3}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  style={{ color: '#022562',paddingBottom:'10px',fontSize:'16px' }}
                >
                  Earning
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography
                    style={{ color: '#fff', fontSize: '22px', }}
                    fontWeight={700}
                  >
                    {allDashData?.totalEarning ?? 0}
                  </Typography>
                </Box>
              </Grid>

              {/* Price */}
              {/* <Grid item xs={12} sm={3}>
            <Typography variant="body2" color="text.secondary">
               Duration
              </Typography>
                <Typography variant="body2" component="span" fontWeight={400}>
                {chatList?.duration} Days
                </Typography>
            </Grid> */}
            </Grid>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default DoctorNewSection;
