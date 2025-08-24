'use client';

import { Upload, FileText } from 'lucide-react';
import { useProfileStore } from '../../stores/ProfileStore';

export function MedicalInfoForm() {
  const {
    allergies,
    setAllergies,
    chronicCondition,
    setChronicCondition,
    medication,
    setMedication,
    primaryCare,
    setPrimaryCare,
    medicalRecordFileName,
    setMedicalRecordFileName,
  } = useProfileStore();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedicalRecordFileName(file.name);
      console.log('Medical record file selected:', file.name);
    } else {
      setMedicalRecordFileName('');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-2">
          Allergies (If any)
        </label>
        <input
          id="allergies"
          placeholder="Enter Allergies"
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:border-[#00AAEE] transition-colors"
        />
      </div>
      <div>
        <label htmlFor="chronicCondition" className="block text-sm font-medium text-gray-700 mb-2">
          Chronic Condition
        </label>
        <div className="relative">
          <select
            id="chronicCondition"
            value={chronicCondition}
            onChange={(e) => setChronicCondition(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:border-[#00AAEE] transition-colors appearance-none pr-8"
          >
            <option value="">Chronic Condition</option>
            <option value="none">None</option>
            <option value="diabetes">Diabetes</option>
            <option value="hypertension">Hypertension</option>
            <option value="asthma">Asthma</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>
      <div>
        <label htmlFor="medication" className="block text-sm font-medium text-gray-700 mb-2">
          Medication (If any)
        </label>
        <input
          id="medication"
          placeholder="Enter Medication Details"
          value={medication}
          onChange={(e) => setMedication(e.target.value)}
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:border-[#00AAEE] transition-colors"
        />
      </div>
      <div>
        <label htmlFor="primaryCare" className="block text-sm font-medium text-gray-700 mb-2">
          Primary Care Physician (optional)
        </label>
        <input
          id="primaryCare"
          placeholder="Primary care Physician"
          value={primaryCare}
          onChange={(e) => setPrimaryCare(e.target.value)}
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:border-[#00AAEE] transition-colors"
        />
      </div>
      <div>
        <label htmlFor="uploadMedical" className="block text-sm font-medium text-gray-700 mb-2">
          Upload Medical Records (Optional)
        </label>
        <div className="relative">
          <input id="uploadMedical" type="file" className="hidden" onChange={handleFileChange} />
          <label
            htmlFor="uploadMedical"
            className="flex items-center justify-between w-full px-4 py-3 bg-white border border-gray-300 rounded-full cursor-pointer text-gray-500"
          >
            {medicalRecordFileName || 'Medical Record'}
            <Upload className="h-5 w-5 text-gray-400" />
          </label>
        </div>
      </div>
      <div className="flex flex-col justify-end">
        <label className="block text-sm font-medium text-gray-700 mb-2">File Attached</label>
        <div className="flex items-center gap-2 text-gray-600">
          {medicalRecordFileName && <FileText className="h-5 w-5 text-blue-500" />}
          <span>{medicalRecordFileName || 'No file attached'}</span>
          {medicalRecordFileName && <span className="text-xs text-gray-400">500KB</span>} {/* Placeholder size */}
        </div>
      </div>
    </div>
  );
}
