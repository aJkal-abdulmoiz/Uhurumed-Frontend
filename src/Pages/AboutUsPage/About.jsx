import { Box, Typography, Container } from '@mui/material';
import './About.css';
import Btn from '../../CommonComponenet/CommonButtons/Btn';
import { useEffect, useState } from 'react';
import ApiConfig from '../../ApiConfig/ApiConfig';
import axios from 'axios';

const About = () => {
  const [sections, setSections] = useState([]);

  const listStatic = async () => {
    // const token = window.localStorage.getItem("UhuruMedToken");
    try {
      const response = await axios({
        method: 'GET',
        url: ApiConfig.userstaticList,
        // headers: {
        //   authorization: `Bearer ${token}`,
        // },
      });
      if (response?.data?.error === 'false') {
        setSections(
          response?.data?.data
            .reverse()
            .filter((item) => item.type === 'ABOUTUS')
        );
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    listStatic();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage:
            'url("https://img.freepik.com/free-photo/man-working-as-paediatrician_23-2151696282.jpg?ga=GA1.1.406090842.1746782723&semt=ais_hybrid&w=740")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          textAlign: 'center',
          width: '100%',
          height: { xs: '40vh', md: '60vh' },
          position: 'relative',
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: '1.8rem', md: '3rem' },
            backgroundColor: 'rgba(243, 232, 232, 0.67)',
            p: 2,
            borderRadius: 2,
            color: '#0077CC',
          }}
        >
          About Us
        </Typography>
      </Box>

      {/* All About Sections */}
      <Container maxWidth="lg" sx={{ pt: 10 }}>
        {sections.map((section, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              flexDirection: {
                xs: 'column',
                md: index % 2 === 0 ? 'row' : 'row-reverse',
              },
              gap: 5,
              alignItems: 'center',
              justifyContent: 'center',
              mb: 8,
              flexWrap: 'wrap',
            }}
          >
            {/* Left: Images */}
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                maxWidth: 550,
                height: { xs: 300, md: 450 },
                backgroundImage:
                  'url("https://elite-themes.com/html/medicoz/images/icons/pattern-2.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <Box sx={{ position: 'relative', width: 'fit-content' }}>
                {/* Main Hexagon Image */}
                <Box
                  className="hexagon"
                  sx={{
                    width: { xs: 230, sm: 300, md: 400 },
                    height: { xs: 230, sm: 300, md: 400 },
                  }}
                >
                  <img
                    src={section?.imageUrl || '/Images/about1.png'}
                    alt="About Section"
                    width="100%"
                    height="100%"
                    style={{ objectFit: 'cover' }}
                  />
                </Box>

                {/* Overlay Images */}
                <Box
                  className="hexagon"
                  sx={{
                    position: 'absolute',
                    bottom: { xs: 0, md: 10 },
                    left: 0,
                    width: { xs: 80, sm: 100, md: 150 },
                    height: { xs: 80, sm: 100, md: 150 },
                    zIndex: 1,
                  }}
                >
                  <img
                    src="/Images/about2.png"
                    alt="X-ray"
                    width="100%"
                    height="100%"
                    style={{ objectFit: 'cover' }}
                  />
                </Box>

                <Box
                  className="hexagon"
                  sx={{
                    position: 'absolute',
                    bottom: 30,
                    right: 0,
                    width: { xs: 80, sm: 100, md: 150 },
                    height: { xs: 80, sm: 100, md: 150 },
                    zIndex: 1,
                  }}
                >
                  <img
                    src="/Images/about3.png"
                    alt="Doctor"
                    width="100%"
                    height="100%"
                    style={{ objectFit: 'cover' }}
                  />
                </Box>
              </Box>
            </Box>

            {/* Right: Text Content */}
            <Box
              sx={{
                flex: 1,
                maxWidth: 600,
                px: { xs: 2, sm: 3 },
                textAlign: { xs: 'center', md: 'left' },
              }}
            >
              <Typography
                variant="h4"
                fontWeight="bold"
                gutterBottom
                sx={{ fontSize: { xs: '1.6rem', md: '2.2rem' } }}
              >
                {section?.title || 'Welcome to UhuruMed'}
              </Typography>

              <Typography
                sx={{ my: 2, color: '#000', fontSize: { xs: 14, sm: 16 } }}
              >
            
                <span
                  dangerouslySetInnerHTML={{
                    __html: (() => {
                      const div = document.createElement('div');
                      div.innerHTML =
                        section?.content ||
                        'At UhuruMed, we are committed to revolutionizing healthcare by combining compassionate clinical care with cutting-edge research.';
                      const plainText = div.textContent || div.innerText || '';
                      const trimmed =
                        plainText?.length > 80000
                          ? plainText.slice(0, 80000) + '...'
                          : plainText;

                      return trimmed;
                    })(),
                  }}
                />
              </Typography>

              {/* <Box sx={{ display: "flex", justifyContent: { xs: "center", md: "flex-start" }, mt: 3 }}>
                <Btn label="More About" />
              </Box> */}
            </Box>
          </Box>
        ))}
      </Container>
    </>
  );
};

export default About;
