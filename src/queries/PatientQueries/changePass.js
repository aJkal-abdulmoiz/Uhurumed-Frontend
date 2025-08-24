import ApiConfig from '@/ApiConfig/ApiConfig';
import { useAuthStore } from '@/stores/authStore';
import axiosApi from '@/utils/axiosApi';

export const ChangePassword = async (oldPassword,password,confirmPassword) =>{

  const {token} = useAuthStore.getState(); 
  console.log(token);
  

  try {
    const response = await axiosApi({
      method:'POST',
      url:ApiConfig.changePassword,
      headers:{
        authorization: `Bearer ${token}`,
      },
      data:{
        oldPassword,
        password,
        confirmPassword
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
      message: response?.data?.message || 'Failed to change password'
    };


  } catch (error) {
    console.error('Error changing password:', error);

    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'An error occurred'
    };
    
  }

};  