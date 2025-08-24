import { useEffect, useState } from 'react';
import DashboardCard from '../../NewComponents/userDashboard/DashboardCard';
import { getAppointmentHistory, getUpcomingAppointments } from '@/queries/DoctorQueries/appointments';
import { useAuthStore } from '@/stores/authStore';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ApiConfig from '@/ApiConfig/ApiConfig';
import { useDoctorProfileStore } from '@/stores/DoctorProfileStore';

export default function DoctorDashboard() {
  const { user } = useAuthStore();
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentConsultations, setRecentConsultations] = useState([]);
  const [nextAppointment, setNextAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rawAppointments, setRawAppointments] = useState([]);
  const [rawConsultations, setRawConsultations] = useState([]);
  const navigate = useNavigate();
  const { setProfileData } = useDoctorProfileStore();

  // fetching doctor Data
  const getDoctorProfile = async () => {
    try {
      const response = await axios.get(ApiConfig.profile, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('UhuruMedToken')}`,
        },
      });
      const doctorData = response.data.data;
      console.log('Doctor Profile Data:', doctorData);
      setProfileData(doctorData);
      useDoctorProfileStore.setState({ lastSavedState: doctorData });
    } catch (error) {
      console.error('Error fetching doctor profile:', error);
    }
  };

  useEffect(() => {
    getDoctorProfile();
  }, [setProfileData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const upcomingResponse = await getUpcomingAppointments();
        console.log(upcomingResponse);

        setMeetingLink('app.meetingLink');
        setRawAppointments(upcomingResponse);
        const formattedUpcoming = upcomingResponse.map((app, index) => ({
          Date: moment(app.scheduledTime).format('MMMM D, YYYY'),
          Time: `${app.slot.startTime} - ${app.slot.endTime}`,
          Patient: app.patientName || 'Unknown Patient',
          Type: 'Consultation',
        }));
        setUpcomingAppointments(formattedUpcoming);
        setNextAppointment(formattedUpcoming[0]);

        const recentResponse = await getAppointmentHistory();

        setRawConsultations(recentResponse);
        setRecentConsultations(
          recentResponse.map((cons, index) => ({
            Date: moment(cons.scheduledTime).format('MMMM D, YYYY'),
            Patient: cons.patientName || 'Unknown Patient',
            Summary: cons.symptoms || 'Consultation',
          })),
        );
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleViewDetails = (appointmentData) => {
    navigate('/appointment-details', {
      state: { appointment: appointmentData },
    });
  };

  const handleSchedule = () => {
    navigate('/appointment-doctor');
  };

  const handleConsultation = () => {
    navigate('/doctor-availability');
  };

  const handleVeiwPateint = () => {
    navigate('/patients');
  };


  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00AAEE]"></div>
      </div>
    );
  }

  return (
    <div className="py-6 pt-16">
      <div className="px-4 md:px-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0 text-center sm:w-full md:text-left md:w-auto">
            Welcome, Dr. {user?.lastName || 'User'}!
          </h1>
          <a href={`${nextAppointment.meetingLink}`} className="bg-[#00AAEE] hover:bg-[#0099DD] text-white font-semibold px-6 py-3 rounded-full shadow-md w-full md:w-auto">
            Start Video Consultation
          </a>
        </div>
        {nextAppointment && (
          <p className="text-lg text-gray-700 mb-8 text-center md:text-left">
            Next appointment: {moment(nextAppointment.scheduledTime).format('dddd, MMMM D [at] h:mm A')} with{' '}
            <span className="font-semibold">
              {nextAppointment.Patient} ({nextAppointment.Type})
            </span>
          </p>
        )}
        <div className="flex flex-wrap gap-4 mb-10 w-full sm:max-w-full md:max-w-screen-md justify-center md:justify-start">
          <button
            onClick={handleSchedule}
            className="bg-[#00AAEE] hover:bg-[#0099DD] text-white font-semibold px-6 py-3 rounded-full shadow-md flex-1 min-w-[150px] md:min-w-[100px] text-center"
          >
            View Schedule
          </button>
          <button
            onClick={handleConsultation}
            className="bg-[#00AAEE] hover:bg-[#0099DD] text-white font-semibold px-6 py-3 rounded-full shadow-md flex-1 min-w-[150px] md:min-w-[100px] text-center"
          >
            New Consultation
          </button>
          <button
            onClick={handleVeiwPateint}
            className="bg-[#00AAEE] hover:bg-[#0099DD] text-white font-semibold px-6 py-3 rounded-full shadow-md flex-1 min-w-[150px] md:min-w-[100px] text-center"
          >
            View Patient List
          </button>
        </div>
        <div className="grid gap-8">
          <div>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <DashboardCard
                title="Upcoming Appointments"
                columns={['Date', 'Time', 'Patient', 'Type', 'Action']}
                data={
                  upcomingAppointments.length > 0
                    ? upcomingAppointments.map((appointment, index) => ({
                      ...appointment,
                      Action: (
                        <button
                          onClick={() => handleViewDetails(rawAppointments[index])}
                          className="bg-[#00AAEE] hover:bg-[#0099DD] text-white text-sm px-4 py-2 rounded-full shadow-sm"
                        >
                            View Details
                        </button>
                      ),
                    }))
                    : [
                      {
                        Date: 'No upcoming appointments',
                        Time: '',
                        Patient: '',
                        Type: '',
                        Action: <div></div>,
                      },
                    ]
                }
                emptyMessage="No upcoming appointments found"
              />
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#0000004D]">
                <div className="p-3 sm:p-4 border-b border-gray-200">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Upcoming Appointments</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {upcomingAppointments.length > 0 ? (
                    upcomingAppointments.map((appointment, index) => (
                      <div key={index} className="p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-base">{appointment.Patient}</h3>
                            <p className="text-sm text-gray-600">{appointment.Type}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Date:</span>
                            <p className="text-gray-600">{appointment.Date}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Time:</span>
                            <p className="text-gray-600">{appointment.Time}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
                          <button
                            onClick={() => handleViewDetails(rawAppointments[index])}
                            className="bg-[#00AAEE] hover:bg-[#0099DD] text-white text-sm px-4 py-2 rounded-full shadow-sm"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-gray-500">No upcoming appointments found</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <DashboardCard
                title="Recent Consultations"
                columns={['Date', 'Patient', 'Summary', 'Status']}
                data={
                  recentConsultations.length > 0
                    ? recentConsultations.map((consultation, index) => ({
                      ...consultation,
                      Status: (
                        <div className="flex justify-center items-center gap-2">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              rawConsultations[index]?.status === 'COMPLETED'
                                ? 'bg-[#E6FAE6] text-[#34C759]'
                                : rawConsultations[index]?.status === 'CANCELLED'
                                  ? 'bg-[#FFE6E6] text-[#FF3B30]'
                                  : 'bg-orange-100 text-orange-700'
                            }`}
                          >
                            {rawConsultations[index]?.status}
                          </span>
                        </div>
                      ),
                    }))
                    : [
                      {
                        Date: 'No recent consultations',
                        Patient: '',
                        Summary: '',
                        Status: <div></div>,
                      },
                    ]
                }
                emptyMessage="No consultation history found"
              />
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#0000004D]">
                <div className="p-3 sm:p-4 border-b border-gray-200">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Recent Consultations</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {recentConsultations.length > 0 ? (
                    recentConsultations.map((consultation, index) => (
                      <div key={index} className="p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-base">{consultation.Patient}</h3>
                            <p className="text-sm text-gray-600">{consultation.Summary}</p>
                          </div>
                          <div className="flex-shrink-0 flex flex-col items-end gap-2">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                rawConsultations[index]?.status === 'COMPLETED'
                                  ? 'bg-[#E6FAE6] text-[#34C759]'
                                  : rawConsultations[index]?.status === 'CANCELLED'
                                    ? 'bg-[#FFE6E6] text-[#FF3B30]'
                                    : 'bg-orange-100 text-orange-700'
                              }`}
                            >
                              {rawConsultations[index]?.status}
                            </span>
                          </div>
                        </div>

                        <div className="text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Date:</span>
                            <p className="text-gray-600">{consultation.Date}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-gray-500">No consultation history found</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}






// import React, { useContext, useEffect, useState } from 'react';
// import { Grid, Box, Container, Typography, Chip } from '@mui/material';
// import DashboardCard from './DashboardCard';
// import {
//   SentimentSatisfied,
//   ContentCut,
//   PersonAdd,
//   LocalAtm,
// } from '@mui/icons-material';
// import DashboardSection from './DashboardSection';
// import Appointment from '../../Pages/Appointment/Appointment';
// import { AuthContext } from '../../Context/Auth';
// import axios from 'axios';
// import ApiConfig from '../../ApiConfig/ApiConfig';
// import AppointmentUserlist from '../../Pages/AppointmentUserlist';
// import AppointMentDash from '../../Pages/AppointMentDash';
// import DashboardAppointment from '../../Pages/DashboardAppointment';
// import StarIcon from '@mui/icons-material/Star';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
// import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
// import DoctorNewSection from './DoctorNewSection';
// import DoctorTodatApppoint from '../../Pages/DoctorTodayAppointmnet/DoctorTodatApppoint';

// const cardData = [
//   {
//     title: 'Appointments',
//     value: '650',
//     icon: <SentimentSatisfied />,
//     color: '#7B61FF',
//   },
//   {
//     title: 'Operations',
//     value: '54',
//     icon: <ContentCut />,
//     color: '#FF6B2C',
//   },
//   {
//     title: 'New Patients',
//     value: '129',
//     icon: <PersonAdd />,
//     color: '#3DAA54',
//   },
//   {
//     title: 'Earning',
//     value: '$20,125',
//     icon: <LocalAtm />,
//     color: '#0E9AF7',
//   },
// ];

// const DoctorDashboard = () => {
//   const auth = useContext(AuthContext);
//   const userData = auth.userData;
//   const [loading, setLoading] = useState(false);
//   const [allDashData, setAllDashData] = useState({});

//   useEffect(() => {
//     const dashboardCount = async () => {
//       const token = window.localStorage.getItem('UhuruMedToken');
//       setLoading(true);
//       try {
//         const response = await axios.get(ApiConfig.adminDashboard, {
//           headers: {
//             authorization: `Bearer ${token}`,
//           },
//         });
//         if (response?.data?.error === 'false') {
//           setAllDashData(response?.data?.data || {});
//         }
//       } catch (error) {
//         console.error('Dashboard fetch error:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     dashboardCount();
//   }, []);

//   const cardData = [
//     {
//       title: 'Total Users',
//       value: allDashData?.totalUser || 0,
//       icon: <SentimentSatisfied />,
//       color: '#7B61FF',
//     },
//     {
//       title: 'Active Users',
//       value: allDashData?.userActive || 0,
//       icon: <ContentCut />,
//       color: '#FF6B2C',
//     },
//     {
//       title: 'Total Doctors',
//       value: allDashData?.totalDoctor || 0,
//       icon: <PersonAdd />,
//       color: '#3DAA54',
//     },
//     {
//       title: 'Active Doctors',
//       value: allDashData?.doctorActive || 0,
//       icon: <LocalAtm />,
//       color: '#0E9AF7',
//     },
//   ];

//   return (
//     <Container maxWidth="xxl">
//       {/* <Box>
//         <DoctorNewSection allDashData={allDashData} />
//       </Box> */}
//       <Box>
//         <Typography variant="h4" fontWeight="bold" gutterBottom>
//           Welcome, Dr. {userData?.firstName} {userData?.lastName}
//         </Typography>
//         <Box mt={2} mb={3}>
//           <Box
//             sx={{
//               display: 'flex',
//               justifyContent: 'space-between',
//               flexWrap: 'wrap',
//               gap: { xs: '10px' },
//               // padding: "0px 1rem",
//             }}
//           >
//             <Box
//               sx={{
//                 background: '#fff',
//                 padding: '20px',
//                 borderRadius: '10px',
//                 width: '100%',
//                 maxWidth: '350px',
//                 display: 'flex',
//                 flexDirection: 'column',
//                 gap: '25px',
//               }}
//             >
//               <Typography sx={{ fontSize: '18px', fontWeight: '700' }}>
//                 Total Complete Appointments
//               </Typography>
//               <Typography sx={{ fontSize: '30px', fontWeight: '600' }}>
//                 {allDashData?.totalCompletedAppointment || '0'}
//               </Typography>
//             </Box>
//             <Box
//               sx={{
//                 background: '#fff',
//                 padding: '20px',
//                 borderRadius: '10px',
//                 width: '100%',
//                 maxWidth: '350px',
//                 display: 'flex',
//                 flexDirection: 'column',
//                 gap: '25px',
//               }}
//             >
//               <Typography sx={{ fontSize: '18px', fontWeight: '700' }}>
//                 Total Earning
//               </Typography>
//               <Typography sx={{ fontSize: '30px', fontWeight: '600' }}>
//                 {allDashData?.totalEarning || '0'}
//               </Typography>
//             </Box>
//             <Box
//               sx={{
//                 background: '#fff',
//                 padding: '20px',
//                 borderRadius: '10px',
//                 width: '100%',
//                 maxWidth: '350px',
//                 height: '150px',
//                 display: 'flex',
//                 flexDirection: 'column',
//                 gap: '25px',
//               }}
//             >
//               <Typography sx={{ fontSize: '18px', fontWeight: '700' }}>
//                 Upcoming Appointment
//               </Typography>
//               <Typography sx={{ fontSize: '30px', fontWeight: '600' }}>
//                 {allDashData?.upcomingAppointment || '0'}
//               </Typography>
//             </Box>
//           </Box>
//         </Box>
//       </Box>
//       <Box mt={4}>
//         <Typography
//           style={{
//             fontSize: '20px',
//             fontWeight: '600',
//             color: '#0077CC',
//             paddingLeft: '20px',
//           }}
//         >
//           Today`&apos;`Appointment
//         </Typography>
//         <DoctorTodatApppoint />
//       </Box>
//       <Box mt={4}>
//         <Typography
//           style={{
//             fontSize: '20px',
//             fontWeight: '600',
//             color: '#0077CC',
//             paddingLeft: '20px',
//           }}
//         >
//           Upcoming Appointments
//         </Typography>
//         <DashboardAppointment />
//       </Box>
//       {/* <AppointMentDash /> */}
//     </Container>
//   );
// };

// export default DoctorDashboard;
