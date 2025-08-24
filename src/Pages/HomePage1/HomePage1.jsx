import React from 'react';
import { Box, Typography } from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const slides = [
  {
    backgroundImage:
      'https://img.freepik.com/premium-photo/mixed-race-female-doctor-wearing-face-mask-putting-oxygen-mask-ventilator-male-patient_13339-320631.jpg?ga=GA1.1.1825963648.1747401291&semt=ais_hybrid&w=740',
    title: 'Welcome to Our Healthcare Platform',
    description:
      'Delivering compassionate care and innovative solutions to improve patient outcomes.',
  },
  {
    backgroundImage:
      'https://img.freepik.com/premium-photo/stethoscope-usa-america-brazil-world-globe-map_39768-2373.jpg?ga=GA1.1.1825963648.1747401291&semt=ais_hybrid&w=740',
    title: 'Expert Medical Team',
    description:
      'Our experienced professionals are dedicated to your health and well-being.',
  },
  {
    backgroundImage:
      'https://img.freepik.com/free-photo/pills-medical-tools-arrangement-flat-lay_23-2149341610.jpg?ga=GA1.1.1825963648.1747401291&semt=ais_hybrid&w=740',
    title: 'State-of-the-Art Facilities',
    description:
      'Equipped with the latest technology to provide top-notch medical care.',
  },
];

const HomePage1 = () => {
  const settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000, // 3 seconds instead of 5
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: false, // keep autoplay running even when mouse over
    arrows: false,
    adaptiveHeight: true,
  };

  return (
    <Box sx={{ width: '100%', height: { xs: '50vh', md: '100vh' } }}>
      <Slider {...settings}>
        {slides.map(({ backgroundImage, title, description }, index) => (
          <Box
            key={index}
            sx={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              height: { xs: '50vh', md: '100vh' },
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: 2,
                bgcolor: 'rgba(0, 0, 0, 0.4)',
              }}
            >
              <Typography
                variant="h3"
                fontWeight="bold"
                gutterBottom
                sx={{
                  fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3.5rem' },
                  color: '#fff',
                }}
              >
                {title}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                  maxWidth: '700px',
                  color: '#fff',
                }}
              >
                {description}
              </Typography>
            </Box>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default HomePage1;
