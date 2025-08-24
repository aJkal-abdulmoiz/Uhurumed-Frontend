import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Container,
  useMediaQuery,
  useTheme,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import ApiConfig from '../../ApiConfig/ApiConfig';

const StaticData = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [teams, setTeams] = useState([]);
  console.log('555555', teams);

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
      console.log('resposMian', response);
      if (response?.data?.error === 'false') {
        setTeams(
          response?.data?.data.reverse().filter((item) => item.type === 'FAQ')
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
    <Box sx={{marginTop:{xs:2,md:9}}}>
      <Container
        maxWidth="md"
        sx={{ py: 4, height: teams[0]?.rows?.length > 6 ? 'auto' : 'auto' }}
      >
        <Box mb={4}>
          <Typography
            variant={isMobile ? 'h5' : 'h4'}
            gutterBottom
            align="center"
            fontWeight={'bold'}
            color="#000"
          >
            UhuruMed – Frequently Asked Questions (FAQs)
          </Typography>
        </Box>

        {teams?.length > 0 ? (
          teams.map((section, idx) => (
            <div key={idx} style={{ marginBottom: '2rem' }}>
              <Accordion
                sx={{
                  background:
                    'linear-gradient(to right, rgba(0, 119, 204, 0.8), #2e5ad5)',
                  color: 'white',
                  borderRadius: '10px !important',
                  mb: 2,
                  boxShadow: 3,
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    {section.title}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    background: '#fff',
                    backdropFilter: 'blur(2px)',
                    borderRadius: 1,
                    color: '#000',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ whiteSpace: 'pre-line' }}
                    component="div"
                  >
                    <span
                      dangerouslySetInnerHTML={{
                        __html: (() => {
                          const div = document.createElement('div');
                          div.innerHTML = section?.content || '';
                          const plainText =
                            div.textContent || div.innerText || '';
                          const trimmed =
                            plainText.length > 30
                              ? plainText.slice(0, 30) + '...'
                              : plainText;

                          return trimmed;
                        })(),
                      }}
                    />
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </div>
          ))
        ) : (
          <Typography
            variant="body1"
            align="center"
            color="text.secondary"
            sx={{ mt: 4 }}
          >
            No data found.
          </Typography>
        )}
      </Container>
    </Box>
  );
};

export default StaticData;
