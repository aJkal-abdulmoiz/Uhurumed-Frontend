import { useDoctorProfileStore } from '@/stores/DoctorProfileStore';

export function ConsultationDetailsForm() {
  const {
    timeZone,
    setTimeZone,
    telemedicinePlatform,
    setTelemedicinePlatform,
    consultationFee,
    setConsultationFee,
    followUpFee,
    setFollowUpFee,
    prescriptionAuthority,
    setPrescriptionAuthority,
    labsImagingOrderRights,
    setLabsImagingOrderRights,
  } = useDoctorProfileStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      <div>
        <label htmlFor="timeZone" className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
          Time Zone
        </label>
        <div className="relative">
          <select
            id="timeZone"
            value={timeZone}
            onChange={(e) => setTimeZone(e.target.value)}
            className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:border-[#00AAEE] transition-colors appearance-none pr-8 text-sm sm:text-base"
          >
            <option value="">Select Time Zone</option>
            <option value="est">EST</option>
            <option value="cst">CST</option>
            <option value="mst">MST</option>
            <option value="pst">PST</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>
      <div>
        <label htmlFor="telemedicinePlatform" className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
          Telemedicine Platform
        </label>
        <div className="relative">
          <select
            id="telemedicinePlatform"
            value={telemedicinePlatform}
            onChange={(e) => setTelemedicinePlatform(e.target.value)}
            className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:border-[#00AAEE] transition-colors appearance-none pr-8 text-sm sm:text-base"
          >
            <option value="">Select Telemedicine Platform</option>
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
      <div>
        <label htmlFor="consultationFee" className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
          Consultation Fee (USD)
        </label>
        <input
          id="consultationFee"
          placeholder="Enter Consultation Fee"
          type="number"
          value={consultationFee}
          onChange={(e) => setConsultationFee(e.target.value)}
          className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:border-[#00AAEE] transition-colors text-sm sm:text-base"
        />
      </div>
      <div>
        <label htmlFor="followUpFee" className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
          Follow Up Fee (USD)
        </label>
        <input
          id="followUpFee"
          placeholder="Enter Follow Up Fee"
          type="number"
          value={followUpFee}
          onChange={(e) => setFollowUpFee(e.target.value)}
          className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:border-[#00AAEE] transition-colors text-sm sm:text-base"
        />
      </div>
      <div>
        <label htmlFor="prescriptionAuthority" className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
          Prescription Authority
        </label>
        <div className="relative">
          <select
            id="prescriptionAuthority"
            value={prescriptionAuthority}
            onChange={(e) => setPrescriptionAuthority(e.target.value)}
            className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:border-[#00AAEE] transition-colors appearance-none pr-8 text-sm sm:text-base"
          >
            <option value="">Select Authority</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>
      <div>
        <label htmlFor="labsImagingOrderRights" className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
          Labs & Imaging Order Rights
        </label>
        <div className="relative">
          <select
            id="labsImagingOrderRights"
            value={labsImagingOrderRights}
            onChange={(e) => setLabsImagingOrderRights(e.target.value)}
            className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:border-[#00AAEE] transition-colors appearance-none pr-8 text-sm sm:text-base"
          >
            <option value="">Select Rights</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
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
