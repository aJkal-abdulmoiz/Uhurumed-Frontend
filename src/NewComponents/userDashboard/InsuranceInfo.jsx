import { Upload, FileText } from 'lucide-react';
import { useProfileStore } from '../../stores/ProfileStore';

export function InsuranceInfoForm() {
  const {
    isInsuredByUhuruMed,
    setIsInsuredByUhuruMed,
    policyNo,
    setPolicyNo,
    planName,
    setPlanName,
    idCardFileName,
    setIdCardFileName,
  } = useProfileStore();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIdCardFileName(file.name);
      // In a real app, you would handle file upload here
      console.log('ID card file selected:', file.name);
    } else {
      setIdCardFileName('');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      <div className="col-span-1 md:col-span-2">
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
          Are You Insured by UhuruMed?
        </label>
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="insurance-yes"
              checked={isInsuredByUhuruMed === true}
              onChange={() => setIsInsuredByUhuruMed(true)}
              className="h-3 w-3 sm:h-4 sm:w-4 text-[#00AAEE] border-gray-300 rounded focus:ring-[#00AAEE]"
            />
            <label htmlFor="insurance-yes" className="text-xs sm:text-sm text-gray-700">
              Yes
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="insurance-no"
              checked={isInsuredByUhuruMed === false}
              onChange={() => setIsInsuredByUhuruMed(false)}
              className="h-3 w-3 sm:h-4 sm:w-4 text-[#00AAEE] bg-[#00AAEE] border-gray-300 rounded focus:ring-[#00AAEE]"
            />
            <label htmlFor="insurance-no" className="text-xs sm:text-sm text-gray-700">
              No
            </label>
          </div>
        </div>
      </div>
      <div>
        <label htmlFor="policyNo" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
          Policy Number
        </label>
        <input
          id="policyNo"
          placeholder="Enter Your Policy No"
          value={policyNo}
          onChange={(e) => setPolicyNo(e.target.value)}
          className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:border-[#00AAEE] transition-colors text-sm sm:text-base"
        />
      </div>
      <div>
        <label htmlFor="planName" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
          Plan Name
        </label>
        <div className="relative">
          <select
            id="planName"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:border-[#00AAEE] transition-colors appearance-none pr-8 text-sm sm:text-base"
          >
            <option value="">Select Plan</option>
            <option value="basic">Basic Plan</option>
            <option value="premium">Premium Plan</option>
            <option value="gold">Gold Plan</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-3 w-3 sm:h-4 sm:w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>
      <div>
        <label htmlFor="uploadIdCard" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
          Upload ID Card
        </label>
        <div className="relative">
          <input id="uploadIdCard" type="file" className="hidden" onChange={handleFileChange} />
          <label
            htmlFor="uploadIdCard"
            className="flex items-center justify-between w-full px-3 py-2 sm:px-4 sm:py-3 bg-white border border-gray-300 rounded-full cursor-pointer text-gray-500 text-sm sm:text-base"
          >
            {idCardFileName || 'Upload ID card'}
            <Upload className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
          </label>
        </div>
      </div>
      <div className="flex flex-col justify-end">
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">File Attached</label>
        <div className="flex items-center gap-2 text-gray-600">
          {idCardFileName && <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />}
          <span className="text-xs sm:text-sm">{idCardFileName || 'No file attached'}</span>
          {idCardFileName && <span className="text-xs text-gray-400">500KB</span>} {/* Placeholder size */}
        </div>
      </div>
    </div>
  );
}
