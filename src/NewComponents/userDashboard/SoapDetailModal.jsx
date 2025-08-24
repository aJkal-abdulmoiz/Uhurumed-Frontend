
import React from 'react';

const SoapDetailModal = ({ isOpen, onClose, appointment }) => {
  if (!isOpen || !appointment) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-6"
      role="dialog"
      aria-labelledby="soap-modal-title"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 id="soap-modal-title" className="text-2xl font-semibold text-gray-900">
            SOAP Note Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#04A4E2] rounded-full p-1"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="grid gap-4 text-sm text-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center">
            <span className="font-medium w-32 shrink-0">Doctor:</span>
            <span>{appointment.doctorName || 'N/A'}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center">
            <span className="font-medium w-32 shrink-0">Symptoms:</span>
            <span>{appointment.symptoms || 'N/A'}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center">
            <span className="font-medium w-32 shrink-0">Chief Complaint:</span>
            <span>{appointment.chiefComplaint || 'N/A'}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center">
            <span className="font-medium w-32 shrink-0">Assessment:</span>
            <span>{appointment.assessment || 'N/A'}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center">
            <span className="font-medium w-32 shrink-0">Lab Results:</span>
            <a
              className="text-[#04A4E2] underline hover:text-[#038DC8] transition-colors"
              href={appointment.labresultsUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View Lab Results"
            >
              {appointment.labresultsUrl && appointment.labresultsUrl !== '#' ? 'View Lab Results' : 'Not Available'}
            </a>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center">
            <span className="font-medium w-32 shrink-0">Prescription:</span>
            <a
              className="text-[#04A4E2] underline hover:text-[#038DC8] transition-colors"
              href={appointment.prescriptionUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View Prescription"
            >
              {appointment.prescriptionUrl && appointment.prescriptionUrl !== '#' ? 'View Prescription' : 'Not Available'}
            </a>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center">
            <span className="font-medium w-32 shrink-0">Appointment Date:</span>
            <span>{appointment.appointmentDate || 'N/A'}</span>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default SoapDetailModal;