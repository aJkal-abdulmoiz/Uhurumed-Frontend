import ApiConfig from '@/ApiConfig/ApiConfig';
import { useAuthStore } from '@/stores/authStore';
import axiosApi from '@/utils/axiosApi';

export const getDoctorPatients = async (params = {}) => {
  const { token } = useAuthStore.getState();
  try {
    const response = await axiosApi({
      method: 'GET',
      url: ApiConfig.doctorAppointmentList,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        limit: 3,
        ...params
      }
    });

    if (response?.data?.error === 'false') {
      return response.data.data.docs;
    }

    return [];
  } catch (error) {
    console.error('Error fetching appointment history:', error);

    return [];
  }
};
