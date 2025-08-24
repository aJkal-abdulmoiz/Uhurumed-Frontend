import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API_BASE_URL } from '../../ApiConfig/ApiConfig';
import Btn from '../../CommonComponenet/CommonButtons/Btn';
import { useAuthStore } from '../../stores/authStore';

const PaymentVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setPaymentVerified } = useAuthStore();


  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get('reference');

      if (!reference) {
        setError('Reference not found in URL');
        setIsLoading(false);

        return;
      }

      try {
        const token = window.localStorage.getItem('UhuruMedToken');
        setIsLoading(true);

        const response = await fetch(
          `${API_BASE_URL}/api/v1/appointment/payment/verify?reference=${reference}&provider=PAYSTACK`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );


        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Payment verification failed');
        }

        if (data?.data?.token) {
          localStorage.setItem('UhuruMedToken', data.data.token);
        }


        
      } catch (err) {
        setError(err.message || 'Error verifying payment');
      } finally {
        setIsLoading(false);

        setPaymentVerified(true);
      }
    };
    

    verifyPayment();
  }, [searchParams, setPaymentVerified]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          {isLoading ? (
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          ) : error ? (
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <svg 
                className="w-10 h-10 text-red-500" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <svg 
                className="w-10 h-10 text-green-500" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
          )}
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          {isLoading 
            ? 'Verifying payment...' 
            : error 
              ? 'Payment Failed'
              : 'Appointment Confirmed!'}
        </h1>
        
        <p className="text-gray-600 mb-6">
          {isLoading 
            ? 'Please wait while we verify your payment' 
            : error
              ? error
              : 'Thank you for your payment. Your doctor\'s appointment has been successfully booked!'}
        </p>

        <div className="mt-4">
          <Btn 
            label={error ? 'Try Again' : 'Okay'} 
            onClick={() => error ? window.location.reload() :  window.close()} 
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentVerification;