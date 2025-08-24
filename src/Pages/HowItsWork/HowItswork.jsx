import React, { useEffect } from 'react';
import { Box, Container, Grid, Typography, useTheme } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import GroupsIcon from '@mui/icons-material/Groups';
import AOS from 'aos';
import 'aos/dist/aos.css';

const steps = [
  {
    icon: <LocationOnIcon fontSize="large" color="primary" />,
    title: 'Choose Your Country & Specialty',
    description:
      'Select your location and the type of doctor you need—from internal medicine to obesity care or urgent issues.',
  },
  {
    icon: <CalendarTodayIcon fontSize="large" color="primary" />,
    title: 'Book or Request Urgent Care',
    description:
      'Schedule a convenient appointment or request immediate care, UhuruMed is available 24/7, every day.',
  },
  {
    icon: <LaptopMacIcon fontSize="large" color="primary" />,
    title: 'See a Doctor from Anywhere',
    description:
      'Join your secure video consultation on phone, tablet, or computer. Get prescriptions, notes, and advice in real time.',
  },
  {
    icon: <GroupsIcon fontSize="large" color="primary" />,
    title: 'Members Get More Details',
    description:
      'UhuruCare members enjoy free annual physicals and discounted visits. Non-members pay per use—no subscription required.',
  },
];

const HowItswork = () => {
  const theme = useTheme();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <Container maxWidth="lg">
      <Box
        px={2}
        py={5}
        sx={{ backgroundColor: '#fff', textAlign: 'center', marginTop: '7rem' }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom color="#000">
          How It Works
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {steps.map((step, index) => (
            <Grid
              key={index}
              item
              xs={12}
              sm={6}
              md={3}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                px={2}
                textAlign="center"
                marginTop="2rem"
              >
                <Box
                  sx={{
                    background: '#0077CC',
                    borderRadius: '50%',
                    width: '100px',
                    height: '100px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                  }}
                >
                  {React.cloneElement(step.icon, {
                    sx: { color: '#fff', fontSize: 40 },
                  })}
                </Box>

                <Typography
                  fontWeight="bold"
                  gutterBottom
                  sx={{
                    fontWeight: 'bold',
                    fontSize: { xs: '1.25rem', sm: '1.4rem' },
                    color: '#000',
                    width:210,
                    marginTop:'10px',
                  }}
                >
                  {step.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 1,
                    fontSize: { xs: '14px', sm: '16px', width: 200 },
                  }}
                >
                  {step.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default HowItswork;
