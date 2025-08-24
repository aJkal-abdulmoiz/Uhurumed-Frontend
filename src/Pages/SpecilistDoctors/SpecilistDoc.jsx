import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Skeleton,
} from '@mui/material';
import axios from 'axios';
import toast from 'react-hot-toast';
import ApiConfig from '../../ApiConfig/ApiConfig';

const doctors = [
  {
    name: 'Emily Haden',
    title: 'Orthodontist',
    image: 'https://elite-themes.com/html/medicoz/images/resource/team-5.jpg',
    description:
      'Specializes in diagnosing and correcting misaligned teeth and jaws with braces.',
  },
  {
    name: 'Hellen Hill',
    title: 'Endodontist',
    image: 'https://elite-themes.com/html/medicoz/images/resource/team-6.jpg',
    description:
      'Expert in saving teeth through root canal treatments and managing dental pulp diseases.',
  },
  {
    name: 'Audrey Button',
    title: 'Prosthodontist',
    image: 'https://elite-themes.com/html/medicoz/images/resource/team-7.jpg',
    description:
      'Focuses on restoring and replacing teeth with crowns, bridges, and dentures for aesthetics.',
  },
  {
    name: 'Emily Haden',
    title: 'Periodontist',
    image: 'https://elite-themes.com/html/medicoz/images/resource/team-8.jpg',
    description:
      'Specialist in preventing, diagnosing, and treating gum disease and placing dental implants.',
  },
  {
    name: 'Hellen Hill',
    title: 'Pediatric Dentist',
    image: 'https://elite-themes.com/html/medicoz/images/resource/team-9.jpg',
    description:
      'Dedicated to the dental health of infants, children, and teenagers, providing gentle care.',
  },
  {
    name: 'Audrey Button',
    title: 'Oral Surgeon',
    image: 'https://elite-themes.com/html/medicoz/images/resource/team-10.jpg',
    description:
      'Performs complex procedures like wisdom tooth removal, corrective jaw surgery, and facial repair.',
  },
];

const SpecilistDoc = () => {
  const [loading, setLoading] = useState(false);
  const [doctor, setDoctor] = useState([]);

  const DeleteDoctorHanlder = async (id) => {
    const token = window.localStorage.getItem('UhuruMedToken');
    setLoading(true);
    try {
      const response = await axios({
        method: 'GET',
        url: ApiConfig.doctoruserList,
      });
      console.log('b565bvifbifu', response.data.error);
      if (response.data.error === 'false') {
        console.log('sdsadfsasssss', response.data);
        setDoctor(response?.data?.data.slice(-10));
        setLoading(false);
      } else {
        setLoading(false);
        toast.error(response?.data?.message ?? 'Please try again');
      }
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.message ?? 'Please try again');
      console.log('error', error);
    }
  };

  useEffect(() => {
    DeleteDoctorHanlder();
  }, []);

  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: { xs: '40vh', sm: '50vh', md: '60vh' },
          position: 'relative',
          backgroundImage:
            'url(https://img.freepik.com/free-photo/male-working-as-paediatrician_23-2151696328.jpg?ga=GA1.1.406090842.1746782723&semt=ais_hybrid&w=740)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h3"
          sx={{
            backgroundColor: 'rgba(243, 232, 232, 0.67)',
            p: 2,
            borderRadius: 2,
            color: '#0077CC',
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
          }}
        >
          Our Dedicated Doctors
        </Typography>
      </Box>
      <Box mt={5} display={'flex'} justifyContent={'center'}>
        <Typography
          variant="h3"
          sx={{
            p: 2,
            borderRadius: 2,
            color: '#0077CC',
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
          }}
        >
          Our Specialist Doctors
        </Typography>
      </Box>
      <Box sx={{ padding: { xs: 2, sm: 3, md: 4 } }}>
        <Grid container spacing={4} justifyContent="center">
          {loading
            ? Array.from(new Array(6)).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{ maxWidth: 350, mx: 'auto', borderRadius: '10px' }}
                >
                  <Skeleton variant="rectangular" height={300} width={300} />
                  <CardContent>
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="80%" />
                    <Skeleton variant="text" width="40%" />
                  </CardContent>
                </Card>
              </Grid>
            ))
            : doctor?.map((doctor, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  elevation={4}
                  sx={{
                    textAlign: 'center',
                    width: '100%',
                    maxWidth: 350,
                    mx: 'auto',
                    overflow: 'hidden',
                    position: 'relative',
                    borderRadius: '10px',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: '3px',
                      backgroundColor: '#1976d2',
                      transform: 'scaleX(0)',
                      transformOrigin: 'bottom right',
                      transition: 'transform 0.3s ease',
                    },
                    '&:hover::after': {
                      transform: 'scaleX(1)',
                      transformOrigin: 'bottom left',
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={
                      doctor.profilePic ??
                        'https://png.pngtree.com/png-clipart/20230515/original/pngtree-doctor-flat-illustration-png-image_9162024.png'
                    }
                    alt={doctor.name}
                    sx={{
                      objectFit: 'cover',
                      width: '300px',
                      height: '300px',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                  />
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">
                      {doctor.firstName}
                    </Typography>
                    <Typography variant="body2" color="primary" gutterBottom>
                      {doctor.email}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        fontSize: { xs: '0.85rem', sm: '0.9rem' },
                      }}
                    >
                      {doctor.specialization}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Box>
    </>
  );
};

export default SpecilistDoc;
