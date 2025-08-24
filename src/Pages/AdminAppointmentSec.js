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

export default function AdminAppointmentSec() {
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
  console.log('ASfadsfgads', totalPages);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
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
        url: ApiConfig.AdminAppoimmentList,
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
        setLoading(false);

        console.log('responseresponse', response);
        setPatients(response?.data?.data?.docs);
        setTotalPages(response?.data?.data?.totalPages);
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
              <TableRow>
                {[
                  'Serial No',
                  'Time',
                  'Date',
                  // "Phone",
                  // "Address",
                
                  'Slot type',
                  'Consultation Fee ',
                  'Symptoms',
                  'Status',
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
              ) : patients?.length > 0 ? (
                patients?.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff',
                      borderRadius: '10px',
                      '&:last-child td, &:last-child th': { border: 0 },
                    }}
                  >
                    <TableCell sx={{ padding: '25px' }}>{(page - 1) * limit + index + 1}</TableCell>
                    <TableCell style={{ textWrap: 'nowrap' }}>
                      {row.slotTime}
                    </TableCell>
                    <TableCell style={{ textWrap: 'nowrap' }}>
                      {moment(row.createdAt).format('lll')}
                    </TableCell>
                    {/* <TableCell style={{ textWrap: "nowrap" }}>
                      {row.doctor?.phone}
                    </TableCell>
                    <TableCell style={{ textWrap: "nowrap" }}>
                      {row?.doctor?.address}
                    </TableCell> */}
                   
                    <TableCell style={{ textWrap: 'nowrap' }}>
                      {row?.slotType}
                    </TableCell>
                    <TableCell style={{ textWrap: 'nowrap' }}>
                      {row?.doctor?.consultationFee}
                    </TableCell>
                    <TableCell style={{ textWrap: 'nowrap' }}>
                      {row?.symptoms}
                    </TableCell>
                    <TableCell style={{ textWrap: 'nowrap' }}>
                      {row.status}{' '}
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
