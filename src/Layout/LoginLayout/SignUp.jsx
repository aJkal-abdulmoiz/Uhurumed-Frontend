'use client';

// components/SignUpForm.jsx
import React, { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Select from 'react-select';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import ApiConfig from '@/ApiConfig/ApiConfig';
import axios from 'axios';

const getSelectStyles = (hasError) => ({
  control: (provided, state) => ({
    ...provided,
    backgroundColor: 'white',
    border: hasError ? '1px solid #f87171' : '1px solid rgba(0, 0, 0, 0.3)',
    borderRadius: '6px',
    padding: '2px 4px',
    cursor: 'pointer',
    boxShadow: state.isFocused ? (hasError ? '0 0 0 1px #f87171' : '0 0 0 1px #3ea2dd') : 'none',
    '&:hover': {
      borderColor: hasError ? '#f87171' : '#3ea2dd',
    },
    transition: 'border-color 0.2s, box-shadow 0.2s',
  }),
  option: (provided, state) => ({
    ...provided,
    cursor: 'pointer',
    backgroundColor: state.isSelected ? '#3ea2dd' : state.isFocused ? '#e1f3fb' : 'white',
    color: state.isSelected ? 'white' : '#333',
    '&:hover': {
      backgroundColor: '#e1f3fb',
      color: '#333',
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#333',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#999',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
    maxHeight: 160,
    overflowY: 'auto',
  }),
});

import { CountryFlag } from '@/Context/CountryFlag';

const countryOptions = CountryFlag.map((country) => ({
  value: country.name,
  label: (
    <div className="flex items-center gap-2">
      <img
        src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`}
        alt={country.name}
        className="w-5 h-4 object-cover rounded-sm"
      />
      <span>{country.name}</span>
    </div>
  ),
}));

const Step1 = () => {
  const { formData, setFormData, errors } = useAuthStore();
  useEffect(() => {
    console.log(formData);
  }, [formData]);

  // Regular input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Country select change handler
  const handleCountryChange = (selectedOption) => {
    if (selectedOption) {
      setFormData({
        ...formData,
        country: selectedOption.label.props.children[1].props.children,
        // countryCode: selectedOption.value
      });
    }
  };

  const handlePhoneChange = (phone, country) => {
    setFormData({
      ...formData,
      phone: phone,
      countryCode: country.dialCode,
    });
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full p-2 rounded-md cursor-text outline-none transition-all duration-200 ${
            errors.email
              ? 'border border-red-400 focus:border-red-400 focus:ring-1 focus:ring-red-400'
              : 'border border-[#0000004D] focus:border-[#3ea2dd] focus:ring-1 focus:ring-[#3ea2dd]'
          }`}
          placeholder="john@example.com"
          required
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" className="text-red-500 text-xs mt-1" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
        <div className="w-full">
          <Select
            options={countryOptions}
            value={countryOptions.find((option) => option.value === formData.country)}
            onChange={handleCountryChange}
            styles={getSelectStyles(!!errors.country)}
            placeholder="Select your country"
            isSearchable
          />
          {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
        <div className="relative w-full">
          <PhoneInput
            country={formData.countryCode?.toLowerCase() || 'gh'}
            value={formData.phone}
            onChange={(phone, country) => handlePhoneChange(phone, country)}
            inputProps={{
              name: 'phone',
              required: true,
            }}
            containerClass="react-tel-input"
            inputClass={`!w-full !h-[40px] pl-12 pr-3 py-2 text-sm rounded-md outline-none transition-all duration-200 ${
              errors.phone
                ? '!border-red-400 focus:border-red-400 focus:ring-1 focus:ring-red-400'
                : '!border-[#0000004D] focus:!border-[#3ea2dd] focus:ring-1 focus:ring-[#3ea2dd]'
            }`}
            buttonClass={`absolute left-0 top-0 h-full bg-white border-r rounded-l-md px-2 transition-all duration-200 ${
              errors.phone ? '!border-red-400' : 'border-[#0000004D] hover:border-[#6dbbeb]'
            }`}
            dropdownClass="w-full"
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>
      </div>
    </div>
  );
};

const Step2 = () => {
  const { formData, setFormData, errors } = useAuthStore();
  useEffect(() => {
    console.log(formData);
  }, [formData]);
  const handleChange = (e) => {
    setFormData({ [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setFormData({ [e.target.name]: e.target.checked });
  };

  // Only show Step2 if user is from United States
  if (formData.country !== 'United States') {
    return null;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-3 text-gray-900">
        Federal Program Eligibility Check (U.S. Patients Only)
      </h3>
      <p className="mb-3">Are you enrolled in any of the following?</p>

      <div className="space-y-2">
        <label className="flex items-center">
          <input
            type="radio"
            name="federalProgram"
            value="medicare"
            checked={formData.federalProgram === 'medicare'}
            onChange={handleChange}
            className="mr-2 cursor-pointer"
          />
          Medicare (including Medicare Advantage)
        </label>

        <label className="flex items-center">
          <input
            type="radio"
            name="federalProgram"
            value="medicaid"
            checked={formData.federalProgram === 'medicaid'}
            onChange={handleChange}
            className="mr-2 cursor-pointer"
          />
          Medicaid
        </label>

        <label className="flex items-center">
          <input
            type="radio"
            name="federalProgram"
            value="tricare"
            checked={formData.federalProgram === 'tricare'}
            onChange={handleChange}
            className="mr-2 cursor-pointer"
          />
          TRICARE / VA Health
        </label>

        <label className="flex items-center mb-4">
          <input
            type="radio"
            name="federalProgram"
            value="none"
            checked={formData.federalProgram === 'none'}
            onChange={handleChange}
            className="mr-2 cursor-pointer"
          />
          None of the above
        </label>

        {errors.federalProgram && <p className="text-red-500 text-sm">{errors.federalProgram}</p>}
      </div>

      {['medicare', 'medicaid', 'tricare'].includes(formData.federalProgram) && (
        <div className="mt-3 p-3 bg-red-100 rounded text-red-700">
          UhuruMed is a private cash-only medical service. Due to federal regulations, we cannot offer services to
          patients enrolled in Medicare, Medicaid, or other U.S. government insurance programs. Please seek care through
          your government-provided coverage.
        </div>
      )}

      {formData.federalProgram === 'none' && (
        <div className="mt-4">
          <label className="flex items-start">
            <input
              type="checkbox"
              name="certifyNoFederalProgram"
              checked={formData.certifyNoFederalProgram}
              onChange={handleCheckboxChange}
              className="mt-1 mr-2"
            />
            <span className="text-sm">
              I certify that I am not a beneficiary of any U.S. federal health insurance program (Medicare, Medicaid,
              TRICARE, VA). I understand UhuruMed is a private-pay service and no insurance will be billed.
            </span>
          </label>
          {errors.certifyNoFederalProgram && (
            <p className="text-red-500 text-sm mt-1">{errors.certifyNoFederalProgram}</p>
          )}
        </div>
      )}
    </div>
  );
};

const Step3 = () => {
  const { formData, setFormData, errors } = useAuthStore();

  const handleChange = (e) => {
    setFormData({ [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-4">
      {/* First Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="John"
          className={`w-full p-2 rounded-md cursor-text outline-none transition-all duration-200 ${
            errors.firstName
              ? 'border border-red-400 focus:border-red-400 focus:ring-1 focus:ring-red-400'
              : 'border border-[#0000004D] focus:border-[#3ea2dd] focus:ring-1 focus:ring-[#3ea2dd]'
          }`}
        />
        {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
      </div>

      {/* Last Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Doe"
          className={`w-full p-2 rounded-md cursor-text outline-none transition-all duration-200 ${
            errors.lastName
              ? 'border border-red-400 focus:border-red-400 focus:ring-1 focus:ring-red-400'
              : 'border border-[#0000004D] focus:border-[#3ea2dd] focus:ring-1 focus:ring-[#3ea2dd]'
          }`}
        />
        {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="At least 6 characters"
          className={`w-full p-2 rounded-md cursor-text outline-none transition-all duration-200 ${
            errors.password
              ? 'border border-red-400 focus:border-red-400 focus:ring-1 focus:ring-red-400'
              : 'border border-[#0000004D] focus:border-[#3ea2dd] focus:ring-1 focus:ring-[#3ea2dd]'
          }`}
        />
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
          className={`w-full p-2 rounded-md cursor-text outline-none transition-all duration-200 ${
            errors.confirmPassword
              ? 'border border-red-400 focus:border-red-400 focus:ring-1 focus:ring-red-400'
              : 'border border-[#0000004D] focus:border-[#3ea2dd] focus:ring-1 focus:ring-[#3ea2dd]'
          }`}
        />
        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
      </div>
    </div>
  );
};

const SignUpForm = () => {
  const { currentStep, setCurrentStep, formData, validateCurrentStep, gotoPreviousStep } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const navigate = useNavigate();

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (!isValid) return;

    // Skip step 2 if not US
    if (currentStep === 1 && formData.country !== 'United States') {
      setCurrentStep(3);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const signupData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        countryCode: formData.countryCode,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        userType: 'USER',
      };

      const response = await axios({
        method: 'POST',
        url: ApiConfig.signup,
        data: signupData,
      });

      if (response?.data?.error === 'false') {
        toast.success(response.data?.message);

        localStorage.setItem('UhuruMedToken', response?.data?.data?.token);
        localStorage.setItem('userData', JSON.stringify(response.data?.data));

        useAuthStore.getState().setAuthData({
          token: response?.data?.data?.token,
          user: response.data?.data,
          isAuthenticated: true,
        });

        navigate('/user-dashboard');
      } else {
        toast.error(response?.data?.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error?.response?.data?.message || 'An error occurred during signup');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
    case 1:
      return <Step1 />;
    case 2:
      return <Step2 />;
    case 3:
      return <Step3 />;
    default:
      return <Step1 />;
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const isDisabled = useAuthStore((state) => state.isStepTwoDisabled());

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="md:h-auto h-[85vh] md:w-[425px] w-full bg-white p-8 rounded-[30px] border border-[#0000004D] shadow-lg md:mt-0 mt-[62px]">
        <div className="relative flex items-center justify-center mb-6">
          {currentStep > 1 && (
            <button className="absolute left-0" onClick={gotoPreviousStep}>
              ←
            </button>
          )}
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Create a new <span className="text-[#3ea2dd]">Account</span>
          </h2>
        </div>

        {renderStep()}

        <div className="mt-12 flex justify-center items-center px-[50px]">
          {currentStep < (formData.country === 'United States' ? 3 : 2) ? (
            <button
              type="button"
              disabled={isDisabled}
              onClick={handleNext}
              className={`w-full px-8 py-2 text-lg font-medium text-white ${isDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#41a8eb] hover:bg-[#3b97da] cursor-pointer'} rounded-full transition-shadow duration-300 focus:outline-none hover:shadow-lg`}
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full px-8 py-2 text-lg font-medium text-white bg-[#41a8eb] hover:bg-[#3b97da] cursor-pointer rounded-full transition-shadow duration-300 focus:outline-none hover:shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing Up...
                </span>
              ) : (
                'Sign Up'
              )}
            </button>
          )}
        </div>

        <div className="mt-4 text-center text-sm text-gray-600 cursor-pointer">
          Already have an account?{' '}
          <span onClick={handleLogin} className="text-[#3ea2dd] font-semibold hover:underline">
            Log In
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
