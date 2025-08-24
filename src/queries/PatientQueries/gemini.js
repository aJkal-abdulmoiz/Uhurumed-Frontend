import ApiConfig from '@/ApiConfig/ApiConfig';
import { useAuthStore } from '@/stores/authStore';
import axiosApi from '@/utils/axiosApi';

export const ExtractWithGemini = async (transcript) => {
  const { token } = useAuthStore.getState();

  try {
    const response = await axiosApi({
      method: 'POST',
      url: ApiConfig.ExtractWithGemini,
      headers: {
        authorization: `Bearer ${token}`,
      },
      data: {
        transcript,
      },
    });

    console.log(response.data.keyNotes);

    return {
      success: true,
      keyNotes: response.data.keyNotes,
      message: response.data.message,
    };


  } catch (error) {
    console.error('Error sending transcript to Gemini:', error);

    return {
      success: false,
      keyNotes: null,
      message: error.response?.data?.message || 'An error occurred',
    };
  }
};