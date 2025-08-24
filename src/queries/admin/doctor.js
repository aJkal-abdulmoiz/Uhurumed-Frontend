import ApiConfig from '@/ApiConfig/ApiConfig';
import axiosApi from '@/utils/axiosApi';

/**
 * Creates a new doctor (admin only)
 * @param {Object} doctorData - Doctor details
 * @param {string} doctorData.firstName - First name
 * @param {string} doctorData.lastName - Last name
 * @param {string} doctorData.email - Email
 * @param {string} doctorData.phone - Phone number
 * @param {string} doctorData.countryCode - Country code
 * @param {string} doctorData.password - Password
 * @param {string} doctorData.specialization - Specialization
 * @param {string} doctorData.licenseNumber - License number
 * @param {number} doctorData.experience - Years of experience
 * @param {string} doctorData.bio - Biography
 * @param {number} doctorData.consultationFee - Consultation fee
 * @param {string} [doctorData.qualification] - Qualifications
 * @param {string} [doctorData.department] - Department
 * @param {string} [doctorData.dateOfBirth] - Date of birth (YYYY-MM-DD)
 * @param {string} [doctorData.address] - Address
 * @param {string} [doctorData.country] - Country
 * @param {string} [doctorData.profilePic] - Profile picture URL
 * @param {string} [doctorData.gender] - Gender
 * @returns {Promise<{success: boolean, data: any, message: string}>}
 */
export const createDoctor = async (doctorData) => {
  const token = localStorage.getItem('UhuruMedToken');
  
  try {
    const response = await axiosApi({
      method: 'POST',
      url: ApiConfig.doctorAdd,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: doctorData
    });

    if (response?.data?.error === 'false') {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Doctor created successfully'
      };
    }

    return {
      success: false,
      data: null,
      message: response?.data?.message || 'Failed to create doctor'
    };
  } catch (error) {
    console.error('Error creating doctor:', error);

    return {
      success: false,
      data: null,
      message: error.response?.data?.message || 'An error occurred while creating doctor'
    };
  }
};