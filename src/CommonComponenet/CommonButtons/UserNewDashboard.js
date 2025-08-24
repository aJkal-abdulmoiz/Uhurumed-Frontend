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

const UserNewDashboard = () => {
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

  const getActivatedPlans = async () => {
    const token = window.localStorage.getItem('UhuruMedToken');
    setLoading(true);

    try {
      const response = await axios({
        method: 'GET',
        url: ApiConfig.activePlan,
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      console.log('asfdadfds', response?.data?.success);
      if (response?.data?.error === 'false') {
        setLoading(false);
        setChatList(response?.data?.data);

        // setTotalPages(response?.data?.data?.[0]?.count);
      }
    } catch (error) {
      setChatList([]);
      setLoading(false);
      console.log('errorerror', error);

      return error?.response;
    }
  };

  useEffect(() => {
    getActivatedPlans();
  }, []);

  return (
    <Box
      sx={{
        borderRadius: 3,
        p: 3,
        backgroundImage: 'url("Images/banner.svg")', // Place image in public/ folder
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
          Dear, {userData?.firstName} {userData?.lastName}
        </Typography>

        {chatList && Object.keys(chatList)?.length > 0 && (
          <Box
            mt={3}
            sx={{
              border: '1px solid #eeeeee60',
              borderRadius: 3,
              p: 3,
              backgroundColor: '#ffffff39',
              boxShadow: 1,
              width: '100%',
              maxWidth: 900,
              mx: 'auto',
              // width: {
              //   xs: 'auto',   // wrap on small screens
              //   sm: 'auto' ,
              //   md:'430px' // no wrap from small screens and up
              // }

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
              <Grid container alignItems="center" spacing={3} sx={{
                flexWrap: {
                  xs: 'wrap',   // wrap on small screens
                  sm: 'nowrap'  // no wrap from small screens and up
                }
              }}>
                <Grid item xs={12} sm={4} md={3}>
                  <Box>
                    <Chip
                      label={chatList?.name}
                      color="primary"
                      sx={{
                        backgroundColor: '#E6F0FF',
                        color: '#0057FF',
                        fontWeight: 'bold',
                        textTransform: 'capitalize',
                      }}
                    />
                  </Box>
                </Grid>

                {/* Expiration */}
                <Grid item xs={12} sm={4} md={3}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    style={{ color: '#022562' }}
                  >
                    Expiration date
                  </Typography>
                  <Typography
                    style={{ color: '#fff', fontSize: '14px' }}
                    fontWeight={500}
                  >
                    {moment(chatList?.endDate).format('ll')}
                  </Typography>
                </Grid>

                {/* Payment method */}
                <Grid item xs={12} sm={4} md={3}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    style={{ color: '#022562' }}
                  >
                    Payment method
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography
                      style={{ color: '#fff', fontSize: '14px' }}
                      fontWeight={500}
                    >
                      PayStack
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
        )}
      </Box>
    </Box>
  );
};

export default UserNewDashboard;