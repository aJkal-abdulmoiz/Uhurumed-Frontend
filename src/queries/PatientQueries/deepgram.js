import ApiConfig from '@/ApiConfig/ApiConfig';
import { useAuthStore } from '@/stores/authStore';
import { uploadFile } from '../upload/upload';
import axios from 'axios';

export const uploadAudioToDeepgram = async (audioBlob, appointmentId) => {
  const { token } = useAuthStore.getState();
  
  if (!audioBlob || audioBlob.size === 0) {
    console.error('Invalid audio blob:', audioBlob);
    throw new Error('No audio data recorded');
  }

  const file = new File([audioBlob], `recording-${appointmentId}-${Date.now()}.wav`, { 
    type: 'audio/wav'
  });

  try {
    const uploadResult = await uploadFile(file, `consultation_recording-${appointmentId}`);
    
    if (!uploadResult.success) {
      console.error('S3 upload failed:', uploadResult);
      throw new Error(uploadResult.message || 'Failed to upload to S3');
    }
    
    const audioUrl = uploadResult.data;

    const response = await axios.post(
      `${ApiConfig.uploadToDeepgram}`,
      { 
        audioUrl,
        appointmentId
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    
    console.log('Deepgram processing completed',response.data.transcript);

    return response.data.transcript;
  } catch (error) {
    console.error('Processing pipeline failed:', {
      error: error.response?.data || error.message,
      stack: error.stack
    });
    throw error;
  }
};