import React, { useContext, useEffect, useState } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Container,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { CountryFlag } from '../../Context/CountryFlag';
import ApiConfig from '../../ApiConfig/ApiConfig';
import axios from 'axios';
import { AuthContext } from '../../Context/Auth';
import { useNavigate } from 'react-router-dom';

const Country = () => {
  const [country, setCountry] = React.useState('Select country');
  const [specialty, setSpecialty] = React.useState('Select');
  const [filteredCountries, setFilteredCountries] = useState([
    { index: 0 },
    ...CountryFlag,
  ]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const commonHeight = 41;
  const { userLoggedIn, userData } = useContext(AuthContext); // Assuming you provide this from context

  const doctorList = [
    {
      name: 'Internal Medicine',
    },
    {
      name: 'Obesity Medicine & Weight Management',
    },
    {
      name: 'Specialist Consultations',
    },
    {
      name: 'Urgent Care & Sick Visits',
    },
    {
      name: 'Annual Physicals (Free for UhuruCare Members)',
    },

  ];

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
    <Box sx={{ p: 2, mt: 13 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          sx={{
            mb: 2,
            fontWeight: 600,
            textAlign: { xs: 'center', md: 'start' },
            marginLeft: { xs: '0px', md: '0px' },
          }}
        >
          Country & Physician Selector
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            p: 2,
          }}
        >
          {/* Country */}
          <FormControl
            sx={{
              height: commonHeight,
              minWidth: { xs: '100%', sm: 400 },
              flexGrow: { xs: 1, sm: 0 },
              marginLeft: { xs: '0px', md: '-2rem' },
            }}
          >
            <Autocomplete
              value={country || null}
              onChange={(event, newValue) => setCountry(newValue)}
              options={filteredCountries?.map((item) => item?.name) || []}
              getOptionLabel={(option) => option || ''}
              sx={{
                '& .MuiInputBase-root': {
                  height: 48, // set height of the input
                  fontSize: '14px', // input text font size
                  color: '#333', // input text color
                  borderRadius: 2,
                },
                '& .MuiInputBase-input': {
                  fontSize: '15px', // 🔵 Selected value font size
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#ccc', // border color
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#0077cc', // hover border color
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#0077cc', // focused border color
                },
                '& .MuiInputLabel-root': {
                  fontSize: '14px',
                  color: '#555',
                },
              }}
              slotProps={{
                popper: {
                  modifiers: [
                    {
                      name: 'offset',
                      options: {
                        offset: [0, 4],
                      },
                    },
                  ],
                },
                paper: {
                  sx: {
                    '& .MuiAutocomplete-option': {
                      color: '#000000DE',
                      fontSize: '16px', // 🔴 Dropdown option text color
                    },
                  },
                },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Select Country"
                  sx={{
                    height: commonHeight,
                    '& .MuiInputBase-root': {
                      height: commonHeight,
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 14px',
                    },
                  }}
                />
              )}
              isOptionEqualToValue={(option, value) => option === value}
              fullWidth
            />
          </FormControl>
          {/* Specialty */}
          <FormControl
            sx={{
              height: commonHeight,
              minWidth: { xs: '100%', sm: 400 },
              flexGrow: { xs: 1, sm: 0 },
            }}
          >
            <Autocomplete
              value={specialty || null}
              onChange={(event, newValue) => setSpecialty(newValue)}
              options={doctorList?.map((item) => item?.name) || []}
              getOptionLabel={(option) => option || ''}
              sx={{
                '& .MuiInputBase-root': {
                  height: 48, // set height of the input
                  fontSize: '14px', // input text font size
                  color: '#333', // input text color
                  borderRadius: 2,
                },
                '& .MuiInputBase-input': {
                  fontSize: '15px', // 🔵 Selected value font size
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#ccc', // border color
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#0077cc', // hover border color
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#0077cc', // focused border color
                },
                '& .MuiInputLabel-root': {
                  fontSize: '14px',
                  color: '#555',
                },
              }}
              slotProps={{
                popper: {
                  modifiers: [
                    {
                      name: 'offset',
                      options: {
                        offset: [0, 4],
                      },
                    },
                  ],
                },
                paper: {
                  sx: {
                    '& .MuiAutocomplete-option': {
                      color: '#000000DE',
                      fontSize: '16px', // 🔴 Dropdown option text color
                    },
                  },
                },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Select"
                  sx={{
                    height: commonHeight,
                    '& .MuiInputBase-root': {
                      height: commonHeight,
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 14px',
                    },
                  }}
                />
              )}
              isOptionEqualToValue={(option, value) => option === value}
              fullWidth
            />
          </FormControl>

          {/* Availability */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: { xs: '100%', sm: 'auto' },
              maxWidth: 400,
              flexGrow: { xs: 1, sm: 0 },
            }}
          >
            <TextField
              placeholder="Available Today"
              variant="outlined"
              disabled
              sx={{
                flex: 1,
                '& .MuiInputBase-root': {
                  height: commonHeight,
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                },
              }}
              inputProps={{
                style: {
                  padding: '0 14px',
                  fontSize: 14,
                },
              }}
            />

            <Button
              sx={{
                height: commonHeight,
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                minWidth: 100,
                fontSize: 14,
                textTransform: 'none',
                background: '#2e5ad5',
                color: '#fff',
              }}
              onClick={handleLogin}
            >
              Search
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Country;
