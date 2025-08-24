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

import Btn from '../CommonComponenet/CommonButtons/Btn';
import { MdDelete } from 'react-icons/md';
import SearchAppointmentBar from '../CommonComponenet/CommonButtons/SearchAppointmentBar';
import CancelBtn from '../CommonComponenet/CommonButtons/CancelBtn';
import { HiMiniVideoCamera } from 'react-icons/hi2';
import { HiMiniVideoCameraSlash } from 'react-icons/hi2';
import { BsChatSquareTextFill } from 'react-icons/bs';

import AddPointMent from './AddPointMent';
import { AuthContext } from '../Context/Auth';
import axios from 'axios';
import ApiConfig from '../ApiConfig/ApiConfig';
import moment from 'moment';
import toast from 'react-hot-toast';

export default function AppointMentDash() {
  const location = useLocation();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [doctors, setDoctors] = useState([]);
  console.log('dafdsfdas', doctors);
  const theme = useTheme();
  const auth = useContext(AuthContext);
  const userData = auth?.userData;
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [totalPages, setTotalPages] = useState('');
  console.log('ASfadsfgads', totalPages);
  const [searchQuery, setSearchQuery] = useState('');
  const [reason, setReason] = useState('');
  const [page, setPage] = useState(0);
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

  const handleReasonQueryChange = (event) => {
    setReason(event.target.value);
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
        url: ApiConfig.appointmentUserList,
        headers: {
          authorization: `Bearer ${token}`,
        },
        // params: {
        //   page: page,
        //   limit: 200,
        //   search: searchQuery,
        // },
      });
      console.log('successsuccess', response?.data?.success);
      if (response?.data?.error === 'false') {
        setLoading(false);

        console.log('responseresponse', response);
        setDoctors(response?.data?.data?.slice(0, 6));
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
    getAllDoctors();
  }, []);


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
              <TableRow>
                {[
                  'Serial No',
                  'Time',
                  'Date',
                  // "Address",
                  'Payment Type',
                  'Shift Time',
                  'Doctor Fee',
                  // "Medical History",
                  // "Symptoms",
                ].map((heading, i) => (
                  <TableCell
                    key={i}
                    sx={{ fontWeight: 'bold', textWrap: 'nowrap' }}
                  >
                    {heading}
                  </TableCell>
                ))}
              </TableRow>
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
              ) : doctors?.length > 0 ? (
                doctors?.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff',
                      borderRadius: '10px',
                      '&:last-child td, &:last-child th': { border: 0 },
                    }}
                  >
                    <TableCell sx={{ padding: '25px', textWrap: 'nowrap' }}>
                      {index + 1}
                    </TableCell>
                    <TableCell style={{ textWrap: 'nowrap' }}>
                      {row.slotTime}
                    </TableCell>
                    <TableCell style={{ textWrap: 'nowrap' }}>
                      {moment(row.createdAt).format('lll')}
                    </TableCell>
                  
                    {/* <TableCell style={{ textWrap: "nowrap" }}>
                      {row.patient?.address}
                    </TableCell> */}
                    <TableCell style={{ textWrap: 'nowrap' }}>
                      {row?.paymentType}{' '}
                    </TableCell>
                    <TableCell style={{ textWrap: 'nowrap' }}>
                      {row?.slotType}{' '}
                     
                    </TableCell>
                    <TableCell style={{ textWrap: 'nowrap' }}>
                      {row?.doctor?.consultationFee}{' '}
                     
                    </TableCell>
                  

                    {/* <TableCell style={{ textWrap: "nowrap" }}>
                      {row.doctor?.medicalHistory}{" "}
                    </TableCell> */}
                    {/* <TableCell style={{ textWrap: "nowrap" }}>
                      {row?.symptoms}{" "}
                     
                    </TableCell>  */}

                 
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
      
     
      </Container>
    </>
  );
}
