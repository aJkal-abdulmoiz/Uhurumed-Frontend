import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Breadcrumbs,
  Link,
  TextField,
  Container,
  CircularProgress,
} from '@mui/material';
import DoctorCard from '../../CommonComponenet/CommonButtons/DoctorCard';
import Btn from '../../CommonComponenet/CommonButtons/Btn';
import { useNavigate } from 'react-router-dom';
import ApiConfig from '../../ApiConfig/ApiConfig';
import axios from 'axios';

const doctors = [
  {
    name: 'Dr. Michael Sullivan',
    specialty: 'Endocrinologist',
    image: 'https://randomuser.me/api/portraits/men/10.jpg',
    rating: 3,
  },
  {
    name: 'Dr. Michael Sullivan',
    specialty: 'Endocrinologist',
    image: 'https://randomuser.me/api/portraits/women/11.jpg',
    rating: 3,
  },
  {
    name: 'Dr. Michael Sullivan',
    specialty: 'Endocrinologist',
    image: 'https://randomuser.me/api/portraits/men/12.jpg',
    rating: 3,
  },
  {
    name: 'Dr. Michael Sullivan',
    specialty: 'Endocrinologist',
    image: 'https://randomuser.me/api/portraits/men/13.jpg',
    rating: 3,
  },
  {
    name: 'Dr. Michael Sullivan',
    specialty: 'Endocrinologist',
    image: 'https://randomuser.me/api/portraits/women/14.jpg',
    rating: 3,
  },
  {
    name: 'Dr. Michael Sullivan',
    specialty: 'Endocrinologist',
    image: 'https://randomuser.me/api/portraits/men/13.jpg',
    rating: 3,
  },
  {
    name: 'Dr. Michael Sullivan',
    specialty: 'Endocrinologist',
    image: 'https://randomuser.me/api/portraits/men/13.jpg',
    rating: 3,
  },
  {
    name: 'Dr. Michael Sullivan',
    specialty: 'Endocrinologist',
    image: 'https://randomuser.me/api/portraits/men/13.jpg',
    rating: 3,
  },

  {
    name: 'Dr. Michael Sullivan',
    specialty: 'Endocrinologist',
    image: 'https://randomuser.me/api/portraits/men/15.jpg',
    rating: 3,
  },
];

const UserDoctors = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [open1, setOpen1] = useState(false);
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const getAllDoctors = async () => {
    const token = window.localStorage.getItem('UhuruMedToken');
    setLoading(true);

    try {
      const response = await axios({
        method: 'GET',
        url: ApiConfig.doctorMain,
        headers: {
          authorization: `Bearer ${token}`,
        },
        params: {
          page: page,
          limit: 200,
          search: searchQuery,
        },
      });
      console.log('successsuccess', response?.data?.success);
      if (response?.data?.error === 'false') {
        setLoading(false);

        console.log('responseresponse', response);
        setDoctors(response?.data?.data?.docs);
        // setTotalPages(response?.data?.data?.[0]?.count);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setDoctors([]);
      setLoading(false);

      console.log('errorerror', error);

      return error?.response;
    }
  };

  useEffect(() => {
    getAllDoctors();
  }, [searchQuery]);

  return (
    <Container maxWidth="xxl">
      <Box
        mb={2.5}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontSize: '30px', fontWeight: '700', fontFamily: 'rubik' }}
        >
          Doctors List
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search by name, country"
            type="search"
            value={searchQuery}
            onChange={handleSearchQueryChange}
            sx={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              marginTop: {
                xs: '10px',
                md: '0px',
              },
              minWidth: 200,
              '& .MuiOutlinedInput-root': {
                paddingRight: 0,
                padding: '2.5px 0px',
                borderRadius: '10px',
                fontSize: '14px',
              },
            }}
            InputProps={{
              sx: { paddingRight: '8px' },
            }}
          />
        </Box>
      </Box>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="50vh"
        >
          <CircularProgress />
        </Box>
      ) : doctors?.length > 0 ? (
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {doctors.map((doc, index) => (
            <Grid key={index} size={{ xs: 12, sm: 4, md: 4, lg: 3 }}>
              <DoctorCard
                main={doc}
                {...doc}
                setOpen1={setOpen1}
                type={'users'}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100%"
          textAlign="center"
          py={5}
        >
          <img
            src="/Images/404.png" // <-- Replace with your image path
            alt="No results"
            style={{ maxWidth: 300, marginBottom: 16 }}
          />
          <Typography variant="h5" fontWeight="bold" color="#0077CC">
            {'No results found'}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {'We couldn’t find what you searched for. Try searching again.'}
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default UserDoctors;
