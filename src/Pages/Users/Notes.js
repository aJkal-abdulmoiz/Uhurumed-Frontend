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
import Btn from '../../CommonComponenet/CommonButtons/Btn';
import { MdDelete } from 'react-icons/md';
import CancelBtn from '../../CommonComponenet/CommonButtons/CancelBtn';

export default function Notes() {
  const location = useLocation();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [totalPages, setTotalPages] = useState('');
  console.log('ASfadsfgads', totalPages);
  const [searchQuery, setSearchQuery] = useState('');
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

  const patients = [
    {
      img: '/Images/user1.jpg',
      Subscription: 'Morning Medicine',
      Description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been',
      phone: '09-06-2025',
      status: 'Active',
    },
    {
      img: '/Images/user1.jpg',
      Subscription: 'Evening Medicine',
      Description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been',
      phone: '09-06-2025',

      status: 'Active',
    },
    {
      img: '/Images/user1.jpg',
      Subscription: 'Afternoon Plan',
      Description:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been',
      phone: '09-06-2025',

      status: 'Active',
    },
    // Add more dummy patients here
  ];

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
              Notes
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search by name"
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
                  'Title',
                  'Description',
                  'Date',
                  'Status',
                
                ].map((heading, i) => (
                  <TableCell key={i} sx={{ fontWeight: 'bold' }}>
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
                    <TableCell sx={{ padding: '25px' }}>{index + 1}</TableCell>
                    <TableCell style={{ textWrap: 'nowrap' }}>
                      {row.Subscription}
                    </TableCell>
                    <TableCell style={{ textWrap: 'nowrap' }}>
                      {row.Description.length > 40
                        ? row.Description.slice(0, 40) + '...'
                        : row.Description}
                    </TableCell>
                    <TableCell style={{ textWrap: 'nowrap' }}>
                      {row.phone}
                    </TableCell>
                    <TableCell style={{ textWrap: 'nowrap' }}>
                      {row.status}
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
        {totalPages > 1 && plans?.[0]?.rows?.length > 0 && (
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
      </Container>
    </>
  );
}
