import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Divider,
  Fade,
  CircularProgress,
} from '@mui/material';
import ApiConfig from '../../ApiConfig/ApiConfig';
import axios from 'axios';

const PrivacyTitle = ({ title = 'Privacy Policy' }) => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);

  const listStatic = async () => {
    // const token = window.localStorage.getItem("UhuruMedToken");
    setLoading(true);
    try {
      const response = await axios({
        method: 'GET',
        url: ApiConfig.userstaticList,
        // headers: {
        //   authorization: `Bearer ${token}`,
        // },
      });

      if (response?.data?.error === 'false') {
        setLoading(false);
        const filtered = response?.data?.data
          ?.reverse()
          ?.filter((item) => item.type === 'PRIVACY&POLICY')
          ?.map((item) => ({
            title: item.title,
            content: item.content,
          }));

        if (filtered.length > 0) {
          setSections(filtered);
        }
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching static content:', error);
    }
  };

  useEffect(() => {
    listStatic();
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 10, mt: 4 }}>
      <Typography
        variant="h3"
        gutterBottom
        fontWeight="bold"
        textAlign="center"
        sx={{ mb: 6, color: '#0077CC' }}
      >
        {title}
      </Typography>

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <CircularProgress color="primary" />
        </Box>
      ) : sections?.length === 0 ? (
        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          mt={4}
        >
          No Data Found
        </Typography>
      ) : (
        sections.map((section, index) => (
          <Fade in timeout={500 + index * 200} key={index}>
            <Box sx={{ mb: 6 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontSize: '22px', fontWeight: 'bold' }}
              >
                {section.title}
              </Typography>
              {/* <Divider sx={{ mb: 2 }} /> */}
              {Array.isArray(section.content) ? (
                <Box component="ul" sx={{ pl: 3, m: 0 }}>
                  {section.content.map((item, idx) => (
                    <li key={idx}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        {item}
                      </Typography>
                    </li>
                  ))}
                </Box>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ whiteSpace: 'pre-line' }}
                  dangerouslySetInnerHTML={{
                    __html: (() => {
                      const div = document.createElement('div');
                      div.innerHTML = section?.content || '';
                      const fullText = div.textContent || div.innerText || '';

                      return fullText;
                    })(),
                  }}
                />
              )}
            </Box>
          </Fade>
        ))
      )}
    </Container>
  );
};

export default PrivacyTitle;
