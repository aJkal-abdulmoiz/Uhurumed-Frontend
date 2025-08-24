import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  Stack,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  CheckCircleOutline,
} from '@mui/icons-material';
import { IoArrowBackSharp } from 'react-icons/io5';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ApiConfig from '../ApiConfig/ApiConfig';
import toast from 'react-hot-toast';

const ChangePassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleToggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const handleToggleVisibility1 = () => {
    setShowPassword1((prev) => !prev);
  };

  // ✅ Yup Validation Schema
  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('New password is required'),
    oldPassword: Yup.string().required('Old password is required'),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Confirm password is required'),
  });

  // ✅ Formik Hook
  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    // validationSchema,
    onSubmit: (values) => {
      changePasswordHandler(values);
      setSubmitError('');
      console.log('Form submitted with:', values);
      // Submit password logic here
    },
  });

  const { values, handleChange, handleBlur, handleSubmit, errors, touched } =
    formik;

  const isPasswordValid =
    values.newPassword.length >= 6 &&
    values.newPassword === values.confirmPassword;

  const changePasswordHandler = async (values) => {
    const token = window.localStorage.getItem('UhuruMedToken');
    setLoading(true);
    try {
      const response = await axios({
        method: 'POST',
        url: ApiConfig.changePassword,
        headers: { authorization: `Bearer ${token}` },
        data: {
          oldPassword: values?.oldPassword,
          password: values?.newPassword,
          confirmPassword: values?.confirmPassword,
        },
      });
      console.log('successsuccess', response?.data?.success);
      if (response?.data?.error === 'false') {
        setLoading(false);

        console.log('jwtTokenjwtToken', response?.data?.data);
        toast.success(response.data.message);
        navigate('/login');
        console.log('responseresponse', response);
      }
    } catch (error) {
      setLoading(false);
      toast.error(error?.response.data.message);
      setLoading(false);
      console.log('errorerror', error);

      return error?.response;
    }
  };

  return (
    <>
      <Box
        sx={{
          cursor: 'pointer',
          background: '#82828214',
          width: '45px',
          height: '45px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={() => navigate('/settings')}
      >
        <IconButton sx={{ color: '#000', p: 0 }}>
          <IoArrowBackSharp size={25} />
        </IconButton>
      </Box>

      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Box pb={3}>
            {' '}
            <Typography
              variant="h5"
              align="center"
              style={{ fontSize: '24px' }}
              fontWeight={600}
              gutterBottom
            >
              Change your password
            </Typography>
            <Typography
              variant="body2"
              align="center"
              color="text.secondary"
              mb={2}
            >
              Enter a new password below to change your password
            </Typography>
          </Box>

          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              {/* New Password Field */}
              <TextField
                label="Old password"
                type={'text'}
                name="oldPassword"
                value={values.oldPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your old password"
                error={touched.oldPassword && Boolean(errors.oldPassword)}
                helperText={touched.oldPassword && errors.oldPassword}
                fullWidth
                FormHelperTextProps={{
                  style: {
                    marginLeft: '0px',
                  },
                }}
                InputLabelProps={{ sx: { fontSize: '14px', color: '#555' } }}
                sx={{
                  mx: 1,
                  '& .MuiOutlinedInput-root': {
                    fontSize: '14px',
                    color: '#333',
                    bgcolor: '#fff',
                    borderRadius: 2,
                    px: 1,
                    '& fieldset': {
                      borderColor: '#ccc',
                    },
                    '&:hover fieldset': {
                      borderColor: '#999',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#0077CC',
                    },
                  },
                  '& .MuiInputBase-input': {
                    '::placeholder': {
                      color: '#aaa',
                      fontSize: '13px',
                      fontStyle: 'italic',
                    },
                  },
                }}
              />
              <TextField
                label="New password"
                type={showPassword ? 'text' : 'password'}
                name="newPassword"
                value={values.newPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your new password"
                error={touched.newPassword && Boolean(errors.newPassword)}
                helperText={touched.newPassword && errors.newPassword}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {isPasswordValid && (
                        <CheckCircleOutline color="success" sx={{ mr: 1 }} />
                      )}
                      <IconButton
                        onClick={handleToggleVisibility}
                        edge="end"
                        style={{ paddingRight: '15px' }}
                      >
                        {!showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                FormHelperTextProps={{
                  style: {
                    marginLeft: '0px',
                  },
                }}
                InputLabelProps={{ sx: { fontSize: '14px', color: '#555' } }}
                sx={{
                  mx: 1,
                  '& .MuiOutlinedInput-root': {
                    fontSize: '14px',
                    color: '#333',
                    bgcolor: '#fff',
                    borderRadius: 2,
                    px: 1,
                    '& fieldset': {
                      borderColor: '#ccc',
                    },
                    '&:hover fieldset': {
                      borderColor: '#999',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#0077CC',
                    },
                  },
                  '& .MuiInputBase-input': {
                    '::placeholder': {
                      color: '#aaa',
                      fontSize: '13px',
                      fontStyle: 'italic',
                    },
                  },
                }}
              />

              {/* Confirm Password Field */}
              <TextField
                label="Confirm password"
                type={showPassword1 ? 'text' : 'password'}
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  touched.confirmPassword && Boolean(errors.confirmPassword)
                }
                helperText={touched.confirmPassword && errors.confirmPassword}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {isPasswordValid && (
                        <CheckCircleOutline color="success" sx={{ mr: 1 }} />
                      )}
                      <IconButton
                        onClick={handleToggleVisibility1}
                        edge="end"
                        style={{ paddingRight: '15px' }}
                      >
                        {!showPassword1 ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                FormHelperTextProps={{
                  style: {
                    marginLeft: '0px',
                  },
                }}
                InputLabelProps={{ sx: { fontSize: '14px', color: '#555' } }}
                sx={{
                  mx: 1,
                  '& .MuiOutlinedInput-root': {
                    fontSize: '14px',
                    color: '#333',
                    bgcolor: '#fff',
                    borderRadius: 2,
                    px: 1,
                    '& fieldset': {
                      borderColor: '#ccc',
                    },
                    '&:hover fieldset': {
                      borderColor: '#999',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#0077CC',
                    },
                  },
                  '& .MuiInputBase-input': {
                    '::placeholder': {
                      color: '#aaa',
                      fontSize: '13px',
                      fontStyle: 'italic',
                    },
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: '#2e5ad5',
                  padding: 1,
                  fontSize: '16px',
                  fontWeight: 500,
                  '&:hover': { backgroundColor: '#2e5ad5' },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : (
                  ' Change Password'
                )}
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    </>
  );
};

export default ChangePassword;
