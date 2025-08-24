import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import React, { useContext, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { AuthContext } from '../../Context/Auth';
import { useNavigate } from 'react-router-dom';

export const WhiteBanner = () => {
  const navigate = useNavigate();
  const { userLoggedIn, userData } = useContext(AuthContext);
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('xs'));
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const isMd = useMediaQuery(theme.breakpoints.down('md'));
  const isLg = useMediaQuery(theme.breakpoints.down('lg'));

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const headingFontSize = isSm
    ? 'clamp(2rem, 5vw, 3.1rem)'
    : 'clamp(3rem, 7vw, 4.0rem)';

  const subHeadingFontSize = isSm
    ? 'clamp(1rem, 3vw, 1.25rem)'
    : 'clamp(1.25rem, 2vw, 1.5rem)';

  const paragraphWidth = isSm ? '100%' : 590;

  const handleLogin = (e) => {
    e.preventDefault();
    if (userLoggedIn) {
      switch (userData?.userType) {
      case 'ADMIN':
        navigate('/dashboard');
        break;
      case 'DOCTOR':
        navigate('/doctor-dashboard');
        break;
      case 'USER':
        navigate('/user-dashboard');
        break;
      default:
        navigate('/dashboard');
        break;
      }
    } else {
      navigate('/login');
    }
  };

  const handleSign = (e) => {
    e.preventDefault();
    if (userLoggedIn) {
      switch (userData?.userType) {
      case 'ADMIN':
        navigate('/dashboard');
        break;
      case 'DOCTOR':
        navigate('/doctor-dashboard');
        break;
      case 'USER':
        navigate('/user-dashboard');
        break;
      default:
        navigate('/dashboard');
        break;
      }
    } else {
      navigate('/signUp');
    }
  };

  return (
    <Box
      sx={{
        mt: { xs: 15, md: 20 },
        mb: { xs: 6, md: 10 },
        marginLeft:{xs:'0px',md:'1rem'},
        px: 2,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          {/* Left Content */}
          <Grid item xs={12} md={6} data-aos="fade-right">
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
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
                24/7 Virtual Care <br /> Across Borders
              </Typography>

              <Typography
                data-aos="fade-up"
                data-aos-delay="200"
                sx={{
                  fontWeight: 500,
                  lineHeight: 1.2,
                  color: '#000',
                  fontSize: subHeadingFontSize,
                  width: paragraphWidth,
                }}
              >
                Choose your doctor by specialty and country. UhuruMed connects
                you to expert care—anytime, anywhere.
              </Typography>

              {/* Buttons */}
              <Box
                data-aos="fade-up"
                data-aos-delay="400"
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2,
                  flexWrap: 'wrap',
                }}
              >
                <Button
                  onClick={handleLogin}
                  sx={{
                    // border: '1px solid gray',
                    fontWeight: 'bold',
                    borderRadius: '9999px',
                    textTransform: 'none',
                    padding: '10px 70px',
                    color: '#fff',
                    border: '1px solid #2e5ad5',
                    background: '#2e5ad5',
                    '&:hover': {
                      backgroundColor: '#fff',
                      color: 'text.primary',
                      border: '1px solid gray',
                    },
                  }}
                >
                  Book a Consultation
                </Button>
                <Button
                  onClick={handleSign}
                  sx={{
                    border: '1px solid gray',
                    fontWeight: 'bold',
                    borderRadius: '9999px',
                    textTransform: 'none',
                    padding: '10px 44px',
                    color: 'text.primary',
                    '&:hover': {
                      backgroundColor: '#fff',
                      color: '#000',
                    },
                  }}
                >
                  Browse Doctors by Country
                </Button>
              </Box>

              <Typography
                data-aos="fade-up"
                data-aos-delay="600"
                sx={{
                  fontWeight: 500,
                  lineHeight: 1.2,
                  color: '#000',
                  fontSize: subHeadingFontSize,
                  width: paragraphWidth,
                }}
              >
                UhuruCare Member? Book Your Annual Physical
              </Typography>
            </Box>
          </Grid>

          {/* Right Image */}
          <Grid item xs={12} md={6} data-aos="zoom-in">
            <Box
              sx={{
                width: '100%',
                maxWidth: 500,
                background: '#f7fbfc',
                height: 300,
                borderRadius: 3,
                overflow: 'hidden',
              }}
            >
              <Box
                component="img"
                // src="Images/mailImage.PNG"
                src="Images/withoutBanner.png"
                alt="UhuruMed banner"
                sx={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '10px',
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
