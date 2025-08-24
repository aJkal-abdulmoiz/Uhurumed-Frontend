import { useState, useEffect } from 'react';
import { UploadDocumentModal } from '../../NewComponents/userDashboard/UploadModal';
import { ChangePasswordModal } from '../../NewComponents/userDashboard/ChangePassModal';
import { EditProfileModal } from '../../NewComponents/userDashboard/EditProfileModal';
import { useProfileStore } from '../../stores/ProfileStore';
import { uploadFile } from '@/queries/upload/upload';
import { useAuthStore } from '@/stores/authStore';
import { updateProfile } from '@/queries/DoctorQueries/update';

export default function SettingsPage() {
  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    bloodGroup,
    setBloodGroup,
    gender,
    setGender,
    policyNo,
    setPolicyNo,
    phone,
    setPhone,
    dateOfBirth,
    setDateOfBirth,
    address,
    setAddress,
    nationality,
    setNationality,
    country,
    setCountry,
    language,
    setLanguage,
    lastSavedState,
    saveAllProfileData,
    discardChanges,
    setProfileData,
    profilePic,
    setProfilePic
  } = useProfileStore();

  const [profileImage, setProfileImage] = useState('/placeholder.svg?height=120&width=120');
  const [originalProfileImage, setOriginalProfileImage] = useState('/placeholder.svg?height=120&width=120');
  const [hasChanges, setHasChanges] = useState(false);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  const { user } = useAuthStore.getState();

  useEffect(() => {
    const currentProfile = {
      firstName,
      lastName,
      email,
      bloodGroup,
      gender,
      policyNo,
      phone,
      dateOfBirth,
      address,
      nationality,
      country,
      language,
    };

    const savedProfile = {
      firstName: lastSavedState?.firstName || '',
      lastName: lastSavedState?.lastName || '',
      email: lastSavedState?.email || '',
      bloodGroup: lastSavedState?.bloodGroup || '',
      gender: lastSavedState?.gender || '',
      policyNo: lastSavedState?.policyNo || '',
      phone: lastSavedState?.phone || '',
      dateOfBirth: lastSavedState?.dateOfBirth || '',
      address: lastSavedState?.address || '',
      nationality: lastSavedState?.nationality || '',
      country: lastSavedState?.country || '',
      language: lastSavedState?.language || '',
    };

    const changed =
      JSON.stringify(currentProfile) !== JSON.stringify(savedProfile) || profileImage !== originalProfileImage;
    setHasChanges(changed);
  }, [
    firstName,
    lastName,
    email,
    bloodGroup,
    gender,
    policyNo,
    phone,
    dateOfBirth,
    address,
    nationality,
    country,
    language,
    lastSavedState,
    profileImage,
    originalProfileImage,
  ]);


  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const userFolder = user.userType === 'DOCTOR' ? 'Doctor' : 'Patient';

    try {
      const uploadedUrl = await uploadFile(file, userFolder);
      console.log('File URL:', uploadedUrl);
      setProfilePic(uploadedUrl.data);

      const res = await updateProfile({ profilePic: uploadedUrl.data });
      console.log('uploading profile : ', res);

    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage('/placeholder.svg?height=120&width=120');
    setHasChanges(true);
  };

  const handleInputChange = (setter, value) => {
    setter(value);
  };

  const handleEditProfile = () => {
    setShowEditProfileModal(true);
  };

  const handleSaveProfile = () => {
    saveAllProfileData();
    setOriginalProfileImage(profileImage);
    setHasChanges(false);
  };

  const handleDiscardChanges = () => {
    discardChanges();
    setProfileImage(originalProfileImage);
    setHasChanges(false);
  };

  const handleUploadDocument = () => {
    setShowUploadModal(true);
  };

  const handleChangePassword = () => {
    setShowChangePasswordModal(true);
  };

  return (
    <div className="min-h-screen mt-5 py-4 sm:py-8">
      <div className="mx-auto px-4 sm:px-2">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Account Settings</h1>
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 sm:w-16 sm:h-16 mt-2 sm:mt-4">
              <svg className="w-12 h-12 sm:w-16 sm:h-16 transform -rotate-90" viewBox="0 0 38 38">
                <path
                  d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="5"
                />
                <path
                  d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#00AAEE"
                  strokeWidth="5"
                  strokeDasharray="60, 100"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs sm:text-sm font-semibold text-gray-700">60%</span>
              </div>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-900 mt-3 sm:mt-5">Profile status: Incomplete</p>
            </div>
          </div>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-8 mb-4 sm:mb-6">
          {/* Profile Image Section */}
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            <div className="relative mb-3 sm:mb-4">
              <img
                src={profilePic || '/placeholder.svg'}
                alt="Profile"
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-gray-100"
              />
            </div>
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <label className="flex-1 sm:flex-none bg-[#00AAEE] text-white px-4 py-2 sm:px-6 sm:py-2 rounded-full font-medium cursor-pointer hover:bg-[#0099DD] transition-colors text-center text-sm sm:text-base">
                Change
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
              <button
                onClick={handleRemoveImage}
                className="flex-1 sm:flex-none bg-[#00AAEE] text-white px-4 py-2 sm:px-6 sm:py-2 rounded-full font-medium hover:bg-[#0099DD] transition-colors text-sm sm:text-base"
              >
                Remove
              </button>
            </div>
          </div>

          {/* Profile Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* First Name */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => handleInputChange(setFirstName, e.target.value)}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:border-[#00AAEE] transition-colors text-sm sm:text-base"
                placeholder="Enter your first name"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => handleInputChange(setLastName, e.target.value)}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:border-[#00AAEE] transition-colors text-sm sm:text-base"
                placeholder="Enter your last name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Email</label>
              <div className="relative">
                <input
                  type="email"
                  disabled
                  value={email}
                  onChange={(e) => handleInputChange(setEmail, e.target.value)}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 pr-10 sm:pr-12 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:border-[#00AAEE] transition-colors text-sm sm:text-base"
                  placeholder="Enter your email address"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Blood Group */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => handleInputChange(setBloodGroup, e.target.value)}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:border-[#00AAEE] transition-colors appearance-none pr-8 text-sm sm:text-base"
              >
                <option value="">Select blood group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Gender</label>
              <select
                value={gender}
                onChange={(e) => handleInputChange(setGender, e.target.value)}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:border-[#00AAEE] transition-colors appearance-none pr-8 text-sm sm:text-base"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            {/* Policy No */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Policy No</label>
              <input
                type="text"
                value={policyNo}
                onChange={(e) => handleInputChange(setPolicyNo, e.target.value)}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:border-[#00AAEE] transition-colors text-sm sm:text-base"
                placeholder="Enter policy number"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => handleInputChange(setPhone, e.target.value)}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:border-[#00AAEE] transition-colors text-sm sm:text-base"
                placeholder="Enter phone number"
              />
            </div>

            {/* DOB */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Date of Birth</label>
              <input
                value={dateOfBirth?.slice(0, 10)}
                onChange={(e) => handleInputChange(setDateOfBirth, e.target.value)}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:border-[#00AAEE] transition-colors text-sm sm:text-base"
              />
            </div>

            {/* Address */}
            <div className="sm:col-span-2 md:col-span-2">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => handleInputChange(setAddress, e.target.value)}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:border-[#00AAEE] transition-colors text-sm sm:text-base"
                placeholder="Enter your full address"
              />
            </div>

            {/* Nationality */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Nationality</label>
              <input
                type="text"
                value={nationality}
                onChange={(e) => handleInputChange(setNationality, e.target.value)}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:border-[#00AAEE] transition-colors text-sm sm:text-base"
                placeholder="Enter your nationality"
              />
            </div>

            {/* County/City */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">City</label>
              <input
                type="text"
                value={country} // Using 'country' from store for consistency
                onChange={(e) => handleInputChange(setCountry, e.target.value)}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:border-[#00AAEE] transition-colors text-sm sm:text-base"
                placeholder="Enter your city"
              />
            </div>

            {/* Language */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Preferred Language
              </label>
              <input
                type="text"
                value={language}
                onChange={(e) => handleInputChange(setLanguage, e.target.value)}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:border-[#00AAEE] transition-colors text-sm sm:text-base"
                placeholder="Enter your language"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mb-6 sm:mb-8">
            {!hasChanges ? (
              <button
                onClick={handleEditProfile}
                className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 bg-[#00AAEE] text-white rounded-full font-medium hover:bg-[#0099DD] transition-colors text-sm sm:text-base"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleDiscardChanges}
                  className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  Discard Changes
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 bg-[#00AAEE] text-white rounded-full font-medium hover:bg-[#0099DD] transition-colors text-sm sm:text-base"
                >
                  Save Changes
                </button>
              </>
            )}
          </div>
        </div>

        {/* Bottom Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Upload Documents Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 text-center">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Upload Documents</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
              Upload your medical report with a title and brief description for secure record keeping.
            </p>
            <button
              onClick={handleUploadDocument}
              className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 bg-[#00AAEE] text-white rounded-full font-medium hover:bg-[#0099DD] transition-colors text-sm sm:text-base"
            >
              Upload Your Report
            </button>
          </div>

          {/* Change Password Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 text-center">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Change Password</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
              We recommend updating your password regularly. Make sure your new password is strong and unique.
            </p>
            <button
              onClick={handleChangePassword}
              className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-colors text-sm sm:text-base"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditProfileModal isOpen={showEditProfileModal} onClose={() => setShowEditProfileModal(false)} />
      <UploadDocumentModal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} />
      <ChangePasswordModal isOpen={showChangePasswordModal} onClose={() => setShowChangePasswordModal(false)} />
    </div>
  );
}
