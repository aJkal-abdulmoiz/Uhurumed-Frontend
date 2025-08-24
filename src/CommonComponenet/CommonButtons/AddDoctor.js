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
  select,
  Box,
  TextField,
  CircularProgress,
  MenuItem,
  FormControl,
  FormHelperText,
  Select,
  Autocomplete,
  InputAdornment,
  InputLabel,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import CancelBtn from './CancelBtn';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import toast from 'react-hot-toast';
import axios from 'axios';
import ApiConfig from '../../ApiConfig/ApiConfig';
import { useNavigate } from 'react-router-dom';
import { CountryFlag } from '../../Context/CountryFlag';
import PhoneInput from 'react-phone-input-2';

const countryData = [
  { name: 'Afghanistan', code: 'AF', dial_code: '+93' },
  { name: 'Albania', code: 'AL', dial_code: '+355' },
  { name: 'Algeria', code: 'DZ', dial_code: '+213' },
  { name: 'Andorra', code: 'AD', dial_code: '+376' },
  { name: 'Angola', code: 'AO', dial_code: '+244' },
  { name: 'Argentina', code: 'AR', dial_code: '+54' },
  { name: 'Australia', code: 'AU', dial_code: '+61' },
  { name: 'Austria', code: 'AT', dial_code: '+43' },
  { name: 'Bangladesh', code: 'BD', dial_code: '+880' },
  { name: 'Belgium', code: 'BE', dial_code: '+32' },
  { name: 'Brazil', code: 'BR', dial_code: '+55' },
  { name: 'Canada', code: 'CA', dial_code: '+1' },
  { name: 'China', code: 'CN', dial_code: '+86' },
  { name: 'Denmark', code: 'DK', dial_code: '+45' },
  { name: 'Egypt', code: 'EG', dial_code: '+20' },
  { name: 'France', code: 'FR', dial_code: '+33' },
  { name: 'Germany', code: 'DE', dial_code: '+49' },
  { name: 'India', code: 'IN', dial_code: '+91' },
  { name: 'Indonesia', code: 'ID', dial_code: '+62' },
  { name: 'Italy', code: 'IT', dial_code: '+39' },
  { name: 'Japan', code: 'JP', dial_code: '+81' },
  { name: 'Kenya', code: 'KE', dial_code: '+254' },
  { name: 'Mexico', code: 'MX', dial_code: '+52' },
  { name: 'Netherlands', code: 'NL', dial_code: '+31' },
  { name: 'Nigeria', code: 'NG', dial_code: '+234' },
  { name: 'Pakistan', code: 'PK', dial_code: '+92' },
  { name: 'Russia', code: 'RU', dial_code: '+7' },
  { name: 'Saudi Arabia', code: 'SA', dial_code: '+966' },
  { name: 'South Africa', code: 'ZA', dial_code: '+27' },
  { name: 'Spain', code: 'ES', dial_code: '+34' },
  { name: 'Sweden', code: 'SE', dial_code: '+46' },
  { name: 'Switzerland', code: 'CH', dial_code: '+41' },
  { name: 'Turkey', code: 'TR', dial_code: '+90' },
  { name: 'United Arab Emirates', code: 'AE', dial_code: '+971' },
  { name: 'United Kingdom', code: 'GB', dial_code: '+44' },
  { name: 'United States', code: 'US', dial_code: '+1' },
];

const patientData = {
  firstName: '',
  lastName: '',
  email: '',
  mobile: '',
  birthday: '',
  maritalStatus: '',
  sex: '',
  consultationFee: '',
  bio: '',
  ZipCode: '',
  address: '',
  UserRole: '',
  // confirmPassword: "",
  knownDiseases: '',
  period: '',
  familyHistory: '',
  Diseases: '',
  doctor: {
    name: 'Tiger Nixon',
    avatar: 'https://i.pravatar.cc/150?img=12',
  },
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
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  mobile: Yup.string().required('Mobile number is required'),
  birthday: Yup.date()
    .required('Birthday is required')
    .max(maxDate, 'Doctor must be at least 18 years old')
    .min(minDate, 'Doctor must be younger than 80 years old'),
  // birthday: Yup.string()
  //   .required("Date of birth is required")
  //   .matches(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
  //   .test("is-valid-date", "Invalid date", (value) => {
  //     const date = new Date(value);
  //     return !isNaN(date.getTime());
  //   })
  //   .test(
  //     "is-between-ages",
  //     "You must be between 12 and 90 years old",
  //     (value) => {
  //       const date = new Date(value);
  //       return date >= minDate && date <= maxDate;
  //     }
  //   ),
  // maritalStatus: Yup.string().required("Marital status is required"),
  sex: Yup.string().required('Gender is required'),
  consultationFee: Yup.string().required('Consultation Fee is required'),
  bio: Yup.string().required('Doctor Details is required'),
  ZipCode: Yup.string()
    .matches(/^[a-zA-Z0-9]*$/, 'License number must be alphanumeric')
    .required('License number is required'),

  address: Yup.string().required('Address is required'),
  country: Yup.string().required('Country is required'),
  UserRole: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('New password is required'),
  // confirmPassword: Yup.string()
  //   .oneOf([Yup.ref("UserRole"), null], "Passwords must match")
  //   .required("Confirm password is required"),
  knownDiseases: Yup.string().required('Main specialization is required'),
  period: Yup.string().required('Experience is required'),
  familyHistory: Yup.string().required('Department is required'),
  Diseases: Yup.string().required('Medical Education required'),
});

export default function AddDoctor({ open, onClose }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const commonHeight = 41;
  const [storeImage, setStoreImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState([
    { index: 0 },
    ...CountryFlag,
  ]);

  const GenderStatus = [
    {
      name: 'Male',
    },
    {
      name: 'Female',
    },
    {
      name: 'Other',
    },
  ];

  const countryCurrencyMap = {
    Ghana: 'GHS', // Ghanaian Cedi
    // Add more countries and symbols if needed
  };

  const getCurrencySymbol = (country) => {
    return countryCurrencyMap[country] || '$'; // Default is $
  };

  console.log('Dsgasdgsad', storeImage);
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

  const loginHandler = async (values) => {
    const token = window.localStorage.getItem('UhuruMedToken');
    setLoading(true);
    try {
      const response = await axios({
        method: 'POST',
        url: ApiConfig.doctorAdd,
        headers: {
          authorization: `Bearer ${token}`,
        },
        data: {
          firstName: values?.firstName,
          lastName: values?.lastName,
          email: values?.email,
          phone: values?.mobile,
          password: values?.UserRole,
          specialization: values?.knownDiseases,
          bio: values?.bio,
          countryCode: values?.countryCode,
          country: values?.country,
          licenseNumber: values?.ZipCode,
          experience: values?.period,
          consultationFee: values?.consultationFee,
          qualification: values?.Diseases,
          department: values?.familyHistory,
          dateOfBirth: values?.birthday,
          address: values?.address,
          ...(storeImage && {
            profilePic: storeImage,
          }),
          gender: values?.sex,
        },
      });
      console.log('successsuccess', response?.data?.error);
      if (response?.data?.error === 'false') {
        console.log('jwtTokenjwtToken', response?.data?.data);
        toast.success(response.data?.message);
        onClose();
        window.location.reload();
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
    <Dialog open={open} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'space-between' }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h6" fontWeight={'bold'}>
            Add Doctor
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
            loginHandler(values);
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
              {/* <DialogContent dividers sx={{ pt: 3 }}> */}
              <Box mb={3}>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  gap={2}
                >
                  <Box
                    sx={{
                      cursor: 'pointer',
                      border: '1px solid #e5e5e5',
                      borderRadius: '50%',
                      width: '130px',
                      height: '130px',
                    }}
                    onClick={() =>
                      document.getElementById('fileUpload').click()
                    }
                  >
                    {loading ? (
                      // Show loader
                      <Box
                        display="flex"
                        justifyContent="center"
                        paddingTop="40px"
                      >
                        <CircularProgress />
                      </Box>
                    ) : (
                      <Avatar
                        src={
                          storeImage ||
                          'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?ga=GA1.1.406090842.1746782723&semt=ais_hybrid&w=740'
                        }
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    )}
                  </Box>

                  <input
                    id="fileUpload"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => uploadDataHanlder(e.target.files[0])}

                    // onChange={(e) => {
                    //   const file = e.target.files[0];
                    //   if (file) {
                    //     setImagePreview(URL.createObjectURL(file));
                    //     setFieldValue("image", file);
                    //   }
                    // }}
                  />
                </Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ mb: 1, textAlign: 'center', paddingTop: '10px' }}
                >
                  Upload Profile Photo
                </Typography>
              </Box>

              <Box>
                {[
                  ['firstName', 'First Name'],
                  ['lastName', 'Last Name'],
                  ['email', 'Email'],
                  ['mobile', 'Mobile No.'],
                  ['birthday', 'Date of Birth'],
                  // ["maritalStatus", "Marital status"],
                  ['sex', 'Gender'],
                  ['consultationFee', 'Consultation Fee'],
                  ['bio', 'Doctor Details'],
                  ['ZipCode', 'License Number'],
                  ['address', 'Address'],
                  ['country', 'Country'],
                  ['UserRole', 'Password'],
                  // ["confirmPassword", "Confirm Password"],
                ]
                  .reduce((acc, curr, i, arr) => {
                    if (i % 2 === 0) acc.push([curr, arr[i + 1]]);

                    return acc;
                  }, [])
                  .map((pair, idx) => (
                    <Grid
                      container
                      key={idx}
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

                          {field === 'country' ? (
                            <FormControl
                              fullWidth
                              error={touched[field] && Boolean(errors[field])}
                              sx={{ width: '250px' }}
                            >
                              <Field name={field}>
                                {({ field: formikField, meta }) => (
                                  <Autocomplete
                                    options={filteredCountries || []}
                                    getOptionLabel={(option) =>
                                      option?.name || ''
                                    }
                                    onChange={(event, newValue) => {
                                      setFieldValue(
                                        field,
                                        newValue?.name || ''
                                      ); // Save country name to Formik
                                    }}
                                    value={
                                      filteredCountries?.find(
                                        (c) => c.name === formikField.value
                                      ) || null
                                    }
                                    sx={{
                                      '& .MuiInputBase-root': {
                                        // height: 48, // set height of the input
                                        fontSize: '14px', // input text font size
                                        color: '#333', // input text color
                                        borderRadius: 1,
                                      },
                                      '& .MuiInputBase-input': {
                                        fontSize: '15px', // 🔵 Selected value font size
                                      },
                                      '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#ccc', // border color
                                      },
                                      '&:hover .MuiOutlinedInput-notchedOutline':
                                        {
                                          borderColor: '#0077cc', // hover border color
                                        },
                                      '&.Mui-focused .MuiOutlinedInput-notchedOutline':
                                        {
                                          borderColor: '#0077cc', // focused border color
                                        },
                                      '& .MuiInputLabel-root': {
                                        fontSize: '14px',
                                        color: '#555',
                                      },
                                    }}
                                    slotProps={{
                                      popper: {
                                        modifiers: [
                                          {
                                            name: 'offset',
                                            options: {
                                              offset: [0, 4],
                                            },
                                          },
                                        ],
                                      },
                                      paper: {
                                        sx: {
                                          '& .MuiAutocomplete-option': {
                                            color: '#000000DE',
                                            fontSize: '16px', // 🔴 Dropdown option text color
                                          },
                                        },
                                      },
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        // label="Select Country"
                                        variant="outlined"
                                        InputLabelProps={{ shrink: true }}
                                        error={
                                          meta.touched && Boolean(meta.error)
                                        }
                                        helperText={meta.touched && meta.error}
                                        sx={{
                                          '& .MuiInputBase-root': {
                                            height: 40, // set height of the input
                                            fontSize: '14px', // input text font size
                                            color: '#333', // input text color
                                            borderRadius: 1,
                                          },
                                          '& .MuiOutlinedInput-notchedOutline':
                                            {
                                              borderColor: '#ccc', // border color
                                            },
                                          '&:hover .MuiOutlinedInput-notchedOutline':
                                            {
                                              borderColor: '#0077cc', // hover border color
                                            },
                                          '&.Mui-focused .MuiOutlinedInput-notchedOutline':
                                            {
                                              borderColor: '#0077cc', // focused border color
                                            },
                                          '& .MuiInputLabel-root': {
                                            fontSize: '14px',
                                            color: '#555',
                                          },
                                        }}
                                        slotProps={{
                                          popper: {
                                            modifiers: [
                                              {
                                                name: 'offset',
                                                options: {
                                                  offset: [0, 4],
                                                },
                                              },
                                            ],
                                          },
                                          paper: {
                                            sx: {
                                              '& .MuiAutocomplete-option': {
                                                color: '#000',
                                                fontSize: '14px', // 🔴 Dropdown option text color
                                              },
                                            },
                                          },
                                        }}
                                      />
                                    )}
                                    isOptionEqualToValue={(option, value) =>
                                      option?.name === value?.name
                                    }
                                  />
                                )}
                              </Field>
                            </FormControl>
                          ) : field === 'sex' ? (
                            <FormControl
                              fullWidth
                              error={touched[field] && Boolean(errors[field])}
                              sx={{ width: '250px' }}
                            >
                              <Field name={field}>
                                {({ field: formikField, meta }) => (
                                  <Autocomplete
                                    options={GenderStatus || []}
                                    getOptionLabel={(option) =>
                                      option?.name || ''
                                    }
                                    onChange={(event, newValue) => {
                                      setFieldValue(
                                        field,
                                        newValue?.name || ''
                                      ); // Save country name to Formik
                                    }}
                                    value={
                                      GenderStatus?.find(
                                        (c) => c.name === formikField.value
                                      ) || null
                                    }
                                    sx={{
                                      '& .MuiInputBase-root': {
                                        // height: 48, // set height of the input
                                        fontSize: '14px', // input text font size
                                        color: '#333', // input text color
                                        borderRadius: 1,
                                      },
                                      '& .MuiInputBase-input': {
                                        fontSize: '15px', // 🔵 Selected value font size
                                      },
                                      '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#ccc', // border color
                                      },
                                      '&:hover .MuiOutlinedInput-notchedOutline':
                                        {
                                          borderColor: '#0077cc', // hover border color
                                        },
                                      '&.Mui-focused .MuiOutlinedInput-notchedOutline':
                                        {
                                          borderColor: '#0077cc', // focused border color
                                        },
                                      '& .MuiInputLabel-root': {
                                        fontSize: '14px',
                                        color: '#555',
                                      },
                                    }}
                                    slotProps={{
                                      popper: {
                                        modifiers: [
                                          {
                                            name: 'offset',
                                            options: {
                                              offset: [0, 4],
                                            },
                                          },
                                        ],
                                      },
                                      paper: {
                                        sx: {
                                          '& .MuiAutocomplete-option': {
                                            color: '#000000DE',
                                            fontSize: '16px', // 🔴 Dropdown option text color
                                          },
                                        },
                                      },
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        // label="Select Country"
                                        variant="outlined"
                                        InputLabelProps={{ shrink: true }}
                                        error={
                                          meta.touched && Boolean(meta.error)
                                        }
                                        helperText={meta.touched && meta.error}
                                        sx={{
                                          '& .MuiInputBase-root': {
                                            height: 40, // set height of the input
                                            fontSize: '14px', // input text font size
                                            color: '#333', // input text color
                                            borderRadius: 1,
                                          },
                                          '& .MuiOutlinedInput-notchedOutline':
                                            {
                                              borderColor: '#ccc', // border color
                                            },
                                          '&:hover .MuiOutlinedInput-notchedOutline':
                                            {
                                              borderColor: '#0077cc', // hover border color
                                            },
                                          '&.Mui-focused .MuiOutlinedInput-notchedOutline':
                                            {
                                              borderColor: '#0077cc', // focused border color
                                            },
                                          '& .MuiInputLabel-root': {
                                            fontSize: '14px',
                                            color: '#555',
                                          },
                                        }}
                                        slotProps={{
                                          popper: {
                                            modifiers: [
                                              {
                                                name: 'offset',
                                                options: {
                                                  offset: [0, 4],
                                                },
                                              },
                                            ],
                                          },
                                          paper: {
                                            sx: {
                                              '& .MuiAutocomplete-option': {
                                                color: '#000',
                                                fontSize: '14px', // 🔴 Dropdown option text color
                                              },
                                            },
                                          },
                                        }}
                                      />
                                    )}
                                    isOptionEqualToValue={(option, value) =>
                                      option?.name === value?.name
                                    }
                                  />
                                )}
                              </Field>
                            </FormControl>
                          ) : field === 'birthday' ? (
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
                          ) : field === 'consultationFee' ? (
                            <Field name="consultationFee">
                              {({ field: formikField, meta }) => (
                                <TextField
                                  {...formikField}
                                  fullWidth
                                  variant="outlined"
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
                                    '&:hover fieldset': {
                                      borderColor: '#0077CC',
                                    },
                                    '&.Mui-focused fieldset': {
                                      borderColor: '#0077CC',
                                    },
                                  }}
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        <Typography
                                          sx={{
                                            fontSize: '12px',
                                            color: '#333',
                                          }}
                                        >
                                          {getCurrencySymbol(values.country)}
                                        </Typography>
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              )}
                            </Field>
                          ) : (
                            <Field name={field}>
                              {({ field: formikField, meta }) => {
                                const isPassword =
                                  field === 'UserRole' ||
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

              <Box mt={3}>
                <Typography variant="h6" style={{ fontSize: '18px' }} mb={2}>
                  Medical Information
                </Typography>

                <Grid
                  container
                  rowSpacing={2}
                  columnSpacing={{ xs: 1, sm: 2, md: 5 }}
                >
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      Main specialization
                    </Typography>
                    <Field
                      as={TextField}
                      select
                      fullWidth
                      variant="outlined"
                      name="knownDiseases"
                      value={values.knownDiseases}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        touched.knownDiseases && Boolean(errors.knownDiseases)
                      }
                      helperText={touched.knownDiseases && errors.knownDiseases}
                      SelectProps={{ native: true }}
                      FormHelperTextProps={{ style: { marginLeft: 0 } }}
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
                    >
                      <option value="">Select</option>
                      <option value="General & Primary Care">
                        General & Primary Care
                      </option>
                      <option value="Surgical Specialties">
                        Surgical Specialties
                      </option>
                      <option value="Specialized Care">Specialized Care</option>
                      <option value="Medical Specialties">
                        Medical Specialties
                      </option>
                      <option value="Sensory and Neurological Systems">
                        Sensory and Neurological Systems
                      </option>
                      <option value="Diagnostic & Lab-Based">
                        Diagnostic & Lab-Based{' '}
                      </option>
                      <option value="Mental Health">Mental Health</option>
                      <option value="Women’s and Reproductive Health">
                        Women’s and Reproductive Health
                      </option>
                      <option value="Other">Other</option>
                    </Field>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      Department
                    </Typography>
                    <Field
                      as={TextField}
                      select
                      fullWidth
                      variant="outlined"
                      name="familyHistory"
                      value={values.familyHistory}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        touched.familyHistory && Boolean(errors.familyHistory)
                      }
                      helperText={touched.familyHistory && errors.familyHistory}
                      SelectProps={{ native: true }}
                      FormHelperTextProps={{ style: { marginLeft: 0 } }}
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
                    >
                      <option value="">Select</option>
                      <option value="Internal Medicine">
                        Internal Medicine
                      </option>
                      <option value="Obesity Medicine & Weight Management">
                        Obesity Medicine & Weight Management
                      </option>
                      <option value="Specialist Consultations">
                        Specialist Consultations
                      </option>
                      <option value="Urgent Care & Sick Visits">
                        Urgent Care & Sick Visits
                      </option>
                      <option value="Annual Physicals (Free for UhuruCare Members)">
                        Annual Physicals (Free for UhuruCare Members)
                      </option>
                    </Field>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      Medical Education
                    </Typography>
                    <Field
                      as={TextField}
                      fullWidth
                      variant="outlined"
                      name="Diseases"
                      value={values.Diseases}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.Diseases && Boolean(errors.Diseases)}
                      helperText={touched.Diseases && errors.Diseases}
                      FormHelperTextProps={{ style: { marginLeft: 0 } }}
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
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      Experience
                    </Typography>
                    <Field
                      as={TextField}
                      fullWidth
                      variant="outlined"
                      name="period"
                      value={values.period}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.period && Boolean(errors.period)}
                      helperText={touched.period && errors.period}
                      FormHelperTextProps={{ style: { marginLeft: 0 } }}
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
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* </DialogContent> */}

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
