import React, { useContext, useEffect } from 'react';
import { Box, Grid, Typography, Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { AuthContext } from '../../Context/Auth';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();
  const { userLoggedIn, userData } = useContext(AuthContext);
  console.log('asfgadsgsda', userData);
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic',
    });
  }, []);

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
        navigate('/dashboard'); // fallback route
        break;
      }
    } else {
      navigate('/login');
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        flexGrow: 1,
        minHeight: '100vh',
        py: { xs: 10, md: 20 },
        px: { xs: 2, sm: 4, md: 10 },
        marginTop: { xs: '2rem', md: '0px' },
        backgroundColor: '#fff',
        pb: 7,
        // minHeight: 'auto',
        overflow: 'hidden',
      }}
    >
      {/* Blurred Background Image */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url(\'https://img.freepik.com/free-photo/blurred-background-abstract-blur-beautiful-luxury-hospital-clinic-interior-background-vintage-effect-style-pictures_1253-1358.jpg?ga=GA1.1.1825963648.1747401291&semt=ais_hybrid&w=740\')',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'blur(6px)',
          opacity: 1.1,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Main Content */}
      <Grid
        container
        spacing={6}
        alignItems="center"
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'center',
        }}
        direction={{ xs: 'column', sm: 'column', md: 'row' }}
      >
        {/* Left Content */}
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              maxWidth: 480,
              mx: { xs: 'auto', md: 0 },
              textAlign: { xs: 'center', md: 'left' },
            }}
            data-aos="fade-right"
          >
            <Typography
              variant="h3"
              fontWeight={700}
              gutterBottom
              sx={{
                fontSize: { xs: '1.8rem', sm: '2rem', md: '2.5rem' },
                color: '#0077CC',
              }}
            >
              Your Doctor, Anywhere. Anytime.
            </Typography>
            <Typography
              variant="body1"
              color="#000"
              paragraph
              sx={{ opacity: 0.7 }}
            >
              Core Value Proposition: UhuruMed delivers 24/7 virtual access to
              licensed physicians across internal medicine, obesity care, and
              specialist services. Whether you&apos;re an UhuruCare member or a
              private patient, you can connect with a trusted doctor in your
              country for urgent care, chronic disease management, or preventive
              health—right from your device.
            </Typography>
            {/* <Typography
              variant="body1"
              color="#000"
              paragraph
              sx={{ opacity: 0.7 }}
            >
              Whether you're seeking a second opinion or building a customized
              health plan, we’ll help you navigate your options with confidence
              and clarity. Your well-being is our highest priority.
            </Typography> */}
            <Button
              variant="contained"
              onClick={handleLogin}
              endIcon={<ArrowForwardIcon />}
              sx={{
                mt: 3,
                borderRadius: '999px',
                px: 5,
                py: 1.7,
                fontWeight: 'bold',
                boxShadow: 3,
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#155fa0',
                },
              }}
            >
              Book a Consultation
            </Button>
          </Box>
        </Grid>

        {/* Middle Image */}
        <Grid item xs={12} md={4}>
          <Box
            component="img"
            src="https://img.freepik.com/premium-photo/professional-female-healthcare-worker-white-lab-coat-friendly-approachable-pose_1404165-4094.jpg?ga=GA1.1.1815935878.1746680291&semt=ais_hybrid&w=740"
            alt="Hero Illustration"
            sx={{
              height: { xs: 240, sm: 320, md: 400 },
              width: '100%',
              maxWidth: { xs: 300, sm: 400, md: '100%' },
              borderRadius: 4,
              mx: 'auto',
              display: 'block',
              objectFit: 'cover',
            }}
            data-aos="zoom-in"
            data-aos-delay="200"
          />
        </Grid>

        {/* Right Content */}
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              maxWidth: 530,
              mx: { xs: 'auto', md: 0 },
              textAlign: { xs: 'center', md: 'left' },
            }}
            data-aos="fade-left"
          >
            <Typography
              variant="h3"
              fontWeight={700}
              gutterBottom
              sx={{
                fontSize: { xs: '1.8rem', sm: '2rem', md: '2.5rem' },
                color: '#0077CC',
              }}
            >
              24/7 Virtual Care Across Borders
            </Typography>
            <Typography
              variant="body1"
              color="#000"
              paragraph
              sx={{ opacity: 0.7 }}
            >
              Choose your doctor by specialty and country. UhuruMed connects you
              to expert care—anytime, anywhere.
            </Typography>
            <Typography
              variant="body1"
              color="#000"
              paragraph
              sx={{ opacity: 0.7 }}
            >
              UhuruCare Member? Book Your Annual Physical
            </Typography>
            <Button
              variant="contained"
              onClick={handleLogin}
              endIcon={<ArrowForwardIcon />}
              sx={{
                mt: 3,
                borderRadius: '999px',
                px: 5,
                py: 1.7,
                fontWeight: 'bold',
                boxShadow: 3,
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#155fa0',
                },
              }}
            >
              Browse Doctors by Country
            </Button>
            {/* <Typography
              variant="body1"
              color="#000"
              paragraph
              sx={{ opacity: 0.7 }}
            >
              As a healthcare provider, you play a vital role in shaping patient
              outcomes. Stay ahead of the curve with access to cutting-edge
              treatments, clinical tools, and a network of forward-thinking
              professionals.
            </Typography> */}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HeroSection;
