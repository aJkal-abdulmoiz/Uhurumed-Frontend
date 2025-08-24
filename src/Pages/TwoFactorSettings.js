import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  useMediaQuery,
  useTheme,
  Divider,
  Stack,
  Avatar,
  FormControlLabel,
  Dialog,
  styled,
  DialogContent,
} from '@mui/material';
import Btn from '../CommonComponenet/CommonButtons/Btn';
import CancelBtn from '../CommonComponenet/CommonButtons/CancelBtn';
import { useNavigate } from 'react-router-dom';
import TwoStepVerification from './TwoStepVerification';
import EditProfile from '../CommonComponenet/CommonButtons/EditProfile';
import { AuthContext } from '../Context/Auth';
import { use } from 'react';
import { sortAddress } from '../utils';
import DoctorTypeProfile from '../CommonComponenet/CommonButtons/DoctorTypeProfile';
import ApiConfig from '../ApiConfig/ApiConfig';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getDataHandlerWithToken } from '../Context/service';
import MedicalReports from '../CommonComponenet/CommonButtons/MedicalReports';

const TwoFactorSettings = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [profileData, setProfileData] = useState({});
  console.log('dafgsadg', profileData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogOpenMedical, setIsDialogOpenMedical] = useState(false);
  const [store, setStore] = useState('');
  console.log('sadfasdfads', store);
  const auth = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const userData = auth.userData;
  const handleDeleteClick = () => {
    if (
      profileData?.enabled2FA === 'true' &&
      profileData?.verified2FA === 'true'
    ) {
      DisbaledTwoFAAuthandler();
      setDeleteOpen(true);
    } else {
      TwoFAAuthandler();
      setDeleteOpen(true);
    }
  };
  const handleDeleteCancel = () => {
    setDeleteOpen(false);
  };

  const CustomDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiPaper-root': {
      backgroundColor: 'transparent', // transparent content background
      boxShadow: 'none',
      maxWidth: 'unset',
      overflow: 'visible',
    },
    '& .MuiBackdrop-root': {
      backgroundColor: 'rgba(0,0,0,0.4)', // semi-transparent backdrop
      backdropFilter: 'blur(4px)', // optional blur
    },
  }));

  const getProfileData = async () => {
    try {
      const res = await getDataHandlerWithToken('profile');
      if (res) {
        console.log('dsgsadgsadgsa', res);
        setProfileData(res);
      } else {
        console.log('');
      }
    } catch (error) {console.log(error);}
  };

  const TwoFAAuthandler = async () => {
    const token = window.localStorage.getItem('UhuruMedToken');

    setLoading(true);
    try {
      const response = await axios({
        method: 'POST',
        url: ApiConfig.enableOrDisable2FA,
        headers: {
          authorization: `Bearer ${token}`,
        },
        data: {
          type: 'GOOGLE_AUTH',
          enable: profileData?.enabled2FA === 'false' ? 'true' : 'false',
        },
      });
      console.log('546456465456', response?.data);
      if (response?.data?.error === 'false') {
        setStore(response?.data?.data);
        getProfileData();
        setLoading(false);
        // if (userData?.enabled2FA === "false") {
        //   window.location.reload();
        // }
        // toast.success(response.data?.message);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      toast.error(error?.response.data.message);
      console.log('errorerror', error);

      return error?.response;
    }
  };

  const DisbaledTwoFAAuthandler = async () => {
    const token = window.localStorage.getItem('UhuruMedToken');

    setLoading(true);
    try {
      const response = await axios({
        method: 'POST',
        url: ApiConfig.enableOrDisable2FA,
        headers: {
          authorization: `Bearer ${token}`,
        },
        data: {
          type: 'GOOGLE_AUTH',
          enable: 'false',
        },
      });
      console.log('546456465456', response?.data);
      if (response?.data?.error === 'false') {
        setStore(response?.data?.data);
        getProfileData();
        toast.success(response.data?.message);
        setDeleteOpen(false);
        window.location.reload();
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      toast.error(error?.response.data.message);
      console.log('errorerror', error);

      return error?.response;
    }
  };

  useEffect(() => {
    getProfileData();
  }, []);

  return (
    <>
      <Box pl={isMobile ? 2 : 4}>
        <Box mb={2}>
          <Typography
            variant="h4"
            sx={{ fontSize: '30px', fontWeight: '700', fontFamily: 'rubik' }}
          >
            Account Settings
          </Typography>
        </Box>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
          <Grid container spacing={3} alignItems="flex-start">
            {/* Left Side: Avatar and Delete */}
            <Grid item xs={12} sm={4} md={3}>
              <Stack spacing={2} alignItems="center">
                <Avatar
                  src={
                    userData?.profilePic ??
                    'data:image/jpeg;base64,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'
                  }
                  alt="User"
                  sx={{
                    width: 120,
                    height: 120,
                    objectFit: 'fill',
                    borderRadius: '8px',
                  }}
                />
              </Stack>
            </Grid>

            {/* Center: Profile Info */}
            <Grid item xs={12} sm={4} md={5}>
              <Stack spacing={1}>
                <Typography variant="subtitle1">
                  <strong>First name:</strong> {userData?.firstName ?? '__'}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Last name:</strong> {userData?.lastName ?? '__'}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Phone:</strong> {userData?.phone}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>User Role:</strong> {userData?.userType}
                </Typography>
                <Stack direction="row" spacing={1} mt={1}>
                  {/* <PhoneIcon color="action" /> */}
                  {/* <EmailIcon color="action" /> */}
                </Stack>
                <Box mt={2} pb={3}>
                  <Btn
                    label="Edit Profile"
                    sx={{ mt: 2, width: 'fit-content' }}
                    onClick={() => setIsDialogOpen(true)}
                  />
                </Box>
              </Stack>
            </Grid>

            {/* Right Side: Timezone and Communication */}
            <Grid item xs={12} sm={4} md={4}>
              <Stack spacing={1}>
                <Typography variant="subtitle1">
                  <strong>Email:</strong> {userData?.email}
                </Typography>
                {userData?.userType === 'USER' && (
                  <Typography variant="subtitle1">
                    <strong>Blood Group:</strong> {userData?.bloodGroup}
                  </Typography>
                )}
                <Typography variant="subtitle1">
                  <strong>Address:</strong> {userData?.address}
                </Typography>
                {userData?.userType === 'DOCTOR' && (
                  <>
                    <Typography variant="subtitle1">
                      <strong>specialization:</strong>{' '}
                      {userData?.specialization}
                    </Typography>
                    <Typography variant="subtitle1">
                      <strong>Experience:</strong> {userData?.experience} years
                    </Typography>
                  </>
                )}
              </Stack>
            </Grid>
          </Grid>
          <Stack spacing={3}>
            {/* Email Section */}

            <Divider />

            {/* 2FA Section */}
            <Box>
              <Typography variant="h6">
                Two-factor authentication{' '}
                {profileData?.enabled2FA === 'true' &&
                profileData?.verified2FA === 'true'
                  ? '(Active)'
                  : '(Disabled)'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Two-factor authentication is an enhanced security measure. Once
                enabled, you’ll be required to give two types of identification
                when logging into your account.
                <strong> Google Authenticator and SMS are supported.</strong>
              </Typography>
              <Box mt={2}>
                <Button
                  onClick={handleDeleteClick}
                  variant="contained"
                  color="success"
                  sx={{ mt: 1 }}
                >
                  {profileData?.enabled2FA === 'true' &&
                  profileData?.verified2FA === 'true'
                    ? 'Google Authenticator'
                    : 'Disabled Google Authenticator'}
                </Button>
              </Box>
            </Box>

            {/* Secondary Verification */}

            {/* Backup Codes */}

            <Divider />
            <Box>
              <Typography variant="h6">Upload Documents</Typography>
              <Typography variant="body2" color="text.secondary">
                Upload your medical report with a title and brief description
                for secure record keeping.
              </Typography>
              <Box mt={1}>
                <Btn
                  label="Upload Report"
                  sx={{ mt: 2, width: 'fit-content' }}
                  onClick={() => setIsDialogOpenMedical(true)}
                />
              </Box>
            </Box>
            {/* Logout */}
            <Box>
              <Typography variant="h6">Change Password</Typography>
              <Typography variant="body2" color="text.secondary">
                For your security, we recommend updating your password
                regularly. Make sure your new password is strong and unique.
              </Typography>
              <Button
                onClick={() => navigate('/changePassword')}
                variant="contained"
                color="error"
                sx={{ mt: 1 }}
              >
                Change Password
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Box>
      {deleteOpen && (
        <TwoStepVerification
          loading={loading}
          store={store}
          open={deleteOpen}
          onClose={handleDeleteCancel}
        />
      )}

      {isDialogOpenMedical && (
        <>
          <MedicalReports
            open={isDialogOpenMedical}
            userData={userData}
            onClose={() => setIsDialogOpenMedical(false)}
          />
        </>
      )}

      {isDialogOpen && (
        <>
          {userData?.userType === 'DOCTOR' ? (
            <DoctorTypeProfile
              open={isDialogOpen}
              userData={userData}
              onClose={() => setIsDialogOpen(false)}
            />
          ) : (
            <EditProfile
              open={isDialogOpen}
              userData={userData}
              onClose={() => setIsDialogOpen(false)}
            />
          )}
        </>
      )}
    </>
  );
};

export default TwoFactorSettings;
