import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API_BASE_URL } from '../../ApiConfig/ApiConfig';
import { Box, CircularProgress } from '@mui/material';
import Btn from '../../CommonComponenet/CommonButtons/Btn';
import { useAuthStore } from '@/stores/authStore';

const StripeSuccess = () => {
  const [searchParams] = useSearchParams();
  const [loader, setLoader] = useState(false);
  const { setPaymentVerified } = useAuthStore();

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    console.log('Session ID from URL:', sessionId);
    
    if (!sessionId) {
      console.error('sessionId not found in URL');

      return;
    }

    const token = window.localStorage.getItem('UhuruMedToken');
    console.log('Token available:', !!token);

    setLoader(true);

    fetch(
      `${API_BASE_URL}/api/v1/appointment/payment/verify?provider=STRIPE&session_id=${sessionId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )
      .then(async (res) => {
        console.log('Response status:', res.status);
        const data = await res.json();
        console.log('Full API response:', data);
        
        if (!res.ok) {
          throw new Error(data.message || `HTTP error ${res.status}`);
        }
        
        return data;
      })
      .then((data) => {
        console.log('Verification successful:', data);
        setPaymentVerified(true);
        
        if (data?.data?.token) {
          localStorage.setItem('UhuruMedToken', data.data.token);
        }
      })
      .catch((error) => {
        console.error('Error calling API:', error);
        alert('Verification failed: ' + error.message);
      })
      .finally(() => {
        setLoader(false);
      });
  }, [searchParams, setPaymentVerified]);


  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <div style={styles.icon}>
          {loader ? (
            <CircularProgress size={35} style={{ color: '#10b981' }} />
          ) : (
            <svg viewBox="0 0 24 24" style={styles.svg}>
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="#10b981"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M8 12l2 2 4-4"
                stroke="#10b981"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
        <h1 style={styles.heading}>{loader ? 'Please wait...' : 'Your appointment has been confirmed'}</h1>
        <p style={styles.paragraph}>
          Thank you for your payment. Your doctor’s appointment has been
          successfully booked!
        </p>
        <Box mt={2}>
          <Btn label="Okay" onClick={() => {

            // For popup windows, simply close them
            window.close();
            
          }}  />
        </Box>
      </div>
    </div>
  );
};

const styles = {
  body: {
    backgroundColor: '#f9fafb',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    margin: 0,
    fontFamily: 'Inter, Arial, sans-serif',
  },
  container: {
    textAlign: 'center',
    background: 'white',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    maxWidth: '500px',
    width: '90%',
  },
  icon: {
    width: '64px',
    height: '64px',
    marginBottom: '24px',
    display: 'flex',
    justifyContent: 'center',
    margin: '0 auto',
  },
  svg: {
    width: '100%',
    height: '100%',
  },
  heading: {
    fontSize: '28px',
    color: '#111827',
    marginBottom: '16px',
  },
  paragraph: {
    fontSize: '16px',
    color: '#6b7280',
    margin: '4px 0',
    lineHeight: '25px',
  },
  button: {
    marginTop: '30px',
    padding: '12px 24px',
    fontSize: '16px',
    color: 'white',
    background: 'linear-gradient(to right, #0077CC, #0077CC)',
    border: 'none',
    borderRadius: '8px',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
};

export default StripeSuccess;
