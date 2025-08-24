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
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useLocation, useNavigate } from 'react-router-dom';
import JoditEditor from 'jodit-react';
import { IoArrowBackSharp } from 'react-icons/io5';
import axios from 'axios';
import ApiConfig from '../ApiConfig/ApiConfig';
import toast from 'react-hot-toast';

export default function AddSubscription({ plan }) {
  const location = useLocation();
  const planList = location?.state?.row;
  console.log('planData', planList);
  const navigate = useNavigate();

  const [plans, setPlans] = useState('');
  console.log('dafsadfdfsa', plans);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const editor = useRef(null);
  const config = {
    readonly: false,
  };

  const handleSubmit = (values) => {
    EditPlansHandler(values);
    console.log('Updated Plan Values:', values);
  };

  const EditPlansHandler = async (values) => {
    console.log('Asdfgadsgsadgas', values);
  };

  const initialValues = {
    plan_name: planList?.name ?? '',
    amount: planList?.price ?? '',
    plan_description: planList?.description ?? '',
    duration: planList?.duration ?? '',
    type: planList?.type ?? '',
  };

  const validationSchema = Yup.object().shape({
    plan_name: Yup.string()
      .matches(
        /^[A-Za-z0-9.,?'"\-()! ]{3,200}$/,
        'Only valid title characters allowed'
      )
      .required('Title is required'),
    plan_description: Yup.string().required('Description is required'),
    duration: Yup.string().required('Duration is required'),
    type: Yup.string().required('Type is required'),
    amount: Yup.string()
      .required('Amount is required')
      .matches(/^\d+$/, 'Amount must be a number'),
  });

  const careteData = async (values) => {
    const token = window.localStorage.getItem('UhuruMedToken');
    const payload = {
      name: values.plan_name,
      description: values.plan_description,
      price: values.amount,
      duration: values.duration,
      type: values.type,
      status: 'ACTIVE',
    };

    try {
      const response = await axios({
        method: 'POST',
        url: ApiConfig.createPlan,
        headers: {
          authorization: `Bearer ${token}`,
        },
        data: payload,
      });

      if (response?.data?.error === 'false') {
        navigate('/subscription');
        toast.success(response?.data?.message);
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      console.error('Error creating plan:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  const updateData = async (values) => {
    const token = window.localStorage.getItem('UhuruMedToken');
    const payloadData = {
      name: values.plan_name,
      description: values.plan_description,
      price: values.amount,
      duration: values.duration,
      type: values.type,
      status: 'ACTIVE',
    };

    try {
      const response = await axios({
        method: 'PUT',
        url: ApiConfig.updatePlan,
        headers: {
          authorization: `Bearer ${token}`,
        },
        params: {
          id: planList.id,
        },
        data: payloadData,
      });

      if (response?.data?.error === 'false') {
        toast.success(response?.data?.message || 'Plan updated successfully.');
        navigate('/subscription');
      } else {
        toast.error(response?.data?.message || 'Failed to update the plan.');
      }
    } catch (error) {
      console.error('Error updating plan:', error);
      toast.error('Something went wrong. Please try again.');
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
        onClick={() => navigate('/subscription')}
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
          {planList ? 'Edit Subscription Details' : 'Add Subscription Details'}
        </Typography>

        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={(values) => {
            if (planList) {
              updateData(values);
            } else {
              careteData(values);
            }
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
                      label="Title"
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
                          height: '40px',
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

                  <Grid item xs={12}>
                    <TextField
                      sx={{
                        width: { xs: '100%', md: 362 },
                        '& .MuiInputBase-input': {
                          fontSize: '16px', // Input text size
                          padding: '14px 12px', // Adjust padding to control height
                        },
                      }}
                      label="Amount"
                      name="amount"
                      value={values.amount}
                      onChange={handleChange}
                      error={touched.amount && Boolean(errors.amount)}
                      helperText={touched.amount && errors.amount}
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
                  }}
                >
                  <Grid item xs={12}>
                    <FormControl
                      sx={{
                        width: { xs: '100%', md: 362 },
                        '& .MuiSelect-select': {
                          fontSize: '16px', // Set font size
                          padding: '14px 12px', // Reduce height via padding
                        },
                        '& .MuiInputBase-root': {
                          height: '50px', // Optional fixed height
                        },
                      }}
                      error={touched.amount && Boolean(errors.amount)}
                      margin="normal"
                    >
                      <InputLabel
                        style={{
                          color: '#000',
                          fontWeight: '400',
                          fontSize: '17px',
                        }}
                      >
                        Duration
                      </InputLabel>
                      <Select
                        name="duration"
                        value={values.duration}
                        onChange={handleChange}
                        label="duration"
                      >
                        <MenuItem value="" style={{ color: 'black',fontSize:'18px'  }}>
                          {/* <em>None</em> */}
                        </MenuItem>
                        <MenuItem value={10} style={{ color: 'black',fontSize:'18px'  }}>
                          10
                        </MenuItem>
                        <MenuItem value={20} style={{ color: 'black',fontSize:'18px'  }}>
                          30
                        </MenuItem>
                        <MenuItem value={30} style={{ color: 'black',fontSize:'18px'  }}>
                          90
                        </MenuItem>
                        <MenuItem value={365} style={{ color: 'black',fontSize:'18px'  }}>
                          365
                        </MenuItem>
                        {/* Add your dynamic options here */}
                      </Select>
                      {touched.duration && errors.duration && (
                        <FormHelperText
                          style={{
                            color: 'red',
                            fontSize: '0.8rem',
                            marginTop: '4px',
                            marginLeft: '0px',
                          }}
                        >
                          {errors.duration}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl
                      sx={{
                        width: { xs: '100%', md: 362 },
                        '& .MuiSelect-select': {
                          fontSize: '16px', // Set font size
                          padding: '14px 12px', // Reduce height via padding
                        },
                        '& .MuiInputBase-root': {
                          height: '50px', // Optional fixed height
                        },
                      }}
                      error={touched.type && Boolean(errors.type)}
                      margin="normal"
                    >
                      <InputLabel
                        style={{
                          color: '#000',
                          fontWeight: '400',
                          fontSize: '17px',
                        }}
                      >
                        Type
                      </InputLabel>
                      <Select
                        name="type"
                        value={values.type}
                        onChange={handleChange}
                        label="type"
                      >
                        <MenuItem value="" style={{ color: 'black' }}>
                          {/* <em>None</em> */}
                        </MenuItem>
                        <MenuItem value="MONTHLY" style={{ color: 'black',fontSize:'18px' }}>
                          Monthly
                        </MenuItem>
                        <MenuItem value="QUARTERLY" style={{ color: 'black',fontSize:'18px'  }}>
                          Quarterly
                        </MenuItem>
                        <MenuItem value="YEARLY" style={{ color: 'black',fontSize:'18px'  }}>
                          Yearly
                        </MenuItem>

                        {/* Add your dynamic options here */}
                      </Select>
                      {touched.type && errors.type && (
                        <FormHelperText
                          style={{
                            color: 'red',
                            fontSize: '0.8rem',
                            marginTop: '4px',
                            marginLeft: '0px',
                          }}
                        >
                          {errors.type}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
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
