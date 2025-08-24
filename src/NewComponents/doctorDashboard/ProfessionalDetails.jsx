import { Upload, FileText } from 'lucide-react';
import { useDoctorProfileStore } from '@/stores/DoctorProfileStore';

export function ProfessionalDetailsForm() {
  const {
    licenseNumber,
    setLicenseNumber,
    countryOfLicense,
    setCountryOfLicense,
    licenseStartDate,
    setLicenseStartDate,
    licenseExpiryDate,
    setLicenseExpiryDate,
    cvResumeFileName,
    setCvResumeFileName,
  } = useDoctorProfileStore();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCvResumeFileName(file.name);
      console.log('CV/Resume file selected:', file.name);
    } else {
      setCvResumeFileName('');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      <div>
        <label htmlFor="medicalLicenseNumber" className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
          Medical License Number
        </label>
        <input
          id="medicalLicenseNumber"
          placeholder="Enter Medical License Number"
          value={licenseNumber}
          onChange={(e) => setLicenseNumber(e.target.value)}
          className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:border-[#00AAEE] transition-colors text-sm sm:text-base"
        />
      </div>
      <div>
        <label htmlFor="countryOfLicense" className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
          Country of License
        </label>
        <div className="relative">
          <select
            id="countryOfLicense"
            value={countryOfLicense}
            onChange={(e) => setCountryOfLicense(e.target.value)}
            className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:border-[#00AAEE] transition-colors appearance-none pr-8 text-sm sm:text-base"
          >
            <option value="">Select Country</option>
            <option value="us">United States</option>
            <option value="ca">Canada</option>
            <option value="uk">United Kingdom</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>
      <div>
        <label htmlFor="licenseStartDate" className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
          License Start Date
        </label>
        <input
          id="licenseStartDate"
          type="date"
          value={licenseStartDate.slice(0, 10)}
          onChange={(e) => setLicenseStartDate(e.target.value)}
          className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:border-[#00AAEE] transition-colors text-sm sm:text-base"
        />
      </div>
      <div>
        <label htmlFor="licenseExpiryDate" className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
          License Expiry Date
        </label>
        <input
          id="licenseExpiryDate"
          type="date"
          value={licenseExpiryDate.slice(0, 10)}
          onChange={(e) => setLicenseExpiryDate(e.target.value)}
          className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:border-[#00AAEE] transition-colors text-sm sm:text-base"
        />
      </div>
      <div>
        <label htmlFor="uploadCvResume" className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
          Upload CV/Resume
        </label>
        <div className="relative">
          <input id="uploadCvResume" type="file" className="hidden" onChange={handleFileChange} />
          <label
            htmlFor="uploadCvResume"
            className="flex items-center justify-between w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-white border border-gray-300 rounded-full cursor-pointer text-gray-500 hover:bg-gray-50 transition-colors text-sm sm:text-base"
          >
            <span className="truncate pr-2">{cvResumeFileName || 'Upload CV/Resume'}</span>
            <Upload className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
          </label>
        </div>
      </div>
      <div className="flex flex-col justify-end">
        <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">File Attached</label>
        <div className="flex items-center gap-2 text-gray-600 min-h-[42px] sm:min-h-[48px] px-3 py-2.5 sm:px-4 sm:py-3">
          {cvResumeFileName && <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0" />}
          <span className="text-sm sm:text-base truncate">{cvResumeFileName || 'No file attached'}</span>
          {cvResumeFileName && <span className="text-xs text-gray-400 flex-shrink-0">500KB</span>}
        </div>
      </div>
    </div>
  );
}
