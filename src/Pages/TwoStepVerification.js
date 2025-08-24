import React, { useContext, useRef, useState } from 'react';
import {
  Dialog,
  Box,
  Typography,
  Button,
  Stack,
  IconButton,
  Paper,
  styled,
  CircularProgress,
  TextField,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { RiCloseCircleLine } from 'react-icons/ri';
import axios from 'axios';
import ApiConfig from '../ApiConfig/ApiConfig';
import toast from 'react-hot-toast';
import { AuthContext } from '../Context/Auth';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    width: '100%',
    maxWidth: 460,
    height: 560,
    borderRadius: 16,
    overflow: 'visible',
  },
  '& .MuiBackdrop-root': {
    backgroundColor: 'rgba(0,0,0,0.4)',
    backdropFilter: 'blur(3px)',
  },
}));

const TwoStepVerification = ({ open, onClose, store, loading }) => {
  const secretCode = 'LKS7-28HS-J910-HAXX-72LA-0HAJ-SCBH';
  const [code, setCode] = useState(new Array(6).fill('')); // Array for 6 inputs
  const inputsRef = useRef([]);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const auth = useContext(AuthContext);
  const userData = auth.userData;

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (code[index]) {
        // If current input has a value, clear it
        const newCode = [...code];
        newCode[index] = '';
        setCode(newCode);
        setError('');
      } else if (index > 0) {
        // Move focus back if current empty
        inputsRef.current[index - 1].focus();
      }
    }
  };

  const handleChange = (e, index) => {
    const val = e.target.value;
    if (/^\d?$/.test(val)) {
      // allow only single digit or empty
      const newCode = [...code];
      newCode[index] = val;
      setCode(newCode);
      setError('');

      // Move focus to next input if digit entered
      if (val && index < 5) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const verify2FAHandler = async () => {
    const token = window.localStorage.getItem('UhuruMedToken');
    const enteredCode = code.join('');
    if (enteredCode.length !== 6) {
      setError('Code must be 6 digits');

      return;
    }
    try {
      // Call API to verify 2FA code
      const response = await axios.post(
        ApiConfig.verify2FA,
        {
          code: enteredCode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.error === 'false') {
        toast.success('Two-factor authentication successful');
        window.location.reload();
      } else {
        // setError(response.data.message || "Invalid authentication code");
        // setLoading(false);
      }
    } catch (err) {
      // setError(err?.response?.data?.message || "Verification failed");
      // setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(secretCode);
    alert('Copied to clipboard!');
  };

  return (
    <StyledDialog open={open}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
        // px={2}
        backgroundColor={'#FFF'}
        sx={{ borderRadius: 4, position: 'relative' }}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          <Paper elevation={4} sx={{ width: '100%', p: 4, borderRadius: 4 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                position: 'absolute',
                right: 8,
                top: 5,
              }}
            >
              <IconButton onClick={onClose}>
                <RiCloseCircleLine />
              </IconButton>
            </Box>
            <Stack
              spacing={3}
              style={{ paddingTop: '5px' }}
              alignItems="center"
            >
              <Typography variant="h6" fontWeight={600}>
                Turn on 2-Step Verification
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                Open authenticator and choose scan barcode.
              </Typography>

              <Box
                component="img"
                src={store?.code2FA}
                alt="QR Code"
                sx={{ width: 150, height: 150, borderRadius: 2 }}
              />
              {userData?.verified2FA === 'false' ? (
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{ backgroundColor: '#2e5ad5' }}
                  onClick={() => verify2FAHandler()}
                >
                  Continue
                </Button>
              ) : null}
              <Typography variant="caption" color="text.secondary">
                OR enter the code manually
              </Typography>
              {userData?.verified2FA === 'false' ? (
                <Box
                  mt={1}
                  display="flex"
                  justifyContent="space-between"
                  maxWidth={400}
                  mx="auto"
                >
                  {code.map((digit, index) => (
                    <TextField
                      key={index}
                      inputRef={(el) => (inputsRef.current[index] = el)}
                      value={digit}
                      onChange={(e) => handleChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      variant="outlined"
                      inputProps={{
                        maxLength: 1,
                        inputMode: 'numeric',
                        pattern: '[0-9]*',
                        style: {
                          textAlign: 'center',
                          fontSize: 24,
                          height: '50px',
                          padding: 0,
                        },
                      }}
                      sx={{
                        width: 50,
                        height: 50,
                        marginRight: '4px',
                        '& .MuiOutlinedInput-root': {
                          height: 50,
                          padding: 0,
                          '& input': {
                            height: 50,
                            padding: 0,
                            textAlign: 'center',
                            fontSize: 24,
                            boxSizing: 'border-box',
                          },
                        },
                      }}
                    />
                  ))}
                </Box>
              ) : null}

              <Box
                display="flex"
                alignItems="center"
                bgcolor="#f0f0f0"
                px={2}
                py={1}
                borderRadius={2}
                width="100%"
                sx={{ overflowX: 'auto' }}
              >
                <Typography
                  variant="body2"
                  fontFamily="monospace"
                  sx={{ flexGrow: 1, whiteSpace: 'nowrap' }}
                >
                  {store?.secret2FA}
                </Typography>
                <IconButton onClick={handleCopy} size="small">
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Box>
            </Stack>
          </Paper>
        )}
      </Box>
    </StyledDialog>
  );
};

export default TwoStepVerification;
