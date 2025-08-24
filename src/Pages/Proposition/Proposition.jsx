import React, { useContext, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/Auth';
import AOS from 'aos';
import 'aos/dist/aos.css';

export const Proposition = () => {
  const navigate = useNavigate();
  const { userLoggedIn, userData } = useContext(AuthContext);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));

  const headingFontSize = isSm
    ? 'clamp(1.5rem, 5vw, 1.5rem)'
    : 'clamp(3rem, 7vw, 3.0rem)';
  const subHeadingFontSize = isSm
    ? 'clamp(1rem, 3vw, 1rem)'
    : 'clamp(1.25rem, 2vw, 1rem)';
  const paragraphWidth = isSm ? '100%' : 590;

  return (
    <Box sx={{ mt: { xs: 15, md: 13 }, mb: { xs: 6, md: 15 }, px: 2 }}>
      <Container maxWidth="lg">
        {/* <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          color="#000"
          textAlign="center"
          data-aos="fade-up"
        >
          UhuruMed Value Proposition
        </Typography> */}

        <Grid container spacing={6} alignItems="center" mt={4}>
          {/* Left Content */}
          <Grid item xs={12} md={6} data-aos="fade-right">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Typography
                sx={{
                  fontSize: headingFontSize,
                  fontWeight: 'bold',
                  lineHeight: 1.1,
                  color: '#000',
                  textAlign: { xs: 'center', md: 'justify' },
                  fontFamily: '\'Poppins\', sans-serif',
                }}
              >
                Your Doctor Anywhere
                <br /> Anytime
              </Typography>

              <Typography
                sx={{
                  fontWeight: 300,
                  lineHeight: 1.2,
                  color: '#000',
                  fontSize: subHeadingFontSize,
                  width: paragraphWidth,
                }}
              >
                UhuruMed provides 24/7 virtual access to licensed doctors across
                internal medicine, obesity care, and specialist services.
                Whether you&apos;re an UhuruCare member or a private patient, you can
                choose physicians by country, book urgent care or scheduled
                visits, and receive expert medical care from the comfort of your
                home—no matter where you are
              </Typography>

              {/* Feature Rows */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  flexWrap: 'wrap',
                }}
              >
                <Box
                  sx={{
                    width: '300px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}
                  data-aos="fade-up"
                >
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <CheckCircleIcon
                      sx={{ color: '#1976d2', fontSize: '24px' }}
                    />
                    <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>
                      Choose doctors by country and specialty
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    width: '300px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <CheckCircleIcon
                      sx={{ color: '#1976d2', fontSize: '24px' }}
                    />
                    <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>
                      Access round-the-clock care, including urgent care
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  flexWrap: 'wrap',
                }}
              >
                <Box
                  sx={{
                    width: '300px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <CheckCircleIcon
                      sx={{ color: '#1976d2', fontSize: '24px' }}
                    />
                    <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>
                      UhuruCare members enjoy free annual physicals and
                      exclusive benefits
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    width: '300px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}
                  data-aos="fade-up"
                  data-aos-delay="300"
                >
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <CheckCircleIcon
                      sx={{ color: '#1976d2', fontSize: '24px' }}
                    />
                    <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>
                      Non-members can pay per visit with no subscription
                      required
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{ display: 'flex', gap: 1 }}
                data-aos="fade-up"
                data-aos-delay="400"
              >
                <CheckCircleIcon sx={{ color: '#1976d2', fontSize: '24px' }} />
                <Typography
                  sx={{
                    fontWeight: 600,
                    lineHeight: 1.2,
                    color: '#000',
                    fontSize: '16px',
                    width: paragraphWidth,
                  }}
                >
                  Seamless booking, video consults, and digital health records
                  in one platform
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Right Image */}
          <Grid item xs={12} md={6} data-aos="fade-left">
            <Box
              sx={{
                width: '100%',
                maxWidth: 500,
                background: '#f7fbfc',
                height: {
                  xs: 500, // small screens
                  sm: 600, // medium and up
                },
                borderRadius: 3,
                overflow: 'hidden',
              }}
            >
              <Box
                component="img"
                src="Images/mailImage.PNG"
                alt="UhuruMed banner"
                sx={{ width: '100%', height: '100%', borderRadius: '10px' }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
