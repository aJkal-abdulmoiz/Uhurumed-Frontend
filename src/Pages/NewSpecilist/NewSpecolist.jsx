import { Box, Container, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const NewSpecolist = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <Container maxWidth="lg">
      <Box
        px={2}
        py={5}
        sx={{ backgroundColor: '#fff', textAlign: 'center', marginTop: '7rem' }}
        data-aos="fade-up"
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom color="#000">
          Specialist Consultations
        </Typography>
      </Box>

      <Box sx={{ marginTop: '-1rem' }} data-aos="fade-up" data-aos-delay="100">
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 0,
            fontSize: { xs: '14px', sm: '16px' },
            width: { xs: '100%', md: '800px' },
            textAlign: 'center',
            margin: 'auto',
          }}
        >
          Get direct access to trusted medical specialists—without waiting
          months or traveling far. UhuruMed connects you to licensed
          professionals across a wide range of specialties, all from the comfort
          of your home.
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: { xs: '10px', md: '25px' },
          flexWrap: 'wrap',
        }}
      >
        <Box component="ul" sx={{ pl: 2, mt: 1 }} data-aos="fade-right" data-aos-delay="200">
          <Typography
            fontWeight="bold"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '1.25rem', sm: '1.4rem' },
              color: '#000',
              marginTop: '10px',
            }}
          >
            What You Can Expect:
          </Typography>
          {[
            'One-on-one virtual visits with board-certified specialists',
            'Flexible booking—choose a time that works for you',
            'Global access—connect by country and specialty',
            'Follow-up options to continue care or coordinate with local providers',
          ].map((item, idx) => (
            <li key={idx}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1, fontSize: { xs: '14px', sm: '16px' } }}
              >
                {item}
              </Typography>
            </li>
          ))}
        </Box>

        <Box data-aos="fade-left" data-aos-delay="300">
          <Typography
            fontWeight="bold"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '1.25rem', sm: '1.4rem' },
              color: '#000',
              marginTop: '10px',
            }}
          >
            Available Specialties Include:
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box component="ul" sx={{ pl: 2, mt: 0 }}>
              {['Cardiology', 'Endocrinology', 'Gastroenterology', 'Neurology'].map((spec, i) => (
                <li key={spec}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1, fontSize: { xs: '14px', sm: '16px' } }}
                  >
                    {spec}
                  </Typography>
                </li>
              ))}
            </Box>
            <Box component="ul" sx={{ pl: 2, mt: 1 }}>
              {['Dermatology', 'Pediatrics', 'Women’s Health', 'And more...'].map((spec, i) => (
                <li key={spec}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1, fontSize: { xs: '14px', sm: '16px' } }}
                  >
                    {spec}
                  </Typography>
                </li>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: { xs: 'justify', md: 'space-between' },
          marginTop: { xs: '10px', md: '25px' },
          flexWrap: 'wrap',
        }}
      >
        <Box component="ul" sx={{ pl: 2, mt: 1 }} data-aos="fade-up" data-aos-delay="400">
          <Typography
            fontWeight="bold"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '1.25rem', sm: '1.4rem' },
              color: '#000',
              marginTop: '10px',
            }}
          >
            UhuruCare Members:
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 1,
              fontSize: { xs: '14px', sm: '16px' },
              width: { xs: '100%', md: '450px' },
            }}
          >
            Enjoy discounted or included specialist visits depending on your plan
          </Typography>
        </Box>

        <Box data-aos="fade-up" data-aos-delay="500">
          <Typography
            fontWeight="bold"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '1.25rem', sm: '1.4rem' },
              color: '#000',
              marginTop: '10px',
            }}
          >
            Non-Members:
          </Typography>
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 1,
                fontSize: { xs: '14px', sm: '16px' },
                width: { xs: '100%', md: '290px' },
              }}
            >
              Pay per consultation, no subscription required
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default NewSpecolist;
