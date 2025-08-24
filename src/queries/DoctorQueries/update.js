import axiosApi from '@/utils/axiosApi';
import ApiConfig from '@/ApiConfig/ApiConfig';
import { useAuthStore } from '@/stores/authStore';

 

export const updateProfile = async (updateValues) =>{

  const {token} = useAuthStore.getState(); 
  
  try {
    const response = await axiosApi({
      method:'PUT',
      url:ApiConfig.updateProfile,
      headers:{
        authorization: `Bearer ${token}`,
      },
      data:updateValues
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
      message: response?.data?.message || 'Failed to update profile'
    };


  } catch (error) {
    console.error('Error updating profile:', error);

    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'An error occurred'
    };
    
  }

};  