import React, { useContext, useState } from 'react';
import {
  Card,
  Avatar,
  Typography,
  Rating,
  IconButton,
  Box,
  Fade,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Btn from './Btn';
import CancelBtn from './CancelBtn';
import axios from 'axios';
import ApiConfig from '../../ApiConfig/ApiConfig';
import toast from 'react-hot-toast';
import { FaUserDoctor } from 'react-icons/fa6';

import DoctorView from './DoctorView';
import SingleDoctorAppoint from '../../Pages/SingleDoctorAppoint';
import SubscriptionModal from './SubscriptionModal';
import { AuthContext } from '../../Context/Auth';

const DoctorCard = ({
  image,
  name,
  specialty,
  rating,
  setOpen1,
  type,
  firstName,
  specialization,
  lastName,
  email,
  id,
  getAllDoctors,
  profilePic,
  main,
  country,
}) => {
  console.log('51564161556', main);
  const [hover, setHover] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const auth = useContext(AuthContext);
  const actived = auth?.actived;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogOpen1, setIsDialogOpen1] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const handleDeleteClick = () => {
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    // TODO: Add delete logic here
    setDeleteOpen(false);
    console.log('Deleted doctor:', name);
  };

  const DeleteDoctorHanlder = async (id) => {
    const token = window.localStorage.getItem('UhuruMedToken');
    setLoading(true);
    try {
      const response = await axios({
        method: 'DELETE',
        url: ApiConfig.doctorDelete,
        headers: {
          authorization: `Bearer ${token}`,
        },
        params: {
          id: id,
        },
      });
      console.log('b565bvifbifu', response.data.error);
      if (response.data.error === 'false') {
        console.log('sdsadfsasssss', response.data);
        toast.success(response?.data?.message);
        setDeleteOpen(false);
        getAllDoctors();
        setLoading(false);
      } else {
        setLoading(false);
        toast.error(response?.data?.message ?? 'Please try again');
      }
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.message ?? 'Please try again');
      console.log('error', error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteOpen(false);
  };

  return (
    <>
      <Card
        elevation={2}
        sx={{
          borderRadius: 3,
          px: 2,
          py: 3,
          position: 'relative',
          overflow: 'visible',
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* Top right icons */}
        {type != 'users' ? (
          <Fade in={hover}>
            <Box display="flex" justifyContent="flex-end">
              <Tooltip title="Edit">
                <IconButton
                  onClick={() => setOpen1(main)}
                  size="small"
                  color="primary"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  size="small"
                  color="error"
                  onClick={handleDeleteClick}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Fade>
        ) : (
          <>
            <Fade in={hover}>
              <Box display="flex" justifyContent="flex-end">
                <Tooltip title="Appointment">
                  <IconButton
                    // onClick={() => {
                    //   if (!actived || Object.keys(actived)?.length === 0) {
                    //     setOpenModal(true);
                    //   } else {
                    //     setIsDialogOpen1(main);
                    //   }
                    // }}
                    onClick={() => setIsDialogOpen1(main)}
                    size="small"
                    color="primary"
                  >
                    <FaUserDoctor fontSize="medium" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Fade>
          </>
        )}

        {/* Card content */}
        <Box
          onClick={() => setIsDialogOpen(main)}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Avatar
            src={
              profilePic ??
              'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?ga=GA1.1.406090842.1746782723&semt=ais_hybrid&w=740'
            }
            sx={{ width: 80, height: 80, mb: 1 }}
          />
          <Typography variant="subtitle1" fontWeight={600}>
            {firstName} {lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {specialization}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {email}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {country}
          </Typography>
          {/* <Rating value={"3"} readOnly size="small" sx={{ mt: 1 }} /> */}
        </Box>
      </Card>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteOpen} onClose={handleDeleteCancel} 
        PaperProps={{
          sx: {
            padding: '1.5rem',
            width: '400px',
            maxWidth: '90%',
            borderRadius: '12px',
          },
        }}
      >
        <DialogTitle style={{ fontWeight: 'bold', textAlign: 'center' }}>
          Confirm Delete
        </DialogTitle>

        <DialogContent>
          <DialogContentText style={{ fontSize: '17px', textAlign: 'center' }}>
            Are you sure you want to delete Dr. {firstName} {' '} {lastName}?
          </DialogContentText>
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: 'center',
            pb: 2,
            gap: 2, // spacing between buttons
          }}
        >
          <CancelBtn label="No" onClick={handleDeleteCancel} variant="outlined">
            Cancel
          </CancelBtn>
          <Btn
            label="Yes"
            onClick={() => DeleteDoctorHanlder(id)}
            variant="contained"
            color="error"
          >
            Delete
          </Btn>
        </DialogActions>
      </Dialog>
      {isDialogOpen && (
        <DoctorView
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />
      )}
      {isDialogOpen1 && (
        <SingleDoctorAppoint
          open={isDialogOpen1}
          onClose={() => setIsDialogOpen1(false)}
        />
      )}
      {openModal && (
        <SubscriptionModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          // onPurchase={handlePurchase}
        />
      )}
    </>
  );
};

export default DoctorCard;
