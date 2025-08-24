import React, { useContext, useState, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ApiConfig from '../ApiConfig/ApiConfig';
import toast from 'react-hot-toast';
import { AuthContext } from '../Context/Auth';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { X } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState(new Array(6).fill(''));
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const auth = useContext(AuthContext);
  const inputsRef = useRef([]);

  const {
    checkLogin,
    getProfileData,
    setAuthData,
    setFormData,
    setIsLogin,
    token,
    user
  } = useAuthStore();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: (values) => {
      loginHandler(values);
    },
  });

  const loginHandler = async (values) => {
    setLoading(true);
    try {
      const response = await axios({
        method: 'POST',
        url: ApiConfig.login,
        data: {
          identity: values?.email,
          password: values?.password,
        },
      });


      if (response?.data?.error === 'false') {
        const data = response?.data?.data;
        if (data?.enabled2FA === 'true' && data?.verified2FA === 'true') {
          setOpen(true);
          setLoading(false);
          window.localStorage.setItem('UhuruMedToken', data?.token);
        } else {
          toast.success(response.data?.message);
          auth.checkLogin(data?.token);
          window.localStorage.setItem('UhuruMedToken', data?.token);
          window.localStorage.setItem('userData', JSON.stringify(data));
          auth.getProfileData();
          auth.setIsLogin(true);
          setLoading(false);
          setAuthData({
            token: data?.token,
            user: data
          });
          setFormData({
            ...data,
          });
          let path = '/dashboard';
          if (data?.userType === 'DOCTOR') path = '/doctor-dashboard';
          else if (data?.userType === 'USER') path = '/user-dashboard';

          setTimeout(() => {
            navigate(path);
          }, 2000);
        }
      } else {
        setLoading(false);
        toast.error(response.data?.message || 'Login failed');
      }
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
  };

  const onClose = () => {
    setOpen(false);
    setCode(new Array(6).fill(''));
    setError('');
  };

  const handleChange = (e, index) => {
    const val = e.target.value;
    if (/^\d?$/.test(val)) {
      const newCode = [...code];
      newCode[index] = val;
      setCode(newCode);
      setError('');

      if (val && index < 5) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (code[index]) {
        const newCode = [...code];
        newCode[index] = '';
        setCode(newCode);
        setError('');
      } else if (index > 0) {
        inputsRef.current[index - 1].focus();
      }
    }
  };

  const verify2FAHandler = async () => {
    const token = window.localStorage.getItem('UhuruMedToken');
    const enteredCode = code.join('');
    if (enteredCode.length !== 6) {
      setError('Code must be 6 digits');

      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        ApiConfig.verify2FA,
        { code: enteredCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.error === 'false') {
        const data = response?.data?.data;
        toast.success('Two-factor authentication successful');
        auth.checkLogin(response?.data?.data?.token);
        window.localStorage.setItem('UhuruMedToken', response?.data?.data?.token);
        window.localStorage.setItem('userData', JSON.stringify(response.data?.data));
        auth.getProfileData();
        auth.setIsLogin(true);
        setLoading(false);
        setOpen(false);
        setCode(new Array(6).fill(''));
        setError('');
        let path = '/dashboard';
        if (data?.userType === 'DOCTOR') path = '/doctor-dashboard';
        else if (data?.userType === 'USER') path = '/user-dashboard';

        setTimeout(() => {
          navigate(path);
        }, 2000);
      } else {
        setError(response.data.message || 'Invalid authentication code');
        setLoading(false);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Verification failed');
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    navigate('/signUp');
  };

  const handlePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="md:h-auto h-[85vh] md:w-[425px] w-full bg-white p-8 rounded-[30px] border border-[#0000004D] shadow-lg md:mt-0 mt-[62px]">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Please enter your <span className="text-[#3ea2dd]">Login</span> details
        </h2>

        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email"
              value={formik.values.email}
              onChange={formik.handleChange}
              className={`w-full p-2 rounded-md cursor-text outline-none transition-all duration-200  ${
                formik.touched.email && formik.errors.email ? 'border border-red-400 focus:border-red-400 focus:ring-1 focus:ring-red-400' : 'border border-[#0000004D] focus:border-[#3ea2dd] focus:ring-1 focus:ring-[#3ea2dd]' 
              }`}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={formik.values.password}
                onChange={formik.handleChange}
                className={`w-full p-2 rounded-md cursor-text outline-none transition-all duration-200  ${
                  formik.touched.password && formik.errors.password ? 'border border-red-400 focus:border-red-400 focus:ring-1 focus:ring-red-400' : 'border border-[#0000004D] focus:border-[#3ea2dd] focus:ring-1 focus:ring-[#3ea2dd]' 
                }`}
              />
              <button
                type="button"
                onClick={handlePassword}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.password}</p>
            )}
          </div>
          <div className='mt-12 flex justify-center items-center px-[50px]'>
            <button
              type="submit"
              disabled={loading}
              className="w-[80%] px-8 py-2 text-lg font-medium text-white bg-[#41a8eb] hover:bg-[#3b97da] cursor-pointer rounded-full transition-shadow duration-300 focus:outline-none hover:shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                Logging in...
                </div>
              ) : (
                'Login'
              )}
            </button>
          </div>
        </form>

        <p className="text-center text-gray-800 mt-4">
          New user?{' '}
          <button onClick={handleSignUp} className="text-[#3ea2dd] font-semibold hover:underline">
            Sign-Up
          </button>
        </p>
      </div>

      {/* 2FA Dialog */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-md w-full mx-4 overflow-hidden">
            <div className="relative p-6">
              <h3 className="text-xl font-bold text-center">Two-Factor Authentication</h3>
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="px-6 pb-4">
              <p className="text-gray-700 text-center mb-6">
                Enter the 6-digit code from Google Authenticator to verify.
              </p>

              <div className="flex justify-between max-w-xs mx-auto mb-6">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputsRef.current[index] = el)}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className={`w-12 h-12 text-2xl text-center border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      error ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                ))}
              </div>

              {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

              <button
                onClick={verify2FAHandler}
                disabled={loading}
                className="w-full py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition duration-300 disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </div>
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;