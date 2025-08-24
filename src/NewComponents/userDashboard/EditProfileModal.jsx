import { useState, useEffect } from 'react';
import { PersonalInfoForm } from './PersonalInfo';
import { ContactInfoForm } from './ContactInfo';
import { MedicalInfoForm } from './MedicalInfo';
import { InsuranceInfoForm } from './InsuranceInfo';
import { EmergencyContactForm } from './EmergencyInfo';
import { ConsentLegalForm } from './ConsentLegal';
import { useProfileStore } from '../../stores/ProfileStore';
import axios from 'axios';
import ApiConfig from '../../ApiConfig/ApiConfig';
import { date } from 'yup';
import { updateProfile } from '@/queries/DoctorQueries/update';


export function EditProfileModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('personal-info');
  const tabs = [
    { id: 'personal-info', name: 'Personal Info' },
    { id: 'contact-info', name: 'Contact Info' },
    { id: 'medical-info', name: 'Medical Info' },
    { id: 'insurance-info', name: 'Insurance Info' },
    { id: 'emergency-contact', name: 'Emergency Contact' },
    { id: 'consent-legal', name: 'Consent & Legal and Submission' },
  ];

  const saveAllProfileData = useProfileStore((state) => state.saveAllProfileData);

  const {
    firstName,
    lastName,
    dateOfBirth,
    gender,
    address,
    nationality,
    country,
    language,
    phone,
    enabled2FA,
    allergies,
    chronicCondition,
    medication,
    primaryCare,
    policyNo,
    planName,
    idCardFileName,
    medicalRecordFileName,
    emergencyContactFullName,
    emergencyContactRelationship,
    emergencyContactPhone,
    acceptTerms,
    consentTelemedicine,
    dataProtectionAcknowledgment,
    submitTerms,
    submitTelemedicine,
    submitDataProtectionAcknowledgment,
  } = useProfileStore();

  const updateValues = {
    firstName,
    lastName,
    dateOfBirth, // Ensure this is in the correct format for your API
    gender,
    address,
    nationality,
    country,
    language,
    phone,
    idCardFileName,
    medicalRecordFileName,
    allergies,
    chronicCondition,
    medication,
    // enabled2FA,
    primaryCare,
    policyNo,
    planName,
    emergencyContactFullName,
    emergencyContactRelationship,
    emergencyContactPhone,
    acceptTerms,
    consentTelemedicine,
    dataProtectionAcknowledgment,
    submitTerms,
    submitTelemedicine,
    submitDataProtectionAcknowledgment,
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleNext = () => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    }
  };

  const handleBack = () => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
    }
  };

  const handleSave = () => {
    saveAllProfileData();
    updateProfile(updateValues);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4">
      <div className="relative w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-[95vh] sm:h-[90vh]">
        <div className="p-4 sm:p-6 pb-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 pr-8">Edit Profile</h2>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-700 p-1"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 sm:h-6 sm:w-6"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          <div className="p-4 sm:p-6 pt-0">
            <div className="hidden md:grid w-full grid-cols-6 h-auto bg-white rounded-lg shadow-sm border border-gray-200 p-1 mb-4 sm:mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 sm:py-2 px-2 sm:px-4 rounded-md text-xs sm:text-sm font-medium transition-colors min-h-[44px] ${
                    activeTab === tab.id ? 'bg-[#00AAEE] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>

            <div className="md:hidden w-full bg-white rounded-lg shadow-sm border border-gray-200 p-1 mb-4 sm:mb-6">
              {tabs.map(
                (tab) =>
                  tab.id === activeTab && (
                    <button
                      key={tab.id}
                      className="w-full py-2 px-4 rounded-md text-sm font-medium bg-[#00AAEE] text-white shadow-sm min-h-[44px]"
                    >
                      {tab.name}
                    </button>
                  ),
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 sm:px-6">
            <div className="p-4 sm:p-8">
              {activeTab === 'personal-info' && <PersonalInfoForm />}
              {activeTab === 'contact-info' && <ContactInfoForm />}
              {activeTab === 'medical-info' && <MedicalInfoForm />}
              {activeTab === 'insurance-info' && <InsuranceInfoForm />}
              {activeTab === 'emergency-contact' && <EmergencyContactForm />}
              {activeTab === 'consent-legal' && <ConsentLegalForm />}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-200">
          {/* Mobile layout - three buttons in one row */}
          <div className="flex sm:hidden justify-between gap-2">
            <button
              onClick={handleBack}
              disabled={tabs.findIndex((tab) => tab.id === activeTab) === 0}
              className="flex-1 px-4 py-3 bg-[#00AAEE] text-white rounded-full font-medium hover:bg-[#0099DD] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={tabs.findIndex((tab) => tab.id === activeTab) === tabs.length - 1}
              className="flex-1 px-4 py-3 bg-[#00AAEE] text-white rounded-full font-medium hover:bg-[#0099DD] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Next
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-3 bg-[#00AAEE] text-white rounded-full font-medium hover:bg-[#0099DD] transition-colors"
            >
              Save
            </button>
          </div>

          {/* Desktop layout - original button arrangement */}
          <div className="hidden md:flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
            <button
              onClick={handleSave}
              className="w-full sm:w-auto px-6 py-3 bg-[#00AAEE] text-white rounded-full font-medium hover:bg-[#0099DD] transition-colors order-2 sm:order-1"
            >
              Save Changes
            </button>
            <button
              onClick={handleNext}
              className="w-full sm:w-auto px-6 py-3 bg-[#00AAEE] text-white rounded-full font-medium hover:bg-[#0099DD] transition-colors order-1 sm:order-2"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
