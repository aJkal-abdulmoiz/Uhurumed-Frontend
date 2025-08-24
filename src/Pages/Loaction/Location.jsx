import React from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

const services = [
  {
    icon: <LocationOnIcon fontSize="large" color="primary" />,
    title: 'Choose Your Country & Specialty',
    description:
      'Filter by your location and select the right doctor for your needs.',
  },
  {
    icon: <CalendarTodayIcon fontSize="large" color="primary" />,
    title: 'Book or Request Urgent Care',
    description: 'Schedule ahead or request fast care for urgent issues.',
  },
  {
    icon: <PersonIcon fontSize="large" color="primary" />,
    title: 'See a Doctor From Anywhere',
    description:
      'Connect securely via video or voice. Prescriptions & notes sent digitally.',
  },
];

const Location = () => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const spacing = isMdUp ? 4 : 0;

  return (
    <Container maxWidth="lg" >
      <Box sx={{ mt: {xs:10,md:15} }}>
        <Grid container spacing={spacing} wrap="wrap">
          {services.map((service, index) => (
            <Grid
              item
              xs={12}   // full width on extra small screens
              sm={6}    // half width on small screens
              md={4}    // one-third width on medium+ screens
              key={index}
              sx={{
                // Remove minWidth or set a max width for large screens if you want
                // minWidth: 300,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Card elevation={0} sx={{ textAlign: 'center', width: '100%', maxWidth: 360 }}>
                <CardContent>
                  <Box sx={{ mb: 2 }}>{service.icon}</Box>
                  <Typography
                    sx={{
                      fontWeight: 'bold',
                      fontSize: { xs: '1.25rem', sm: '1.6rem' },
                      color: '#000',
                
                    }}
                  >
                    {service.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1, fontSize: { xs: '14px', sm: '16px' } }}
                  >
                    {service.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Location;
