import React, { useEffect, useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  Container,
  Box,
  Skeleton,
} from '@mui/material';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Btn from '../../CommonComponenet/CommonButtons/Btn';
import axios from 'axios';
import ApiConfig from '../../ApiConfig/ApiConfig';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const cards = [
  {
    title: 'Dr. Emily Carter',
    description: 'Cardiologist',
    image: '/Images/card1.png',
  },
  {
    title: 'Dr. James Thompson',
    description: 'Neurologist',
    image: '/Images/card3.png',
  },
  {
    title: 'Dr. Sophia Lee',
    description: 'Pediatrician',
    image: '/Images/card2.png',
  },
  {
    title: 'Dr. Michael Green',
    description: 'Orthopedic Surgeon',
    image: '/Images/card4.png',
  },
];

const CardPage = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [doctor, setDoctor] = useState([]);
  console.log('Sdagsadgdsa',doctor);
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
        setDoctor(response?.data?.data);
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
    <Box
      sx={{
        minHeight: 'auto',
        display: 'flex',
        // alignItems: "center",
        justifyContent: 'center',
        py: 0,
        // background:"red"
      }}
    >
      <Container maxWidth="xlg">
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            mb: 4,
            color: '#0077CC',
            textTransform: 'uppercase',
            mt: 4,
            fontSize: { xs: '30px', sm: '45px', md: '45px' },
          }}
        >
          Our Best Specialists
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {loading ? (
            // Show skeletons while loading
            Array.from(new Array(4)).map((_, index) => (
              <Grid
                item
                key={index}
                xs={12}
                sm={6}
                md={3}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                mt={8}
              >
                <Skeleton
                  variant="rectangular"
                  width={320}
                  height={420}
                  animation="wave"
                  sx={{ borderRadius: 3 }}
                />
              </Grid>
            ))
          ) : doctor?.length === 0  || doctor?.length === undefined ? (
            // Show "No data found" when not loading and no doctors
            <Grid item xs={12}>
              <Typography
                variant="h6"
                align="center"
                color="textSecondary"
                sx={{ mt: 8 }}
              >
                No doctors found.
              </Typography>
            </Grid>
          ) : (
            // Show doctor cards
            doctor?.slice(0, 4)?.map((card, index) => (
              <Grid
                item
                key={index}
                xs={12}
                sm={6}
                md={3}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                mt={8}
              >
                <Box
                  sx={{
                    width: 320,
                    height: 420,
                    position: 'relative',
                    '&:hover .overlay': {
                      opacity: 1,
                    },
                  }}
                  
                >
                  <Card
                    sx={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 3,
                      overflow: 'hidden',
                      boxShadow: 4,
                      position: 'relative',
                      '&:hover .media': {
                        transform: 'scale(1.05)',
                      },
                    }}
                    onClick={()=> navigate('/expert')}
                  >
                    <CardMedia
                      className="media"
                      component="img"
                      image={
                        card.profilePic ??
                        'https://png.pngtree.com/png-clipart/20230515/original/pngtree-doctor-flat-illustration-png-image_9162024.png'
                      }
                      alt={card.title}
                      sx={{
                        objectFit: 'cover',
                        objectPosition: 'center',
                        height: '100%',
                        width: '100%',
                        transition:
                          'transform 0.4s ease, object-position 0.4s ease',
                      }}
                    />

                    <Box
                      className="overlay"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        display: 'flex',
                        alignItems: 'flex-end',
                      }}
                    >
                      <Box
                        className="overlay-content"
                        sx={{
                          width: '100%',
                          color: '#fff',
                          p: 2,
                          background:
                            'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            textAlign: 'center',
                            fontSize: '20px',
                            fontFamily: '700',
                          }}
                        >
                          {card.firstName}
                        </Typography>
                        <Typography
                          variant="body2"
                          mt={0.5}
                          sx={{ textAlign: 'center', color: '#fff' }}
                        >
                          {card.specialization}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Box>
              </Grid>
            ))
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default CardPage;
