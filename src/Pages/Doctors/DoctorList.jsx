import { useState, useEffect } from 'react';
import DoctorCard from '../../NewComponents/userDashboard/DoctorCard';
import AppointmentSidebar from '../../NewComponents/userDashboard/AppointmentSidebar';
import Select from 'react-select';
import { getAllDoctors,getDoctorSlots } from '@/queries/PatientQueries/doctors';
import { bookAppointment } from '@/queries/PatientQueries/appointments';
import { CountryFlag } from '@/Context/CountryFlag';
import dayjs from 'dayjs';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import toast from 'react-hot-toast';

const countryOptions = CountryFlag.map((country) => ({
  value: country.name,
  label: (
    <div className="flex items-center gap-2">
      <img
        src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`}
        alt={country.name}
        className="w-5 h-4 object-cover rounded-sm"
      />
      <span>{country.name}</span>
    </div>
  ),
}));

const specialityOptions = [

  { value: 'General & Primary Care',label:'General & Primary Care', icon: <MedicalServicesIcon /> },
  { value: 'Surgical Specialties',label:'Surgical Specialties', icon: <MedicalServicesIcon /> },
  { value: 'Specialized Care',label:'Specialized Care', icon: <MedicalServicesIcon /> },
  {
    value: 'Sensory and Neurological Systems',label:'Sensory and Neurological Systems',
    icon: <MedicalServicesIcon />,
  },
  { value: 'Diagnostic & Lab-Based',label:'Diagnostic & Lab-Based', icon: <MedicalServicesIcon /> },
  { value: 'Mental Health',label:'Mental Health', icon: <MedicalServicesIcon /> },
  {
    value: 'Women’s and Reproductive Health',label:'Women’s and Reproductive Health',
    icon: <MedicalServicesIcon />,
  },
  { value: 'Other',label:'Other', icon: <MedicalServicesIcon /> },
];

// Helper function to group slots by date
const groupSlotsByDate = (slots) => {
  const grouped = {};

  slots.forEach(slot => {
    const date = dayjs(slot.date).format('YYYY-MM-DD');
    const day = dayjs(slot.date).format('ddd');
    const dateNum = dayjs(slot.date).format('D');

    if (!grouped[date]) {
      grouped[date] = {
        date: dateNum,
        day,
        time_slots: [],
      };
    }
    grouped[date].time_slots.push({
      id: slot.id,
      formattedTime: slot.formattedTime,
      date: slot.date
    });
  });

  return Object.values(grouped);
};

export default function DoctorsList() {
  const [country, setCountry] = useState('');
  const [speciality, setSpeciality] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });
  const [doctorSlots, setDoctorSlots] = useState({});
  const [slotsLoading, setSlotsLoading] = useState(false);

  useEffect(()=>{
    console.log(doctorSlots);
  },[doctorSlots]);
  // Fetch doctors data
  const fetchDoctors = async (page = 1, filters = {}) => {
    try {
      setLoading(true);
      const response = await getAllDoctors({
        ...filters,
        page,
        limit: pagination.limit
      });

      if (response.success) {
        setDoctors(response.data.docs);
        setPagination({
          page: response.data.page,
          limit: response.data.limit,
          total: response.data.total,
          totalPages: response.data.totalPages
        });
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch slots for a specific doctor
  const fetchDoctorSlots = async (doctorId) => {
    if (doctorSlots[doctorId]) return; // Already fetched

    try {
      setSlotsLoading(true);
      const data = await getDoctorSlots(doctorId);

      setDoctorSlots(prev => ({
        ...prev,
        [doctorId]: groupSlotsByDate(data.data)
      }));

    } catch (error) {
      console.error('Error fetching doctor slots:', error);
    } finally {
      setSlotsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchDoctors();
  }, []);

  // Handle search with filters
  const handleSearch = () => {
    const filters = {};
    if (country) filters.country = country;
    if (speciality) filters.specialization  = speciality;
    fetchDoctors(1, filters);
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      const filters = {};
      if (country) filters.country = country;
      if (speciality) filters.specialization  = speciality;
      fetchDoctors(newPage, filters);
    }
  };

  // Handle book appointment
  const handleBookAppointment = async (doctor) => {
    setSelectedDoctor(doctor);
    setIsSidebarOpen(true);
    // Fetch slots when opening the sidebar
    await fetchDoctorSlots(doctor.id);
  };

  // Handle close sidebar
  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedDoctor(null);
  };

  // Submit appointment booking
  const handleSubmitAppointment = async (bookingData) => {
    try {
      const response = await bookAppointment({
        ...bookingData,
        doctorId: selectedDoctor.id
      });
      if(response.success === false){
        toast.error(response.message);
      }
      console.log('book appointment response:',response.message);

      return response;

    } catch (error) {
      console.error('Booking error:', error);
      throw error;
    }
  };

  // Map API data to match the expected format for DoctorCard
  const formattedDoctors = doctors.map(doctor => ({
    id: doctor.id,
    name: `Dr. ${doctor.firstName} ${doctor.lastName}`,
    image: doctor.profilePic || 'images/doctorpfp.png',
    specialty: doctor.specialization,
    email: doctor.email,
    location: doctor.country,
    fee: `${doctor.consultationFee}$`,
    slots_available: doctorSlots[doctor.id] || []
  }));

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <div className="max-w-8xl mx-auto py-8 px-4 sm:px-6 lg:px-2">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 mt-10">Doctors List</h1>

        {/* Search Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Select
              value={countryOptions.find((option) => option.value === country)}
              onChange={(selectedOption) => setCountry(selectedOption ? selectedOption.value : '')}
              options={countryOptions}
              isClearable={true}
              placeholder="Select Country"
              classNames={{
                control: (state) =>
                  `!w-full !px-6 !py-1.5 !bg-white !border !border-gray-300 !rounded-full !shadow-none ${
                    state.isFocused ? '!ring-2 !ring-[#00AAEE] !border-[#00AAEE]' : ''
                  } !transition-colors`,
                valueContainer: () => '!p-0',
                input: () => '!m-0 !p-0 !text-gray-500',
                placeholder: () => '!text-gray-500',
                singleValue: () => '!text-gray-900',
                indicatorSeparator: () => '!hidden',
                dropdownIndicator: () => '!text-gray-700 !pr-2',
                menu: () => '!rounded-lg !shadow-lg !border !border-gray-200 !mt-2',
                option: (state) =>
                  `!py-2 !px-4 !cursor-pointer ${
                    state.isSelected ? '!bg-[#00AAEE] !text-white' : '!bg-white !text-gray-900'
                  } ${
                    state.isFocused && !state.isSelected ? '!bg-gray-100 !text-gray-900' : ''
                  } hover:!bg-gray-100 hover:!text-gray-900 transition-colors`,
              }}
            />
          </div>
          <div className="relative flex-1">
            <Select
              value={specialityOptions.find((option) => option.value === speciality)}
              onChange={(selectedOption) => setSpeciality(selectedOption ? selectedOption.value : '')}
              options={specialityOptions}
              isClearable={true}
              placeholder="Select Speciality"
              classNames={{
                control: (state) =>
                  `!w-full !px-6 !py-1.5 !bg-white !border !border-gray-300 !rounded-full !shadow-none ${
                    state.isFocused ? '!ring-2 !ring-[#00AAEE] !border-[#00AAEE]' : ''
                  } !transition-colors`,
                valueContainer: () => '!p-0',
                input: () => '!m-0 !p-0 !text-gray-500',
                placeholder: () => '!text-gray-500',
                singleValue: () => '!text-gray-900',
                indicatorSeparator: () => '!hidden',
                dropdownIndicator: () => '!text-gray-700 !pr-2',
                menu: () => '!rounded-lg !shadow-lg !border !border-gray-200 !mt-2',
                option: (state) =>
                  `!py-2 !px-4 !cursor-pointer ${
                    state.isSelected ? '!bg-[#00AAEE] !text-white' : '!bg-white !text-gray-900'
                  } ${
                    state.isFocused && !state.isSelected ? '!bg-gray-100 !text-gray-900' : ''
                  } hover:!bg-gray-100 hover:!text-gray-900 transition-colors`,
              }}
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-8 py-3 bg-[#00AAEE] text-white rounded-full font-medium hover:bg-[#0099DD] transition-colors flex-shrink-0"
          >
            Search
          </button>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00AAEE]"></div>
          </div>
        )}


        {/* Doctors Grid */}
        {!loading && !error && (
          formattedDoctors.length > 0 ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {formattedDoctors.map((doctor) => (
                  <DoctorCard
                    key={doctor.id}
                    doctor={doctor}
                    onBookAppointment={() => handleBookAppointment(doctor)}
                    slotsLoading={slotsLoading && selectedDoctor?.id === doctor.id}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <nav className="inline-flex rounded-md shadow">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="px-4 py-2 rounded-l-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
              Previous
                    </button>
                    {[...Array(pagination.totalPages).keys()].map((page) => (
                      <button
                        key={page + 1}
                        onClick={() => handlePageChange(page + 1)}
                        className={`px-4 py-2 border-t border-b border-gray-300 ${
                          pagination.page === page + 1
                            ? 'bg-[#00AAEE] text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {page + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className="px-4 py-2 rounded-r-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
              Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <svg
                className="w-24 h-24 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="mt-4 text-lg font-medium text-gray-600">
        No doctors found matching your criteria
              </p>
            </div>
          )
        )}
      </div>

      {/* Appointment Sidebar */}
      {selectedDoctor && (
        <AppointmentSidebar
          doctor={selectedDoctor}
          isOpen={isSidebarOpen}
          onClose={handleCloseSidebar}
          onSubmit={handleSubmitAppointment}
          slots={doctorSlots[selectedDoctor.id] || []}
          slotsLoading={slotsLoading}
        />
      )}
    </div>
  );
}



// import React, { useEffect, useState } from 'react';
// import {
//   Box,
//   Grid,
//   Typography,
//   Breadcrumbs,
//   Link,
//   TextField,
//   Container,
//   CircularProgress,
// } from '@mui/material';
// import DoctorCard from '../../CommonComponenet/CommonButtons/DoctorCard';
// import Btn from '../../CommonComponenet/CommonButtons/Btn';
// import { useNavigate } from 'react-router-dom';
// import AddAppointmentDialog from '../../CommonComponenet/CommonButtons/AddAppointmentDialog';
// import AddDoctor from '../../CommonComponenet/CommonButtons/AddDoctor';
// import EditDoctor from '../../CommonComponenet/CommonButtons/EditDoctor';
// import ApiConfig from '../../ApiConfig/ApiConfig';
// import axios from 'axios';
// import toast from 'react-hot-toast';

// const DoctorsList = () => {
//   const navigate = useNavigate();
//   const [searchQuery, setSearchQuery] = useState('');
//   const [open, setOpen] = useState(false);
//   const [open1, setOpen1] = useState(false);
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const [loading, setLoading] = useState(false);
//   const [doctors, setDoctors] = useState([]);
//   console.log('dasgasdgas', doctors);

//   const handleSearchQueryChange = (event) => {
//     setSearchQuery(event.target.value);
//   };

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
//           page: page,
//           limit: 200,
//           search: searchQuery,
//         },
//       });
//       console.log('successsuccess', response?.data?.success);
//       if (response?.data?.error === 'false') {
//         setLoading(false);

//         console.log('responseresponse', response);
//         setDoctors(response?.data?.data?.docs);
//         // setTotalPages(response?.data?.data?.[0]?.count);
//       } else{
//         setLoading(false);
//       }
//     } catch (error) {
//       setDoctors([]);
//       setLoading(false);

//       console.log('errorerror', error);

//       return error?.response;
//     }
//   };

//   useEffect(() => {
//     getAllDoctors();
//   }, [searchQuery]);

//   return (
//     <Container maxWidth="xxl">
//       <Box
//         mb={2.5}
//         sx={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           flexDirection: { xs: 'column', md: 'row' },
//         }}
//       >
//         <Typography
//           variant="h4"
//           sx={{ fontSize: '30px', fontWeight: '700', fontFamily: 'rubik' }}
//         >
//           Doctors List
//         </Typography>
//         <Box sx={{ display: 'flex', gap: 2 }}>
//           <TextField
//             variant="outlined"
//             size="small"
//             placeholder="Search by name, country"
//             type="search"
//             value={searchQuery}
//             onChange={handleSearchQueryChange}
//             sx={{
//               backgroundColor: '#fff',
//               borderRadius: '8px',
//               marginTop: {
//                 xs: '10px',
//                 md: '0px',
//               },
//               minWidth: 200,
//               '& .MuiOutlinedInput-root': {
//                 paddingRight: 0,
//                 padding: '2.5px 0px',
//                 borderRadius: '10px',
//                 fontSize: '14px',
//               },
//             }}
//             InputProps={{
//               sx: { paddingRight: '8px' },
//             }}
//           />
//           <Btn label="New Doctor" onClick={() => setOpen(true)} />
//         </Box>
//       </Box>
//       {loading ? (
//         <Box
//           display="flex"
//           justifyContent="center"
//           alignItems="center"
//           height="50vh"
//         >
//           <CircularProgress />
//         </Box>
//       ) : doctors?.length > 0 ? (
//         <Grid
//           container
//           spacing={{ xs: 2, md: 3 }}
//           columns={{ xs: 4, sm: 8, md: 12 }}
//         >
//           {doctors?.map((doc, index) => (
//             <Grid key={index} size={{ xs: 12, sm: 4, md: 4, lg: 3 }}>
//               <DoctorCard
//                 {...doc}
//                 main={doc}
//                 setOpen1={setOpen1}
//                 getAllDoctors={() => getAllDoctors()}
//               />
//             </Grid>
//           ))}
//         </Grid>
//       ) : (
//         <Box
//           display="flex"
//           flexDirection="column"
//           alignItems="center"
//           justifyContent="center"
//           height="100%"
//           textAlign="center"
//           py={5}
//         >
//           <img
//             src="/Images/404.png" // <-- Replace with your image path
//             alt="No results"
//             style={{ maxWidth: 300, marginBottom: 16 }}
//           />
//           <Typography variant="h5" fontWeight="bold" color="#0077CC">
//             {'No results found'}
//           </Typography>
//           <Typography variant="body1" color="textSecondary">
//             {'We couldn’t find what you searched for. Try searching again.'}
//           </Typography>
//         </Box>
//       )}
//       {open && <AddDoctor open={open} onClose={() => setOpen(false)} />}
//       {open1 && <EditDoctor open={open1} onClose={() => setOpen1(false)} />}
//     </Container>
//   );
// };

// export default DoctorsList;
