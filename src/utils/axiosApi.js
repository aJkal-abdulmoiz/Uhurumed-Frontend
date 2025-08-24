import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/stores/authStore';

const axiosApi = axios.create();
const { handleTokenExpiration } = useAuthStore.getState();

// Request interceptor
axiosApi.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  
  // Add authorization header if token exists
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Add ngrok bypass header to prevent interstitial warning
  config.headers['ngrok-skip-browser-warning'] = 'true';
  
  // Alternatively, you can use a custom User-Agent
  // config.headers['User-Agent'] = 'MyApp/1.0';

  return config;
});

// Response interceptor
axiosApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (error.response?.data?.message === 'Your token has expired. Please login again') {
        
        toast.error('Your session has expired. Please login again.');
        
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        handleTokenExpiration();

      }
    }

    return Promise.reject(error);
  }
);

export default axiosApi;