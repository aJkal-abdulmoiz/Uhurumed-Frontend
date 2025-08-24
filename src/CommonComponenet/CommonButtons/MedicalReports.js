import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import axios from 'axios';
import ApiConfig from '../../ApiConfig/ApiConfig';
import toast from 'react-hot-toast';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const recordTypes = [
  { value: 'LAB_REPORT', label: 'Lab Report' },
  { value: 'MEDICAL_HISTORY', label: 'Medical History' },
  { value: 'PRESCRIPTION', label: 'Prescription' },
];

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  recordType: Yup.string().required('Record type is required'),
  fileUrl: Yup.array().min(1, 'Please upload at least one file'),
});

const MedicalReports = ({ open, onClose }) => {
  const [previewDialog, setPreviewDialog] = useState({ open: false, url: '' });
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      fileUrl: [],
      recordType: 'LAB_REPORT',
    },
    validationSchema,
    onSubmit: async (values) => {
      const token = localStorage.getItem('UhuruMedToken');
      setLoading(true);
      try {
        const response = await axios.post(ApiConfig.medicalRecord, values, {
          headers: { authorization: `Bearer ${token}` },
        });
        if (response?.data?.error === 'false') {
          toast.success(response?.data?.message);
          onClose();
        } else {
          toast.error(response?.data?.message || 'Something went wrong');
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Upload failed');
      }
      setLoading(false);
    },
  });

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    const token = localStorage.getItem('UhuruMedToken');
    setLoading(true);

    for (const file of files) {
      const formData = new FormData();
      formData.append('files', file);

      try {
        const response = await axios.post(ApiConfig.uploadFile, formData, {
          headers: {
            authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response?.data?.error === 'false') {
          const secureUrl = response?.data?.data?.secureUrl;
          formik.setFieldValue('fileUrl', [...formik.values.fileUrl, secureUrl]);
        } else {
          toast.error('File upload failed: ' + response?.data?.message);
        }
      } catch (error) {
        toast.error('Failed to upload file.');
      }
    }

    setLoading(false);
  };

  const handleOpenPreview = (url) => {
    setPreviewDialog({ open: true, url });
  };

  const handleClosePreview = () => {
    setPreviewDialog({ open: false, url: '' });
  };

  return (
    <Box>
      <Dialog open={open} fullWidth maxWidth="sm">
        <DialogTitle style={{fontWeight:'bold',fontSize:'18px'}}>
          Upload Documents
          <IconButton
            onClick={onClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              label="Title"
              name="title"
              fullWidth
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              FormHelperTextProps={{ style: { marginLeft: 0 } }}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />

            <Box mt={2}>
              <TextField
                label="Description"
                name="description"
                multiline
                rows={2}
                fullWidth
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                FormHelperTextProps={{ style: { marginLeft: 0 } }}

                error={
                  formik.touched.description && Boolean(formik.errors.description)
                }
                helperText={
                  formik.touched.description && formik.errors.description
                }
              />
            </Box>

            <Box mt={2}>
              <TextField
                select
                label="Record Type"
                name="recordType"
                fullWidth
                value={formik.values.recordType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                FormHelperTextProps={{ style: { marginLeft: 0 } }}

                error={
                  formik.touched.recordType && Boolean(formik.errors.recordType)
                }
                helperText={
                  formik.touched.recordType && formik.errors.recordType
                }
              >
                {recordTypes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box mt={2}>
              <Button
                component="label"
                style={{
                  background: '#2e5ad5',
                  color: '#fff',
                  width: '150px',
                }}
                disabled={loading}
              >
                {loading ? 'Uploading...' : 'Upload Files'}
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  hidden
                  multiple
                  onChange={handleFileChange}
                />
              </Button>
              
            </Box>
            {formik.touched.fileUrl && formik.errors.fileUrl && (
              <Typography color="error" variant="caption">
                {formik.errors.fileUrl}
              </Typography>
            )}

            {formik.values.fileUrl.length > 0 && (
              <Box mt={3}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Preview Files:
                </Typography>
                <Grid container spacing={1}>
                  {formik.values.fileUrl.map((url, index) => (
                    <Grid item key={index}>
                      <Box
                        onClick={() => handleOpenPreview(url)}
                        sx={{
                          width: 80,
                          height: 80,
                          border: '1px solid #ccc',
                          borderRadius: 1,
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        {url.toLowerCase().includes('.pdf') ? (
                          <InsertDriveFileIcon fontSize="large" />
                        ) : (
                          <img
                            src={url}
                            alt="preview"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            <Box mt={4} display="flex" justifyContent="center">
              <Button
                variant="contained"
                type="submit"
                style={{ background: '#2e5ad5', width: 150 }}
                disabled={loading}
              >
                Submit
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog
        open={previewDialog.open}
        onClose={handleClosePreview}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          File Preview
          <IconButton
            onClick={handleClosePreview}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {previewDialog.url.toLowerCase().includes('.pdf') ? (
            <iframe
              src={previewDialog.url}
              title="PDF Preview"
              width="100%"
              height="500px"
              style={{ border: 'none' }}
            />
          ) : (
            <img
              src={previewDialog.url}
              alt="Preview"
              style={{ width: '100%', height: 'auto' }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default MedicalReports;
