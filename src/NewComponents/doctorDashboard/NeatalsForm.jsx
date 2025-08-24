import { useDoctorProfileStore } from '@/stores/DoctorProfileStore';

export function ProfessionalNeatsForm() {
  const {
    specialization,
    setSpecialization,
    subspecialties,
    setSubspecialties,
    experience,
    setExperience,
    languageOfConsultation,
    setLanguageOfConsultation,
    emergencyAvailability,
    setEmergencyAvailability,
  } = useDoctorProfileStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      <div>
        <label htmlFor="primarySpeciality" className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
          Primary Speciality
        </label>
        <div className="relative">
          <select
            id="primarySpeciality"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:border-[#00AAEE] transition-colors appearance-none pr-8 text-sm sm:text-base"
          >
            <option value="">Select Primary Speciality</option>
            <option value="general">General & Primary Care</option>
            <option value="pediatrics">Pediatrics</option>
            <option value="cardiology">Cardiology</option>
            <option value="dermatology">Dermatology</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>
      <div>
        <label htmlFor="subspecialties" className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
          Subspecialties (Optional)
        </label>
        <input
          id="subspecialties"
          placeholder="Enter Subspecialties"
          value={subspecialties}
          onChange={(e) => setSubspecialties(e.target.value)}
          className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:border-[#00AAEE] transition-colors text-sm sm:text-base"
        />
      </div>
      <div>
        <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
          Years of Experience
        </label>
        <input
          id="yearsOfExperience"
          type="text"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:border-[#00AAEE] transition-colors text-sm sm:text-base"
          placeholder="Enter years of experience"
        />
      </div>
      <div>
        <label htmlFor="languageOfConsultation" className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
          Language of Consultation
        </label>
        <div className="relative">
          <select
            id="languageOfConsultation"
            value={languageOfConsultation}
            onChange={(e) => setLanguageOfConsultation(e.target.value)}
            className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:border-[#00AAEE] transition-colors appearance-none pr-8 text-sm sm:text-base"
          >
            <option value="">Select Language of Consultation</option>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>
      <div>
        <label htmlFor="emergencyAvailability" className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
          Emergency Availability
        </label>
        <div className="relative">
          <select
            id="emergencyAvailability"
            value={emergencyAvailability}
            onChange={(e) => setEmergencyAvailability(e.target.value)}
            className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:border-[#00AAEE] transition-colors appearance-none pr-8 text-sm sm:text-base"
          >
            <option value="">Select Availability</option>
            <option value="jitsi">Jitsi</option>
            <option value="zoom">Zoom</option>
            <option value="google-meet">Google Meet</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
