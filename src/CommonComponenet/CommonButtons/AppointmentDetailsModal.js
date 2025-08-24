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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import CancelBtn from './CancelBtn';
import toast from 'react-hot-toast';
import { styled } from '@mui/system';
import axios from 'axios';
import ApiConfig from '../../ApiConfig/ApiConfig';
import { useNavigate } from 'react-router-dom';

const patientData = {
  notes: '',
  prescription: '',
  knownDiseases: '',
  // diagnosis: "",
  // date: "", // Add this line
};

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

const Input = styled('input')({ display: 'none' });

const ImagePreview = styled('img')(({ theme }) => ({
  width: '100%',
  maxWidth: '200px',
  height: '200px',
  borderRadius: theme.shape.borderRadius,
  marginTop: theme.spacing(2),
}));

const todayDate = new Date();
todayDate.setHours(0, 0, 0, 0); // zero time to avoid timezone issues

const validationSchema = Yup.object({
  notes: Yup.string().required('Notes is required'),
  prescription: Yup.string().required('Prescription is required'),
  knownDiseases: Yup.string().required('Follow up is required'),
  // diagnosis: Yup.string().required("Diagnosis is required"),
  // date: Yup.date()
  //   .required("Follow-up date is required")
  //   .min(todayDate, "Past dates are not allowed"),
});

export default function AppointmentDetailsModal({ open, onClose }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [storeImage, setStoreImage] = useState(null);
  console.log('Dsgasdgsad', storeImage);
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null);

  const CompleteMarkedHandler = async (values) => {
    const token = window.localStorage.getItem('UhuruMedToken');
    setLoading(true);
    try {
      const response = await axios({
        method: 'POST',
        url: ApiConfig.DoctorMarked,
        headers: {
          authorization: `Bearer ${token}`,
        },
        data: {
          appointmentId: open?.id,
          notes: values?.notes,
          diagnosis: preview ?? 'null',
          prescription: values?.prescription,
          followUpNeeded: values?.knownDiseases,
          followUpDate: values?.date,
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

  const uploadDataHandler = async (image, setFieldValue) => {
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
        const uploadedUrl = response?.data?.data?.secureUrl;
        setPreview(uploadedUrl);
        setFieldValue('imageUrl', uploadedUrl);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error uploading file:', error);
      toast.error('Failed to upload image. Please try again.');
    }
  };

  const handleRemove = () => {
    setImage(null);
    setPreview(null);
  };

  return (
    <Dialog open={open} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'space-between' }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h6" fontWeight={'bold'}>
            Complete Conversation
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
            CompleteMarkedHandler(values);
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
              <Box mt={1}>
                {/* <Typography variant="h6" style={{ fontSize: "18px" }} mb={2}>
                  Patient Information
                </Typography> */}

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
                      Follow Up
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
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </Field>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      Follow Up Date
                    </Typography>
                    <Field
                      as={TextField}
                      fullWidth
                      type="date"
                      variant="outlined"
                      name="date"
                      value={values.date}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.date && Boolean(errors.date)}
                      helperText={touched.date && errors.date}
                      FormHelperTextProps={{ style: { marginLeft: 0 } }}
                      InputLabelProps={{
                        shrink: true, // Ensures label doesn't overlap with the date value
                      }}
                      inputProps={{
                        min: new Date().toISOString().split('T')[0],
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
                    />
                  </Grid>
                </Grid>
                {/* <Grid item xs={12}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mb: 1, mt: 2 }}
                  >
                    Diagnosis
                  </Typography>
                  <Field
                    as={TextField}
                    fullWidth
                    multiline
                    rows={1}
                    variant="outlined"
                    name="diagnosis"
                    value={values.diagnosis}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.diagnosis && Boolean(errors.diagnosis)}
                    helperText={touched.diagnosis && errors.diagnosis}
                    FormHelperTextProps={{ style: { marginLeft: 0 } }}
                  />
                </Grid> */}

                <Grid item xs={12}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mb: 1, mt: 2 }}
                  >
                    Prescription
                  </Typography>
                  <Field
                    as={TextField}
                    fullWidth
                    multiline
                    rows={2}
                    variant="outlined"
                    name="prescription"
                    value={values.prescription}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.prescription && Boolean(errors.prescription)}
                    helperText={touched.prescription && errors.prescription}
                    FormHelperTextProps={{ style: { marginLeft: 0 } }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mb: 1, mt: 2 }}
                  >
                    Notes
                  </Typography>
                  <Field
                    as={TextField}
                    fullWidth
                    multiline
                    rows={3}
                    variant="outlined"
                    name="notes"
                    value={values.notes}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.notes && Boolean(errors.notes)}
                    helperText={touched.notes && errors.notes}
                    FormHelperTextProps={{ style: { marginLeft: 0 } }}
                  />
                </Grid>
                <Box textAlign="center" marginTop="1rem">
                  <label htmlFor="upload-image">
                    <Input
                      accept="image/*,application/pdf"
                      id="upload-image"
                      type="file"
                      onChange={(e) =>
                        uploadDataHandler(e.target.files[0], setFieldValue)
                      }
                    />
                    <Button
                      sx={{ background: '#2e5ad5', color: '#fff' }}
                      component="span"
                      startIcon={<CloudUploadIcon />}
                    >
                      Upload Image
                    </Button>
                  </label>

                  {preview ? (
                    <Box mt={2} position="relative">
                      <ImagePreview
                        src={
                          preview?.toLowerCase().endsWith('.pdf')
                            ? 'https://cdn-icons-png.flaticon.com/512/337/337946.png' // Dummy PDF icon
                            : preview ||
                              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJlks1ylqkT3dB4gIp_uVe6a-OfgOgH6RFFg&s'
                        }
                        alt="Preview"
                      />
                      <IconButton
                        aria-label="delete"
                        onClick={handleRemove}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          backgroundColor: 'white',
                          '&:hover': { backgroundColor: '#f0f0f0' },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ) : (
                    <Typography mt={2}></Typography>
                  )}
                </Box>
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
