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
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import moment from 'moment';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { he } from 'date-fns/locale';

// const generateTimeSlots = () => {
//   const slots = [];
//   let hour = 8;

//   while (hour < 20) {
//     const start = dayjs().hour(hour).minute(0);
//     const end = start.add(1, "hour");

//     slots.push({
//       startTime: start.format("HH:mm"),
//       endTime: end.format("HH:mm"),
//     });

//     hour += 1;
//   }

//   return slots;
// };

// const generateTimeSlots = () => {
//   const slots = [];
//   let hour = 0;
//   let minute = 0;

//   while (hour < 24) {
//     const start = dayjs().hour(hour).minute(minute);
//     const end = start.add(30, "minute");
  
//     slots.push({
//       // startTime: start.format("HH:mm"),        // For API payload
//       // endTime: end.format("HH:mm"),
//       startTime: start.format("hh:mm A"),
//       endTime: end.format("hh:mm A"),
//     });

//     minute += 30;
//     if (minute >= 60) {
//       minute = 0;
//       hour += 1;
//     }
//   }

//   return slots;
// };

// const generateTimeSlots = () => {
//   const slots = [];
//   let hour = 0;
//   let minute = 0;

//   while (hour < 24) {
//     const start = dayjs().hour(hour).minute(minute);
//     const end = start.add(30, "minute");

//     // Format hour in 24h + keep AM/PM manually
//     const formatCustomTime = (time) => {
//       const hour24 = time.format("HH");
//       const minutes = time.format("mm");
//       const ampm = time.format("A");
//       return `${hour24}:${minutes} ${ampm}`;
//     };

//     slots.push({
//       startTime: formatCustomTime(start),
//       endTime: formatCustomTime(end),
//       apiStart: start.format("HH:mm"), // Optional for backend
//       apiEnd: end.format("HH:mm"),
//     });

//     minute += 30;
//     if (minute >= 60) {
//       minute = 0;
//       hour += 1;
//     }
//   }

//   return slots;
// };
const generateTimeSlots = () => {
  const slots = [];
  let current = dayjs().hour(1).minute(0); // Start from 01:00 AM
  const end = current.add(24, 'hour');     // End at 01:00 AM next day

  const format24WithAmPm = (time) => {
    const hour24 = time.format('HH'); // 24-hour format
    const minutes = time.format('mm');
    const ampm = time.format('A');    // AM / PM

    return `${hour24}:${minutes} ${ampm}`;
  };

  while (current.isBefore(end)) {
    const start = current;
    const endTime = current.add(30, 'minute');

    slots.push({
      // startTime: format24WithAmPm(start),   // e.g. "13:00 PM"
      // endTime: format24WithAmPm(endTime),   // e.g. "13:30 PM"
      startTime: start.format('HH:mm'),      // backend safe format
      endTime: endTime.format('HH:mm'),
    });

    current = endTime;
  }

  return slots;
};


// const generateTimeSlots = () => {
//   const slots = [];
//   let current = dayjs().hour(1).minute(0); // Start at 1:00 AM
//   const end = current.add(24, "hour"); // End at 1:00 AM next day

//   while (current.isBefore(end)) {
//     const start = current;
//     const endTime = current.add(30, "minute");

//     slots.push({
//       startTime: start.format("hh:mm A"), // UI format (like 01:00 AM)
//       endTime: endTime.format("hh:mm A"),
//       apiStart: start.format("HH:mm"),    // For API (like 01:00)
//       apiEnd: endTime.format("HH:mm"),
//     });

//     current = endTime;
//   }

//   return slots;
// };



export default function AddSlot({ plan }) {
  const location = useLocation();
  const planList = location?.state?.row;
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState([]);
  const [plans, setPlans] = useState('');
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const editor = useRef(null);
  const config = {
    readonly: false,
  };

  const [selectedDates, setSelectedDates] = useState([]);
  const [currentDate, setCurrentDate] = useState(null);
  const [slotSelections, setSlotSelections] = useState({});
  console.log('sdgsadgsa', slotSelections);
  const timeSlots = generateTimeSlots();

  // const handleDateChange = (date) => {
  //   const formatted = dayjs(date).format("YYYY-MM-DD");
  //   if (!selectedDates.includes(formatted)) {
  //     setSelectedDates([...selectedDates, formatted]);
  //     setSlotSelections({
  //       ...slotSelections,
  //       [formatted]: [],
  //     });
  //   }
  //   setCurrentDate(formatted);
  // };

  const handleDateChange = (e) => {
    const rawDate = e.target.value; // This is already in "YYYY-MM-DD" format
    if (!selectedDates.includes(rawDate)) {
      setSelectedDates([...selectedDates, rawDate]);
      setSlotSelections({
        ...slotSelections,
        [rawDate]: [],
      });
    }
    setCurrentDate(rawDate);
  };

  const handleSlotToggle = (date, slot) => {
    const currentSlots = slotSelections[date] || [];
    const exists = currentSlots.find(
      (s) => s.startTime === slot.startTime && s.endTime === slot.endTime
    );

    const updatedSlots = exists
      ? currentSlots.filter(
        (s) => !(s.startTime === slot.startTime && s.endTime === slot.endTime)
      )
      : [...currentSlots, slot];

    setSlotSelections({
      ...slotSelections,
      [date]: updatedSlots,
    });
  };

  const initialValues = {
    plan_name: planList?.title ?? '',
    plan_description: planList?.description ?? '',
  };

  const validationSchema = Yup.object().shape({
    plan_name: Yup.string()
      .matches(
        /^[A-Za-z0-9.,?'"\-()! ]{3,200}$/,
        'Only valid title characters allowed'
      )
      .required('Title is required'),
    plan_description: Yup.string().required('Description is required'),
  });

  const careteData = async (values) => {
    const token = window.localStorage.getItem('UhuruMedToken');

    // if (Object.keys(slotSelections).length === 0) {
    //   toast.error("Please select atleast one slot");
    //   return;
    // }

    const hasAtLeastOneSlot = Object.values(slotSelections).some(
      (slots) => slots.length > 0
    );

    if (!hasAtLeastOneSlot) {
      toast.error('Please select at least one time slot');

      return;
    }

    const payload = {
      title: values.plan_name,
      description: values.plan_description,
      slotDateTime: slotSelections,
      limit: '1',
    };
    setLoading(true);
    try {
      const response = await axios({
        method: 'POST',
        url: ApiConfig.createDoctorSlot,
        headers: {
          authorization: `Bearer ${token}`,
        },
        data: payload,
      });

      if (response?.data?.error === 'false') {
        setLoading(false);
        navigate('/slot');
        toast.success(response?.data?.message);
      } else {
        setLoading(false);
        toast.error(response?.data?.message);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error creating plan:', error);
      toast.error(
        error?.response?.data?.message ??
          'Something went wrong. Please try again.'
      );
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
          Add Slot Details
        </Typography>

        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.log('sdgasfgasgas', values);
            careteData(values);
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
                  <Grid item xs={12} sm={6} md={6}>
                    <TextField
                      sx={{
                        width: { xs: '100%', md: 362 },
                        '& .MuiInputBase-input': {
                          fontSize: '15px',
                          padding: '12.5px 12px',

                          // ✅ Placeholder style
                          '&::placeholder': {
                            color: '#000', // Custom placeholder color
                            fontSize: '16px', // Custom placeholder font size
                          },
                        },
                      }}
                      // label="Slots Name"
                      placeholder="Slot title"
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

                  <Grid item xs={12} sm={6} md={6}>
                    <Box mt={2}>
                      {/* <DatePicker
                        // label="Select Date"
                        value={currentDate ? dayjs(currentDate) : null}
                        onChange={handleDateChange}
                        disablePast
                        slotProps={{
                          textField: {
                            size: "small",
                            sx: {
                              "& .MuiInputBase-root": {
                                minHeight: 40,
                                fontSize: "14px",
                              },
                              "& .MuiInputBase-input": {
                                padding: "6px 10px",
                              },
                              "& .MuiInputLabel-root": {
                                fontSize: "15px",
                              },
                              "& .MuiInputLabel-shrink": {
                                fontSize: "12px",
                              },
                            },
                          },
                          popper: {
                            sx: {
                              "& .MuiPaper-root": {
                                borderRadius: "8px",
                              },
                              "& .MuiPickersDay-root": {
                                fontSize: "13px",
                                width: 32,
                                height: 32,
                              },
                              "& .MuiPickersCalendarHeader-root": {
                                padding: "6px 12px",
                              },
                            },
                          },
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            inputProps={{
                              ...params.inputProps,
                              style: {
                                fontSize: "18px",
                              },
                            }}
                            
                            size="small"
                            sx={{
                              width: "280px", // ✅ SET YOUR DESIRED WIDTH HERE

                              "& .MuiInputBase-input": {
                                fontSize: "14px",
                                padding: "8px 10px",
                              },
                              "& .MuiInputBase-root": {
                                minHeight: "25px",
                              },
                              "& .MuiInputLabel-root": {
                                fontSize: "13px",
                                transform: "translate(14px, 9px) scale(1)",
                              },
                              "& .MuiInputLabel-shrink": {
                                fontSize: "12px",
                                transform: "translate(14px, -4px) scale(0.75)",
                              },
                            }}
                          />
                        )}
                      /> */}

                      <TextField
                        // label="Select Date"
                        type="date"
                        value={currentDate || ''} // empty if no date selected
                        onChange={handleDateChange}
                        inputProps={{
                          min: dayjs().format('YYYY-MM-DD'),
                        }}
                        sx={{
                          width: { xs: '100%', md: 365 },
                          '& .MuiInputBase-root': {
                            height: 52,
                          },
                          '& .MuiInputBase-input': {
                            fontSize: '16px',
                            padding: '14px 12px',
                            height: '100%',
                            boxSizing: 'border-box',
                          },
                          '& .MuiInputLabel-root': {
                            fontSize: '17px',
                          },
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Box>
                  </Grid>
                </Box>
              </Grid>
              <Box p={0}>
                {selectedDates?.map((date) => (
                  <Box
                    key={date}
                    mt={3}
                    p={2}
                    border="1px solid #ccc"
                    borderRadius={2}
                  >
                    <Typography
                      variant="h6"
                      style={{ fontSize: '18px', color: '#000' }}
                    >
                      {date}
                    </Typography>
                    <Grid container spacing={1}>
                      {timeSlots?.map((slot) => {
                        const isChecked = slotSelections[date]?.some(
                          (s) =>
                            s.startTime === slot.startTime &&
                            s.endTime === slot.endTime
                        );

                        return (
                          <Grid
                            item
                            xs={6}
                            sm={4}
                            md={3}
                            key={`${date}-${slot.startTime}`}
                          >
                            <Box display="flex" alignItems="center">
                              <Checkbox
                                checked={isChecked}
                                onChange={() => handleSlotToggle(date, slot)}
                              />
                              <Typography
                                style={{ fontSize: '16px', color: '#000' }}
                              >{`${slot.startTime} - ${slot.endTime}`}</Typography>
                            </Box>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                ))}
              </Box>
              {/* <Box p={2}>
                {selectedDates?.map((date) => (
                  <Box
                    key={date}
                    mt={3}
                    p={2}
                    border="1px solid #ccc"
                    borderRadius={2}
                  >
                    <Typography variant="h6" sx={{ color: "#0077CC" }}>
                      {date}
                    </Typography>
                    <Grid container spacing={1}>
                      {timeSlots?.map((slot) => {
                        const isChecked = slotSelections[date]?.some(
                          (s) =>
                            s.startTime === slot?.startTime &&
                            s.endTime === slot?.endTime
                        );

                        return (
                          <Grid
                            item
                            xs={6}
                            sm={4}
                            md={3}
                            key={`${date}-${slot.startTime}`}
                          >
                            <Box display="flex" alignItems="center">
                              <Checkbox
                                checked={isChecked}
                                onChange={() => handleSlotToggle(date, slot)}
                              />
                              <Typography>{`${slot.startTime} - ${slot?.endTime}`}</Typography>
                            </Box>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                ))}
              </Box> */}

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
    </LocalizationProvider>
  );
}
