import ApiConfig from '@/ApiConfig/ApiConfig';
import { useAuthStore } from '@/stores/authStore';
import axiosApi from '@/utils/axiosApi';

export const getDoctorSlots = async (params = {}) => {
  const { token } = useAuthStore.getState();
  
  try {
    const response = await axiosApi({
      method: 'GET',
      url: ApiConfig.listDoctorSlot,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page: 1,
        limit: 10,
        ...params
      }
    });

    if (response?.data?.error === 'false') {
      return response.data.data;
    }
    console.log(response);

    return { docs: [], total: 0 };
  } catch (error) {
    console.error('Error fetching doctor slots:', error);

    return { docs: [], total: 0 };
  }
};

export const createDoctorSlot = async (slotData) => {
  const { token } = useAuthStore.getState();
  
  try {
    const response = await axiosApi({
      method: 'POST',
      url: ApiConfig.createDoctorSlot,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: slotData
    });

    if (response?.data?.error === 'false') {
      return response.data.data;
    }
    
    throw new Error(response?.data?.message || 'Failed to create slot');
  } catch (error) {
    console.error('Error creating doctor slot:', error);
    throw error;
  }
};

export const deleteDoctorSlot = async (slotId) => {
  const { token } = useAuthStore.getState();
  
  try {
    const response = await axiosApi({
      method: 'DELETE',
      url: ApiConfig.deleteDoctorSlot,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        id: slotId
      }
    });

    if (response?.data?.error === 'false') {
      return response.data.data;
    }
    
    throw new Error(response?.data?.message || 'Failed to delete slot');
  } catch (error) {
    console.error('Error deleting doctor slot:', error);
    throw error;
  }
};

export const editDoctorSlot = async (slotData,id) => {  
  const { token } = useAuthStore.getState();
  console.log(id);
  
  
  try {
    const response = await axiosApi({
      method: 'PUT',
      url: ApiConfig.editDoctorSlot,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        id:id
      },
      data: slotData
    });

    if (response?.data?.error === 'false') {
      return response.data.data;
    }
    
    throw new Error(response?.data?.message || 'Failed to edit slot');
  } catch (error) {
    console.error('Error editing doctor slot:', error);
    throw error;
  }
};