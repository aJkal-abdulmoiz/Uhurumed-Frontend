import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';
import ApiConfig from '@/ApiConfig/ApiConfig';

export const initializePayment = async (appointmentId,method) => {
  const { token } = useAuthStore.getState();
  console.log(method);
  
  
  try {
    const response = await axios.post(
      `${ApiConfig.appointmentPaymentInitialize}`,
      {
        appointmentId,
        paymentGateway: method ?? 'PAYSTACK' 

      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return {
      success: true,
      data: response.data.data,
      paymentUrl: response.data.data.paymentUrl
    };
  } catch (error) {
    console.error('Payment initialization error:', error);

    return {
      success: false,
      message: error.response?.data?.message || 'Payment initialization failed'
    };
  }
};

export const verifyPayment = async (appointmentId) => {
  const { token } = useAuthStore.getState();

  try {
    const response = await axios.get(
      `${ApiConfig.appointmentPaymentVerify}`,
      {
        params: { appointmentId },
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    return {
      success: true,
      data: response.data.data,
      isPaid: response.data.data.status === 'SCHEDULED'
    };
  } catch (error) {
    console.error('Payment verification error:', error);

    return {
      success: false,
      message: error.response?.data?.message || 'Payment verification failed'
    };
  }
};