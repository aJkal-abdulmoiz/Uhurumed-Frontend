import {
  Box,
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  Paper,
  TableHead,
  CircularProgress,
  Button,
  IconButton,
  Avatar,
  Tabs,
  Tab,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Context/Auth';
import ApiConfig from '../../ApiConfig/ApiConfig';
import axios from 'axios';
import moment from 'moment';
import { ro } from 'date-fns/locale';
import { useLocation, useNavigate } from 'react-router-dom';
import SubscribeUserList from '../SubscribeUserList/SubscribeUserList';
import DoctorMedicalReport from '../SubscribeUserList/DoctorMedicalReport';

const DoctorRecord = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const userData = location?.state?.row;
  console.log('Adgsadgsaf', userData);
  const handleAppoinmet = () => {
    navigate('/appointment-user');
  };
  const auth = useContext(AuthContext);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [value, setValue] = React.useState(1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const birthday = userData?.patient?.dateOfBirth
    ? new Date(userData.patient?.dateOfBirth).toISOString().split('T')[0]
    : '';

  const patientData = {
    'Patient Name': userData?.patient?.firstName ?? '__',
    'Date of Birth': birthday ?? '__',
    Gender: userData?.patient?.gender,
    Email: userData?.patient?.email,
    Phone: userData?.patient?.phone,
    Address: userData?.patient?.address,
  };

  const visitData = {
    Medical: userData?.patient?.medicalHistory,
    Allergies: userData?.patient?.allergies,
    'Blood Group': userData?.patient?.bloodGroup,
    Height: userData?.patient?.height,
    Weight: userData?.patient?.weight,
  };

  const paperStyle = {
    borderColor: '#c6d9ec',
    borderRadius: '8px',
    overflow: 'hidden',
    fontFamily: 'Arial, sans-serif',
    marginTop: '10px',
  };

  const headerBoxStyle = {
    backgroundColor: '#e6f0fb',
    padding: '10px 16px',
    borderBottom: '1px solid #c6d9ec',
  };

  const labelValueBoxStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    paddingY: '4px',
    gap: { xs: '4rem', md: '20rem' },
  };

  const handleRowClick = (row) => {
    setSelectedDoctor(row);
  };

  useEffect(() => {
    if (doctors?.length > 0) {
      setSelectedDoctor(doctors[0]);
    }
  }, [doctors]);

  const getAllDoctors = async (id) => {
    const token = window.localStorage.getItem('UhuruMedToken');
    setLoading(true);

    try {
      const response = await axios({
        method: 'GET',
        url: ApiConfig.doctorAppointmentList,
        headers: {
          authorization: `Bearer ${token}`,
        },
        params: {
          patientId: id,
        },
      });
      console.log('successsuccess', response?.data?.success);
      if (response?.data?.error === 'false') {
        setLoading(false);

        console.log('responseresponse', response);
        setDoctors(response?.data?.data?.docs);
        // setTotalPages(response?.data?.data?.[0]?.count);
      }
    } catch (error) {
      setDoctors([]);
      setLoading(false);

      console.log('errorerror', error);

      return error?.response;
    }
  };

  useEffect(() => {
    if (userData?.patientId) {
      getAllDoctors(userData.patientId);
    }
  }, [userData?.patientId]);

  return (
    <Container maxWidth="xxl">
      <Box mb={3} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="disabled tabs example"
        >
          <Tab label="ELECTRONIC MEDICAL RECORD" />
          <Tab label="MEDICAL REPORT" />
        </Tabs>
      </Box>
      {value === 1 ? (
        <>
          <DoctorMedicalReport userData={userData} />
        </>
      ) : (
        <Box>
          <Box
            mb={2.5}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: { xs: 'column', md: 'row' },
            }}
          >
            <Typography
              variant="h4"
              sx={{ fontSize: '30px', fontWeight: '700', fontFamily: 'rubik' }}
            >
              {value === 1 ? 'Medical Report' : 'Electronic Medical Record'}
            </Typography>
          </Box>
          <Grid container spacing={2}>
            {/* Left column */}
            <Grid item xs={12} sm={6} md={6}>
              {/* Patient Profile */}
              <Paper variant="outlined" sx={paperStyle}>
                <Box sx={headerBoxStyle}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 'bold', color: '#1a1a1a' }}
                  >
                    Patient Profile
                  </Typography>
                </Box>

                <Box sx={{ padding: '16px' }}>
                  {Object.entries(patientData).map(([label, value]) => (
                    <Box key={label} sx={labelValueBoxStyle}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#333',
                          fontWeight: 400,
                          fontSize: '14px',
                        }}
                      >
                        {label}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#000',
                          fontWeight: 500,
                          fontSize: '14px',
                        }}
                      >
                        {value != null ? value : 'N/A'}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>

              {/* Medical History */}
              <Paper variant="outlined" sx={paperStyle}>
                <Box sx={headerBoxStyle}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 'bold', color: '#1a1a1a' }}
                  >
                    Medical History
                  </Typography>
                </Box>

                <Box sx={{ padding: '16px' }}>
                  {Object.entries(visitData).map(([label, value]) => (
                    <Box key={label} sx={labelValueBoxStyle}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#333',
                          fontWeight: 400,
                          fontSize: '14px',
                        }}
                      >
                        {label}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#000',
                          fontWeight: 500,
                          fontSize: '14px',
                        }}
                      >
                        {value != null ? value : 'N/A'}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>

            {/* Right column */}
            <Grid item xs={12} sm={6} md={6}>
              {/* Medication Details */}
              <Paper variant="outlined" sx={paperStyle}>
                <Box sx={headerBoxStyle}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 'bold', color: '#1a1a1a' }}
                  >
                    Medication Details
                  </Typography>
                </Box>
                <TableContainer
                  component={Paper}
                  sx={{
                    backgroundColor: '#fff',
                    color: '#fff',
                    borderRadius: '8px',
                    overflow: 'hidden',
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>
                          Patient Name
                        </TableCell>
                        <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>
                          Appointment Date
                        </TableCell>
                        <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>
                          Amount
                        </TableCell>
                        <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>
                          Slot Time
                        </TableCell>
                        <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>
                          Status
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            <CircularProgress size={24} />
                          </TableCell>
                        </TableRow>
                      ) : doctors?.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            No data found
                          </TableCell>
                        </TableRow>
                      ) : (
                        (showAll ? doctors : doctors?.slice(0, 4))?.map(
                          (row, idx) => (
                            <TableRow
                              key={idx}
                              sx={{
                                '&:last-child td, &:last-child th': {
                                  border: 0,
                                },
                                borderBottom:
                                  '1px solid rgba(255, 255, 255, 0.1)',
                                cursor: 'pointer',
                              }}
                              onClick={() => handleRowClick(row)} // <-- Your click handler
                              hover
                            >
                              <TableCell sx={{ color: '#000' }}>
                                {row?.patientName?.length > 12
                                  ? `${row.patientName.slice(0, 12)}...`
                                  : row?.patientName}
                              </TableCell>

                              <TableCell sx={{ color: '#000' }}>
                                {moment(row?.scheduledTime).format('lll')}
                              </TableCell>
                              <TableCell sx={{ color: '#000' }}>
                                {row?.paymentAmount}
                              </TableCell>
                              <TableCell sx={{ color: '#000' }}>
                                {row?.slotTime}
                              </TableCell>

                              <TableCell sx={{ color: '#000' }}>
                                {row?.status?.length > 12
                                  ? `${row.status.slice(0, 12)}...`
                                  : row?.status}
                              </TableCell>
                            </TableRow>
                          )
                        )
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>

              {doctors?.length > 4 && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: '5px',
                  }}
                >
                  <Button
                    onClick={() => setShowAll((prev) => !prev)}
                    style={{ color: '#2e5ad5' }}
                  >
                    {showAll ? 'View Less' : 'View More'}
                  </Button>
                </Box>
              )}
              <Paper variant="outlined" sx={paperStyle}>
                <Box sx={headerBoxStyle}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 'bold', color: '#1a1a1a' }}
                  >
                    SOAP Note
                  </Typography>
                </Box>

                <Box
                  sx={{
                    padding: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 3,
                  }}
                >
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: '#333', fontWeight: 600, fontSize: '14px' }}
                    >
                      Symptoms :
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: '#000', fontWeight: 500, fontSize: '14px' }}
                    >
                      {selectedDoctor?.symptoms}
                      {/* {doctors?.[0]?.symptoms} */}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: '#333', fontWeight: 600, fontSize: '14px' }}
                    >
                      Consultation :
                    </Typography>
                    {/* <Typography
                    variant="body2"
                    sx={{ color: "#000", fontWeight: 500, fontSize: "14px" }}
                  >
                    Diagnosis : {selectedDoctor?.consultation?.diagnosis ?? "__"}
                  </Typography> */}
                    <Box sx={{ maxWidth: '470px' }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#000',
                          fontWeight: 500,
                          fontSize: '14px',
                        }}
                      >
                        Notes : {selectedDoctor?.consultation?.notes ?? '__'}
                      </Typography>
                    </Box>
                    <Box mt={1} sx={{ maxWidth: '470px' }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#000',
                          fontWeight: 500,
                          fontSize: '14px',
                        }}
                      >
                        Prescription :{' '}
                        {selectedDoctor?.consultation?.prescription ?? '__'}
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    {selectedDoctor?.consultation?.diagnosis && (
                      <a
                        href={selectedDoctor?.consultation?.diagnosis}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Avatar
                          src={selectedDoctor?.consultation?.diagnosis}
                          alt="User"
                          sx={{
                            width: 120,
                            height: 120,
                            objectFit: 'fill',
                            borderRadius: '8px',
                            cursor: 'pointer',
                          }}
                        />
                      </a>
                    )}
                    {selectedDoctor?.consultation?.diagnosis && (
                      <Typography
                        component="a"
                        href={selectedDoctor?.consultation?.diagnosis} // replace with your desired URL
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: '14px',
                          textAlign: 'center',
                          color: '#2e5ad5',
                          textDecoration: 'underline',
                          cursor: 'pointer',
                          display: 'block', // ensures textAlign works properly
                        }}
                      >
                        Click here
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default DoctorRecord;
