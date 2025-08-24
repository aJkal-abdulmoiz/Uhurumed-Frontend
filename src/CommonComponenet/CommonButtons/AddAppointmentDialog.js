import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Avatar,
  Button,
  Grid,
  Box,
  TextField,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import CancelBtn from './CancelBtn';
import axios from 'axios';
import toast from 'react-hot-toast';
import ApiConfig from '../../ApiConfig/ApiConfig';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import PhoneInput from 'react-phone-input-2';

const patientData = {
  firstName: '',
  lastName: '',
  email: '',
  mobile: '',
  birthday: '',
  // countryCode: "",
  password: '',
  confirmPassword:'',
  sex: '',
};

const today = new Date();
const maxDate = new Date(
  today.getFullYear() - 18,
  today.getMonth(),
  today.getDate()
); // must be 18 or older
const minDate = new Date(
  today.getFullYear() - 80,
  today.getMonth(),
  today.getDate()
); // max 80 years old

const validationSchema = Yup.object({
  firstName: Yup.string()
    .matches(/^[A-Za-z]+$/, 'First name must contain only letters')
    .required('First name is required'),

  lastName: Yup.string()
    .matches(/^[A-Za-z]+$/, 'Last name must contain only letters')
    .required('Last name is required'),

  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),

  mobile: Yup.string()
    .matches(/^\+?\d{10,15}$/, 'Mobile number is not valid') // Accepts optional + and 10 to 15 digits
    .required('Mobile number is required'),

  birthday: Yup.date()
    .required('Birthday is required')
    .max(maxDate, 'Doctor must be at least 18 years old')
    .min(minDate, 'Doctor must be younger than 80 years old'),

  sex: Yup.string()
    .matches(/^(male|female|other)$/i, 'Gender must be male, female, or other')
    .required('Gender is required'),

  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must be at least 8 characters'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),

  // countryCode: Yup.string()
  //   .matches(
  //     /^\+\d{1,4}$/,
  //     "CountryCode must start with + followed by 1 to 4 digits"
  //   )
  //   .required("CountryCode is required"),
});

export default function AddAppointmentDialog({ open, onClose }) {
  const [loading, setLoading] = useState(false);
  const [storeImage, setStoreImage] = useState(null);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const uploadDataHanlder = async (image) => {
    console.log('dsagasdgsad', image);
    if (!image) return;
    const token = window.localStorage.getItem('adminToken');
    setLoading(true);

    const formData = new FormData();
    formData.append('files', image);

    try {
      const response = await axios.post(ApiConfig.uploadFile, formData, {
        headers: {
          authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response?.data?.error === 'false') {
        toast.success(response?.data?.message);
        setStoreImage(response?.data?.data?.secureUrl);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error uploading file:', error);
      toast.error('Failed to upload image. Please try again.');
    }
  };

  const patientAdd = async (values, onClick) => {
    const token = window.localStorage.getItem('UhuruMedToken');
    const payloadList = {
      firstName: values?.firstName ?? '',
      lastName: values.lastName ?? '',
      email: values.email ?? '',
      phone: values?.mobile ?? '',
      countryCode: values?.countryCode ?? '',
      password: values?.password ?? '',
      dateOfBirth: values?.birthday ?? '',
      gender: values?.sex ?? '',
    };
    setLoading(true);
    try {
      const response = await axios({
        method: 'POST',
        url: ApiConfig.patientCreate,
        headers: {
          authorization: `Bearer ${token}`,
        },
        data: payloadList,
      });
      if (response?.data?.error === 'false') {
        onClose();
        setLoading(false);
        toast.success(response?.data?.message || 'Patient Add Successfully');
        window.location.reload();
      } else {
        setLoading(false);
        toast.error(response?.data?.message || 'Please try again');
      }
    } catch (error) {
      setLoading(false);
      console.log('error', error);
      toast.error(error?.data?.message || 'Please try again');
    }
  };

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: '10px', // Set border radius
          // Add padding (optional, adjust as needed)
        },
      }}
    >
      <DialogTitle
        sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'space-between' }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h6" fontWeight={'bold'}>
            Add Patient
          </Typography>
        </Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ px: 3 }}>
        <Formik
          initialValues={patientData}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            patientAdd(values);
          }}
        >
          {({
            errors,
            touched,
            handleChange,
            handleBlur,
            values,
            setFieldValue,
          }) => (
            <Form>
             
              <Box>
                {[
                  ['firstName', 'First Name'],
                  ['lastName', 'Last Name'],
                  ['email', 'Email'],
                  ['birthday', 'Date of Birth'],
                  // ["countryCode", "CountryCode"],
                  ['mobile', 'Mobile No.'],
                  ['sex', 'Gender'],
                  ['password', 'Password'],
                  ['confirmPassword', 'Confirm Password'],
                ]
                  .reduce((acc, curr, i, arr) => {
                    if (i % 2 === 0) acc.push([curr, arr[i + 1]]);

                    return acc;
                  }, [])
                  .map((pair, idx) => (
                    <Grid
                      key={idx}
                      container
                      rowSpacing={2}
                      columnSpacing={{ xs: 1, sm: 2, md: 5 }}
                    >
                      {pair.map(([field, label]) => (
                        <Grid item xs={12} sm={6} key={field}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            sx={{ mb: 1, mt: 1 }}
                          >
                            {label}
                          </Typography>
                          {field === 'birthday' ? (
                            <Field name={field}>
                              {({ field: formikField, meta }) => (
                                <TextField
                                  {...formikField}
                                  fullWidth
                                  type="date"
                                  variant="outlined"
                                  error={meta.touched && Boolean(meta.error)}
                                  helperText={meta.touched && meta.error}
                                  InputLabelProps={{ shrink: true }}
                                  FormHelperTextProps={{
                                    style: { marginLeft: 0 },
                                  }}
                                  sx={{
                                    width: '250px',
                                    '& .MuiInputBase-root': {
                                      height: 40,
                                      fontSize: '14px',
                                    },
                                    '& fieldset': {
                                      borderColor: '#ccc',
                                    },
                                    '&:hover fieldset': {
                                      borderColor: '#0077CC',
                                    },
                                    '&.Mui-focused fieldset': {
                                      borderColor: '#0077CC',
                                    },
                                  }}
                                />
                              )}
                            </Field>
                          ) : field === 'mobile' ? (
                            <PhoneInput
                              country={'us'}
                              value={values[field]}
                              onChange={(phone, country) => {
                                setFieldValue(field, phone);
                                setFieldValue('countryCode', country.dialCode); // optional, if needed
                              }}
                              inputProps={{
                                name: field,
                                required: true,
                                autoFocus: false,
                                placeholder: 'Enter phone number',
                              }}
                              specialLabel=""
                              containerStyle={{ width: '100%' }}
                              inputStyle={{
                                width: '250px',
                                height: '40px',
                                background: '#fff',
                                fontSize: '14px',
                                padding: '0 1px 0 45px',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                              }}
                            />
                          ) : (
                            <Field name={field}>
                              {({ field: formikField, meta }) => {
                                const isPassword =
                                  field === 'password' ||
                                  field === 'confirmPassword';
                                const isConfirm = field === 'confirmPassword';
                                const show = isConfirm
                                  ? showConfirmPassword
                                  : showPassword;
                                const toggleShow = () =>
                                  isConfirm
                                    ? setShowConfirmPassword((prev) => !prev)
                                    : setShowPassword((prev) => !prev);

                                return (
                                  <TextField
                                    {...formikField}
                                    fullWidth
                                    variant="outlined"
                                    type={
                                      isPassword
                                        ? !show
                                          ? 'text'
                                          : 'password'
                                        : 'text'
                                    }
                                    error={meta.touched && Boolean(meta.error)}
                                    helperText={meta.touched && meta.error}
                                    FormHelperTextProps={{
                                      style: { marginLeft: 0 },
                                    }}
                                    sx={{
                                      '& .MuiInputBase-root': {
                                        height: 40,
                                        fontSize: '14px',
                                        width: '250px',
                                      },
                                      '& fieldset': {
                                        borderColor: '#ccc',
                                      },
                                      '&.Mui-focused fieldset': {
                                        borderColor: '#0077CC',
                                      },
                                    }}
                                    InputProps={{
                                      endAdornment: isPassword && (
                                        <InputAdornment position="end">
                                          <IconButton
                                            onClick={toggleShow}
                                            edge="end"
                                            size="small"
                                          >
                                            {show ? (
                                              <VisibilityOff />
                                            ) : (
                                              <Visibility />
                                            )}
                                          </IconButton>
                                        </InputAdornment>
                                      ),
                                    }}
                                  />
                                );
                              }}
                            </Field>
                          )}
                        </Grid>
                      ))}
                    </Grid>
                  ))}
              </Box>
              <DialogActions sx={{ px: 3, py: 2, pt: 5 }}>
                <CancelBtn label="Close" onClick={onClose} />

                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: '#2e5ad5',
                    padding: 1,
                    width: '150px',
                    '&:hover': { backgroundColor: '#2e5ad5' },
                    color: '#fff',
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                  ) : (
                    'Submit'
                  )}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
