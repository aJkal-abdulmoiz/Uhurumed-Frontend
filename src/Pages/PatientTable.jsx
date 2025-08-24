'use client';

import { useEffect, useState } from 'react';
import Select from 'react-select';
import { CountryFlag } from '@/Context/CountryFlag';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import { getDoctorPatients } from '@/queries/DoctorQueries/patientsList';

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

const statusColors = {
  SCHEDULED: 'bg-cyan-100 text-cyan-700',
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  PENDING: 'bg-orange-100 text-orange-700',
};

const specialityOptions = [
  { value: 'General & Primary Care', label: 'General & Primary Care', icon: <MedicalServicesIcon /> },
  { value: 'Surgical Specialties', label: 'Surgical Specialties', icon: <MedicalServicesIcon /> },
  { value: 'Specialized Care', label: 'Specialized Care', icon: <MedicalServicesIcon /> },
  {
    value: 'Sensory and Neurological Systems',
    label: 'Sensory and Neurological Systems',
    icon: <MedicalServicesIcon />,
  },
  { value: 'Diagnostic & Lab-Based', label: 'Diagnostic & Lab-Based', icon: <MedicalServicesIcon /> },
  { value: 'Mental Health', label: 'Mental Health', icon: <MedicalServicesIcon /> },
  {
    value: 'Women\'s and Reproductive Health',
    label: 'Women\'s and Reproductive Health',
    icon: <MedicalServicesIcon />,
  },
  { value: 'Other', label: 'Other', icon: <MedicalServicesIcon /> },
];

export default function PatientsPage() {
  const [country, setCountry] = useState('');
  const [speciality, setSpeciality] = useState('');
  const [patient, setPatients] = useState([]);

  const getDoctorPatientsWrapper = async () => {
    const rawPatients = await getDoctorPatients({ limit: 10 });
    console.log('RAW PATIENTS:', rawPatients);
    setPatients(rawPatients);
  };

  useEffect(() => {
    getDoctorPatientsWrapper();
  }, []);

  return (
    <div className="px-4 py-8 mt-10">
      <h1 className="text-3xl font-bold mb-6">Patient List</h1>

      {/* Filter Section */}
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
            placeholder="Select Category"
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
          // onClick={handleSearch}
          className="px-8 py-3 bg-[#00AAEE] text-white rounded-full font-medium hover:bg-[#0099DD] transition-colors flex-shrink-0"
        >
          Search
        </button>
      </div>

      <div className="hidden md:block bg-white rounded-2xl shadow-md border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Patient Detail List</h2>

        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            {/* Table Header - Fixed alignment */}
            <div className="grid grid-cols-[80px_200px_80px_120px_150px_180px_200px] gap-4 bg-gray-100 text-gray-600 font-semibold py-3 px-4 rounded-full text-sm">
              <div className="text-center">Info</div>
              <div className="text-left">Patient Name</div>
              <div className="text-center">Age</div>
              <div className="text-center">DOB</div>
              <div className="text-center">Symptoms</div>
              <div className="text-left">Reason for admission</div>
              <div className="text-center">Action and Status</div>
            </div>

            {/* Table Rows - Fixed alignment */}
            {patient.map((patient) => (
              <div
                key={patient.id}
                className="grid grid-cols-[80px_200px_80px_120px_150px_180px_200px] gap-4 py-4 px-4 border-b border-gray-200 items-center text-sm"
              >
                <div className="flex justify-center">
                  <img
                    src={patient?.patient?.profilePic || '/placeholder.png'}
                    alt="Patient Avatar"
                    className="rounded-full h-[50px] w-[50px] object-cover"
                  />
                </div>
                <div className="font-medium text-left">
                  {patient?.patient?.firstName} {patient?.patient?.lastName}
                </div>
                <div className="text-center">
                  {new Date().getFullYear() - new Date(patient?.patient?.dateOfBirth).getFullYear()}
                </div>
                <div className="text-center">
                  {patient?.patient?.dateOfBirth ? patient?.patient?.dateOfBirth?.slice(0, 10) : 'N/A'}
                </div>
                <div className="flex justify-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {patient.symptoms ? patient?.symptoms : 'N/A'}
                  </span>
                </div>
                <div className="text-left">
                  <div className="font-semibold">{patient?.slot?.title}</div>
                  <div className="text-xs text-gray-600 mt-1">{patient.currentStatus}</div>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <button className="bg-[#04A5DE] text-white px-4 py-2 rounded-full text-xs hover:bg-cyan-600 transition-colors">
                    Contact Patient
                  </button>
                  <span
                    className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium min-w-[80px] ${statusColors[patient.status]}`}
                  >
                    {patient?.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="md:hidden space-y-4">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#0000004D]">
          <div className="p-3 sm:p-4 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Patient Detail List</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {patient.length > 0 ? (
              patient.map((patientItem, index) => (
                <div key={patientItem.id} className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3 flex-1">
                      <img
                        src={patientItem?.patient?.profilePic || '/placeholder.png'}
                        alt="Patient Avatar"
                        className="rounded-full h-[50px] w-[50px] object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-base">
                          {patientItem?.patient?.firstName} {patientItem?.patient?.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Age: {new Date().getFullYear() - new Date(patientItem?.patient?.dateOfBirth).getFullYear()}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium min-w-[80px] ${statusColors[patientItem.status]}`}
                    >
                      {patientItem?.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">DOB:</span>
                      <p className="text-gray-600">
                        {patientItem?.patient?.dateOfBirth ? patientItem?.patient?.dateOfBirth?.slice(0, 10) : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Symptoms:</span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 ml-2">
                        {patientItem.symptoms ? patientItem?.symptoms : 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Reason for admission:</span>
                      <p className="text-gray-600 font-semibold">{patientItem?.slot?.title}</p>
                      <p className="text-xs text-gray-500">{patientItem.currentStatus}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <button className="flex items-center gap-1 bg-[#04A5DE] text-white px-3 py-2 rounded-lg hover:bg-cyan-600 transition-colors text-sm">
                      <span>Contact Patient</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">No patients found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}





// import React, { useContext, useEffect, useState } from 'react';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Typography,
//   Link,
//   Box,
//   CircularProgress,
//   Tooltip,
//   IconButton,
//   Pagination,
//   TextField,
//   Avatar,
//   Container,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
// } from '@mui/material';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { MdModeEditOutline, MdOutlineRemoveRedEye } from 'react-icons/md';
// import { TbPasswordUser } from 'react-icons/tb';
// import { IoEyeSharp } from 'react-icons/io5';
// import { HiEye } from 'react-icons/hi2';
// import Btn from '../CommonComponenet/CommonButtons/Btn';
// import { MdDelete } from 'react-icons/md';
// import PatientDetailsDialog from '../CommonComponenet/CommonButtons/PatientDetailsDialog';
// import CancelBtn from '../CommonComponenet/CommonButtons/CancelBtn';
// import AddAppointmentDialog from '../CommonComponenet/CommonButtons/AddAppointmentDialog';
// import EditPatient from '../CommonComponenet/CommonButtons/EditPatient';
// import { AuthContext } from '../Context/Auth';
// import axios from 'axios';
// import { MdBlock } from 'react-icons/md';
// import ApiConfig from '../ApiConfig/ApiConfig';
// import toast from 'react-hot-toast';

// export default function Payment() {
//   const location = useLocation();
//   const [plans, setPlans] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const [totalPages, setTotalPages] = useState('');
//   const auth = useContext(AuthContext);
//   const userData = auth?.userData;
//   console.log('userDatauserDatauserData', userData);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const [patients, setPatients] = useState([]);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [open1, setOpen1] = useState(false);

//   const handlePageChange = (event, value) => {
//     setPage(value);
//   };

//   const handleSearchQueryChange = (event) => {
//     setSearchQuery(event.target.value);
//   };
//   const [deleteOpen, setDeleteOpen] = useState(false);

//   const handleOpen = () => setIsDialogOpen(true);
//   const handleClose = () => setIsDialogOpen(false);

//   const handleDeleteConfirm = () => {
//     // TODO: Add delete logic here
//     setDeleteOpen(false);
//   };

//   const handleDeleteClick = () => {
//     setDeleteOpen(true);
//   };
//   const handleDeleteCancel = () => {
//     setDeleteOpen(false);
//   };

//   const getAllDoctors = async () => {
//     const token = window.localStorage.getItem('UhuruMedToken');
//     setLoading(true);

//     try {
//       const response = await axios({
//         method: 'GET',
//         url: ApiConfig.adminUserList,
//         headers: {
//           authorization: `Bearer ${token}`,
//         },
//         params: {
//           page: page,
//           limit: limit,
//           search: searchQuery,
//         },
//       });
//       console.log('successsuccess', response?.data?.success);
//       if (response?.data?.error === 'false') {
//         setLoading(false);

//         console.log('responseresponse', response);
//         setPatients(
//           response?.data?.data?.docs?.filter(
//             (item) => item?.userType === 'USER'
//           )
//         );
//         setTotalPages(response?.data?.data?.totalPages);
//         // setTotalPages(response?.data?.data?.[0]?.count);
//       }
//     } catch (error) {
//       setPatients([]);
//       setLoading(false);

//       console.log('errorerror', error);

//       return error?.response;
//     }
//   };
//   const getAllDoctorsDelete = async (id, status) => {
//     const token = window.localStorage.getItem('UhuruMedToken');
//     setLoading(true);

//     try {
//       const response = await axios({
//         method: 'PUT',
//         url: ApiConfig.adminUserListDelete,
//         headers: {
//           authorization: `Bearer ${token}`,
//         },
//         params: {
//           id: id,
//         },
//         data: {
//           status: status,
//         },
//       });
//       console.log('successsuccess', response?.data?.success);
//       if (response?.data?.error === 'false') {
//         setLoading(false);
//         toast.success(response.data.message);
//         setDeleteOpen(false);
//         getAllDoctors();
//         // setTotalPages(response?.data?.data?.[0]?.count);
//       }
//     } catch (error) {
//       setLoading(false);
//       console.log('errorerror', error);

//       return error?.response;
//     }
//   };

//   useEffect(() => {
//     getAllDoctors();
//   }, [searchQuery, page, limit]);

//   return (
//     <>
//       <Container maxWidth="xxl">
//         <Box
//           mb={2.5}
//           sx={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             // alignItems:'center',
//             flexDirection: { xs: 'column', md: 'row' },
//           }}
//         >
//           <Typography
//             variant="h4"
//             sx={{ fontSize: '30px', fontWeight: '700', fontFamily: 'rubik' }}
//           >
//             All Patients
//           </Typography>
//           <Box
//             sx={{
//               display: 'flex',
//               gap: 2,
//               // flexDirection: { xs: "column", md: "row" },
//               // marginTop: { xs: 2 },
//             }}
//           >
//             <TextField
//               variant="outlined"
//               size="small"
//               placeholder="Search..."
//               type="search"
//               value={searchQuery}
//               onChange={handleSearchQueryChange}
//               sx={{
//                 backgroundColor: '#fff',
//                 borderRadius: '8px',
//                 marginTop: {
//                   xs: '10px',
//                   md: '0px',
//                 },
//                 minWidth: 200,
//                 '& .MuiOutlinedInput-root': {
//                   paddingRight: 0,
//                   padding: '2.5px 0px',
//                   borderRadius: '10px',
//                   fontSize: '14px',
//                 },
//               }}
//               InputProps={{
//                 sx: { paddingRight: '8px' },
//               }}
//             />
//             {userData?.userType === 'ADMIN' && (
//               <Btn label="New Patient" onClick={() => setOpen(true)} />
//             )}
//           </Box>
//         </Box>
//         <TableContainer
//           component={Paper}
//           elevation={3}
//           sx={{
//             height: 'auto',
//             background: '#fff',
//             borderRadius: '10px',
//             marginTop: '20px',
//             width: { xs: '100% !important', md: '100% !important' },
//           }}
//         >
//           <Table>
//             <TableHead>
//               <TableRow>
//                 {[
//                   'Patient Profile',
//                   'Full name',
//                   'Email',
//                   'Phone',
//                   'Role',
//                   // "Gender",
//                   'Status',
//                   'Action',
//                 ].map((heading, i) => (
//                   <TableCell
//                     key={i}
//                     sx={{ fontWeight: 'bold', textWrap: 'nowrap' }}
//                   >
//                     {heading}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {loading ? (
//                 <TableRow>
//                   <TableCell
//                     colSpan={6}
//                     align="center"
//                     sx={{ borderBottom: 'none' }}
//                   >
//                     <Box sx={{ py: 4, marginLeft: '10rem' }}>
//                       <CircularProgress />
//                     </Box>
//                   </TableCell>
//                 </TableRow>
//               ) : patients?.length > 0 ? (
//                 patients?.map((row, index) => (
//                   <TableRow
//                     key={index}
//                     sx={{
//                       backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff',
//                       borderRadius: '10px',
//                       '&:last-child td, &:last-child th': { border: 0 },
//                     }}
//                   >
//                     <TableCell>
//                       <Box display="flex" alignItems="center" gap={1}>
//                         <Avatar
//                           src={row.profilePic}
//                           alt={row.firstName}
//                           sx={{ width: 50, height: 50, borderRadius: 1 }}
//                         />
//                       </Box>
//                     </TableCell>
//                     {/* <TableCell sx={{ padding: "25px" }}>{index + 1}</TableCell> */}

//                     <TableCell style={{ textWrap: 'nowrap' }}>
//                       {row?.firstName} {row?.lastName}
//                     </TableCell>
//                     <TableCell style={{ textWrap: 'nowrap' }}>
//                       {row.email}
//                     </TableCell>
//                     <TableCell style={{ textWrap: 'nowrap' }}>
//                       {row.phone ? `+${row.phone}` : ''}
//                     </TableCell>
//                     <TableCell style={{ textWrap: 'nowrap' }}>
//                       {row.userType}
//                     </TableCell>
//                     {/* <TableCell style={{ textWrap: "nowrap" }}>
//                       {row.gender || "--"}
//                     </TableCell> */}
//                     <TableCell
//                       style={{
//                         textWrap: 'nowrap',
//                         color:
//                           row?.status === 'ACTIVE'
//                             ? 'green'
//                             : row?.status === 'BLOCKED'
//                               ? 'red'
//                               : 'Orange',
//                       }}
//                     >
//                       {row.status}
//                     </TableCell>
//                     <TableCell style={{ textWrap: 'nowrap' }}>
//                       <Box>
//                         {/* Show only for userType === "DOCTOR" */}
//                         {userData?.userType === 'DOCTOR' && (
//                           <IconButton onClick={() => setIsDialogOpen(row)}>
//                             <IoEyeSharp />
//                           </IconButton>
//                         )}

//                         {/* Show only for userType === "ADMIN" */}
//                         {userData?.userType === 'ADMIN' && (
//                           <>
//                             <IconButton onClick={() => setIsDialogOpen(row)}>
//                               <IoEyeSharp />
//                             </IconButton>

//                             <IconButton onClick={() => setOpen1(row)}>
//                               <MdModeEditOutline />
//                             </IconButton>

//                             <IconButton onClick={() => setDeleteOpen(row)}>
//                               <MdBlock
//                                 color={
//                                   row?.status === 'ACTIVE' ? 'Green' : 'red'
//                                 }
//                               />
//                             </IconButton>
//                           </>
//                         )}
//                       </Box>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell colSpan={6} sx={{ height: '100px', p: 0 }}>
//                     <Box
//                       sx={{
//                         height: '100%',
//                         display: 'flex',
//                         justifyContent: 'center',
//                         alignItems: 'center',
//                       }}
//                     >
//                       <Typography
//                         variant="h6"
//                         color="textSecondary"
//                         sx={{ fontSize: '15px !important' }}
//                       >
//                         No Data Found
//                       </Typography>
//                     </Box>
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//         {totalPages > 1 && patients?.length > 0 && (
//           <Box
//             sx={{
//               display: 'flex',
//               justifyContent: 'center',
//               textAlign: 'center',
//               // marginTop: "10px",
//               paddingTop: '20px',
//               '& .Mui-selected': {
//                 backgroundColor: '#2e5ad5 !important',
//                 color: '#fff !important',
//                 borderRadius: '5px',
//               },
//               '& .MuiPaginationItem-root': { color: 'black' },
//             }}
//           >
//             <Pagination
//               page={page}
//               onChange={handlePageChange}
//               count={totalPages}
//             />
//           </Box>
//         )}

//         {isDialogOpen && (
//           <PatientDetailsDialog
//             open={isDialogOpen}
//             onClose={() => setIsDialogOpen(false)}
//           />
//         )}
//       </Container>
//       <Dialog
//         PaperProps={{
//           sx: {
//             borderRadius: '10px', // Set border radius
//             p: 2, // Add padding (optional, adjust as needed)
//           },
//         }}
//         open={deleteOpen}
//         onClose={handleDeleteCancel}
//       >
//         <DialogTitle style={{ fontWeight: 'bold', textAlign: 'center' }}>
//           Confirm {deleteOpen?.status === 'ACTIVE' ? 'Blocked' : 'Active'}
//         </DialogTitle>

//         <DialogContent>
//           <DialogContentText style={{ fontSize: '17px', textAlign: 'center' }}>
//             Are you sure you want to delete {deleteOpen?.firstName}{' '}
//             {deleteOpen?.lastName} ?
//           </DialogContentText>
//         </DialogContent>

//         <DialogActions
//           sx={{
//             justifyContent: 'center',
//             pb: 2,
//             gap: 2, // spacing between buttons
//           }}
//         >
//           <CancelBtn label="No" onClick={handleDeleteCancel} variant="outlined">
//             Cancel
//           </CancelBtn>
//           <Btn
//             label="Yes"
//             onClick={() =>
//               getAllDoctorsDelete(
//                 deleteOpen?.id,
//                 deleteOpen?.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE'
//               )
//             }
//             variant="contained"
//             color="error"
//           >
//             Delete
//           </Btn>
//         </DialogActions>
//       </Dialog>

//       {open && (
//         <AddAppointmentDialog open={open} onClose={() => setOpen(false)} />
//       )}
//       {open1 && <EditPatient open={open1} onClose={() => setOpen1(false)} />}
//     </>
//   );
// }
