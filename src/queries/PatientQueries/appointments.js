import ApiConfig from '@/ApiConfig/ApiConfig';
import { useAuthStore } from '@/stores/authStore';
import axiosApi from '@/utils/axiosApi';

export const getAppointments = async (filters = {}) => {
  const { token } = useAuthStore.getState();
  
  try {
    const response = await axiosApi({
      method: 'GET',
      url: ApiConfig.appointmentUserList,
      headers: {
        authorization: `Bearer ${token}`,
      },
      params: {
        status: filters.status,
        fromDate: filters.fromDate,
        toDate: filters.toDate,
        type: filters.type,
        page: filters.page,
        limit: filters.limit,
        search: filters.search,
      },
    });

    if (response?.data?.error === 'false') {


      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }

    return {
      success: false,
      data: [],
      message: response?.data?.message || 'Failed to fetch appointments',
    };
  } catch (error) {
    console.error('Error fetching appointments:', error);

    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'An error occurred',
    };
  }
};

export const cancelAppointment = async (appointmentId, reason) => {
  const { token } = useAuthStore.getState();
  
  try {
    const response = await axiosApi({
      method: 'POST',
      url: ApiConfig.Appointcancel,
      headers: {
        authorization: `Bearer ${token}`,
      },
      data: {
        appointmentId,
        reason: reason || 'Unable to attend due to emergency',
      },
    });

    if (response?.data?.error === 'false') {
      return {
        success: true,
        message: response.data.message,
      };
    }

    return {
      success: false,
      message: response?.data?.message || 'Failed to cancel appointment',
    };
  } catch (error) {
    console.error('Error cancelling appointment:', error);

    return {
      success: false,
      message: error.response?.data?.message || 'An error occurred',
    };
  }
};

export const bookAppointment = async (bookingData) => {
  const { token } = useAuthStore.getState();
  
  try {
    const response = await axiosApi({
      method: 'POST',
      url: ApiConfig.appointmentBook,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: bookingData
    });

    if (response?.data?.error === false || response?.data?.error === 'false') {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Appointment booked successfully'
      };
    }

    return {
      success: false,
      data: null,
      message: response?.data?.message || 'Failed to book appointment'
    };
  } catch (error) {
    console.error('Booking error:', error);

    return {
      success: false,
      data: null,
      message: error.response?.data?.message || 
             error.message || 
             'An error occurred while booking appointment'
    };
  }
};


export const getUpcomingAppointments = async (limit = 3) => {
  const { token } = useAuthStore.getState();
  
  try {
    const response = await axiosApi({
      method: 'GET',
      url: ApiConfig.appointmentUserList,
      headers: {
        authorization: `Bearer ${token}`,
      },
      params: {
        status: 'SCHEDULED',
        fromDate: new Date().toISOString(),
        limit,
      },
    });

    if (response?.data?.error === 'false') {
      return {
        success: true,
        data: response.data.data,
      };
    }

    return {
      success: false,
      data: [],
    };
  } catch (error) {
    console.error('Error fetching upcoming appointments:', error);

    return {
      success: false,
      data: [],
    };
  }
};