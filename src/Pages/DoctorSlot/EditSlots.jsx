import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
  Grid,
  CircularProgress,
  FormHelperText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  Autocomplete,
  Chip,
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useLocation, useNavigate } from 'react-router-dom';
import JoditEditor from 'jodit-react';
import { IoArrowBackSharp } from 'react-icons/io5';
import axios from 'axios';
import toast from 'react-hot-toast';
import ApiConfig from '../../ApiConfig/ApiConfig';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import moment from 'moment';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { ThemeProvider, createTheme } from '@mui/material/styles';

export default function EditSlots({ plan }) {
  const location = useLocation();
  const planList = location?.state?.row;
  console.log('planDa555ta', planList);
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState([]);
  console.log('dsagasdf', selectedIds);
  const [plans, setPlans] = useState('');
  console.log('dafsadfdfsa', plans);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const editor = useRef(null);
  const config = {
    readonly: false,
  };
  const theme = createTheme({
    components: {
      MuiClockNumber: {
        styleOverrides: {
          root: {
            fontSize: '15px',
            color: 'black',
          },
          selected: {
            color: 'black',
            backgroundColor: '#e0e0e0', // optional: light background for selected item
          },
        },
      },
      MuiClock: {
        styleOverrides: {
          root: {
            // Optional: adjust clock face if needed
          },
        },
      },
    },
  });

  const initialValues = {
    plan_name: planList?.title ?? '',
    plan_description: planList?.description ?? '',
    startTime: planList?.startTime
      ? new Date(`1970-01-01T${planList.startTime}`)
      : null,
    endTime: planList?.endTime
      ? new Date(`1970-01-01T${planList.endTime}`)
      : null,
  };

  const validationSchema = Yup.object().shape({
    plan_name: Yup.string()
      .matches(
        /^[A-Za-z0-9.,?'"\-()! ]{3,200}$/,
        'Only valid title characters allowed'
      )
      .required('Title is required'),
    plan_description: Yup.string().required('Description is required'),
    startTime: Yup.string().required('Start time is required'),

    endTime: Yup.string()
      .required('End time is required')
      .test(
        'is-after-start',
        'End time must be after start time',
        function (value) {
          const { startTime } = this.parent;
          if (!startTime || !value) return true; // Skip check if either is missing

          return value > startTime;
        }
      ),
  });

  const updateData = async (values) => {
    const token = window.localStorage.getItem('UhuruMedToken');
    const formattedStartTime = moment(values.startTime).format('HH:mm');
    const formattedEndTime = moment(values.endTime).format('HH:mm');
    const payloadData = {
      title: values.plan_name,
      description: values.plan_description,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      //   type: "Afternoon",
      limit: '1',
      //   dayOfWeek: values.week.join(","), // Converts [0, 1, 2] → "0,1,2"
    };

    setLoading(true);
    try {
      const response = await axios({
        method: 'PUT',
        url: ApiConfig.editDoctorSlot,
        headers: {
          authorization: `Bearer ${token}`,
        },
        params: {
          id: planList.id,
        },
        data: payloadData,
      });

      if (response?.data?.error === 'false') {
        setLoading(false);
        toast.success(response?.data?.message || 'Slot updated successfully.');
        navigate('/slot');
      } else {
        setLoading(false);
        toast.error(response?.data?.message || 'Failed to update the plan.');
      }
    } catch (error) {
      setLoading(false);
      console.error('Error updating plan:', error);
      toast.error(
        error?.response?.data?.message ??
          'Something went wrong. Please try again.'
      );
    }
  };

  return (
    <Box>
      <Box
        sx={{
          cursor: 'pointer',
          background: '#82828214;',
          width: '45px',
          height: '45px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={() => navigate('/slot')}
      >
        <IconButton sx={{ color: '#000', p: 0 }}>
          <IoArrowBackSharp size={25} />
        </IconButton>
      </Box>

      <Paper
        elevation={1}
        sx={{ p: 3, maxWidth: 800, mx: 'auto', mt: 4, borderRadius: 4 }}
      >
        <Typography
          variant="h5"
          mb={2}
          sx={{ fontWeight: 600, fontSize: '20px' }}
        >
        Edit Slot Details
        </Typography>

        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={(values) => {
            updateData(values);
          }}
        >
          {({ values, errors, touched, handleChange, setFieldValue }) => (
            <Form>
              <Grid container spacing={2}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    width: '100%',
                    gap: '1.4rem',
                    marginBottom: '-8px',
                  }}
                >
                  <Grid item xs={12}>
                    <TextField
                      sx={{
                        width: { xs: '100%', md: 362 },
                        '& .MuiInputBase-input': {
                          fontSize: '16px', // Input text size
                          padding: '14px 12px', // Adjust padding to control height
                        },
                      }}
                      label="Slots Name"
                      name="plan_name"
                      value={values.plan_name}
                      onChange={handleChange}
                      error={touched.plan_name && Boolean(errors.plan_name)}
                      helperText={touched.plan_name && errors.plan_name}
                      FormHelperTextProps={{
                        style: {
                          color: 'red', // Custom text color
                          fontSize: '0.8rem', // Custom font size
                          marginTop: '4px',
                          marginLeft: '0px', // Optional spacing
                        },
                      }}
                      InputLabelProps={{
                        style: {
                          color: '#000', // Change this to any color you want
                          fontWeight: '400',
                          fontSize: '17px',
                        },
                      }}
                      margin="normal"
                    />
                  </Grid>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    width: '100%',
                    gap: '1.4rem',
                    marginTop: '10px',
                  }}
                >
                  <ThemeProvider theme={theme}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TimePicker
                            label="Start Time"
                            value={values.startTime}
                            onChange={(newValue) =>
                              setFieldValue('startTime', newValue)
                            }
                            ampm={false}
                            sx={{
                              width: { xs: '100%', md: 365 },
                              '& .MuiInputBase-root': {
                                height: 40,
                                fontSize: '15px',
                              },
                              '& .MuiInputBase-input': {
                                color: 'black',
                                fontSize: '15px',
                                padding: '10px 14px',
                              },
                              '& .MuiInputLabel-root': {
                                color: 'black',
                                fontSize: '15px',
                              },
                              '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline':
                                {
                                  borderColor: 'black',
                                },
                              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                                {
                                  borderColor: 'black',
                                },
                              '& .MuiFormHelperText-root': {
                                fontSize: '13px',
                              },
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                fullWidth
                                error={
                                  touched.startTime && Boolean(errors.startTime)
                                }
                                helperText={
                                  touched.startTime && errors.startTime
                                }
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <TimePicker
                            label="End Time"
                            value={values.endTime}
                            onChange={(newValue) =>
                              setFieldValue('endTime', newValue)
                            }
                            ampm={false}
                            sx={{
                              width: { xs: '100%', md: 365 },
                              '& .MuiInputBase-root': {
                                height: 40,
                                fontSize: '15px',
                              },
                              '& .MuiInputBase-input': {
                                color: 'black',
                                fontSize: '15px',
                                padding: '10px 14px',
                              },
                              '& .MuiInputLabel-root': {
                                color: 'black',
                                fontSize: '15px',
                              },
                              '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline':
                                {
                                  borderColor: 'black',
                                },
                              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                                {
                                  borderColor: 'black',
                                },
                              '& .MuiFormHelperText-root': {
                                fontSize: '13px',
                              },
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                fullWidth
                                error={
                                  touched.endTime && Boolean(errors.endTime)
                                }
                                helperText={touched.endTime && errors.endTime}
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                    </LocalizationProvider>
                  </ThemeProvider>
                </Box>
              </Grid>

              <Box mt={3}>
                <Typography variant="subtitle1" mb={1}>
                  Description
                </Typography>
                <JoditEditor
                  ref={editor}
                  value={values.plan_description}
                  config={config}
                  tabIndex={1}
                  onBlur={(newContent) => {
                    setFieldValue('plan_description', newContent);
                  }}
                />
                {touched.plan_description && errors.plan_description && (
                  <Typography color="error" variant="body2" mt={1}>
                    {errors.plan_description}
                  </Typography>
                )}
              </Box>
              <Box textAlign="right" mt={3} sx={{ height: '45px' }}>
                <Button
                  variant="contained"
                  type="submit"
                  sx={{
                    backgroundColor: '#0077cc',
                    textTransform: 'Capitalize',
                    px: 4,
                    py: 1,
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    border: 'none',
                    color: '#fff',
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                  ) : (
                    'Submit'
                  )}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
}
