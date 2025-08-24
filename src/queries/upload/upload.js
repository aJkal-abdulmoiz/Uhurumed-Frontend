
import ApiConfig from '@/ApiConfig/ApiConfig';
import axiosApi from '@/utils/axiosApi';
import { useAuthStore } from '@/stores/authStore';


export const uploadFile = async (file, uploadingFor = 'user_image') => {

  const {token} = useAuthStore.getState();

  const formData = new FormData();
  formData.append('file', file);
  formData.append('uploadingFor', uploadingFor);


  try {
    const response = await axiosApi({
      method:'POST',
      url:ApiConfig.uploadFile,
      headers:{
        authorization: `Bearer ${token}`,
      },
      data:formData
    });



    if (response?.status === 200) {

      return {
        success: true,
        data: response.data.url,
        message: response.data.message
      };
    }

    return {
      success: false,
      data: [],
      message: response?.data?.message || 'Failed to upload image '
    };


  } catch (error) {
    console.error('Error uploading image :', error);

    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'An error occurred'
    };

  }

};