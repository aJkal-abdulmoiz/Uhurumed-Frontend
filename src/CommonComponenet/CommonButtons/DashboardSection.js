// DashboardSection.js
import React, { useEffect, useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { ArrowForwardIos } from '@mui/icons-material';

import axios from 'axios';
import ApiConfig from '../../ApiConfig/ApiConfig';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { month: 'JAN', appointment: 0, patients: 0 },
  { month: 'FEB', appointment: 150, patients: 100 },
  { month: 'MAR', appointment: 90, patients: 160 },
  { month: 'APR', appointment: 220, patients: 140 },
  { month: 'MAY', appointment: 180, patients: 250 },
];


const DashboardSection = ({allDashData}) => {
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();
  console.log('adfgadsgsad', patients);
  const [stats, setStats] = useState(null);

  const chartData = [
    { name: 'Total Users', value: allDashData?.totalUser ?? 0 },
    { name: 'Total Complete Appointment', value: allDashData?.totalAppointment ?? 0 },
    { name: 'Total Doctors', value: allDashData?.totalDoctor ?? 0 },
    { name: 'Earning', value: allDashData?.totalAppointmentAmount },
  ];

  const getAllDoctors = async () => {
    const token = window.localStorage.getItem('UhuruMedToken');
    setLoading(true);

    try {
      const response = await axios({
        method: 'GET',
        url: ApiConfig.adminUserList,
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      console.log('successsuccess', response?.data?.success);
      if (response?.data?.error === 'false') {
        setLoading(false);

        console.log('responseresponse', response);
        setPatients(
          response?.data?.data?.docs?.filter(
            (item) => item?.userType === 'USER'
          )
        );
      }
    } catch (error) {
      setPatients([]);
      setLoading(false);

      console.log('errorerror', error);

      return error?.response;
    }
  };

  useEffect(() => {
    getAllDoctors();
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }}>
        <Paper elevation={3} sx={{ p: 1.5, borderRadius: 3 }}>
          <Box sx={{ width: '100%', height: 346, mt: 1, pb: 5 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Overview
            </Typography>

            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid vertical={false} horizontal={false} />
                <XAxis
                  dataKey="name"
                  tick={{
                    fontSize: 14,
                    fontWeight: 'bold',
                    fill: '#938f8f',
                    angle: 0,
                    dy: 10,
                  }}
                  
                  axisLine={{ stroke: '#ccc' }}
                  tickLine={false}
                />
                <YAxis allowDecimals={false} />
                <Tooltip />

                <Bar
                  dataKey="value"
                  fill="#1976d2"
                  radius={[6, 6, 0, 0]}
                  barSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
        {/* <Paper elevation={3} sx={{ p: 1.5, borderRadius: 3 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" fontWeight={"bold"}>
              Activity
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Today 07, may 2025
            </Typography>
          </Box>
          <Box mt={3} height={300}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient
                    id="colorAppointment"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#00c6ff" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#00c6ff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="colorPatients"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#14B8A6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="appointment"
                  stroke="#00c6ff"
                  fillOpacity={1}
                  fill="url(#colorAppointment)"
                />
                <Area
                  type="monotone"
                  dataKey="patients"
                  stroke="#14B8A6"
                  fillOpacity={1}
                  fill="url(#colorPatients)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Paper> */}
      </Grid>

      <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }}>
        <Paper elevation={3} sx={{ p: 2.3, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight={'bold'} gutterBottom>
            New Patient
          </Typography>
          {loading ? (
            // Show loader
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="300px"
            >
              <CircularProgress />
            </Box>
          ) : !patients || patients?.length === 0 ? (
            // Show "No Data Found"
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="300px"
            >
              <Typography variant="body1" color="textSecondary">
                No patients found.
              </Typography>
            </Box>
          ) : (
            // Show the list of patients
            <List>
              {patients?.slice(0, 4)?.map((patient, index) => (
                <ListItem
                  key={index}
                  button
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate('/Patients')}
                  secondaryAction={
                    <IconButton edge="end">
                      <ArrowForwardIos fontSize="small" />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar
                      src={
                        patient?.profilePic ??
                        'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?ga=GA1.1.406090842.1746782723&semt=ais_hybrid&w=740'
                      }
                      alt={patient.firstName}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={patient.firstName}
                    secondary={patient.email}
                    primaryTypographyProps={{
                      style: { color: '#000', fontSize: '16px' },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default DashboardSection;
