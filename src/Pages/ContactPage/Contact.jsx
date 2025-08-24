import React, { useState } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, FormHelperText, FormControl } from '@mui/material';
import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import axios from 'axios';
import ApiConfig from '../../ApiConfig/ApiConfig';
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import toast from 'react-hot-toast';

// interface ContactFormValues {
//   firstName: string;
//   lastName: string;
//   phone: string;
//   email: string;
//   message: string;
//   countryCode: string;
// }

// const initialValues: ContactFormValues = {
//   firstName: "",
//   lastName: "",
//   phone: "",
//   email: "",
//   message: "",
//   countryCode: "",
// };

const validationSchema = Yup.object({
  firstName: Yup.string()
    .matches(/^[A-Za-z\s'-]{2,}$/, 'First name must contain only letters and be at least 2 characters')
    .required('First name is required'),

  lastName: Yup.string()
    .matches(/^[A-Za-z\s'-]{2,}$/, 'Last name must contain only letters and be at least 2 characters')
    .required('Last name is required'),

  phone: Yup.string()
    .matches(
      /^\+?[1-9]\d{1,14}$/,
      'Enter a valid international phone number (e.g., +1234567890)'
    )
    .required('Phone number is required'),

  email: Yup.string()
    .matches(
      /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
      'Enter a valid email address'
    )
    .required('Email is required'),

  message: Yup.string()
    .min(10, 'Message should be at least 10 characters')
    .matches(
      /^[\s\S]{10,1000}$/,
      'Message should be between 10 and 1000 characters'
    )
    .required('Please enter a message'),
});

const Contact = () => {
  const contactForm = async (
    values,
    resetForm 
  ) => {
  // Remove the country code prefix from phone
    const dialCode = values.countryCode.replace('+', ''); // "1"
    const phoneWithoutCode = values.phone.startsWith(dialCode)
      ? values.phone.slice(dialCode.length)
      : values.phone;

    const payloadData = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: phoneWithoutCode,
      countryCode: values.countryCode,
      message: values.message,
    };

    try {
      const response = await axios.post(ApiConfig.contactUs, payloadData);
      console.log('dfffdfgdsg', response);
      if (response?.data?.error === 'false') {
        toast.success(response?.data?.message || 'Your message has been sent successfully!');
        resetForm();
      }
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to send message. Please check your connection.');
    }
  };

  const [loading, setLoading] = useState(false);

  return (
    <>
      {/* <ToastContainer position="top-right" autoClose={5000} /> */}

      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage:
            'url("https://img.freepik.com/free-photo/businessman-using-laptop-mobile-phone_1421-526.jpg?ga=GA1.1.406090842.1746782723&semt=ais_hybrid&w=740")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
          height: '60vh',
          position: 'relative',
        }}
      >
        <Typography
          variant="h3"
          sx={{
            backgroundColor: 'rgba(243, 232, 232, 0.67)',
            p: 2,
            borderRadius: 2,
            color: '#0077CC',
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
          }}
        >
          Caring For Life
        </Typography>
      </Box>

      {/* Form Section */}
      <Box
        sx={{
          backgroundColor: '#f9f9f9',
          padding: { xs: 2, sm: 4 },
          maxWidth: 900,
          margin: '-90px auto 40px',
          borderRadius: 2,
          boxShadow: 3,
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontSize: { xs: '1.6rem', sm: '2rem' },
            color: '#333',
            mb: 3,
          }}
        >
          Contact Us
        </Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={contactForm}
        >
          {({ values, handleChange, touched, errors, setFieldValue }) => (
            <Form>
              {/* First Name & Last Name */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2,
                  mb: 2,
                }}
              >
                <TextField
                  fullWidth
                  name="firstName"
                  label="First Name"
                  value={values.firstName}
                  onChange={handleChange}
                  error={touched.firstName && Boolean(errors.firstName)}
                  helperText={touched.firstName && errors.firstName}
                  InputLabelProps={{ sx: { fontSize: '16px', color: '#555' } }}
                  InputProps={{
                    sx: {
                      height: '50px',
                      '& input': {
                        height: '50px',
                        padding: '0 14px',
                        fontSize: '16px',
                      },
                    },
                  }}
                  FormHelperTextProps={{
                    sx: {
                      marginLeft: '0px', // adjust as needed
                      fontSize: '13px', // optional: smaller font size for error message
                      color: 'red' // optional: reinforce error color
                    }
                  }}
                />
                <TextField
                  fullWidth
                  name="lastName"
                  label="Last Name"
                  value={values.lastName}
                  onChange={handleChange}
                  error={touched.lastName && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  InputLabelProps={{ sx: { fontSize: '16px', color: '#555' } }}
                  InputProps={{
                    sx: {
                      height: '50px',
                      '& input': {
                        height: '50px',
                        padding: '0 14px',
                        fontSize: '16px',
                      },
                    },
                  }}
                  FormHelperTextProps={{
                    sx: {
                      marginLeft: '0px', // adjust as needed
                      fontSize: '13px', // optional: smaller font size for error message
                      color: 'red' // optional: reinforce error color
                    }
                  }}
                />
              </Box>

              {/* Email & Phone */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2,
                  mb: 2,
                }}
              >
                <TextField
                  fullWidth
                  name="email"
                  label="Email"
                  value={values.email}
                  onChange={handleChange}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  InputLabelProps={{ sx: { fontSize: '16px', color: '#555' } }}
                  InputProps={{
                    sx: {
                      height: '50px',
                      '& input': {
                        height: '50px',
                        padding: '0 14px',
                        fontSize: '16px',
                      },
                    },
                  }}
                  FormHelperTextProps={{
                    sx: {
                      marginLeft: '0px', // adjust as needed
                      fontSize: '13px', // optional: smaller font size for error message
                      color: 'red' // optional: reinforce error color
                    }
                  }}
                />
  

                <FormControl fullWidth sx={{ mt: 0 }}>
                  <PhoneInput
                    country={'us'}
                    value={values.phone}
                    onChange={(phone, data) => {
                      setFieldValue('phone', phone);
                      setFieldValue('countryCode', '+' + data.dialCode);
                    }}
                    inputProps={{
                      name: 'phone',
                      required: true,
                      autoFocus: false,
                      placeholder: 'Enter phone number',
                      // onBlur: handleBlur, // <- Important for touched state
                    }}
                    specialLabel=""
                    containerStyle={{ width: '100%' }}
                    inputStyle={{
                      width: '100%',
                      height: '50px',
                      background: '#f7fbfc1f',
                      fontSize: '14px',
                      padding: '0 1px 0 45px',
                      border: '1px solid',
                      borderColor: touched.phone && errors.phone ? 'red' : '#ccc',
                    }}
                  />

                  {touched.phone && errors.phone && (
                    <FormHelperText sx={{ color: 'red', fontSize: '13px', ml: '10px' }}>
                      {errors.phone}
                    </FormHelperText>
                  )}
                </FormControl>

              </Box>

              {/* Message */}
              <TextField
                fullWidth
                multiline
                rows={4}
                name="message"
                label="Message"
                value={values.message}
                onChange={handleChange}
                error={touched.message && Boolean(errors.message)}
                helperText={touched.message && errors.message}
                InputLabelProps={{ sx: { fontSize: '16px', color: '#555' } }}
                InputProps={{
                  sx: {
                    '& textarea': {
                      fontSize: '16px',
                    },
                  },
                }}
                sx={{ mb: 3 }}
                FormHelperTextProps={{
                  sx: {
                    marginLeft: '0px', // adjust as needed
                    fontSize: '13px', // optional: smaller font size for error message
                    color: 'red' // optional: reinforce error color
                  }
                }}
              />

              <Button type="submit"
                sx={{
                  // backgroundColor:backgroundColor ?? "#14B8A6",
                  backgroundColor: '#2e5ad5',
                  fontWeight: 'bold',
                  borderRadius: '10px',
                  textTransform: 'none',  
                  padding: '8px 54px',
                  color:'#fff',
                  '&:hover': {
                    backgroundColor: '#0077CC',
                    color:'#fff',
                  },
                }}>
                {loading ? (
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : (
                  'Submit'
                )}</Button>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default Contact;
