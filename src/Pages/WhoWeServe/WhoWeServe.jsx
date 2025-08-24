import React from 'react';
import {
  Box,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PublicIcon from '@mui/icons-material/Public';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CircleIcon from '@mui/icons-material/Circle';

const WhoWeServe = () => {
  const whoWeServe = [
    { icon: <PersonIcon />, label: 'Individuals & Families' },
    { icon: <VerifiedUserIcon />, label: 'UhuruCare Members' },
    { icon: <PublicIcon />, label: 'Diaspora Users' },
    { icon: <CreditCardIcon />, label: 'Non-Members' },
  ];

  const topServices = [
    'Internal Medicine',
    'Obesity Medicine & Weight Management',
    'Specialist Consultations',
    'Urgent Care & Sick Visits',
    'Annual Physicals (Free for UhuruCare Members)',
  ];

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          marginTop: '6rem',
          px: { xs: 2, md: 0 }, // horizontal padding on small screens
        }}
      >
        <Grid
          container
          spacing={{ xs: 4, md: 12 }}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box sx={{display:'flex',justifyContent:'space-between',gap:{xs:'2.5rem',md:'27rem'},flexWrap:'wrap'}}>
            <Grid item xs={12} md={5} >
              <Typography
                variant="h5"
                fontWeight="bold"
                textAlign="start"
                gutterBottom
                fontSize={{ xs: '2.5rem', md: '2.5rem' }}
                color="#000"
               
              >
                Who We Serve
              </Typography>
              <List>
                {whoWeServe.map((item, index) => (
                  <ListItem key={index} sx={{ pl: 0 }}>
                    <ListItemIcon sx={{ color: 'primary.main', minWidth: 36 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        textAlign: 'left',
                        color: '#000',
                        fontSize: { xs: 16, md: 18 },
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>

            {/* Removed spacer Grid item */}

            <Grid item xs={12} md={5} sx={{ mt: { xs: 0, md: 0 } }}>
              <Typography
                variant="h5"
                fontWeight="bold"
                textAlign={{xs:'left',md:'left'}}
                gutterBottom
                fontSize={{ xs: '2.5rem', md: '2.5rem' }}
                color="#000"
              >
                Top Services Offered
              </Typography>
              <List>
                {topServices.map((service, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      pl: 0,
                      py: 0.5,
                      minHeight: 'unset',
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 24 }}>
                      <CircleIcon sx={{ fontSize: 8, color: 'primary.main' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={service}
                      primaryTypographyProps={{
                        textAlign: 'left',
                        color: '#000',
                        fontSize: { xs: 16, md: 18 },
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Box>
        </Grid>
      </Box>
    </Container>
  );
};

export default WhoWeServe;
