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
import SearchAppointmentBar from '../../CommonComponenet/CommonButtons/SearchAppointmentBar';
import CancelBtn from '../../CommonComponenet/CommonButtons/CancelBtn';
import axios from 'axios';
import moment from 'moment';
import toast from 'react-hot-toast';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ApiConfig from '../../ApiConfig/ApiConfig';

export default function SlotList() {
  const location = useLocation();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [totalPages, setTotalPages] = useState('');
  console.log('ASfadsfgads', totalPages);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [editOpen, setEditOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [current, setCurrent] = useState({});
  const [allPlanData, setAllPlanData] = useState([]);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500); // Reset after delay
    });
  };
  const getShortId = (id) => {
    if (!id || id.length <= 8) return id;

    return `${id.slice(0, 4)}...${id.slice(-4)}`;
  };

  console.log('vebfirbgi', allPlanData);
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
  const getAllPlans = async () => {
    const token = window.localStorage.getItem('UhuruMedToken');
    setLoading(true);

    try {
      const response = await axios({
        method: 'GET',
        url: ApiConfig.listDoctorSlot,
        headers: {
          authorization: `Bearer ${token}`,
        },
        params: {
          page: page,
          limit: limit,
          // search: searchQuery,
        },
      });
      console.log('successsudddddccess', response);
      if (response?.data?.error === 'false') {
        setLoading(false);

        console.log('responseresponse', response?.data?.data);
        setAllPlanData(response?.data?.data.docs);
        setTotalPages(response?.data?.data?.totalPages);
      }
    } catch (error) {
      setAllPlanData([]);
      setLoading(false);

      console.log('errorerror', error);

      return error?.response;
    }
  };

  useEffect(() => {
    getAllPlans();
  }, [searchQuery, page, limit]);

  const deleteData = async (id) => {
    const token = window.localStorage.getItem('UhuruMedToken');
    setLoader(true);
    try {
      const response = await axios({
        method: 'DELETE',
        url: ApiConfig.deleteDoctorSlot,
        headers: {
          authorization: `Bearer ${token}`,
        },
        params: {
          id: id,
        },
      });

      if (response?.data?.error === 'false') {
        setLoader(false);
        toast.success(response?.data?.message || 'Plan deleted successfully.');
        navigate('/slot');
        handleDeleteCancel(true);
        getAllPlans();
      } else {
        setLoader(false);
        toast.error(response?.data?.message || 'Failed to delete the plan.');
      }
    } catch (error) {
      setLoader(false);
      console.error('Error deleting plan:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

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
              Slot List
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* <TextField
              variant="outlined"
              size="small"
              placeholder="Search by slot name"
              type="search"
              value={searchQuery}
              onChange={handleSearchQueryChange}
              sx={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                height: "40px",
                marginTop: {
                  xs: "10px",
                  md: "0px",
                },
                minWidth: 200,
                "& .MuiOutlinedInput-root": {
                  paddingRight: 0,
                  padding: "2.5px 0px",
                  borderRadius: "10px",
                  fontSize: "14px",
                },
              }}
              InputProps={{
                sx: { paddingRight: "8px" },
              }}
            /> */}
            <Btn label="Add Slot" onClick={() => navigate('/addSlot')} />
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
                  'Slot Id',
                  // "Type",
                  'Slot Time',
                  'Description',
                  'Date',
                  'Action',
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
              ) : allPlanData?.length > 0 ? (
                allPlanData?.map((row, index) => (
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
                      {row?.title}
                    </TableCell>
                    <TableCell style={{ whiteSpace: 'nowrap' }}>
                      {getShortId(row?.id)}
                      <Tooltip title={copied ? 'Copied!' : 'Copy'}>
                        <IconButton
                          size="small"
                          onClick={() => handleCopy(row?.id)} // Pass full ID here
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>

                    {/* <TableCell style={{ textWrap: "nowrap" }}>
                      {row?.type}
                    </TableCell> */}
                    <TableCell style={{ textWrap: 'nowrap' }}>
                      {row?.startTime}
                      {'-'}
                      {row?.endTime}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: (() => {
                            const div = document.createElement('div');
                            div.innerHTML = row?.description || '';
                            const plainText =
                              div.textContent || div.innerText || '';
                            const trimmed =
                              plainText.length > 30
                                ? plainText.slice(0, 30) + '...'
                                : plainText;

                            return trimmed;
                          })(),
                        }}
                      />
                      {/* {row?.description?.length > 20
                          ? `${row?.description?.slice(0, 20)}...`
                          : row?.description} */}
                    </TableCell>
                    <TableCell style={{ textWrap: 'nowrap' }}>
                      {moment(row.date).format('lll')}
                    </TableCell>

                    <TableCell style={{ textWrap: 'nowrap' }}>
                      <Box>
                        <IconButton
                          // onClick={() => navigate("/editSubscription")}
                          onClick={() =>
                            navigate('/editSlot', {
                              state: { row },
                            })
                          }
                        >
                          <MdModeEditOutline />
                        </IconButton>
                        <IconButton onClick={() => setDeleteOpen(row)}>
                          <MdDelete />
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
        {totalPages > 1 && allPlanData?.length > 0 && (
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
          open={deleteOpen}
          onClose={handleDeleteCancel}
          PaperProps={{
            sx: {
              borderRadius: '10px', // Set border radius
              p: 2, // Add padding (optional, adjust as needed)
            },
          }}
        >
          <DialogTitle style={{ fontWeight: 'bold', textAlign: 'center' }}>
            Confirm Delete
          </DialogTitle>

          <DialogContent>
            <DialogContentText
              style={{ fontSize: '17px', textAlign: 'center' }}
            >
              Are you sure you want to delete this Slot?
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
              onClick={() => deleteData(deleteOpen?.id)}
              variant="contained"
              color="error"
            >
              {loader ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                'Delete'
              )}
            </Btn>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}
