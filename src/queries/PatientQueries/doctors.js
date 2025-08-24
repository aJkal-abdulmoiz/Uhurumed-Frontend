import ApiConfig from '@/ApiConfig/ApiConfig';
import { useAuthStore } from '@/stores/authStore';
import axiosApi from '@/utils/axiosApi';

/**
 * Fetches all doctors with optional filters
 * @param {Object} filters - Filter options
 * @param {string} [filters.search] - Search term
 * @param {string} [filters.country] - Country filter
 * @param {string} [filters.specialization] - Country filter
 * @param {number} [filters.limit] - Number of results to return
 * @param {number} [filters.page] - Page number
 * @returns {Promise<{success: boolean, data: any, message: string}>}
 */
export const getAllDoctors = async (filters = {}) => {
  const { token } = useAuthStore.getState();
  
  try {
    const response = await axiosApi({
      method: 'GET',
      url: ApiConfig.doctoruserList,
      headers: {
        authorization: `Bearer ${token}`,
      },
      params: {
        // search: filters.search,
        country: filters.country,
        specialization: filters.specialization,
        limit: filters.limit,
        page: filters.page
      }
    });

    if (response?.data?.error === 'false') {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    }

    return {
      success: false,
      data: [],
      message: response?.data?.message || 'Failed to fetch doctors'
    };
  } catch (error) {
    console.error('Error fetching doctors:', error);

    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'An error occurred'
    };
  }
};


export const getDoctorSlots = async (doctorId) => {
  const { token } = useAuthStore.getState();
  
  try {
    const response = await axiosApi({
      method: 'GET',
      url: ApiConfig.doctorslotUser,
      headers: {
        authorization: `Bearer ${token}`,
      },
      params: {
        doctorId,
      },
    });

    if (response?.data?.error === 'false') {

      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    }
    

    return {
      success: false,
      data: [],
      message: response?.data?.message || 'Failed to fetch doctor slots'
    };
  } catch (error) {
    console.error('Error fetching doctor slots:', error);

    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'An error occurred while fetching slots'
    };
  }
};

/**
 * Fetches doctors who have/had appointments with the current patient
 * @param {string} patientId - ID of the current patient
 * @param {Object} [options] - Additional options
 * @param {boolean} [options.recentOnly=false] - Whether to return only recent 3 doctors
 * @returns {Promise<{success: boolean, data: any, message: string}>}
 */
export const getPatientDoctors = async (patientId, options = {}) => {
  const { token } = useAuthStore.getState();
  const { recentOnly = false } = options;
  
  try {
    const response = await axiosApi({
      method: 'GET',
      url: ApiConfig.patientDoctors,
      headers: {
        authorization: `Bearer ${token}`,
      },
      params: {
        patientId,
        limit: recentOnly ? 3 : undefined
      }
    });

    if (response?.data?.error === 'false') {


      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    }

    return {
      success: false,
      data: [],
      message: response?.data?.message || 'Failed to fetch patient doctors'
    };
  } catch (error) {
    console.error('Error fetching patient doctors:', error);

    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'An error occurred'
    };
  }
};