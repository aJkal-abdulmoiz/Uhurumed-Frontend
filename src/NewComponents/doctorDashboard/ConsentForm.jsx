import { useDoctorProfileStore } from '@/stores/DoctorProfileStore';

export function DoctorConsentLegalForm() {
  const {
    acceptTerms,
    setAcceptTerms,
    consentTelemedicine,
    setConsentTelemedicine,
    dataProtectionAcknowledgment,
    setDataProtectionAcknowledgment,
    submitTerms,
    setSubmitTerms,
    submitTelemedicine,
    setSubmitTelemedicine,
    submitDataProtectionAcknowledgment,
    setSubmitDataProtectionAcknowledgment,
  } = useDoctorProfileStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Consent & Legal</h3>
        <div className="flex items-start space-x-3 py-1">
          <input
            type="checkbox"
            id="acceptTerms"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="h-4 w-4 mt-0.5 text-[#00AAEE] border-gray-300 rounded focus:ring-[#00AAEE] flex-shrink-0"
          />
          <label htmlFor="acceptTerms" className="text-sm text-gray-700 leading-relaxed">
            Accept Terms & Condition
          </label>
        </div>
        <div className="flex items-start space-x-3 py-1">
          <input
            type="checkbox"
            id="consentTelemedicine"
            checked={consentTelemedicine}
            onChange={(e) => setConsentTelemedicine(e.target.checked)}
            className="h-4 w-4 mt-0.5 text-[#00AAEE] border-gray-300 rounded focus:ring-[#00AAEE] flex-shrink-0"
          />
          <label htmlFor="consentTelemedicine" className="text-sm text-gray-700 leading-relaxed">
            Consent To Telemedicine
          </label>
        </div>
        <div className="flex items-start space-x-3 py-1">
          <input
            type="checkbox"
            id="dataProtection"
            checked={dataProtectionAcknowledgment}
            onChange={(e) => setDataProtectionAcknowledgment(e.target.checked)}
            className="h-4 w-4 mt-0.5 text-[#00AAEE] border-gray-300 rounded focus:ring-[#00AAEE] flex-shrink-0"
          />
          <label htmlFor="dataProtection" className="text-sm text-gray-700 leading-relaxed">
            Data protection / HIPAA Compliance Acknowledgment
          </label>
        </div>
      </div>
      <div className="space-y-3 sm:space-y-4 mt-6 md:mt-0">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Submission</h3>
        <div className="flex items-start space-x-3 py-1">
          <input
            type="checkbox"
            id="submitTerms"
            checked={submitTerms}
            onChange={(e) => setSubmitTerms(e.target.checked)}
            className="h-4 w-4 mt-0.5 text-[#00AAEE] border-gray-300 rounded focus:ring-[#00AAEE] flex-shrink-0"
          />
          <label htmlFor="submitTerms" className="text-sm text-gray-700 leading-relaxed">
            Accept Terms & Condition
          </label>
        </div>
        <div className="flex items-start space-x-3 py-1">
          <input
            type="checkbox"
            id="submitTelemedicine"
            checked={submitTelemedicine}
            onChange={(e) => setSubmitTelemedicine(e.target.checked)}
            className="h-4 w-4 mt-0.5 text-[#00AAEE] border-gray-300 rounded focus:ring-[#00AAEE] flex-shrink-0"
          />
          <label htmlFor="submitTelemedicine" className="text-sm text-gray-700 leading-relaxed">
            Consent To Telemedicine
          </label>
        </div>
        <div className="flex items-start space-x-3 py-1">
          <input
            type="checkbox"
            id="submitDataProtection"
            checked={submitDataProtectionAcknowledgment}
            onChange={(e) => setSubmitDataProtectionAcknowledgment(e.target.checked)}
            className="h-4 w-4 mt-0.5 text-[#00AAEE] border-gray-300 rounded focus:ring-[#00AAEE] flex-shrink-0"
          />
          <label htmlFor="submitDataProtection" className="text-sm text-gray-700 leading-relaxed">
            Data protection / HIPAA Compliance Acknowledgment
          </label>
        </div>
      </div>
    </div>
  );
}
