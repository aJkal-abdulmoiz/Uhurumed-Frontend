import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CardMedia,
  Box,
  Divider,
  Chip,
} from '@mui/material';
import { IoMdAdd } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

const cardsData = [
  {
    title: 'Choose Your Country & Specialty',
    doctorTitle: 'Cardiologist',
    description:
      'Filter by your location and select the right doctor for your needs.',
    image: 'Images/first1.jpeg',
    bgColor: '#64b5f6',
    badge: 'Top Rated',
  },
  {
    title: 'Book or Request Urgent Care',
    doctorTitle: 'Neurologist',
    description: 'Schedule ahead or request instant care for urgent issues.',
    image: 'Images/first2.jpeg',
    bgColor: '#64b5f6',
    badge: 'Expert',
  },
  {
    title: 'See a Doctor From Anywhere',
    doctorTitle: 'Pediatrician',
    description:
      'Connect securely via video or voice. Prescriptions & notes sent digitally.',

    image: 'Images/first4.jpeg',

    bgColor: '#64b5f6',
    badge: '10+ Years',
  },
  {
    title: 'Members Get More',
    doctorTitle: 'Dermatologist',
    description:
      'UhuruCare members enjoy free annual physicals and discounted follow-ups.',
    image: 'Images/first5.jpeg',

    bgColor: '#64b5f6',
    badge: 'Recommended',
  },
];

const DoctorAbout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
    });

    return () => {
      AOS.refreshHard();
    };
  }, []);

  return (
    <Box sx={{ paddingTop: '2rem' }}>
      <Typography
        sx={{
          fontSize: { xs: '2rem', md: '2.4rem' },
          color: '#000',
          fontWeight: '700',
          textAlign: 'center',
        }}
      >
        Simple Secure Seamless{' '}
      </Typography>

      <Box
        sx={{ display: 'flex', justifyContent: 'center', mt: 10, px: 2 }}
        onClick={() => navigate('/signUp')}
      >
        <Grid container spacing={5} justifyContent="center" maxWidth="xl">
          {cardsData?.map((card, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              key={index}
              display="flex"
              justifyContent="center"
              data-aos="fade-up"
              data-aos-delay={index * 150}
            >
              <Card
                sx={{
                  width: { xs: 320, md: 250 },
                  height: { xs: 450, md: 490 },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  boxShadow:
                    '0 8px 32px 0 rgba(31, 38, 135, 0.37), 0 0 0 1px rgba(255, 255, 255, 0.18)',
                  borderRadius: 5,
                  position: 'relative',
                  overflow: 'visible',
                  background: 'rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  transition: 'transform 1.2s ease',
                  '&:hover': {
                    transform: 'scale(1.01) translateY(-15px)',
                    boxShadow:
                      '0 12px 40px 0 rgba(31, 38, 135, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.3)',
                  },
                }}
                elevation={3}
              >
                {/* Animated Doctor Symbol Icon */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: { xs: '-27px', md: '-40px' },
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bgcolor: card.bgColor,
                    borderRadius: '50%',
                    p: 2,
                    boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition:
                      'background-color 0.3s ease, transform 0.3s ease',
                    animation: 'pulse 2.5s infinite',
                    '&:hover': {
                      bgcolor: card.bgColor,
                      transform: 'translateX(-50%) scale(1.3)',
                    },
                    '@keyframes pulse': {
                      '0%, 100%': { transform: 'translateX(-50%) scale(1)' },
                      '50%': { transform: 'translateX(-50%) scale(1.1)' },
                    },
                  }}
                >
                  <IoMdAdd size={20} color="white" />
                </Box>

                {/* Badge */}
                <Chip
                  label={card.badge}
                  color="primary"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    bgcolor: card.bgColor,
                    fontWeight: '600',
                    color: 'white',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    fontSize: 11,
                  }}
                />

                {/* Title and Doctor Title */}
                <CardContent sx={{ mt: 6, textAlign: 'center', px: 4 }}>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    sx={{
                      fontWeight: 800,
                      letterSpacing: 1,
                      fontFamily: '\'Poppins\', sans-serif',
                      color: '#222',
                      fontSize: '18px',
                      lineHeight: '22px',
                      textAlign: 'center',
                    }}
                  >
                    {card.title}
                  </Typography>
                  {/* <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    sx={{ mb: 2, fontWeight: 600, fontStyle: "italic" }}
                  >
                    {card.doctorTitle}
                  </Typography> */}
                </CardContent>

                <Divider
                  sx={{ width: '85%', mb: 3, mx: 'auto', opacity: 0.25 }}
                />

                {/* Circular Image */}
                <CardMedia
                  component="img"
                  height="180"
                  image={card.image}
                  alt={card.title}
                  sx={{
                    width: 140,
                    height: 140,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    boxShadow:
                      '0 10px 20px rgba(0,0,0,0.15), inset 0 0 8px rgba(255,255,255,0.3)',
                    mb: 3,
                    transition: 'transform 0.4s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                />

                {/* Description */}
                <CardContent sx={{ textAlign: 'center', flexGrow: 1, px: 4 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ minHeight: 110, lineHeight: 1.5, fontSize: 15 }}
                  >
                    {card.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default DoctorAbout;
