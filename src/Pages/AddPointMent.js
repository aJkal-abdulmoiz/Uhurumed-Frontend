import React, { useContext, useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  IconButton,
  Typography,
  Box,
  CircularProgress,
  Autocomplete,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import CancelBtn from '../CommonComponenet/CommonButtons/CancelBtn';
import toast from 'react-hot-toast';
import axios from 'axios';
import ApiConfig from '../ApiConfig/ApiConfig';
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/Auth';

const patientList = [
  { id: 1, name: 'Michael R Sheets' },
  { id: 2, name: 'John Doe' },
];

const patientList1 = [
  { id: 1, name: 'VIDEO' },
  { id: 2, name: 'CHAT' },
];
const payments = [
  { id: 1, name: 'PAYSTACK' },
  { id: 2, name: 'STRIPE' },
];

const validationSchema = Yup.object({
  date: Yup.date().required('Date is required'),
  Doctor: Yup.string().required('Slot is required'),
  DoctorApp: Yup.string().required('Doctor is required'),
  type: Yup.string().required('Type is required'),
  method: Yup.string().required('Payment method is required'),
  description: Yup.string().required('Description is required'),
});

function StripePayment({
  clientSecret,
  onSuccess,
  onCancel,
  paymentReference,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  console.log('paymentReferencepaymentReference', paymentReference);
  const handleSubmit = async (e) => {
    console.log('sadfasdfgadsg', e);
    e.preventDefault();
    setLoading(true);
    if (!stripe || !elements) {
      setLoading(false);

      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href, // you can also put your success page url here
      },
      redirect: 'if_required', // don't redirect automatically
    });
    console.log('sdgasdgasdf', error);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Payment successful!');
      navigate(`/stripe?reference=${paymentReference}`);
      // onSuccess();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
        <Button variant="outlined" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={!stripe || loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          Pay Now
        </Button>
      </Box>
    </form>
  );
}

export default function AddPointMent({ open, onClose, onSave }) {
  console.log('asfsdgafs', open);
  const [slots, setSlot] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const stripe = useStripe();
  const elements = useElements();
  const auth = useContext(AuthContext);
  const userData = auth?.userData;
  const [paymentReference, setPaymentReference] = useState(null);
  const [loading, setLoading] = useState(false);
  const [consultationFee, setConsultationFee] = useState('');
  const [selectedDoctorInfo, setSelectedDoctorInfo] = useState(null);
  console.log('selectedDoctorInfo', selectedDoctorInfo);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentDone, setPaymentDone] = useState(false);

  const stripePromise = loadStripe(
    'pk_test_51RUpovAMqg8BSfv5KDRRWYJt2Pi5kNuHy4fs3yA8fz5zsLzq2anwmvTkxsPK0Rk9oJ86ktejMtlqBhJnG8kkJWP700l2knCJ6D'
  ); // Your publishable key

  const filteredPayments =
    selectedDoctorInfo?.country === 'Ghana'
      ? payments?.filter((p) => p.name === 'PAYSTACK')
      : payments;

  console.log('adfsdf', slots);
  const formik = useFormik({
    initialValues: {
      date: null,
      type: '',
      description: '',
      method: '',
    },
    validationSchema,
    onSubmit: (values) => {
      BookAppointmentHandler(values);
      console.log('564564564', values);
      //   onSave(values);
      //   onClose();
    },
  });

  const getAllDoctors = async () => {
    const token = window.localStorage.getItem('UhuruMedToken');

    try {
      const response = await axios({
        method: 'GET',
        url: ApiConfig.doctorMain,
        headers: {
          authorization: `Bearer ${token}`,
        },
        params: {
          page: 1,
          limit: 300,
        },
      });
      console.log('successsuccess', response?.data?.success);
      if (response?.data?.error === 'false') {
        console.log('responseresponse', response);
        setDoctors(response?.data?.data?.docs);
        // setTotalPages(response?.data?.data?.[0]?.count);
      }
    } catch (error) {
      setDoctors([]);

      console.log('errorerror', error);
    }
  };

  const slotlistHandlerfunc = async (id) => {
    const token = window.localStorage.getItem('UhuruMedToken');
    try {
      const response = await axios({
        method: 'GET',
        url: ApiConfig.doctorslotUser,
        headers: {
          authorization: `Bearer ${token}`,
        },
        params: {
          doctorId: id,
        },
      });
      console.log('b565bvifbifu', response.data.error);
      if (response.data.error === 'false') {
        console.log('sdsadfsasssss', response.data);
        const allSlots = response?.data?.data;
        const filteredSlots = allSlots?.filter(
          (slot) =>
            dayjs(slot?.date).format('YYYY-MM-DD') ===
            dayjs(selectedDate).format('YYYY-MM-DD')
        );
        setSlot(filteredSlots);
        // toast.success(response?.data?.message);
      } else {
        setSlot([]);
        toast.error(response?.data?.message ?? 'Please try again');
      }
    } catch (error) {
      setSlot([]);
      //   toast.error(error?.response?.data?.message ?? "Please try again");
      console.log('error', error);
    }
  };

  const BookAppointmentHandler = async (values) => {
    const token = window.localStorage.getItem('UhuruMedToken');
    try {
      const response = await axios({
        method: 'POST',
        url: ApiConfig.appointmentBook,
        headers: {
          authorization: `Bearer ${token}`,
        },
        data: {
          doctorId: values?.DoctorApp,
          slotId: values?.Doctor,
          date: values?.date,
          type: values?.type,
          symptoms: values?.description,
        },
      });
      console.log('b565bvifbifu', response.data.error);
      if (response.data.error === 'false') {
        console.log('askjdhadfhdaj', response?.data?.data);
        if (response?.data?.data?.appointment?.status === 'SCHEDULED') {
          toast.success('Appointment booked successfully');
          onClose();
        } else {
          await InitlizedPaymentBook(
            response?.data?.data?.appointment?.id,
            values?.method
          );
        }

        // toast.success(response?.data?.message);
        // onClose();
        // window.location.reload();
      } else {
        toast.error(response?.data?.message ?? 'Please try again');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message ?? 'Please try again');
      console.log('error', error);
    }
  };

  const InitlizedPaymentBook = async (id, method) => {
    console.log('sdfsdafsdfsd', method);
    const token = window.localStorage.getItem('UhuruMedToken');
    try {
      const response = await axios({
        method: 'POST',
        url: ApiConfig.Appointinitialize,
        headers: {
          authorization: `Bearer ${token}`,
        },
        data: {
          appointmentId: id,
          paymentGateway: method ?? 'PAYSTACK',
        },
      });
      console.log('payememnrnbrn', response.data.error);
      if (response.data.error === 'false') {
        console.log('paymentnntnt=-kljklhjklhjk', response.data);
        const ref = response?.data?.data?.paymentData?.id;
        setPaymentReference(ref);

        const gateway = response?.data?.data?.paymentGateway;
        if (gateway === 'STRIPE') {
          setClientSecret(response?.data?.data?.paymentData?.client_secret);
        } else {
          onClose();
          window.open(response?.data?.data?.paymentUrl, '_blank');
        }
        toast.success(response?.data?.message);
      } else {
        toast.error(response?.data?.message ?? 'Please try again');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message ?? 'Please try again');
      console.log('error', error);
    }
  };

  useEffect(() => {
    getAllDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctorId && selectedDate) {
      slotlistHandlerfunc(selectedDoctorId);
    }
  }, [selectedDate]);

  if (paymentDone) {
    return (
      <Dialog open={open} fullWidth maxWidth="sm" onClose={onClose}>
        <DialogTitle>Payment Successful</DialogTitle>
        <DialogContent>Thank you for your payment and booking!</DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setClientSecret(null);
              setPaymentDone(false);
              formik.resetForm();
              onClose();
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} fullWidth maxWidth="sm">
      <DialogTitle sx={{ m: 0, p: 2, fontWeight: 'bold' }}>
        New appointment
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      {/* <DialogContent dividers> */}
      {clientSecret ? (
        // Stripe payment form when clientSecret is available
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <StripePayment
            clientSecret={clientSecret}
            onSuccess={() => setPaymentDone(true)}
            onCancel={() => setClientSecret(null)}
            paymentReference={paymentReference}
          />
        </Elements>
      ) : (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <form onSubmit={formik.handleSubmit}>
            <DialogContent dividers>
              <Box mt={2}>
                <Autocomplete
                  disablePortal
                  fullWidth
                  options={doctors}
                  getOptionLabel={(option) =>
                    `${option?.firstName} ${option?.lastName} (${option?.specialization})`
                  }
                  value={
                    doctors.find(
                      (doc) => doc?.id === formik.values.DoctorApp
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    const selectedId = newValue?.id || '';
                    formik.setFieldValue('DoctorApp', selectedId);
                    setSelectedDoctorId(selectedId);

                    const selectedDoctor = doctors.find(
                      (doc) => doc?.id === selectedId
                    );
                    if (selectedDoctor) {
                      setConsultationFee(selectedDoctor.consultationFee);
                      setSelectedDoctorInfo(selectedDoctor); // 🟢 Store entire doctor
                    } else {
                      setSelectedDoctorInfo(null);
                      setConsultationFee(null); // Or reset to default
                    }

                    if (selectedId) {
                      slotlistHandlerfunc(selectedId);
                    }
                  }}
                  onBlur={() => formik.setFieldTouched('DoctorApp', true)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Doctor"
                      error={
                        formik.touched.DoctorApp &&
                        Boolean(formik.errors.DoctorApp)
                      }
                      helperText={
                        formik.touched.DoctorApp && formik.errors.DoctorApp
                      }
                      FormHelperTextProps={{
                        style: {
                          color: 'red',
                          fontSize: '0.8rem',
                          marginTop: '4px',
                          marginLeft: '0px',
                        },
                      }}
                      InputLabelProps={{
                        style: {
                          color: '#000000DE',
                          fontWeight: '400',
                          fontSize: '15px',
                        },
                      }}
                    />
                  )}
                  sx={{
                    '& .MuiInputBase-root': { fontSize: '14px' },
                    '& fieldset': { borderColor: '#ccc' },
                    '&.Mui-focused fieldset': { borderColor: '#000' },
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
                />
              </Box>
              <Box mt={2}>
                <TextField
                  fullWidth
                  name="date"
                  type="date"
                  value={formik.values.date}
                  onChange={(e) => {
                    formik.handleChange(e);
                    setSelectedDate(e.target.value); // store selected date in state
                  }}
                  onBlur={formik.handleBlur}
                  error={formik.touched.date && Boolean(formik.errors.date)}
                  helperText={formik.touched.date && formik.errors.date}
                  FormHelperTextProps={{
                    style: {
                      color: 'red',
                      fontSize: '0.8rem',
                      marginTop: '4px',
                      marginLeft: '0px',
                    },
                  }}
                  InputLabelProps={{
                    sx: { fontSize: '16px', color: '#555', shrink: true },
                  }}
                  InputProps={{
                    sx: {
                      height: '50px',
                      // this ensures the internal input aligns correctly
                      '& input': {
                        height: '50px',
                        padding: '0 14px',
                        boxSizing: 'border-box',
                        fontSize: '16px',
                      },
                    },
                  }}
                  // InputLabelProps={{ shrink: true }}
                />
              </Box>

              <Box mt={2}>
                <TextField
                  select
                  fullWidth
                  label="Select Slot"
                  name="Doctor"
                  value={formik.values.Doctor}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  FormHelperTextProps={{
                    style: {
                      color: 'red', // Custom text color
                      fontSize: '0.8rem', // Custom font size
                      marginTop: '4px',
                      marginLeft: '0px', // Optional spacing
                    },
                  }}
                  error={formik.touched.Doctor && Boolean(formik.errors.Doctor)}
                  helperText={formik.touched.Doctor && formik.errors.Doctor}
                  sx={{
                    '& .MuiInputBase-root': { fontSize: '14px' },
                    '& fieldset': { borderColor: '#ccc' },
                    '&.Mui-focused fieldset': { borderColor: '#14B8A6' },
                  }}
                  InputLabelProps={{
                    style: {
                      color: '#000000DE', // Change this to any color you want
                      fontWeight: '400',
                      fontSize: '15px',
                    },
                  }}
                >
                  {slots?.length > 0 ? (
                    slots?.map((patient) => (
                      <MenuItem
                        style={{ color: '#000', fontSize: '16px' }}
                        key={patient.id}
                        value={patient.id}
                      >
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Typography
                            style={{ fontSize: '15px', color: '#555' }}
                          >
                            {patient?.formattedTime}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem
                      disabled
                      style={{ fontSize: '16px', color: '#999' }}
                    >
                      No slots found
                    </MenuItem>
                  )}
                </TextField>
              </Box>

              <Box mt={2}>
                <TextField
                  select
                  fullWidth
                  label="Select type"
                  name="type"
                  value={formik.values.type}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  FormHelperTextProps={{
                    style: {
                      color: 'red', // Custom text color
                      fontSize: '0.8rem', // Custom font size
                      marginTop: '4px',
                      marginLeft: '0px', // Optional spacing
                    },
                  }}
                  error={formik.touched.type && Boolean(formik.errors.type)}
                  helperText={formik.touched.type && formik.errors.type}
                  sx={{
                    '& .MuiInputBase-root': { fontSize: '14px' },
                    '& fieldset': { borderColor: '#ccc' },
                    '&.Mui-focused fieldset': { borderColor: '#14B8A6' },
                  }}
                  InputLabelProps={{
                    style: {
                      color: '#000000DE', // Change this to any color you want
                      fontWeight: '400',
                      fontSize: '15px',
                    },
                  }}
                >
                  {patientList1.map((patient) => (
                    <MenuItem
                      style={{ color: '#000', fontSize: '16px' }}
                      key={patient.id}
                      value={patient.name}
                    >
                      {patient.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              <Box mt={2}>
                <TextField
                  select
                  fullWidth
                  label="Select payment method"
                  name="method"
                  value={formik.values.method}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  FormHelperTextProps={{
                    style: {
                      color: 'red', // Custom text color
                      fontSize: '0.8rem', // Custom font size
                      marginTop: '4px',
                      marginLeft: '0px', // Optional spacing
                    },
                  }}
                  error={formik.touched.method && Boolean(formik.errors.method)}
                  helperText={formik.touched.method && formik.errors.method}
                  sx={{
                    '& .MuiInputBase-root': { fontSize: '14px' },
                    '& fieldset': { borderColor: '#ccc' },
                    '&.Mui-focused fieldset': { borderColor: '#14B8A6' },
                  }}
                  InputLabelProps={{
                    style: {
                      color: '#000000DE', // Change this to any color you want
                      fontWeight: '400',
                      fontSize: '15px',
                    },
                  }}
                >
                  {filteredPayments?.map((patient) => (
                    <MenuItem
                      style={{ color: '#000', fontSize: '16px' }}
                      key={patient.id}
                      value={patient.name}
                    >
                      {patient.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              <Typography
                variant="subtitle2"
                sx={{ mt: 2, fontSize: '15px', paddingBottom: '10px' }}
              >
                Symptoms
              </Typography>

              <TextField
                multiline
                rows={3}
                fullWidth
                name="description"
                placeholder="Enter reason or symptoms..."
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.description &&
                  Boolean(formik.errors.description)
                }
                helperText={
                  formik.touched.description && formik.errors.description
                }
                sx={{
                  '& .MuiInputBase-root': { fontSize: '15px' },
                  '& fieldset': { borderColor: '#ccc' },
                  '&.Mui-focused fieldset': { borderColor: '#14B8A6' },
                }}
                FormHelperTextProps={{
                  style: {
                    color: 'red', // Custom text color
                    fontSize: '0.8rem', // Custom font size
                    marginTop: '4px',
                    marginLeft: '0px', // Optional spacing
                  },
                }}
              />
              {consultationFee && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mt: 2,
                      fontSize: '15px',
                      paddingBottom: '10px',
                      fontWeight: '600',
                    }}
                  >
                    Consultation Fee : {consultationFee}
                  </Typography>
                </Box>
              )}
            </DialogContent>

            <DialogActions sx={{ justifyContent: 'flex-end', px: 3, py: 2 }}>
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
          </form>
        </LocalizationProvider>
      )}
      {/* </DialogContent> */}
    </Dialog>
  );
}
