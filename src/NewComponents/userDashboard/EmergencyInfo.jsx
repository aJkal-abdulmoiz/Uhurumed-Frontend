import { useProfileStore } from '../../stores/ProfileStore';

export function EmergencyContactForm() {
  const {
    emergencyContactFullName,
    setEmergencyContactFullName,
    emergencyContactRelationship,
    setEmergencyContactRelationship,
    emergencyContactPhone,
    setEmergencyContactPhone,
  } = useProfileStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      <div>
        <label htmlFor="fullName" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
          Full Name
        </label>
        <input
          id="fullName"
          placeholder="Enter Full Name"
          value={emergencyContactFullName}
          onChange={(e) => setEmergencyContactFullName(e.target.value)}
          className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:border-[#00AAEE] transition-colors text-sm sm:text-base"
        />
      </div>
      <div>
        <label htmlFor="relationship" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
          Relationship
        </label>
        <div className="relative">
          <select
            id="relationship"
            value={emergencyContactRelationship}
            onChange={(e) => setEmergencyContactRelationship(e.target.value)}
            className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:border-[#00AAEE] transition-colors appearance-none pr-8 text-sm sm:text-base"
          >
            <option value="">Parent/ Spouse/ Husband</option>
            <option value="parent">Parent</option>
            <option value="spouse">Spouse</option>
            <option value="sibling">Sibling</option>
            <option value="friend">Friend</option>
            <option value="other">Other</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-3 w-3 sm:h-4 sm:w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>
      <div>
        <label htmlFor="emergencyPhone" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
          Phone No
        </label>
        <input
          id="emergencyPhone"
          placeholder="Enter Phone No"
          type="tel"
          value={emergencyContactPhone}
          onChange={(e) => setEmergencyContactPhone(e.target.value)}
          className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:border-[#00AAEE] transition-colors text-sm sm:text-base"
        />
      </div>
    </div>
  );
}
