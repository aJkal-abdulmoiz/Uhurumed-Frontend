// stores/authStore.js
import { create } from 'zustand';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';



const signupSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  country: Yup.string().required('Country is required'),
  countryCode: Yup.string().required('Country code is required'),
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  federalProgram: Yup.string().when('country', {
    is: 'United States',
    then: (schema) => schema.required('Federal program selection is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  certifyNoFederalProgram: Yup.boolean().when(['country', 'federalProgram'], {
    is: (country, federalProgram) =>
      country === 'United States' && federalProgram === 'none',
    then: (schema) =>
      schema.oneOf([true], 'You must certify this statement'),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export const useAuthStore = create(
  persist(
    (set, get) => ({
      formData: {
        email: '',
        phone: '',
        country: '',
        countryCode: '',
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: '',
        federalProgram: 'none',
        certifyNoFederalProgram: false,
        userType: 'USER'
      },

      errors: {},
      currentStep: 1,
      isAuthenticated: false,
      token: null,
      user: null,
      loading: false,
      paymentVerified:false,


      // Form data management
      setFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),
      setCurrentStep: (step) => set({ currentStep: step }),

      // Navigation
      gotoPreviousStep: () => set((state) => {
        if (state.currentStep === 3 && state.formData.country !== 'United States') {
          return { currentStep: 1 };
        }

        return { currentStep: Math.max(1, state.currentStep - 1) };
      }),

      // Validation
      validateCurrentStep: async () => {
        let stepSchema;
        const { formData } = get();

        switch(get().currentStep) {
        case 1:
          stepSchema = signupSchema.pick(['email', 'phone', 'country', 'countryCode']);
          break;
        case 2:
          stepSchema = signupSchema.pick(['federalProgram', 'certifyNoFederalProgram']);
          break;
        case 3:
          stepSchema = signupSchema.pick(['firstName', 'lastName', 'password', 'confirmPassword']);
          break;
        default:
          stepSchema = signupSchema;
        }

        try {
          await stepSchema.validate(formData, { abortEarly: false });
          set({ errors: {} });

          return true;
        } catch (err) {
          const errors = {};
          err.inner.forEach((error) => {
            errors[error.path] = error.message;
          });
          set({ errors });

          return false;
        }
      },

      // Authentication state
      setAuthData: (data) => {
        // Set token in cookie with 24-hour expiration
        if (data.token) {
          Cookies.set('UhuruAuthToken', data.token, { expires: 1 }); // 1 day expiration
        }

        return set({
          token: data.token,
          user: data.user,
          isAuthenticated: true,
          formData: {
            ...get().formData,
            userType: data.user?.userType || 'USER'
          }
        });
      },

      // Handle token expiration
      handleTokenExpiration: () => {
        Cookies.remove('UhuruAuthToken');
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          formData: {
            ...get().formData,
            email: '',
            phone: '',
            password: '',
            confirmPassword: ''
          }
        });
        toast.error('Your session has expired. Please login again.');
      },

      // Check if step 2 should be disabled (for US federal program selection)
      isStepTwoDisabled: () => {
        const { formData, currentStep } = get();
        if (currentStep === 2) {
          if (formData.country === 'United States') {
            if (formData.federalProgram === 'none') {
              return false;
            } else {
              return true;
            }
          }
        }

        return false;
      },

      setPaymentVerified: (value) => {
        set({ paymentVerified: value });
        localStorage.setItem('paymentVerified', JSON.stringify(value));
      },


      // Logout functionality
      logout: () => {
        // Remove token from cookies
        Cookies.remove('UhuruAuthToken');
        localStorage.removeItem('UhuruMedToken');
        localStorage.removeItem('auth-storage');
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          formData: {
            ...get().formData,
            email: '',
            phone: '',
            password: '',
            confirmPassword: ''
          }
        });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        paymentVerified: state.paymentVerified,
        formData: {
          userType: state.formData.userType,
          country: state.formData.country,
          phone: state.formData.phone,
          countryCode: state.formData.countryCode
        }
      })

    }
  )
);