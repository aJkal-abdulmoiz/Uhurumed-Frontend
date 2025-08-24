import React, { useContext, useEffect, useState } from 'react';
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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import CancelBtn from './CancelBtn'; // Make sure this is implemented
import { AuthContext } from '../../Context/Auth';
import axios from 'axios';
import ApiConfig from '../../ApiConfig/ApiConfig';
import toast from 'react-hot-toast';
import PhoneInput from 'react-phone-input-2';

const today = new Date();
const minDate = new Date(
  today.getFullYear() - 90,
  today.getMonth(),
  today.getDate()
);
const maxDate = new Date(
  today.getFullYear() - 12,
  today.getMonth(),
  today.getDate()
);

const validationSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  mobile: Yup.string().required('Mobile number is required'),
  birthday: Yup.string()
    .required('Date of birth is required')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .test('is-valid-date', 'Invalid date', (value) => {
      const date = new Date(value);

      return !isNaN(date.getTime());
    })
    .test(
      'is-between-ages',
      'You must be between 12 and 90 years old',
      (value) => {
        const date = new Date(value);

        return date >= minDate && date <= maxDate;
      }
    ),
  // maritalStatus: Yup.string().required("Marital status is required"),
  Gender: Yup.string().required('Gender is required'),
  // bloodGroup: Yup.string().required("Blood group is required"),
  licenseNumber: Yup.string().required('License Number is required'),
  bio: Yup.string().required('Doctor details is required'),
  address: Yup.string().required('Address is required'),
  consultationFee: Yup.string().required('Consultation Fee is required'),
  knownDiseases: Yup.string().required('Specialization Fee is required'),
  familyHistory: Yup.string().required('Department is required'),
  Medical: Yup.string().required('Medical Education is required'),
  period: Yup.string().required('Experience Fee is required'),
  // MedicalHistory: Yup.string().required("Medical History is required"),
  // insurancePolicyId: Yup.string().required("Insurance policy Id is required"),
});

export default function EditDoctor({ open, onClose, getAllDoctors }) {
  const auth = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [storeImage, setStoreImage] = useState(null);

  const userData = auth.userData;

  const birthday = open?.dateOfBirth
    ? new Date(open?.dateOfBirth).toISOString().split('T')[0]
    : '';
  const patientData = {
    firstName: open?.firstName || '',
    lastName: open?.lastName || '',
    email: open?.email || '',
    mobile: open?.phone || '',
    birthday: birthday ?? '',
    // maritalStatus:open?.meritalStatus ?? "",
    Gender: open?.gender ?? '',
    // bloodGroup: open?.bloodGroup ?? "",
    licenseNumber: open?.licenseNumber ?? '',
    bio: open?.bio ?? '',
    address: open?.address ?? '',
    consultationFee: open?.consultationFee ?? '',
    knownDiseases: open?.specialization ?? '',
    familyHistory: open?.department ?? '',
    Medical: open?.qualification ?? '',
    period: open?.experience ?? '',

    doctor: {
      name: 'Tiger Nixon',
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
  };

  const fields = [
    ['firstName', 'First Name'],
    ['lastName', 'Last Name'],
    ['mobile', 'Mobile No.'],
    ['email', 'Email'],
    ['birthday', 'Date of Birth'],
    // ["maritalStatus", "Marital Status"],
    ['Gender', 'Gender'],
    // ["bloodGroup", "Blood Group"],
    ['licenseNumber', 'License Number'],
    ['bio', 'Doctor Details'],
    ['address', 'Address'],
    ['consultationFee', 'ConsultationFee'],
  ];

  const fieldPairs = Array.isArray(fields)
    ? Array.from({ length: Math.ceil(fields.length / 2) }, (_, i) =>
      fields?.slice(i * 2, i * 2 + 2)
    )
    : [];

  useEffect(() => {
    if (open) {
      setStoreImage(open?.profilePic);
    }
  }, [open]);

  const uploadDataHanlder = async (image) => {
    console.log('dsagasdgsad', image);
    if (!image) return;
    const token = window.localStorage.getItem('UhuruMedToken');
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

  const EditProfileHandler = async (values) => {
    const token = window.localStorage.getItem('UhuruMedToken');
    setLoading(true);
    try {
      const response = await axios({
        method: 'PUT',
        url: ApiConfig.doctorupdate,
        headers: { authorization: `Bearer ${token}` },
        params: {
          id: open?.id,
        },
        data: {
          firstName: values?.firstName,
          lastName: values?.lastName,
          email: values?.email,
          phone: values?.mobile,
          dateOfBirth: values?.birthday,
          countryCode:values?.countryCode ?? '',
          gender: values?.Gender,
          ...(storeImage && { profilePic: storeImage }),

          // profilePic: storeImage,
          bio: values?.bio,
          licenseNumber: values?.licenseNumber,
          address: values?.address,
          specialization: values?.knownDiseases,
          department: values?.familyHistory,
          experience: values?.period,
          consultationFee: values?.consultationFee,
          qualification: values?.Medical,
          status: 'ACTIVE',
        },
      });
      if (response?.data?.error === 'false') {
        setLoading(false);
        toast.success(response?.data?.message);
        window.location.reload();
        onClose();
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
    <Dialog open={open} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'space-between' }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            src={
              storeImage ||
              'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?ga=GA1.1.406090842.1746782723&semt=ais_hybrid&w=740'
            }
          />
          <Typography variant="h6">
            {open?.firstName} {open?.lastName}
          </Typography>
        </Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Formik
        initialValues={patientData}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={(values) => {
          EditProfileHandler(values);
          console.log('Submitted values:', values);
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
                  onClick={() => document.getElementById('fileUpload').click()}
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
            <DialogContent dividers sx={{ px: 3 }}>
              <Box>
                {fieldPairs?.map((pair, idx) => (
                  <Grid
                    container
                    key={idx}
                    rowSpacing={2}
                    columnSpacing={{ xs: 1, sm: 2, md: 5 }}
                  >
                    {pair?.map(([field, label]) => (
                      <Grid item xs={12} sm={6} key={field}>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          sx={{ mb: 1, mt: 1 }}
                        >
                          {label}
                        </Typography>
                        {field === 'mobile' ? (
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
                          <Field
                            as={TextField}
                            fullWidth
                            type={field === 'birthday' ? 'date' : 'text'} // ✅ conditionally set type
                            variant="outlined"
                            name={field}
                            value={values[field]}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched[field] && Boolean(errors[field])}
                            helperText={touched[field] && errors[field]}
                            FormHelperTextProps={{ style: { marginLeft: 0 } }}
                            InputLabelProps={
                              field === 'BirthDay' ? { shrink: true } : {}
                            }
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
                                borderColor: '#14B8A6',
                              },
                            }}
                          />
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
                      name="Medical"
                      value={values.Medical}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.Medical && Boolean(errors.Medical)}
                      helperText={touched.Medical && errors.Medical}
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
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
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
                  'Save Changes'
                )}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}
