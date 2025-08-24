import axios from 'axios';
import toast from 'react-hot-toast';
import ApiConfig from '../ApiConfig/ApiConfig';






export const postDataHandler = async (endPoint, data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: ApiConfig[endPoint],
      data: data,
    });

    if (res.data.responseCode === 200) {
      toast.success(res.data.responseMessage);

      return res.data;
    } else {
      toast.error(res.data.responseMessage);

      return res;
    }
  } catch (error) {
    if (error.response) {
      toast.error('An error occurred while processing your request.');

      return error.response;
    } else {
      toast.error('An unexpected error occurred.');

      return error;
    }
  }
};

export const postDataHandlerWithToken = async (endpoint, data, headers) => { //done by me
  try {
    // Create a FormData object
    const formData = new FormData();
    formData.append('newPassword', data.newPassword);  // Add newPassword to formData

    // Perform the fetch request
    const response = await fetch('http://192.168.1.12:1925/api/v1/admin/resetPassword/', {
      method: 'PUT',
      headers: {
        ...headers,  // Include token in the headers
        // No need for Content-Type when using FormData
      },
      body: formData,  // Use formData for the request body
    });

    // Check if the response is ok
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.responseMessage || 'An error occurred');
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('Service error:', error);
    throw error;
  }
};




export const getDataHandlerWithToken = async (endPoint, data) => {
  console.log('ADfasdfsadf');
  try {
    const token = window.localStorage.getItem('UhuruMedToken');
    const res = await axios({
      method: 'GET',
      url: ApiConfig[endPoint],
      headers: {
        authorization: `Bearer ${token}`,
      },
      data: data,
    });
    if (res.data.error === 'false') {
      return res.data?.data;
    } else {
      return res;
    }
  } catch (error) {
    console.log(error);
  }
};

export const getDataHandlerWithTokenAuthSection = async (endPoint, data) => {
  try {
    const res = await axios({
      method: 'POST',
      url: ApiConfig[endPoint],
      headers: {
        token: sessionStorage.getItem('UhuruMedToken'),
      },
      params: {
        page:1,
        limit:100
      },
    });
    if (res.data.responseCode === 200) {
      return res.data;
    } else {
      return res;
    }
  } catch (error) {
    console.log(error);
  }
};

export const putDataHandler = async (endPoint, data) => {
  try {
    const res = await axios({
      method: 'PUT',
      url: ApiConfig[endPoint],

      data: data,
    });
    if (res.data.responseCode === 200) {
      return res.data;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    if (error.response) {
      return error.response;
    
    }
  }
};

export const putDataHandlerWithToken = async (endPoint, data) => {
  try {
    const res = await axios({
      method: 'PUT',
      url: ApiConfig[endPoint],
      headers: {
        token: sessionStorage.getItem('UhuruMedToken'),
      },
      data: data,
    });
    if (res.data.responseCode === 200) {
      return res.data;
    } else {
      return res;
    }
  } catch (error) {
    console.log(error);
    if (error.response) {
      return error.response;
    }
  }
};

export const deleteDataHandler = async (endPoint, data) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: ApiConfig[endPoint],
      data: data,
    });
    if (res.data.responseCode === 200) {
      return res.data;
    } else {
      return res;
    }
  } catch (error) {
    console.log(error);
  }
};

export const patchDataHandler = async (endPoint, data) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: ApiConfig[endPoint],
      data: data,
    });
    if (res.data.responseCode === 200) {
      toast.success(res.data.responseMessage);

      return res.data;
    } else {
      toast.error(res.data.responseMessage);

      return res;
    }
  } catch (error) {
    if (error.response) {
      return error.response;
    }
    console.log(error);
  }
};

export const patchTokenDataHandler = async (endPoint, data) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: ApiConfig[endPoint],
      headers: {
        token: sessionStorage.getItem('UhuruMedToken'),
      },
      data: data,
    });
    if (res.data.responseCode === 200) {
      toast.success(res.data.responseMessage);

      return res.data;
    } else {
      toast.error(res.data.responseMessage);

      return res;
    }
  } catch (error) {
    if (error.response) {
      return error.response;
    }
    console.log(error);
  }
};
