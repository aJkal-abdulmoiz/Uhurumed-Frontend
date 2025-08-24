import React, { useState } from 'react';
import { createDoctor } from '@/queries/admin/doctor';
import { CountryFlag } from '@/Context/CountryFlag';
import Select from 'react-select';
import { toast } from 'react-hot-toast';

const genderOptions = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' }
];

const specialityOptions = [
  { value: 'General & Primary Care', label: 'General & Primary Care' },
  { value: 'Surgical Specialties', label: 'Surgical Specialties' },
  { value: 'Specialized Care', label: 'Specialized Care' },
  { value: 'Sensory and Neurological Systems', label: 'Sensory and Neurological Systems' },
  { value: 'Diagnostic & Lab-Based', label: 'Diagnostic & Lab-Based' },
  { value: 'Mental Health', label: 'Mental Health' },
  { value: 'Women’s and Reproductive Health', label: 'Women’s and Reproductive Health' },
  { value: 'Other', label: 'Other' }
];

const departmentOptions = [
  { value: 'Internal Medicine', label: 'Internal Medicine' },
  { value: 'Obesity Medicine & Weight Management', label: 'Obesity Medicine & Weight Management' },
  { value: 'Specialist Consultations', label: 'Specialist Consultations' },
  { value: 'Urgent Care & Sick Visits', label: 'Urgent Care & Sick Visits' },
  { value: 'Annual Physicals (Free for UhuruCare Members)', label: 'Annual Physicals (Free for UhuruCare Members)' }
];
  
const DoctorCreateForm = ({ onSuccess }) => {

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

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    countryCode: '',
    password: '',
    specialization: '',     
    licenseNumber: '',
    experience: '',
    bio: '',
    consultationFee: '',
    qualification: '',
    department: '',
    dateOfBirth: '',
    address: '',
    country: '',
    profilePic: '',
    gender: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, selectedOption) => {
    setFormData(prev => ({
      ...prev,
      [name]: selectedOption ? selectedOption.value : ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    if (!formData.countryCode) newErrors.countryCode = 'Country code is required';
    if (!formData.password || formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.specialization) newErrors.specialization = 'Specialization is required';
    if (!formData.licenseNumber) newErrors.licenseNumber = 'License number is required';
    if (!formData.experience || isNaN(formData.experience)) newErrors.experience = 'Valid experience is required';
    if (!formData.bio) newErrors.bio = 'Bio is required';
    if (!formData.consultationFee || isNaN(formData.consultationFee)) newErrors.consultationFee = 'Valid fee is required';
    
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const response = await createDoctor(formData);
      if (response.success) {
        toast.success(response.message);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          countryCode: '',
          password: '',
          specialization: '',
          licenseNumber: '',
          experience: '',
          bio: '',
          consultationFee: '',
          qualification: '',
          department: '',
          dateOfBirth: '',
          address: '',
          country: '',
          profilePic: '',
          gender: ''
        });
        if (onSuccess) onSuccess(response.data);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('An error occurred while creating doctor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-[80px]">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Doctor</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                type="text"
                className={`w-full px-3 py-2 border rounded-md ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                type="text"
                className={`w-full px-3 py-2 border rounded-md ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                type="email"
                className={`w-full px-3 py-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country Code</label>
                <Select
                  options={countryOptions}
                  onChange={(selected) => handleSelectChange('countryCode', selected)}
                  className="basic-single"
                  classNamePrefix="select"
                  placeholder="Select country"
                />
                {errors.countryCode && <p className="text-red-500 text-xs mt-1">{errors.countryCode}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  type="text"
                  className={`w-full px-3 py-2 border rounded-md ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                type="password"
                className={`w-full px-3 py-2 border rounded-md ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
          </div>

          {/* Professional Info */}
          <div className="space-y-4">
            <Select
              value={specialityOptions.find(option => option.value === formData.specialization)}
              onChange={(selectedOption) => handleSelectChange('specialization', selectedOption)}
              options={specialityOptions}
              isClearable={true}
              placeholder="Select Speciality"
              classNames={{
                // ... your existing classNames
              }}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
              <input
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleInputChange}
                type="text"
                className={`w-full px-3 py-2 border rounded-md ${errors.licenseNumber ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.licenseNumber && <p className="text-red-500 text-xs mt-1">{errors.licenseNumber}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label>
              <input
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                type="number"
                min="0"
                className={`w-full px-3 py-2 border rounded-md ${errors.experience ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee</label>
              <input
                name="consultationFee"
                value={formData.consultationFee}
                onChange={handleInputChange}
                type="number"
                min="0"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-md ${errors.consultationFee ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.consultationFee && <p className="text-red-500 text-xs mt-1">{errors.consultationFee}</p>}
            </div>
          </div>
        </div>

        {/* Additional Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
            <input
              name="qualification"
              value={formData.qualification}
              onChange={handleInputChange}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <Select
              value={departmentOptions.find(option => option.value === formData.department)}
              onChange={(selectedOption) => handleSelectChange('department', selectedOption)}
              options={departmentOptions}
              isClearable={true}
              placeholder="Select Department"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <Select
              options={genderOptions}
              onChange={(selected) => handleSelectChange('gender', selected)}
              className="basic-single"
              classNamePrefix="select"
              placeholder="Select gender"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <Select
              options={countryOptions}
              onChange={(selected) => handleSelectChange('country', selected)}
              className="basic-single"
              classNamePrefix="select"
              placeholder="Select country"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture URL</label>
            <input
              name="profilePic"
              value={formData.profilePic}
              onChange={handleInputChange}
              type="url"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows="3"
              className={`w-full px-3 py-2 border rounded-md ${errors.bio ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio}</p>}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Doctor'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DoctorCreateForm;