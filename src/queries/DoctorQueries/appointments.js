import ApiConfig from '@/ApiConfig/ApiConfig';
import { useAuthStore } from '@/stores/authStore';
import axiosApi from '@/utils/axiosApi';
import axios from 'axios';
import toast from 'react-hot-toast';


const { token } = useAuthStore.getState();

export const getAllAppointments = async (params = {}) => {
  try {
    const response = await axiosApi({
      method: 'GET',
      url: ApiConfig.doctorAppointmentList,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        limit: 13,
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

export const getAppointmentHistory = async (params = {}) => {
  try {
    const response = await axiosApi({
      method: 'GET',
      url: ApiConfig.doctorAppointmentList,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        status: 'COMPLETED',
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

export const getUpcomingAppointments = async () => {
  try {
    const response = await axiosApi({
      method: 'GET',
      url: ApiConfig.doctorAppointmentList,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        status: 'SCHEDULED',
        limit: 3,
      }
    });

    if (response?.data?.error === 'false') {
      return response.data.data.docs;
    }

    return [];
  } catch (error) {
    console.error('Error fetching upcoming appointments:', error);

    return [];
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

export const completeAppointment = async ({
  appointmentId,
  chiefComplaint = null,
  assessment = null,
  historyOfPresentIllness = null,
  plan = null,
  followUpInstructions = null,
  diagnosis = null,
  prescription = null,
  followUpNeeded = null,
  followUpDate = null,
  pdfUrl = null,
  labResultsUrl = null,
}) => {
  const token = window.localStorage.getItem('UhuruMedToken');

  const dataToSend = {
    appointmentId,
  };

  // Only add fields that are not null AND not undefined
  if (chiefComplaint !== null && chiefComplaint !== undefined) dataToSend.chiefComplaint = chiefComplaint;
  if (assessment !== null && assessment !== undefined) dataToSend.assessment = assessment;
  if (historyOfPresentIllness !== null && historyOfPresentIllness !== undefined) dataToSend.historyOfPresentIllness = historyOfPresentIllness;
  if (plan !== null && plan !== undefined) dataToSend.plan = plan;
  if (followUpInstructions !== null && followUpInstructions !== undefined) dataToSend.followUpInstructions = followUpInstructions;
  if (diagnosis !== null && diagnosis !== undefined) dataToSend.diagnosis = diagnosis;
  if (prescription !== null && prescription !== undefined) dataToSend.prescription = prescription;
  if (followUpNeeded !== null && followUpNeeded !== undefined) dataToSend.followUpNeeded = followUpNeeded;
  if (followUpDate !== null && followUpDate !== undefined) dataToSend.followUpDate = followUpDate;
  if (pdfUrl !== null && pdfUrl !== undefined && pdfUrl !== '') dataToSend.pdfUrl = pdfUrl;
  if (labResultsUrl !== null && labResultsUrl !== undefined && labResultsUrl !== '') dataToSend.labResultsUrl = labResultsUrl;

  console.log('Final dataToSend object:', dataToSend);

  try {
    const response = await axiosApi({
      method: 'POST',
      url: ApiConfig.DoctorMarked,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: dataToSend,
    });

    if (response?.data?.error === 'false') {
      toast.success(response.data.message || 'Data saved successfully!');

      return { success: true, data: response.data.data };
    } else {
      throw new Error(response?.data?.message || 'Failed to save data');
    }
  } catch (error) {
    console.error('Error saving data:', error);
    toast.error(error.response?.data?.message || error.message || 'Failed to save data.');

    return { success: false, error: error.response?.data?.message || error.message };
  }
};