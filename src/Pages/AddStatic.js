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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useLocation, useNavigate } from 'react-router-dom';
import JoditEditor from 'jodit-react';
import { IoArrowBackSharp } from 'react-icons/io5';
import axios from 'axios';
import ApiConfig from '../ApiConfig/ApiConfig';
import toast from 'react-hot-toast';
import { styled } from '@mui/system';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

export default function AddStatic({ plan }) {
  const location = useLocation();
  const { userData } = location?.state || {};
  const navigate = useNavigate();
  const staticLists = location?.state?.row;
  const [plans, setPlans] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const editor = useRef(null);
  const config = { readonly: false };

  const Input = styled('input')({ display: 'none' });

  const ImagePreview = styled('img')(({ theme }) => ({
    width: '100%',
    maxWidth: '300px',
    borderRadius: theme.shape.borderRadius,
    marginTop: theme.spacing(2),
  }));

  useEffect(() => {
    if (staticLists?.imageUrl) {
      setPreview(staticLists.imageUrl);
    }
  }, [staticLists]);

  const initialValues = {
    plan_name: staticLists?.title ?? '',
    plan_description: staticLists?.content ?? '',
    type: staticLists?.type ?? '',
    group: 'GENERAL',
    status: 'ACTIVE',
    imageUrl: staticLists?.imageUrl ?? '',
  };

  const validationSchema = Yup.object().shape({
    plan_name: Yup.string().required('Title is required'),
    plan_description: Yup.string().required('Description is required'),
  });

  const createStatic = async (values) => {
    const token = window.localStorage.getItem('UhuruMedToken');
    const payloadData = {
      type: values?.type,
      group: 'GENERAL',
      title: values?.plan_name,
      content: values?.plan_description,
      status: 'ACTIVE',
      videoUrl: 'http://example.com/video.mp4',
      imageUrl: values?.imageUrl || 'http://example.com/car.png',
    };
    setLoading(true);
    try {
      const response = await axios({
        method: 'POST',
        url: ApiConfig.adminCreateStatic,
        headers: { authorization: `Bearer ${token}` },
        data: payloadData,
      });
      if (response?.data?.error === 'false') {
        setLoading(false);
        navigate('/static');
        toast.success(response?.data.message || 'Created Successfully');
      }
    } catch (error) {
      setLoading(false);
      console.log('error', error);
    }
  };

  const updateStatic = async (values) => {
    const token = window.localStorage.getItem('UhuruMedToken');
    const payloadDatas = {
      type: values?.type,
      group: 'GENERAL',
      title: values.plan_name,
      content: values.plan_description,
      status: 'ACTIVE',
      videoUrl: 'http://example.com/video.mp4',
      imageUrl: values?.imageUrl || preview,
    };
    setLoading(true);
    try {
      const response = await axios({
        method: 'PUT',
        url: ApiConfig.adminUpdateStatic,
        headers: { authorization: `Bearer ${token}` },
        data: payloadDatas,
        params: { id: staticLists?.id },
      });
      if (response?.data?.error === 'false') {
        setLoading(false);
        navigate('/static');
        toast.success(response?.data.message || 'Updated Successfully');
      }
    } catch (error) {
      setLoading(false);
      console.log('error', error);
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
    <Box>
      <Box
        sx={{
          cursor: 'pointer',
          background: '#82828214',
          width: '45px',
          height: '45px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={() => navigate('/static')}
      >
        <IconButton sx={{ color: '#000', p: 0 }}>
          <IoArrowBackSharp size={25} />
        </IconButton>
      </Box>

      <Paper elevation={1} sx={{ p: 3, maxWidth: 800, mx: 'auto', mt: 4, borderRadius: 4 }}>
        <Typography variant="h5" mb={2} sx={{ fontWeight: 600 }}>
          {staticLists ? 'Edit Static Details' : 'Add Static Details'}
        </Typography>

        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={(values) => {
            staticLists ? updateStatic(values) : createStatic(values);
          }}
        >
          {({ values, errors, touched, handleChange, setFieldValue }) => (
            <Form>
              <Grid container spacing={2}>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                  <Grid item xs={12}>
                    <FormControl
                      fullWidth
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
                      <Select name="type" value={values.type} onChange={handleChange} label="type">
                        <MenuItem value="" style={{ color: 'black' }} />
                        <MenuItem value="FAQ" style={{ color: 'black', fontSize: '18px' }}>
                          Faq
                        </MenuItem>
                        <MenuItem value="TERM&CONDITION" style={{ color: 'black', fontSize: '18px' }}>
                          Term & Condition
                        </MenuItem>
                        <MenuItem value="PRIVACY&POLICY" style={{ color: 'black', fontSize: '18px' }}>
                          Privacy & Policy
                        </MenuItem>
                        <MenuItem value="ABOUTUS" style={{ color: 'black', fontSize: '18px' }}>
                          About Us
                        </MenuItem>
                      </Select>
                      {touched.type && errors.type && (
                        <FormHelperText style={{ color: 'red', fontSize: '0.8rem' }}>
                          {errors.type}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Title"
                      name="plan_name"
                      value={values.plan_name}
                      onChange={handleChange}
                      error={touched.plan_name && Boolean(errors.plan_name)}
                      helperText={touched.plan_name && errors.plan_name}
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
                          color: '#000',
                          fontWeight: '400',
                          fontSize: '17px',
                        },
                      }}
                      margin="normal"
                    />
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
                  onBlur={(newContent) => setFieldValue('plan_description', newContent)}
                />
                {touched.plan_description && errors.plan_description && (
                  <Typography color="error" variant="body2" mt={1}>
                    {errors.plan_description}
                  </Typography>
                )}
              </Box>

              {values.type === 'ABOUTUS' && (
                <Box textAlign="center" marginTop="1rem">
                  <label htmlFor="upload-image">
                    <Input
                      accept="image/*"
                      id="upload-image"
                      type="file"
                      onChange={(e) => uploadDataHandler(e.target.files[0], setFieldValue)}
                    />
                    <Button variant="contained" component="span" startIcon={<CloudUploadIcon />}>
                      Upload Image
                    </Button>
                  </label>

                  {preview ? (
                    <Box mt={2} position="relative">
                      <ImagePreview src={preview} alt="Preview" />
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
              )}

              <Box textAlign="right" mt={3} sx={{ height: '45px' }}>
                <Button
                  variant="contained"
                  type="submit"
                  sx={{
                    backgroundColor: '#2e5ad5',
                    textTransform: 'Capitalize',
                    px: 4,
                    py: 1,
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    border: 'none',
                    color: '#fff',
                  }}
                >
                  {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Submit'}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
}
