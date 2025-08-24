import React, { useContext, useEffect, useState } from 'react';
import { Grid, Box, Container, Typography } from '@mui/material';
import DashboardCard from './DashboardCard';
import {
  SentimentSatisfied,
  ContentCut,
  PersonAdd,
  LocalAtm,
} from '@mui/icons-material';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import DashboardSection from './DashboardSection';
import Appointment from '../../Pages/Appointment/Appointment';
import { AuthContext } from '../../Context/Auth';
import axios from 'axios';
import ApiConfig from '../../ApiConfig/ApiConfig';
import AppointmentUserlist from '../../Pages/AppointmentUserlist';
import AppointMentDash from '../../Pages/AppointMentDash';
import DashboardAppointment from '../../Pages/DashboardAppointment';
import AdminAppointmentSec from '../../Pages/AdminAppointmentSec';

const cardData = [
  {
    title: 'Appointments',
    value: '650',
    icon: <SentimentSatisfied />,
    color: '#7B61FF',
  },
  {
    title: 'Operations',
    value: '54',
    icon: <ContentCut />,
    color: '#FF6B2C',
  },
  {
    title: 'New Patients',
    value: '129',
    icon: <PersonAdd />,
    color: '#3DAA54',
  },
  {
    title: 'Earning',
    value: '$20,125',
    icon: <LocalAtm />,
    color: '#0E9AF7',
  },
];

const DashboardOverView = () => {
  const auth = useContext(AuthContext);
  const userData = auth.userData;
  const [loading, setLoading] = useState(false);
  const [allDashData, setAllDashData] = useState({});

  useEffect(() => {
    const dashboardCount = async () => {
      const token = window.localStorage.getItem('UhuruMedToken');
      setLoading(true);
      try {
        const response = await axios.get(ApiConfig.adminDashboard, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        if (response?.data?.error === 'false') {
          setAllDashData(response?.data?.data || {});
        }
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    dashboardCount();
  }, []);

  const cardData = [
    {
      title: 'Total Users',
      value: allDashData?.totalUser || 0,
      icon: <SentimentSatisfied />,
      color: '#7B61FF',
    },
    {
      title: 'Total Complete Appointment',
      value: allDashData?.totalAppointment || 0,
      icon: <HowToRegIcon />,
      color: '#FF6B2C',
    },
    {
      title: 'Total Doctors',
      value: allDashData?.totalDoctor || 0,
      icon: <PersonAdd />,
      color: '#3DAA54',
    },
    {
      title: 'Earning',
      value: allDashData?.totalAppointmentAmount || 0,
      icon: <LocalAtm />,
      color: '#0E9AF7',
    },
  ];

  return (
    <Container maxWidth="xxl">
      <Box>
        <Typography
          style={{ fontSize: '20px', fontWeight: '600', color: '#0077CC' }}
        >
          Welcome {userData?.firstName} {userData?.lastName}
        </Typography>
        <Box mt={2} mb={3}>
          {/* <Typography variant="h5" fontWeight="medium">
            Tabib Apps web | Admin Dashboard
          </Typography> */}
        </Box>
      </Box>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {cardData?.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 4, md: 4, lg: 3 }}>
            <DashboardCard {...card} />
          </Grid>
        ))}
      </Grid>
      <Box mt={4}>
        <DashboardSection  allDashData={allDashData}/>
      </Box>
      <Box mt={4}>
        <Typography
          style={{ fontSize: '20px', fontWeight: '600', color: '#0077CC',paddingLeft:'20px' }}
        >
         Latest Appointment 
        </Typography>
        <AdminAppointmentSec />
      </Box>
    </Container>
  );
};

export default DashboardOverView;
