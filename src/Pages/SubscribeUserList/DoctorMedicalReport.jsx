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
  MenuItem,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { MdModeEditOutline, MdOutlineRemoveRedEye } from 'react-icons/md';
import { TbPasswordUser } from 'react-icons/tb';
import { IoEyeSharp } from 'react-icons/io5';
import { HiEye } from 'react-icons/hi2';
import axios from 'axios';
import ApiConfig from '../../ApiConfig/ApiConfig';
import moment from 'moment';
import MedicalReportView from '../../CommonComponenet/CommonButtons/MedicalReportView';

export default function DoctorMedicalReport({ status, userData }) {
  const location = useLocation();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [totalPagess, setTotalPagess] = useState('');
  console.log('ASfadsfgads', totalPagess);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [editOpen, setEditOpen] = useState(false);
  const [current, setCurrent] = useState({});
  const [subscribeData, setSubscribeData] = useState([]);
  console.log('stateData', subscribeData);
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  const closeEdit = () => setEditOpen(false);

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
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

  const subscribeList = async (id) => {
    const token = window.localStorage.getItem('UhuruMedToken');

    setLoading(true);
    try {
      const response = await axios({
        method: 'GET',
        url: ApiConfig.medicalRecordDoctorList,
        headers: {
          authorization: `Bearer ${token}`,
        },
        params: {
          patientId: id,
          page: page,
          limit: limit,
          ...(searchQuery && {
            search: searchQuery,
          }),
        },
      });
      console.log('subscribeList', response);
      if (response?.data?.error === 'false') {
        setSubscribeData(response?.data?.data?.docs);
        setTotalPagess(response?.data?.data?.totalPages);
        setLoading(false);
        // console.log("subscribeListPage", response?.data?.data?.totalPages);
      } else {
        setLoading(false);
        setSubscribeData([]);
      }
    } catch (error) {
      setSubscribeData([]);
      console.log('error', error);
      setLoading(false);
    }
  };
  useEffect(() => {
    if (userData?.patientId) {
      subscribeList(userData?.patientId);
    }
  }, [page, limit, status, searchQuery, userData?.patientId]);

  return (
    <>
      <Container maxWidth="xxl">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{ fontSize: '30px', fontWeight: '700', fontFamily: 'rubik' }}
            >
              Medical Report
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search by email/name"
              type="search"
              value={searchQuery}
              onChange={handleSearchQueryChange}
              sx={{
                backgroundColor: '#fff',
                borderRadius: '8px',
                height: '40px',
                marginTop: {
                  xs: '10px',
                  md: '0px',
                },
                minWidth: 200,
                '& .MuiOutlinedInput-root': {
                  paddingRight: 0,
                  padding: '2.5px 0px',
                  borderRadius: '10px',
                  fontSize: '14px',
                },
              }}
              InputProps={{
                sx: { paddingRight: '8px' },
              }}
            />
          </Box>
        </Box>
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
                  'Name',
                  'Email Id',
                  'Type',
                  'Blood Group',
                  'Date',
                  'Action',
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
              ) : subscribeData?.length > 0 ? (
                subscribeData?.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff',
                      borderRadius: '10px',
                      '&:last-child td, &:last-child th': { border: 0 },
                    }}
                  >
                    <TableCell sx={{ padding: '25px' }}>
                      {' '}
                      {(page - 1) * limit + index + 1}
                    </TableCell>
                    {/* <TableCell style={{ textWrap: "nowrap" }}>
                      <CopyClip value={row?.id} />
                    </TableCell> */}
                    <TableCell style={{ textWrap: 'nowrap' }}>
                      {row.patient?.firstName}
                    </TableCell>
                    <TableCell style={{ textWrap: 'nowrap' }}>
                      {row.patient?.email}
                    </TableCell>
                    <TableCell style={{ textWrap: 'nowrap' }}>
                      {row.recordType}
                    </TableCell>
                    <TableCell style={{ textWrap: 'nowrap' }}>
                      {row.patient?.bloodGroup}
                    </TableCell>

                    <TableCell style={{ textWrap: 'nowrap' }}>
                      {moment(row.createdAt).format('lll')}
                    </TableCell>
                    <TableCell style={{ textWrap: 'nowrap' }}>
                      <Box>
                        {/* Show only for userType === "DOCTOR" */}

                        <IconButton onClick={() => setEditOpen(row)}>
                          <IoEyeSharp />
                        </IconButton>
                      </Box>
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
        {totalPagess > 1 && subscribeData?.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              textAlign: 'center',
              // marginTop: "10px",
              paddingTop: '20px',
              '& .Mui-selected': {
                backgroundColor: '#00b2ff !important',
                color: '#fff !important',
                borderRadius: '5px',
              },
              '& .MuiPaginationItem-root': { color: 'black' },
            }}
          >
            <Pagination
              page={page}
              onChange={handlePageChange}
              count={totalPagess}
            />
          </Box>
        )}
        {editOpen && (
          <MedicalReportView
            open={editOpen}
            onClose={() => setEditOpen(false)}
          />
        )}
      </Container>
    </>
  );
}
