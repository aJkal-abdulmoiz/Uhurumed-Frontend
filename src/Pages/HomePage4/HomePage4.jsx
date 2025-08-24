import React, { useEffect } from 'react';
import { Grid, Typography, Box } from '@mui/material';
import Btn from '../../CommonComponenet/CommonButtons/Btn';
import AOS from 'aos';
import 'aos/dist/aos.css';

const HomePage4 = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <Box sx={{ flexGrow: 1, padding: 4 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          padding: 4,
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '6rem',
        }}
      >
        <Grid container spacing={4} alignItems="center">
          {/* Left Side: Text Content */}
          <Grid item xs={12} md={6} data-aos="fade-right">
            <Box sx={{ maxWidth: 500, px: { xs: 0, md: 0 } }}>
              <Typography
                variant="h4"
                fontWeight="bold"
                gutterBottom
                sx={{ fontSize: { xs: '1.6rem', md: '2.2rem' } }}
              >
                Excellence in Healthcare <br />
                Innovation in Every Step.
              </Typography>
              <Typography
                sx={{ my: 2, color: '#000', fontSize: { xs: 14, sm: 16 } }}
              >
                Our mission is to deliver compassionate care combined with
                cutting-edge technology to ensure every patient feels valued and
                cared for.
              </Typography>
              <Typography sx={{ color: '#000', fontSize: { xs: 14, sm: 16 } }}>
                With over three decades of expertise, we specialize in advanced
                treatments tailored to your individual needs, promoting wellness
                and healing.
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
                <Btn label="Learn More" />
              </Box>
            </Box>
          </Grid>

          {/* Right Side: Image */}
          <Grid item xs={12} md={6} data-aos="fade-left">
            <Box
              component="img"
              src="/Images/homePage5.png"
              alt="Healthcare illustration"
              sx={{ width: '100%', borderRadius: 2 ,height:'80%'}}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default HomePage4;
