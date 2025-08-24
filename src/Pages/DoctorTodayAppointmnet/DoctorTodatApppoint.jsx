import React, { useContext, useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Link,
  Box,
  CircularProgress,
  Tooltip,
  IconButton,
  Pagination,
  TextField,
  Avatar,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useTheme,
  useMediaQuery,
  DialogContentText,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { MdModeEditOutline, MdOutlineRemoveRedEye } from 'react-icons/md';
import { TbPasswordUser } from 'react-icons/tb';
import { IoEyeSharp } from 'react-icons/io5';
import { HiEye } from 'react-icons/hi2';
import { MdDelete } from 'react-icons/md';
import { HiMiniVideoCamera } from 'react-icons/hi2';
import { HiMiniVideoCameraSlash } from 'react-icons/hi2';
import { BsChatSquareTextFill } from 'react-icons/bs';
import axios from 'axios';
import moment from 'moment';
import CancelBtn from '../../CommonComponenet/CommonButtons/CancelBtn';
import Btn from '../../CommonComponenet/CommonButtons/Btn';
import AddPointMent from '../AddPointMent';
import { AuthContext } from '../../Context/Auth';
import ApiConfig from '../../ApiConfig/ApiConfig';

const dummyData = [
  {
    id: 1,
    image:
      'https://img.freepik.com/premium-vector/ear-nose-throat-doctor-illustration_107173-15038.jpg?uid=R196485355&ga=GA1.1.1825963648.1747401291&semt=ais_hybrid&w=740',
    createdAt: new Date(),
    patientName: 'John Doe',
    status: 'Start Consultation',
  },
  {
    id: 2,
    image:
      'https://img.freepik.com/premium-vector/pandemic-vaccination-health-concept-doctor-with-bottle-vaccine_531064-8551.jpg?uid=R196485355&ga=GA1.1.1825963648.1747401291&semt=ais_hybrid&w=740',
    createdAt: new Date(),
    patientName: 'Jane Smith',
    status: 'Start Consultation',
  },
  {
    id: 3,
    image:
      'https://img.freepik.com/premium-vector/african-american-doctor_88465-168.jpg?uid=R196485355&ga=GA1.1.1825963648.1747401291&semt=ais_hybrid&w=740',
    createdAt: new Date(),
    patientName: 'Alice Johnson',
    status: 'Start Consultation',
  },
  {
    id: 4,
    image:
      'https://img.freepik.com/premium-vector/nurses-day-horizontal-illustration-female-nurse-radiant-background_561238-1304.jpg?uid=R196485355&ga=GA1.1.1825963648.1747401291&semt=ais_hybrid&w=740',
    createdAt: new Date(),
    patientName: 'Bob Williams',
    status: 'Start Consultation',
  },
  {
    id: 5,
    image:
      'https://img.freepik.com/premium-vector/flat-national-doctor-s-day-illustration-with-female-medic_23-2149427400.jpg?uid=R196485355&ga=GA1.1.1825963648.1747401291&semt=ais_hybrid&w=740',
    createdAt: new Date(),
    patientName: 'Eva Davis',
    status: 'Start Consultation',
  },
];

export default function DoctorTodatApppoint() {
  const location = useLocation();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const auth = useContext(AuthContext);
  const [patients, setPatients] = useState([]);
  const userData = auth?.userData;
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [totalPages, setTotalPages] = useState('');
  console.log('patientspatients', patients);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [editOpen, setEditOpen] = useState(false);
  const [current, setCurrent] = useState({});
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  const closeEdit = () => setEditOpen(false);

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSave1 = (data) => {
    console.log('Appointment Saved:', data);
  };

  const openEdit = (row) => {
    setCurrent(row);
    setEditOpen(true);
  };

  const handleSave = () => {
    // Here you’d call your API or update state:
    // setPatients(p =>
    //   p.map(item =>
    //     item.id === current.id ? current : item
    //   )
    // );
    setEditOpen(false);
  };
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleFieldChange = (field) => (e) => {
    setCurrent((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleDeleteConfirm = () => {
    // TODO: Add delete logic here
    setDeleteOpen(false);
  };

  const handleDeleteClick = () => {
    setDeleteOpen(true);
  };
  const handleDeleteCancel = () => {
    setDeleteOpen(false);
  };

  const getAllDoctors = async () => {
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
          page: page,
          limit: limit,
        },
      });

      console.log('successsuccess', response?.data?.success);

      if (response?.data?.error === 'false') {
        const allData = response?.data?.data?.docs || [];

        // Simulated current time for testing (24 May 2025, 10:37 PM)
        // const now = new Date();
        // const now = new Date("2025-05-27T12:40:00"); // ISO format

        // const filteredData = allData?.filter((item) => {
        //   const itemDate = new Date(item?.createdAt);

        //   // Check if same day
        //   const isSameDay =
        //     itemDate.getFullYear() === now.getFullYear() &&
        //     itemDate.getMonth() === now.getMonth() &&
        //     itemDate.getDate() === now.getDate();

        //   // Keep if it's today and time is greater than now
        //   return isSameDay && itemDate > now;
        // });

        const now = new Date(); // or fixed test date: new Date("2025-05-27T22:37:00")

        const filteredData = allData?.filter((item) => {
          const itemDate = new Date(item?.scheduledTime);

          return (
            itemDate.getFullYear() === now.getFullYear() &&
            itemDate.getMonth() === now.getMonth() &&
            itemDate.getDate() === now.getDate()
          );
        });
        setPatients(filteredData);
        setTotalPages(response?.data?.data?.totalPages);
        setLoading(false);
      }
    } catch (error) {
      setPatients([]);
      setLoading(false);
      console.log('errorerror', error);

      return error?.response;
    }
  };

  // const getAllDoctors = async () => {
  //   const token = window.localStorage.getItem("UhuruMedToken");
  //   setLoading(true);
  //   try {
  //     const response = await axios({
  //       method: "GET",
  //       url: ApiConfig.doctorAppointmentList,
  //       headers: {
  //         authorization: `Bearer ${token}`,
  //       },
  //       params: {
  //         page: page,
  //         limit: limit,
  //       },
  //     });

  //     console.log("successsuccess", response?.data?.success);

  //     if (response?.data?.error === "false") {
  //       setLoading(false);
  //       console.log("responseresponse", response);
  //       setPatients(response?.data?.data?.docs);
  //       setTotalPages(response?.data?.data?.totalPages);
  //     }
  //   } catch (error) {
  //     setPatients([]);
  //     setLoading(false);
  //     console.log("errorerror", error);
  //     return error?.response;
  //   }
  // };

  const handelHander = (rows) => {
    if (rows?.status !== 'SCHEDULED') return; // Only allow action if scheduled

    if (rows?.type === 'CHAT') {
      navigate('/chat');
    } else {
      if (rows?.meetingLink) {
        window.open(rows.meetingLink, '_blank', 'noopener,noreferrer');
      }
    }
  };

  useEffect(() => {
    getAllDoctors();
  }, [searchQuery, page, limit]);

  return (
    <>
      <Container maxWidth="xxl">
        <TableContainer
          component={Paper}
          elevation={3}
          sx={{
            height: 'auto',
            background: '#fff',
            borderRadius: '10px',
            marginTop: '20px',
            width: { xs: '100% !important', md: '100% !important' },
          }}
        >
          <Table>
            <TableHead>
              {/* <TableRow>
                {[
                  "Serial No",
                  "Time",
                  "Date",
                  // "Phone",
                  // "Address",
                
                  "Slot type",
                  "Consultation Fee ",
                  "Symptoms",
                  "Status",
                ].map((heading, i) => (
                  <TableCell
                    key={i}
                    sx={{ fontWeight: "bold", textWrap: "nowrap" }}
                  >
                    {heading}
                  </TableCell>
                ))}
              </TableRow> */}
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{ borderBottom: 'none' }}
                  >
                    <Box sx={{ py: 4, marginLeft: '10rem' }}>
                      <CircularProgress />
                    </Box>
                  </TableCell>
                </TableRow>
              ) : patients?.length > 0 ? (
                patients?.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      //   backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                      backgroundColor: index % 2 === 0 ? '#ffffff' : '#ffffff',
                      borderRadius: '10px',
                      '&:last-child td, &:last-child th': { border: 0 },
                    }}
                  >
                    <TableCell style={{ whiteSpace: 'nowrap' }}>
                      <img
                        src={
                          row?.patient?.profilePic ??
                          'https://kristalle.com/wp-content/uploads/2020/07/dummy-profile-pic-1.jpg'
                        } // assuming this is a URL
                        alt="slot"
                        style={{ width: 50, height: 50, borderRadius: '20%' }} // or any size/style you want
                      />
                    </TableCell>
                    <TableCell style={{ textWrap: 'nowrap' }} align="center">
                      {moment(row.scheduledTime).format('lll')}
                    </TableCell>
                    <TableCell style={{ textWrap: 'nowrap' }} align="center">
                      {row.slotTime}
                    </TableCell>
                    <TableCell style={{ textWrap: 'nowrap' }} align="center">
                      {row.type}
                    </TableCell>
                    <TableCell style={{ textWrap: 'nowrap' }} align="center">
                      {row.patientGender}
                    </TableCell>
                    <TableCell style={{ textWrap: 'nowrap' }} align="center">
                      {row?.patientName}
                    </TableCell>
                    <TableCell
                      style={{
                        whiteSpace: 'nowrap', // use `whiteSpace` instead of deprecated `textWrap`
                        color:
                          row.status === 'PENDING_PAYMENT'
                            ? '#FB8C00' // orange
                            : row.status === 'SCHEDULED'
                              ? '#388E3C' // green
                              : row.status === 'CANCELLED'
                                ? '#D32F2F' // red
                                : '#000',
                      }}
                    >
                      {row?.status !== 'SCHEDULED' && row?.status}

                      {row?.status === 'SCHEDULED' && (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handelHander(row)}
                          sx={{
                            backgroundColor: '#0077cc',
                            color: '#fff',
                            ml: 1,
                            '&:hover': {
                              backgroundColor: '#0077cc',
                              color: '#fff',
                            },
                          }}
                        >
                          Start Consultation
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} sx={{ height: '100px', p: 0 }}>
                    <Box
                      sx={{
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Typography
                        variant="h6"
                        color="textSecondary"
                        sx={{ fontSize: '15px !important' }}
                      >
                        No Data Found
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {totalPages > 1 && patients?.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              textAlign: 'center',
              // marginTop: "10px",
              paddingTop: '20px',
              '& .Mui-selected': {
                backgroundColor: '#2e5ad5 !important',
                color: '#fff !important',
                borderRadius: '5px',
              },
              '& .MuiPaginationItem-root': { color: 'black' },
            }}
          >
            <Pagination
              page={page}
              onChange={handlePageChange}
              count={totalPages}
            />
          </Box>
        )}
        <Dialog
          fullWidth
          maxWidth="sm"
          fullScreen={fullScreen}
          open={editOpen}
          onClose={closeEdit}
        >
          <DialogTitle style={{ fontWeight: 'bold' }}>
            Edit Appointment
          </DialogTitle>
          <DialogContent dividers>
            <Box
              component="form"
              mb={2}
              mt={2}
              sx={{
                display: 'grid',
                gridTemplateColumns: fullScreen ? '1fr' : '1fr 1fr',
                gap: 2,
                //   mt: 1
              }}
            >
              <TextField
                label="Date"
                type="date"
                value={current.date || ''}
                onChange={handleFieldChange('date')}
                InputLabelProps={{ shrink: true }}
                fullWidth
                size="small"
              />
              <TextField
                label="Time"
                select
                value={current.time || ''}
                onChange={handleFieldChange('time')}
                SelectProps={{ native: true }}
                fullWidth
                size="small"
              >
                <option value="07:00 – 07:30">07:00 – 07:30</option>
                <option value="08:00 – 08:30">08:00 – 08:30</option>
                <option value="09:00 – 09:30">09:00 – 09:30</option>
              </TextField>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2, pt: 2 }}>
            <CancelBtn onClick={closeEdit} label="Cancel">
              Cancel
            </CancelBtn>
            <Btn label="Submit" onClick={handleSave} />
          </DialogActions>
        </Dialog>
        <Dialog open={deleteOpen} onClose={handleDeleteCancel}>
          <DialogTitle style={{ fontWeight: 'bold', textAlign: 'center' }}>
            Confirm Delete
          </DialogTitle>

          <DialogContent>
            <DialogContentText
              style={{ fontSize: '17px', textAlign: 'center' }}
            >
              Are you sure you want to delete Dr. Dr. Michael Sullivan?
            </DialogContentText>
          </DialogContent>

          <DialogActions
            sx={{
              justifyContent: 'center',
              pb: 2,
              gap: 2, // spacing between buttons
            }}
          >
            <CancelBtn
              label="No"
              onClick={handleDeleteCancel}
              variant="outlined"
            >
              Cancel
            </CancelBtn>
            <Btn
              label="Yes"
              onClick={handleDeleteConfirm}
              variant="contained"
              color="error"
            >
              Delete
            </Btn>
          </DialogActions>
        </Dialog>
        {open && (
          <AddPointMent
            open={open}
            onClose={() => setOpen(false)}
            onSave={handleSave1}
          />
        )}
      </Container>
    </>
  );
}
