// MedicalIntroSection.jsx
import { Box, Typography } from '@mui/material';
import Btn from '../../CommonComponenet/CommonButtons/Btn';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const HomePage3 = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <>
      {/* Main Content */}
      <Box sx={{ paddingTop: '7rem' }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            mb: 2,
            color: '#0077CC',
            textTransform: 'uppercase',
            fontSize: { xs: '30px', sm: '45px', md: '45px' },
          }}
        >
          Who We Serve
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            padding: 4,
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '1rem',
          }}
        >
          {/* Left Side: Hexagon Images */}
          <Box
            sx={{
              position: 'relative',
              width: { md: 700 },
              height: { xs: 300, md: 500 },
              mb: { xs: 4, md: 0 },
              borderRadius: 2,
              overflow: 'hidden',
              mr: { md: 5 },
            }}
          >
            <Box sx={{ position: 'relative', width: 'fit-content' }}>
              {/* Main Image */}
              <Box
                className="hexagon"
                data-aos="fade-left"
                sx={{
                  width: { xs: 230, sm: 300, md: 530 },
                  height: { xs: 230, sm: 300, md: 530 },
                }}
              >
                <img
                  src="/Images/about1.png"
                  alt="Doctor using a microscope"
                  width="100%"
                  height="100%"
                />
              </Box>

              {/* Overlapping Image 2 */}
              <Box
                className="hexagon"
                data-aos="fade-right"
                data-aos-delay="100"
                sx={{
                  position: 'absolute',
                  bottom: { xs: 0, md: 10 },
                  left: 0,
                  width: { xs: 80, sm: 120, md: 250 },
                  height: { xs: 80, sm: 120, md: 250 },
                  zIndex: 1,
                }}
              >
                <img
                  src="/Images/about2.png"
                  alt="Displayed X-ray scan"
                  width="100%"
                  height="100%"
                />
              </Box>

              {/* Overlapping Image 3 */}
              <Box
                className="hexagon"
                data-aos="fade-left"
                data-aos-delay="200"
                sx={{
                  position: 'absolute',
                  bottom: 30,
                  right: 0,
                  width: { xs: 80, sm: 100, md: 200 },
                  height: { xs: 80, sm: 100, md: 200 },
                  zIndex: 1,
                }}
              >
                <img
                  src="/Images/about3.png"
                  alt="Smiling medical professional"
                  width="100%"
                  height="100%"
                />
              </Box>
            </Box>
          </Box>

          {/* Right Side: Text and CTA */}
          <Box sx={{ maxWidth: 500, px: { xs: 0, md: 0 } }}>
            <Typography
              variant="h4"
              fontWeight="bold"
              gutterBottom
              sx={{ fontSize: { xs: '1.6rem', md: '2.2rem' } }}
            >
              We’re setting Standards in Research <br />
              what’s more, Clinical Care.
            </Typography>
            <Typography
              sx={{ my: 2, color: '#000', fontSize: { xs: 14, sm: 16 } }}
            >
              Individuals & Families – See trusted doctors anytime
            </Typography>
            <Typography sx={{ color: '#000', fontSize: { xs: 14, sm: 16 } }}>
              UhuruCare Members – Get annual wellness checks and priority
              booking.
            </Typography>
            <Typography sx={{ color: '#000', fontSize: { xs: 14, sm: 16 } }}>
              Diaspora Users – Support loved ones in Ghana with remote medical
              access.
            </Typography>
            <Typography sx={{ color: '#000', fontSize: { xs: 14, sm: 16 } }}>
              Non-Members – Pay per visit, no subscription needed.
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
              <Btn label="More Details" />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default HomePage3;
