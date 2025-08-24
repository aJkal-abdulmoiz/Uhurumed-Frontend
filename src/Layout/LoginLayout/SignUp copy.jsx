import React, { useContext, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Link,
  MenuItem,
  InputAdornment,
  IconButton,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import axios from 'axios';
import ApiConfig from '../../ApiConfig/ApiConfig';
import toast from 'react-hot-toast';
import { AuthContext } from '../../Context/Auth';
import { FiEye } from 'react-icons/fi';
import { FiEyeOff } from 'react-icons/fi';

const SignUp = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
  const handleClickShowConfirmPassword = () => {
    setConfirmPassword((prev) => !prev);
  };

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      countryCode: '',
      password: '',
      confirmPassword: '',
      userType: 'USER',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('First name is required'),
      lastName: Yup.string().required('Last name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      phone: Yup.string()
        // .matches(/^\d{10}$/, "Phone number must be 10 digits")
        .required('Phone number is required'),
      countryCode: Yup.string().required('Country code is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required'),
      userType: Yup.string()
        .oneOf(['USER', 'ADMIN'])
        .required('User type is required'),
    }),
    onSubmit: (values) => {
      console.log('Login:', values);
      SignUpHandler(values);
      // navigate("/dashboard")
    },
  });

  const handleLogin = () => {
    navigate('/login');
  };

  const auth = useContext(AuthContext);
  const SignUpHandler = async (values) => {
    setLoading(true);
    try {
      const response = await axios({
        method: 'POST',
        url: ApiConfig.signup,
        data: {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
          countryCode: values.countryCode,
          password: values.password,
          confirmPassword: values.confirmPassword,
          userType: values.userType,
        },
      });
      console.log('successsuccess', response?.data?.error);
      if (response?.data?.error === 'false') {
        console.log('jwtTokenjwtToken', response?.data?.data);
        toast.success(response.data?.message);
        auth.checkLogin(response?.data?.data?.token);
        setLoading(false);
        window.localStorage.setItem(
          'UhuruMedToken',
          response?.data?.data?.token
        );
        window.localStorage.setItem(
          'userData',
          JSON.stringify(response.data?.data)
        );

        auth.getProfileData();
        auth.setIsLogin(true);
        setTimeout(() => {
          navigate('/login');
        }); // 2 seconds
        // navigate("/dashboard");
        // history.push("/dashboard");
        console.log('responseresponse', response);
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

  return (
    <Box
      minHeight="100vh"
      // paddingTop="4rem"
      paddingBottom="2rem"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ background: '#ffffffab', paddingTop: {
        xs: '7rem',  // small devices
        sm: '4rem',  // 600px and up
      }, }}
    >
      <Paper
        elevation={2}
        sx={{
          padding: 4,
          width: 550,
          borderRadius: 4,
          background: 'linear-gradient(to bottom right, #0077CC, #ffffff9c)',
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          mb={2}
          style={{ color: '#fff' }}
        >
          Create a new <span style={{ color: '#0077CC' }}>Account</span>
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          {isSmallScreen ? (
            // Mobile layout: stacked fields in order
            <>
              <Typography
                variant="h6"
                mt={2}
                mb={0.5}
                style={{ fontSize: '18px', color: '#fff' }}
              >
                First Name
              </Typography>
              <TextField
                fullWidth
                margin="dense"
                id="firstName"
                name="firstName"
                placeholder="eg. Suraj"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                error={
                  formik.touched.firstName && Boolean(formik.errors.firstName)
                }
                helperText={formik.touched.firstName && formik.errors.firstName}
                InputProps={{
                  sx: {
                    borderRadius: 3,
                    backgroundColor: '#fff',
                    height: 49,
                    '& input::placeholder': { fontSize: '0.8rem' },
                    '& input': { fontSize: '16px' },
                  },
                }}
              />

              <Typography
                variant="h6"
                mt={2}
                mb={0.5}
                style={{ fontSize: '18px', color: '#fff' }}
              >
                Last Name
              </Typography>
              <TextField
                fullWidth
                margin="dense"
                id="lastName"
                name="lastName"
                placeholder="eg. Kumar"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                error={
                  formik.touched.lastName && Boolean(formik.errors.lastName)
                }
                helperText={formik.touched.lastName && formik.errors.lastName}
                InputProps={{
                  sx: {
                    borderRadius: 3,
                    backgroundColor: '#fff',
                    height: 49,
                    '& input::placeholder': { fontSize: '0.8rem' },
                    '& input': { fontSize: '16px' },
                  },
                }}
              />

              <Typography
                variant="h6"
                mt={2}
                mb={0.5}
                style={{ fontSize: '18px', color: '#fff' }}
              >
                Email
              </Typography>
              <TextField
                fullWidth
                margin="dense"
                id="email"
                name="email"
                placeholder="eg. johndoe@example.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                InputProps={{
                  sx: {
                    borderRadius: 3,
                    backgroundColor: '#fff',
                    height: 49,
                    '& input::placeholder': { fontSize: '0.8rem' },
                    '& input': { fontSize: '16px' },
                  },
                }}
              />

              <Typography
                variant="h6"
                mt={2}
                mb={0.5}
                style={{ fontSize: '18px', color: '#fff' }}
              >
                Phone
              </Typography>
              {/* <PhoneInput
                country={"in"}
                value={formik.values.phone}
                onChange={(phone, country) => {
                  formik.setFieldValue("phone", phone);
                  formik.setFieldValue("countryCode", country.dialCode);
                }}
                inputProps={{
                  name: "phone",
                  required: true,
                  onBlur: formik.handleBlur,
                }}
                inputStyle={{
                  width: "95%",
                  height: "40px",
                  borderRadius: "12px",
                  backgroundColor: "#fff",
                  fontSize: "0.8rem",
                  paddingLeft: "10px",
                  marginTop: "10px",
                }}
                specialLabel=""
                containerStyle={{ marginTop: "8px", marginBottom: "8px" }}
              /> */}

              <PhoneInput
                country={'us'}
                value={formik.values.phone}
                onChange={(phone, country) => {
                  formik.setFieldValue('phone', phone);
                  formik.setFieldValue('countryCode', country.dialCode);
                }}
                inputProps={{
                  name: 'phone',
                  required: true,
                  autoFocus: false,
                  placeholder: 'Enter phone number',
                }}
                specialLabel=""
                containerStyle={{ width: '100%' }}
                inputStyle={{
                  width: '100%',
                  height: '50px',
                  background: '#fff',
                  fontSize: '14px',
                  padding: '0 1px 0 45px',
                  border: '1px solid #fff',
                  borderRadius:'10px',
                }}
              />
              {formik.touched.phone && formik.errors.phone && (
                <div
                  style={{
                    color: '#d32f2f',
                    fontSize: '0.85rem',
                    marginTop: '4px',
                  }}
                >
                  {formik.errors.phone}
                </div>
              )}

              <Typography
                variant="h6"
                mt={2}
                mb={0.5}
                style={{ fontSize: '18px', color: '#fff' }}
              >
                Password
              </Typography>
              <TextField
                fullWidth
                margin="dense"
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
                InputProps={{
                  sx: {
                    borderRadius: 3,
                    backgroundColor: '#fff',
                    height: 49,
                    '& input::placeholder': { fontSize: '0.8rem' },
                    '& input': { fontSize: '16px' },
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword} edge="end">
                        {showPassword ? <FiEye /> : <FiEyeOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Typography
                variant="h6"
                mt={2}
                mb={0.5}
                style={{ fontSize: '18px', color: '#fff' }}
              >
                Confirm Password
              </Typography>
              <TextField
                fullWidth
                margin="dense"
                id="confirmPassword"
                name="confirmPassword"
                type={confirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                error={
                  formik.touched.confirmPassword &&
                  Boolean(formik.errors.confirmPassword)
                }
                helperText={
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                }
                InputProps={{
                  sx: {
                    borderRadius: 3,
                    backgroundColor: '#fff',
                    height: 49,
                    '& input::placeholder': { fontSize: '0.8rem' },
                    '& input': { fontSize: '16px' },
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowConfirmPassword}
                        edge="end"
                      >
                        {confirmPassword ? <FiEye /> : <FiEyeOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </>
          ) : (
            // Desktop layout: two-column fields
            <Box display="flex" gap={3} flexWrap="wrap" flexDirection="row">
              {/* Left Column */}
              <Box flex={1}>
                <Typography
                  variant="h6"
                  mt={2}
                  mb={0.5}
                  style={{ fontSize: '18px', color: '#fff' }}
                >
                  First Name
                </Typography>
                <TextField
                  fullWidth
                  margin="dense"
                  id="firstName"
                  name="firstName"
                  placeholder="eg. Suraj"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.firstName && Boolean(formik.errors.firstName)
                  }
                  helperText={
                    formik.touched.firstName && formik.errors.firstName
                  }
                  InputProps={{
                    sx: {
                      borderRadius: 3,
                      backgroundColor: '#fff',
                      height: 49,
                      '& input::placeholder': { fontSize: '0.8rem' },
                      '& input': { fontSize: '16px' },
                    },
                  }}
                />

                <Typography
                  variant="h6"
                  mt={2}
                  mb={0.5}
                  style={{ fontSize: '18px', color: '#fff' }}
                >
                  Email
                </Typography>
                <TextField
                  fullWidth
                  margin="dense"
                  id="email"
                  name="email"
                  placeholder="eg. johndoe@example.com"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  InputProps={{
                    sx: {
                      borderRadius: 3,
                      backgroundColor: '#fff',
                      height: 49,
                      '& input::placeholder': { fontSize: '0.8rem' },
                      '& input': { fontSize: '16px' },
                    },
                  }}
                />

                <Typography
                  variant="h6"
                  mt={2}
                  mb={0.5}
                  style={{ fontSize: '18px', color: '#fff' }}
                >
                  Password
                </Typography>
                <TextField
                  fullWidth
                  margin="dense"
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                  InputProps={{
                    sx: {
                      borderRadius: 3,
                      backgroundColor: '#fff',
                      height: 49,
                      '& input::placeholder': { fontSize: '0.8rem' },
                      '& input': { fontSize: '16px' },
                    },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <FiEye /> : <FiEyeOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* Right Column */}
              <Box flex={1}>
                <Typography
                  variant="h6"
                  mt={2}
                  mb={0.5}
                  style={{ fontSize: '18px', color: '#fff' }}
                >
                  Last Name
                </Typography>
                <TextField
                  fullWidth
                  margin="dense"
                  id="lastName"
                  name="lastName"
                  placeholder="eg. Kumar"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.lastName && Boolean(formik.errors.lastName)
                  }
                  helperText={formik.touched.lastName && formik.errors.lastName}
                  InputProps={{
                    sx: {
                      borderRadius: 3,
                      backgroundColor: '#fff',
                      height: 49,
                      '& input::placeholder': { fontSize: '0.8rem' },
                      '& input': { fontSize: '16px' },
                    },
                  }}
                />

                <Typography
                  variant="h6"
                  mt={2}
                  mb={0.5}
                  style={{ fontSize: '18px', color: '#fff' }}
                >
                  Phone
                </Typography>
                <Box sx={{mt:1.5}}>
                  <PhoneInput
                    country={'us'}
                    value={formik.values.phone}
                    onChange={(phone, country) => {
                      formik.setFieldValue('phone', phone);
                      formik.setFieldValue('countryCode', country.dialCode);
                    }}
                    inputProps={{
                      name: 'phone',
                      required: true,
                      autoFocus: false,
                      placeholder: 'Enter phone number',
                    }}
                    specialLabel=""
                    containerStyle={{ width: '100%' }}
                    inputStyle={{
                      width: '100%',
                      height: '50px',
                      background: '#fff',
                      fontSize: '14px',
                      padding: '0 1px 0 42px',
                      border: '1px solid #fff',
                      borderRadius: '12px',
                    }}
                  />
                </Box>
                {formik.touched.phone && formik.errors.phone && (
                  <div
                    style={{
                      color: '#d32f2f',
                      fontSize: '0.85rem',
                      marginTop: '4px',
                    }}
                  >
                    {formik.errors.phone}
                  </div>
                )}

                <Typography
                  variant="h6"
                  mt={2}
                  mb={0.5}
                  style={{ fontSize: '18px', color: '#fff' }}
                >
                  Confirm Password
                </Typography>
                <TextField
                  fullWidth
                  margin="dense"
                  id="confirmPassword"
                  name="confirmPassword"
                  type={confirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.confirmPassword &&
                    Boolean(formik.errors.confirmPassword)
                  }
                  helperText={
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                  }
                  InputProps={{
                    sx: {
                      borderRadius: 3,
                      backgroundColor: '#fff',
                      height: 49,
                      '& input::placeholder': { fontSize: '0.8rem' },
                      '& input': { fontSize: '16px' },
                    },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowConfirmPassword}
                          edge="end"
                        >
                          {confirmPassword ? <FiEye /> : <FiEyeOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>
          )}

          {/* Submit Button shared by both layouts */}
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{
              mt: 3,
              py: 1.5,
              borderRadius: 999,
              backgroundColor: '#2e5ad5',
              fontSize: '1rem',
              textTransform: 'none',
              ':hover': { backgroundColor: '#2e5ad5' },
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : (
              'Sign Up'
            )}
          </Button>
        </form>

        <Typography variant="body2" textAlign="center" mt={2}>
          Already have an account?{' '}
          <Link
            href="#"
            underline="none"
            sx={{ color: '#2e5ad5', fontWeight: 500 }}
            onClick={handleLogin}
          >
            Log In
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default SignUp;
