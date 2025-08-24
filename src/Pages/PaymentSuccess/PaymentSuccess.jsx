import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API_BASE_URL } from '../../ApiConfig/ApiConfig';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const reference = searchParams.get('reference');
    const token = localStorage.getItem('UhuruMedToken'); // Get token from localStorage
    console.log('referencereferencereference', reference);
    if (reference) {
      fetch(
        `${API_BASE_URL}api/v1/plan/purchase/paystack/verify?reference=${reference}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Add token in header
          },
          params:{
            reference:reference
          }
        }
      )
        .then((res) => res.json())
        .then((data) => {
          console.log('API Response:', data);

          if (data?.data?.jwtToken) {
            localStorage.setItem('UhuruMedToken', data.data.jwtToken);
            localStorage.setItem('userData', JSON.stringify(data.data));
            // Optional redirect:
            // navigate('/dashboard');
          } else {
            console.error('JWT Token not found in API response');
          }
        })
        .catch((error) => {
          console.error('Error calling API:', error);
        });
    } else {
      console.error('reference not found in URL');
    }
  }, [searchParams, navigate]);

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <div style={styles.icon}>
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
        </div>
        <h1 style={styles.heading}>Your payment has been received</h1>
        <p style={styles.paragraph}>
          Thank you for your payment. Your plan has been upgraded to premium!
        </p>
        {/* <button onClick={() => navigate("/dashboard")} style={styles.button}>
          Go to your dashboard
        </button> */}
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

export default PaymentSuccess;
