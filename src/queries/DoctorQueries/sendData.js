import axiosApi from '@/utils/axiosApi';


export const sendToBackend = async (audioBlob) => {
  const formData = new FormData();
  formData.append('audio', audioBlob);

  try {
    const response = await axiosApi('/api/transcribe', {
      method: 'POST',
      body: formData
    });
    const result = await response.json();
    console.log('Medical data:', result);
  } catch (error) {
    console.error('API error:', error);
  }
};
