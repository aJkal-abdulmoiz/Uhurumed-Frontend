import DashboardCard from '../../NewComponents/userDashboard/DashboardCard';
import { getAppointments } from '@/queries/PatientQueries/appointments';
import { getPatientDoctors } from '@/queries/PatientQueries/doctors';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import ApiConfig from '@/ApiConfig/ApiConfig';
import { useProfileStore } from '@/stores/ProfileStore';
import { useAuthStore } from '@/stores/authStore';

export default function DashboardPage() {
  const userDataString = localStorage.getItem('userData');
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const [isChecked, setIsChecked] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('Labs');
  const navigate = useNavigate();

  const { id, firstName } = userData || {};

  const { setProfileData, medicalRecords } = useProfileStore();
  const { user } = useAuthStore();


  const [initialAppointmentsData, setInitialAppointmentsData] = useState([]);
  const [initialDoctorsData, setInitialDoctorsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const statusColors = {
    SCHEDULED: 'bg-cyan-100 text-cyan-700',
    COMPLETED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
    ONGOING: 'bg-yellow-100 text-yellow-700',
  };

  const getUserProfile = async () => {
    try {
      const response = await axios.get(ApiConfig.profile, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('UhuruMedToken')}`,
        },
      });
      const User = response.data.data;

      console.log('User Profile Data:', User);

      setProfileData(User);
      useProfileStore.setState({ lastSavedState: User });

    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    if (id) {
      getUserProfile();
    } else {
      console.error('User ID is not available');
    }
  }, [id, setProfileData]);



  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [appointmentsResult, doctorsResult] = await Promise.all([
        getAppointments({ limit: 3 }),
        getPatientDoctors(id, { recentOnly: true }),
      ]);

      if (appointmentsResult.success) {
        setInitialAppointmentsData(
          appointmentsResult.data.map(appointment => ({
            date: moment(appointment.scheduledTime).format('MMM D'),
            doctor: appointment.doctorName || 'N/A',
            status: appointment.status,
            rawData: appointment
          }))
        );
      } else {
        setError(appointmentsResult.message);
      }

      if (doctorsResult.success) {
        console.log('pateintdotoro', doctorsResult);
        setInitialDoctorsData(
          doctorsResult.data.map(doctor => ({
            name: `${doctor.firstName} ${doctor.lastName}`,
            speciality: doctor.specialization,
            country: doctor.country,
            consultationFee: doctor.consultationFee,
            profilePic: doctor.profilePic
          }))
        );
      } else {
        setError(prev => prev || doctorsResult.message);
      }
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleBookConsultation = () => {
    navigate('/doctors');
  };


  const handleViewDetails = (appointmentData) => {
    navigate('/appointment-details', {
      state: { appointment: appointmentData },
    });
  };

  console.log(initialAppointmentsData);



  const initialBillingData = [
    { date: 'May 29', service: 'Teleconsultant', amount: '$30', status: 'Unpaid' },
    { date: 'May 28', service: 'Lab Work', amount: '$15', status: 'Paid' },
    { date: 'May 27', service: 'Teleconsultant', amount: '$30', status: 'Unpaid' },
  ];

  const initialMessagesData = [
    { from: 'Dr. Kodji', date: 'May 29', subject: 'CBC, CRP', status: 'Unread' },
    { from: 'Dr. Kodji', date: 'May 30', subject: 'CBC, CRP', status: 'Read' },
    { from: 'Dr. Kodji', date: 'May 31', subject: 'CBC, CRP', status: 'Unread' },
  ];

  const insuranceData = [
    { label: 'Annual Physical Due', value: 'September 2025' },
    { label: 'Plan Expires', value: 'December 31, 2025' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen h-full flex justify-center items-center mx-auto px-4 py-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-6 border-[#3fa2df]"></div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen mx-auto">
      <div className="mb-4 sm:mb-6 mt-12 sm:mt-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 mt-10">Welcome, {user?.lastName}!</h1>
        <p className="font-semibold text-lg text-gray-700">
          Next appointment: <span className="text-lg text-gray-700">Monday, June 10 at 10:00 AM with Dr. Kodji (Internal Medicine)</span>
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <button onClick={handleBookConsultation} className="bg-[#00AAEE] hover:bg-[#0099DD] text-white text-base px-6 py-3 rounded-full shadow-md transition-colors">
          Book Consultation
        </button>
        <button className="bg-[#00AAEE] hover:bg-[#0099DD] text-white text-base px-6 py-3 rounded-full shadow-md transition-colors">
          Upload Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments Card */}
        <DashboardCard
          title="Appointments"
          data={initialAppointmentsData.map(item => ({
            date: item.date,
            doctor: item.doctor,
            status: item.status,
            Action: (
              <button
                onClick={() => handleViewDetails(item.rawData)}
                className="bg-[#00AAEE] hover:bg-[#0099DD] text-white text-xs px-3 py-1 rounded-full shadow-sm"
              >
                View Details
              </button>
            )

          }))}
          emptyMessage={'No appointments available'}
          columns={['Appointment Date', 'Appointed Doctor', 'Status', 'Action']}
        />

        {/* Medical Records Card */}
        <DashboardCard
          title="Medical Records"
          columns={['Date', 'Type', 'Title', 'File']}
          data={medicalRecords?.reverse().slice(0, 3).map((item) => ({
            date: new Date(item.createdAt).toLocaleDateString(), // Format if needed
            type: item.recordType,
            description: item.description,
            file: (
              <a
                href={item.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#00AAEE] hover:bg-[#0099DD] text-white text-xs px-3 py-1 rounded-full"
              >
                View File
              </a>
            ),
          }))}
        // headerRightContent={{
        //   dropdown: true,
        //   label: 'Labs',
        //   options: ['All', 'Medical Report', 'Lab Results', 'Prescription'],
        //   onSelect: setSelectedFilter,
        // }}
        />

        {/* Insurance Status Card */}
        <DashboardCard
          title="Insurance Status"
          type="insurance"
          data={insuranceData}
          checkboxProps={{
            checked: isChecked,
            onChange: () => setIsChecked(!isChecked),
            label: 'Covered Under Freesom Basic #111'
          }}
          buttonProps={{
            label: 'View Benefits and Details'
          }}
        />

        {/* Messages Card */}
        <DashboardCard
          title="Messages"
          data={initialMessagesData.map(item => ({
            from: item.from,
            date: item.date,
            subject: item.subject,
            status: item.status
          }))}
          columns={['From', 'Date', 'Subject', 'Status']}
        />

        {/* Doctors Card */}
        <DashboardCard
          title="Doctors"
          data={initialDoctorsData.map(item => ({
            name: item.name,
            speciality: item.speciality,
            country: item.country
          }))}
          emptyMessage={'No doctors found'}
          columns={['Name', 'Speciality', 'Country']}
        />

        {/* Billing Card */}
        <DashboardCard
          title="Billing"
          data={initialAppointmentsData.map(item => ({
            date: item.date,
            service: item.rawData?.doctor?.specialization,
            amount: `$${item.rawData?.paymentAmount}`,
            status: item.status === 'SCHEDULED' ? 'Paid' : 'Unpaid'
          }))}
          columns={['Date', 'Service', 'Amount', 'Status']}
        />
      </div>
    </div>
  );
}





// import React, { useContext, useEffect, useState } from "react";
// import { Grid, Box, Container, Typography } from "@mui/material";
// import DashboardCard from "./DashboardCard";
// import {
//   SentimentSatisfied,
//   ContentCut,
//   PersonAdd,
//   LocalAtm,
// } from "@mui/icons-material";
// import DashboardSection from "./DashboardSection";
// import Appointment from "../../Pages/Appointment/Appointment";
// import { AuthContext } from "../../Context/Auth";
// import axios from "axios";
// import ApiConfig from "../../ApiConfig/ApiConfig";
// import AppointmentUserlist from "../../Pages/AppointmentUserlist";
// import AppointMentDash from "../../Pages/AppointMentDash";
// import DashboardAppointment from "../../Pages/DashboardAppointment";
// import UserDashboardSection from "./UserDashboardPage";
// import UserDashboardPage from "./UserDashboardPage";
// import DoctorNewSection from "./DoctorNewSection";
// import UserNewDashboard from "./UserNewDashboard";

// const UserDashboard = () => {
//   const auth = useContext(AuthContext);
//   const userData = auth.userData;
//   const [loading, setLoading] = useState(false);
//   const [allDashData, setAllDashData] = useState({});

//   useEffect(() => {
//     const dashboardCount = async () => {
//       const token = window.localStorage.getItem("UhuruMedToken");
//       setLoading(true);
//       try {
//         const response = await axios.get(ApiConfig.adminDashboard, {
//           headers: {
//             authorization: `Bearer ${token}`,
//           },
//         });
//         if (response?.data?.error === "false") {
//           setAllDashData(response?.data?.data || {});
//         }
//       } catch (error) {
//         console.error("Dashboard fetch error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     dashboardCount();
//   }, []);

//   const cardData = [
//     {
//       title: "Total Users",
//       value: allDashData?.totalUser || 0,
//       icon: <SentimentSatisfied />,
//       color: "#7B61FF",
//     },
//     {
//       title: "Active Users",
//       value: allDashData?.userActive || 0,
//       icon: <ContentCut />,
//       color: "#FF6B2C",
//     },
//     {
//       title: "Total Doctors",
//       value: allDashData?.totalDoctor || 0,
//       icon: <PersonAdd />,
//       color: "#3DAA54",
//     },
//     {
//       title: "Active Doctors",
//       value: allDashData?.doctorActive || 0,
//       icon: <LocalAtm />,
//       color: "#0E9AF7",
//     },
//   ];

//   return (
//     <Container maxWidth="xxl">
//       <Box>
//         {/* <Typography
//           style={{ fontSize: "20px", fontWeight: "600", color: "#0077CC" }}
//         >
//           Welcome {userData?.firstName} {userData?.lastName}
//         </Typography> */}

//       </Box>

//       <Box mt={0}>
//       <UserNewDashboard allDashData={allDashData} />
//       </Box>
//       <Box mt={4}>
//         <Typography
//           style={{
//             fontSize: "20px",
//             fontWeight: "600",
//             color: "#0077CC",
//             paddingLeft: "20px",
//           }}
//         >
//           Latest Appointment
//         </Typography>
//         <AppointMentDash />
//       </Box>
//     </Container>
//   );
// };

// export default UserDashboard;

// import React, { useContext, useEffect, useState } from 'react';
// import {
//   Box,
//   Typography,
//   Grid,
//   Select,
//   MenuItem,
//   TextField,
//   Button,
//   Card,
//   CardContent,
//   Stack,
//   InputLabel,
//   FormControl,
//   Container,
//   Autocomplete,
//   InputAdornment,
//   Avatar,
//   Rating,
//   CircularProgress,
//   Skeleton,
// } from '@mui/material';
// import { Flag } from '@mui/icons-material';
// import LocationOnIcon from '@mui/icons-material/LocationOn';
// import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
// import DescriptionIcon from '@mui/icons-material/Description';
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
// import Btn from './Btn';
// import { CountryFlag } from '../../Context/CountryFlag';
// import axios from 'axios';
// import ApiConfig from '../../ApiConfig/ApiConfig';
// import SingleDoctorAppoint from '../../Pages/SingleDoctorAppoint';
// import moment from 'moment';
// import { AuthContext } from '../../Context/Auth';
// import { BsChatSquareTextFill } from 'react-icons/bs';
// import { HiMiniVideoCamera } from 'react-icons/hi2';
// import { useNavigate } from 'react-router-dom';
// import { FaTeamspeak } from 'react-icons/fa';
// import { HiClipboardDocument } from 'react-icons/hi2';
// import { FaUsers } from 'react-icons/fa';
// import { IoPersonAdd } from 'react-icons/io5';

// const countries = [
//   { code: 'US', label: 'United States', flag: '🇺🇸' },
//   { code: 'UK', label: 'United Kingdom', flag: '🇬🇧' },
//   { code: 'IN', label: 'India', flag: '🇮🇳' },
// ];

// // Example Specialties
// const specialties = [
//   { specialization: ' General & Primary Care', icon: <MedicalServicesIcon /> },
//   { specialization: 'Surgical Specialties', icon: <MedicalServicesIcon /> },
//   { specialization: 'Specialized Care', icon: <MedicalServicesIcon /> },
//   {
//     specialization: 'Sensory and Neurological Systems',
//     icon: <MedicalServicesIcon />,
//   },
//   { specialization: 'Diagnostic & Lab-Based', icon: <MedicalServicesIcon /> },
//   { specialization: 'Mental Health', icon: <MedicalServicesIcon /> },
//   {
//     specialization: ' Women’s and Reproductive Health',
//     icon: <MedicalServicesIcon />,
//   },
//   { specialization: 'Other', icon: <MedicalServicesIcon /> },
// ];

// const Dashboard = () => {
//   const [selectedCountry, setSelectedCountry] = useState(CountryFlag[0]);
//   const [doctorList, setDoctors] = useState([]);
//   const [doctorListfind, setDoctorsfind] = useState([]);
//   const [appointments, setAppointment] = useState([]);
//   const auth = useContext(AuthContext);
//   const userData = auth.userData;
//   const [selectedSpecialty, setSelectedSpecialty] = useState(doctorList[0]);
//   const [loading, setLoading] = useState(false);
//   const [loading2, setLoading2] = useState(false);
//   const [loading1, setLoading1] = useState(false);
//   const [isDialogOpen1, setIsDialogOpen1] = useState(false);
//   const [hasSearched, setHasSearched] = useState(false);
//   const navigate = useNavigate();
//   const [filteredCountries, setFilteredCountries] = useState([
//     { index: 0 },
//     ...CountryFlag,
//   ]);

//   const quickLinks = [
//     {
//       label: 'New Appointment',
//       icon: <IoPersonAdd size={30} fontSize="large" color="#0077cc" />,
//       navi: '/appointment-user',
//     },
//     {
//       label: 'Our Specialist',
//       icon: <FaUsers size={30} fontSize="large" color="#0077cc" />,
//       navi: '/user-doctors',
//     },
//     {
//       label: 'My Records',
//       icon: <HiClipboardDocument size={30} fontSize="large" color="#0077cc" />,
//       navi: '/record',
//     },
//     {
//       label: 'Doctor Conversation',
//       icon: <FaTeamspeak size={30} fontSize="large" color="#0077cc" />,
//       navi: '/chat',
//     },
//   ];

//   const getAllDoctors = async () => {
//     const token = window.localStorage.getItem('UhuruMedToken');
//     setLoading(true);

//     try {
//       const response = await axios({
//         method: 'GET',
//         url: ApiConfig.doctorMain,
//         headers: {
//           authorization: `Bearer ${token}`,
//         },
//         params: {
//           page: 1,
//           limit: 200,
//         },
//       });
//       console.log('successsuccess', response?.data?.success);
//       if (response?.data?.error === 'false') {
//         setLoading(false);

//         console.log('responseresponse', response);
//         setDoctors(response?.data?.data?.docs);
//         // setTotalPages(response?.data?.data?.[0]?.count);
//       } else {
//         setLoading(false);
//       }
//     } catch (error) {
//       setDoctors([]);
//       setLoading(false);

//       console.log('errorerror', error);

//       return error?.response;
//     }
//   };

//   const handelHander = (rows) => {
//     if (rows?.status !== 'SCHEDULED') return; // Only allow action if scheduled

//     if (rows?.type === 'CHAT') {
//       navigate('/chat');
//     } else {
//       if (rows?.meetingLink) {
//         window.open(rows.meetingLink, '_blank', 'noopener,noreferrer');
//       }
//     }
//   };

//   const handleSearch = () => {
//     if (selectedCountry || selectedSpecialty) {
//       findBycountrygetAllDoctors(selectedCountry, selectedSpecialty);
//     }
//   };

//   const findBycountrygetAllDoctors = async (country, specialization) => {
//     const token = window.localStorage.getItem('UhuruMedToken');
//     setLoading1(true);

//     try {
//       const response = await axios({
//         method: 'GET',
//         url: ApiConfig.doctorMain,
//         headers: {
//           authorization: `Bearer ${token}`,
//         },
//         params: {
//           page: 1,
//           limit: 200,
//           country: country?.name, // assuming CountryFlag has .name
//           search: specialization?.specialization,
//         },
//       });
//       console.log('successsuccess', response?.data?.success);
//       if (response?.data?.error === 'false') {
//         setLoading1(false);

//         console.log('responseresponse', response);
//         setDoctorsfind(response?.data?.data?.docs);
//         // setTotalPages(response?.data?.data?.[0]?.count);
//       } else {
//         setLoading1(false);
//       }
//     } catch (error) {
//       setHasSearched(true);
//       setDoctorsfind([]);
//       setLoading1(false);

//       console.log('errorerror', error);

//       return error?.response;
//     }
//   };

//   const getAppoimentListDoctors = async () => {
//     const token = window.localStorage.getItem('UhuruMedToken');
//     setLoading2(true);
//     try {
//       const response = await axios({
//         method: 'GET',
//         url: ApiConfig.appointmentUserList,
//         headers: {
//           authorization: `Bearer ${token}`,
//         },
//       });
//       console.log('successsuccess', response?.data?.success);
//       if (response?.data?.error === 'false') {
//         console.log('responseresponse', response);
//         setAppointment(response?.data?.data);
//         setLoading2(false);
//         // setTotalPages(response?.data?.data?.[0]?.count);
//       }
//     } catch (error) {
//       setAppointment([]);
//       setLoading2(false);

//       console.log('errorerror', error);

//       return error?.response;
//     }
//   };

//   useEffect(() => {
//     getAllDoctors();
//     getAppoimentListDoctors();
//   }, []);

//   return (
//     <Container maxWidth="xxl">
//       {/* Header */}

//       {/* Welcome Text */}
//       <Typography variant="h4" fontWeight="bold" gutterBottom>
//         Welcome, {userData?.firstName} {userData?.lastName}
//       </Typography>
//       <Box mb={4}>
//         <Typography
//           variant="body1"
//           color="text.secondary"
//           gutterBottom
//           sx={{
//             color: '#000',
//             fontSize: { xs: '18px', sm: '20px', md: '20px' },
//           }}
//         >
//           Select your country and specialty to find a doctor.
//         </Typography>
//       </Box>

//       {/* Search Section */}
//       <Box
//         mb={3}
//         p={2}
//         sx={{
//           backgroundColor: '#fff',
//           borderRadius: 2,
//           maxWidth: 1200, // or any suitable width like 900, 1000, etc.
//           // mx: "auto", // center it
//         }}
//       >
//         <Grid
//           container
//           spacing={{ xs: 2, md: 5 }}
//           columns={{ xs: 2, sm: 8, md: 12 }}
//         >
//           {/* Country Autocomplete */}
//           <Grid size={{ xs: 2, sm: 4, md: 4 }}>
//             <Autocomplete
//               fullWidth
//               options={filteredCountries}
//               value={selectedCountry}
//               onChange={(e, newValue) => setSelectedCountry(newValue)}
//               getOptionLabel={(option) => option.name}
//               renderOption={(props, option) => (
//                 <li {...props}>{option.name}</li>
//               )}
//               sx={{
//                 '& .MuiInputBase-root': {
//                   height: 48, // set height of the input
//                   fontSize: '14px', // input text font size
//                   color: '#333', // input text color
//                   borderRadius: 2,
//                 },
//                 '& .MuiOutlinedInput-notchedOutline': {
//                   borderColor: '#ccc', // border color
//                 },
//                 '&:hover .MuiOutlinedInput-notchedOutline': {
//                   borderColor: '#0077cc', // hover border color
//                 },
//                 '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                   borderColor: '#0077cc', // focused border color
//                 },
//                 '& .MuiInputLabel-root': {
//                   fontSize: '14px',
//                   color: '#555',
//                 },
//               }}
//               slotProps={{
//                 popper: {
//                   modifiers: [
//                     {
//                       name: 'offset',
//                       options: {
//                         offset: [0, 4],
//                       },
//                     },
//                   ],
//                 },
//                 paper: {
//                   sx: {
//                     '& .MuiAutocomplete-option': {
//                       color: '#000000DE',
//                       fontSize: '16px', // 🔴 Dropdown option text color
//                     },
//                   },
//                 },
//               }}
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   InputLabelProps={{ shrink: true }}
//                   label="Country"
//                 />
//               )}
//             />
//           </Grid>

//           {/* Specialty Autocomplete */}
//           <Grid size={{ xs: 2, sm: 4, md: 4 }}>
//             <Autocomplete
//               fullWidth
//               options={specialties}
//               value={selectedSpecialty}
//               onChange={(e, newValue) => setSelectedSpecialty(newValue)}
//               getOptionLabel={(option) => option?.specialization}
//               renderOption={(props, option) => (
//                 <li {...props}>{option?.specialization}</li>
//               )}
//               sx={{
//                 '& .MuiInputBase-root': {
//                   height: 48, // set height of the input
//                   fontSize: '14px', // input text font size
//                   color: '#333', // input text color
//                   borderRadius: 2,
//                 },
//                 '& .MuiOutlinedInput-notchedOutline': {
//                   borderColor: '#ccc', // border color
//                 },
//                 '&:hover .MuiOutlinedInput-notchedOutline': {
//                   borderColor: '#0077cc', // hover border color
//                 },
//                 '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                   borderColor: '#0077cc', // focused border color
//                 },
//                 '& .MuiInputLabel-root': {
//                   fontSize: '14px',
//                   color: '#555',
//                 },
//               }}
//               slotProps={{
//                 popper: {
//                   modifiers: [
//                     {
//                       name: 'offset',
//                       options: {
//                         offset: [0, 4],
//                       },
//                     },
//                   ],
//                 },
//                 paper: {
//                   sx: {
//                     '& .MuiAutocomplete-option': {
//                       color: '#000000DE',
//                       fontSize: '16px', // 🔴 Dropdown option text color
//                     },
//                   },
//                 },
//               }}
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   InputLabelProps={{ shrink: true }}
//                   label="Specialty"
//                   InputProps={{
//                     ...params.InputProps,
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <MedicalServicesIcon />
//                       </InputAdornment>
//                     ),
//                   }}
//                 />
//               )}
//             />
//           </Grid>

//           {/* Search Button */}
//           <Grid item xs={12} sm={2}>
//             <Button
//               variant="contained"
//               fullWidth
//               onClick={handleSearch}
//               sx={{
//                 height: '45px',
//                 width: '250px',
//                 // marginTop: "5px",
//                 backgroundColor: '#2e5ad5',
//               }}
//             >
//               {loading1 ? (
//                 <CircularProgress size={24} sx={{ color: 'white' }} />
//               ) : (
//                 ' Find Doctors'
//               )}
//             </Button>
//           </Grid>
//         </Grid>
//       </Box>
//       <Box mt={2} mb={4}>
//         {doctorListfind && doctorListfind?.length > 0 ? (
//           <Grid container spacing={2}>
//             {doctorListfind.map((doc, index) => (
//               <Grid item xs={12} sm={6} md={4} key={index}>
//                 <Card
//                   onClick={() => setIsDialogOpen1(doc)}
//                   sx={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     p: 2,
//                     borderRadius: 2,
//                     boxShadow: 1,
//                     maxWidth: '420px',
//                     width: '300px',
//                     background: '#FFF',
//                   }}
//                 >
//                   <Avatar
//                     src={doc.profilePic}
//                     alt={doc.firstName}
//                     sx={{ width: 64, height: 64, mr: 2, borderRadius: 1 }}
//                   />
//                   <Box sx={{ flexGrow: 1 }}>
//                     <Typography variant="subtitle1" fontWeight="bold">
//                       {doc.firstName}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       {doc.specialization}
//                     </Typography>
//                     <Box display="flex" alignItems="center" gap={1} mt={0.5}>
//                       <Typography variant="caption" color="text.secondary">
//                         {doc.country}
//                       </Typography>
//                     </Box>
//                   </Box>
//                   <Box textAlign="right" style={{ cursor: 'pointer' }}>
//                     <Typography variant="body2" color="#0077cc" mb={0.5}>
//                       Book now
//                     </Typography>
//                   </Box>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         ) : hasSearched ? (
//           <Box
//             sx={{
//               backgroundColor: '#fff',
//               borderRadius: 2,
//               maxWidth: 1200,
//               height: '60px',
//             }}
//           >
//             <Typography
//               variant="h6"
//               color="text.secondary"
//               textAlign={'center'}
//               style={{ paddingTop: '15px', fontSize: '16px' }}
//             >
//               No doctors found.
//             </Typography>
//           </Box>
//         ) : null}
//       </Box>

//       {/* Quick Links */}
//       <Typography
//         variant="h6"
//         fontWeight="bold"
//         style={{ color: '#0077cc', paddingBottom: '15px' }}
//         gutterBottom
//       >
//         Quick Links
//       </Typography>
//       <Grid container spacing={2}>
//         {quickLinks?.map((item, index) => (
//           <Grid item xs={12} sm={3} md={3} key={index}>
//             <Card
//               onClick={() => navigate(item?.navi)}
//               // variant="outlined"
//               sx={{
//                 textAlign: 'center',
//                 p: 2,
//                 cursor: 'pointer',
//                 height: '100%',
//                 display: 'flex',
//                 flexDirection: 'column',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 borderRadius: 2,
//                 maxWidth: '300px',
//                 width: '280px',
//                 transition: 'transform 0.2s ease',
//                 '&:hover': {
//                   transform: 'translateY(-4px)',
//                   boxShadow: 3,
//                 },
//               }}
//             >
//               <Box mb={1}>{item.icon}</Box>
//               <Typography
//                 // variant="body1"
//                 // fontWeight="medium"
//                 sx={{
//                   color: '#000',
//                   fontSize: { xs: '14px', sm: '18px', md: '18px' },
//                 }}
//               >
//                 {item.label}
//               </Typography>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>

//       {/* Next Appointment */}
//       <Box mt={3} mb={2}>
//         <Typography
//           variant="h6"
//           fontWeight="bold"
//           style={{ color: '#0077cc' }}
//           gutterBottom
//         >
//           Appointments
//         </Typography>
//       </Box>

//       <Box maxWidth="lg">
//         {loading2
//           ? // Show 4 skeleton cards
//           Array.from({ length: 4 }).map((_, index) => (
//             <Card
//               key={index}
//               elevation={0}
//               sx={{
//                 mb: 2,
//                 borderRadius: 2,
//                 p: 2,
//                 display: 'flex',
//                 justifyContent: 'space-between',
//               }}
//             >
//               <Skeleton
//                 variant="rectangular"
//                 width={120}
//                 height={70}
//                 sx={{ borderRadius: 1, marginRight: '8px' }}
//               />
//               <Box style={{ width: '100%' }}>
//                 <Skeleton variant="text" width="40%" height={20} />
//                 <Skeleton variant="text" width="60%" height={30} />
//                 <Skeleton variant="text" width="30%" height={20} />
//               </Box>
//               <Box>
//                 <Skeleton
//                   variant="rectangular"
//                   width={120}
//                   height={36}
//                   sx={{ mt: 2, borderRadius: 1 }}
//                 />
//               </Box>
//             </Card>
//           ))
//           : appointments?.slice(0, 4)?.map((appointment) => (
//             <Card
//               key={appointment.id}
//               elevation={0}
//               sx={{ mb: 2, borderRadius: 2 }}
//             >
//               <Box
//                 sx={{
//                   display: 'flex',
//                   justifyContent: 'space-between',
//                   alignItems: 'center',
//                   p: 2,
//                 }}
//               >
//                 <Box sx={{}}>
//                   <Avatar
//                     src={
//                       appointment?.doctor?.profilePic ??
//                         'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkkE1LSJXHRCOSWyn1wFq8RhGSO8_geSROkA&s'
//                     }
//                     sx={{
//                       width: 70,
//                       height: 80,
//                       mb: 1,
//                       borderRadius: 2,
//                       marginRight: '12px',
//                       objectFit: 'cover',
//                     }}
//                   />
//                 </Box>
//                 {/* Left Content */}
//                 <CardContent sx={{ flex: 1, p: 0 }}>
//                   <Typography variant="subtitle2" color="text.secondary">
//                       Next Appointment
//                   </Typography>
//                   <Typography
//                     variant="body1"
//                     fontWeight="bold"
//                     gutterBottom
//                     sx={{
//                       color: '#000',
//                       fontSize: { xs: '14px', sm: '16px', md: '16px' },
//                     }}
//                   >
//                     {moment(appointment?.endTime).format('MMM Do YY')} •{' '}
//                     {appointment?.slotTime}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                       with {appointment?.doctorName}
//                   </Typography>
//                 </CardContent>

//                 {/* Right Button */}
//                 <Box>
//                   <Button
//                     variant="contained"
//                     onClick={() => handelHander(appointment)}
//                     disabled={appointment?.status !== 'SCHEDULED'}
//                     sx={{
//                       textTransform: 'capitalize',
//                       backgroundColor:
//                           appointment?.status === 'CANCELLED'
//                             ? '#d32f2f'
//                             : appointment?.status === 'SCHEDULED'
//                               ? '#2e5ad5'
//                               : '#9e9e9e',
//                       '&:hover': {
//                         backgroundColor:
//                             appointment?.status === 'CANCELLED'
//                               ? '#c62828'
//                               : appointment?.status === 'SCHEDULED'
//                                 ? '#2e5ad5'
//                                 : '#757575',
//                       },
//                     }}
//                   >
//                     {appointment?.status === 'SCHEDULED' &&
//                         (appointment?.type === 'CHAT' ? (
//                           <BsChatSquareTextFill
//                             style={{ marginRight: '10px' }}
//                           />
//                         ) : (
//                           <HiMiniVideoCamera style={{ marginRight: '10px' }} />
//                         ))}

//                     {appointment?.status === 'CANCELLED'
//                       ? 'CANCELLED'
//                       : appointment?.status === 'SCHEDULED'
//                         ? `JOIN ${appointment?.type}`
//                         : appointment?.status}
//                   </Button>
//                 </Box>
//               </Box>
//             </Card>
//           ))}
//       </Box>

//       {isDialogOpen1 && (
//         <SingleDoctorAppoint
//           open={isDialogOpen1}
//           onClose={() => setIsDialogOpen1(false)}
//         />
//       )}
//     </Container>
//   );
// };

// export default Dashboard;
