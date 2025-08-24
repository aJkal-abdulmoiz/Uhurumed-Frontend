'use client';

import { useState, useEffect } from 'react';
import { Bold, Italic, Underline, Strikethrough, List } from 'lucide-react';
import { useConsultStore } from '../stores/consultStore';
import toast from 'react-hot-toast';
import { completeAppointment } from '../queries/DoctorQueries/appointments';

const RichTextEditorToolbar = () => (
  <div className="flex space-x-1 p-2 sm:p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
    <button className="p-1 sm:p-2 rounded hover:bg-gray-200">
      <Bold className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
    </button>
    <button className="p-1 sm:p-2 rounded hover:bg-gray-200">
      <Italic className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
    </button>
    <button className="p-1 sm:p-2 rounded hover:bg-gray-200">
      <Underline className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
    </button>
    <button className="p-1 sm:p-2 rounded hover:bg-gray-200">
      <Strikethrough className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
    </button>
    <button className="p-1 sm:p-2 rounded hover:bg-gray-200">
      <List className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
    </button>
  </div>
);

export default function ConsultNotes({ appointmentId }) {
  const { consultNotes, setConsultNoteField, currentPatient, currentAppointmentId, clearConsultNotes } = useConsultStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [finalAppointmentId, setFinalAppointmentId] = useState(null);

  const currentDate = new Date().toLocaleDateString('en-CA');
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  useEffect(() => {
    const id = appointmentId || currentAppointmentId;
    setFinalAppointmentId(id);

    console.log('ConsultNotes - Appointment ID Resolution:', {
      fromProps: appointmentId,
      fromStore: currentAppointmentId,
      finalUsed: id,
      currentPatient: currentPatient?.name || 'Not set',
    });
  }, [appointmentId, currentAppointmentId, currentPatient]);

  const handleFinalizeNote = async () => {
    if (isSubmitting) return;

    if (!finalAppointmentId) {
      toast.error('Appointment ID is missing. Cannot finalize notes.');
      console.error('No appointment ID available for consultation');

      return;
    }

    const hasContent = Object.values(consultNotes).some((value) => value && value.toString().trim() !== '');

    if (!hasContent) {
      toast.error('Please fill in at least one consultation field');

      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare the data to send to the backend
      const dataToSend = {
        appointmentId: finalAppointmentId,
        chiefComplaint: consultNotes.chiefComplaint || '',
        assessment: consultNotes.assessment || '',
        historyOfPresentIllness: consultNotes.historyOfPresentIllness || '',
        plan: consultNotes.plan || '',
        followUpInstructions: consultNotes.followUpInstructions || '',
        diagnosis: consultNotes.diagnosis || '',
        prescription: consultNotes.prescription || '',
        followUpNeeded: consultNotes.followUpNeeded || 'false',
        followUpDate: consultNotes.followUpNeeded === 'true' ? consultNotes.followUpDate : null,
      };

      const result = await completeAppointment(dataToSend);

      if (result.success) {
        toast.success('Consultation notes finalized and appointment completed successfully!');
        clearConsultNotes();
      } else {
        toast.error(result.error || 'Failed to save consultation notes');
      }
    } catch (error) {
      console.error('Error finalizing consultation notes:', error);

      if (error.response?.status === 404) {
        toast.error('Appointment not found or already completed');
      } else if (error.response?.status === 400) {
        toast.error(error.response?.data?.message || 'Invalid data provided');
      } else if (error.response?.status === 500) {
        toast.error('Server error. Please try again later');
      } else {
        toast.error('Failed to save consultation notes. Please try again');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Patient Info Header */}
      <div className="bg-white p-3 sm:p-6 rounded-md border border-gray-200 shadow-sm mb-4 sm:mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
        <div>
          <p className="font-semibold">Patient: {currentPatient?.name || 'N/A'}</p>
          <p>DOB: {currentPatient?.dob || 'N/A'}</p>
        </div>
        <div>
          <p className="font-semibold">Age: {currentPatient?.age || 'N/A'}</p>
          <p>MRN: {currentPatient?.patientId || 'N/A'}</p>
        </div>
        <div className="md:col-span-2 lg:col-span-1 text-left md:text-right">
          <p className="font-semibold">Date: {currentDate}</p>
          <p>Time: {currentTime}</p>
          <p>Type: Video Consultation</p>
          <p className="text-gray-500 text-xs">Appointment ID: {finalAppointmentId}</p>
        </div>
      </div>

      {/* Consultation Notes Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold p-3 sm:p-4 border-b border-gray-200">Chief Complaint</h2>
          <div className="p-3 sm:p-4">
            <RichTextEditorToolbar />
            <textarea
              className="w-full p-2 sm:p-3 border border-gray-200 rounded-b-lg focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y min-h-[100px] sm:min-h-[120px] text-xs sm:text-sm"
              placeholder="Patient reports worsening persistent headache over the past 3 days..."
              value={consultNotes.chiefComplaint || ''}
              onChange={(e) => setConsultNoteField('chiefComplaint', e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold p-3 sm:p-4 border-b border-gray-200">Assessment</h2>
          <div className="p-3 sm:p-4">
            <RichTextEditorToolbar />
            <textarea
              className="w-full p-2 sm:p-3 border border-gray-200 rounded-b-lg focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y min-h-[100px] sm:min-h-[120px] text-xs sm:text-sm"
              placeholder="45-year-old female presenting with acute exacerbation of headache..."
              value={consultNotes.assessment || ''}
              onChange={(e) => setConsultNoteField('assessment', e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold p-3 sm:p-4 border-b border-gray-200">
            History of Present Illness
          </h2>
          <div className="p-3 sm:p-4">
            <RichTextEditorToolbar />
            <textarea
              className="w-full p-2 sm:p-3 border border-gray-200 rounded-b-lg focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y min-h-[100px] sm:min-h-[120px] text-xs sm:text-sm"
              placeholder="History of migraines since adolescence..."
              value={consultNotes.historyOfPresentIllness || ''}
              onChange={(e) => setConsultNoteField('historyOfPresentIllness', e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold p-3 sm:p-4 border-b border-gray-200">Plan</h2>
          <div className="p-3 sm:p-4">
            <RichTextEditorToolbar />
            <textarea
              className="w-full p-2 sm:p-3 border border-gray-200 rounded-b-lg focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y min-h-[100px] sm:min-h-[120px] text-xs sm:text-sm"
              placeholder="1. Continue current migraine prophylactic..."
              value={consultNotes.plan || ''}
              onChange={(e) => setConsultNoteField('plan', e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="hidden lg:block"></div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold p-3 sm:p-4 border-b border-gray-200">
            Follow-up Instructions
          </h2>
          <div className="p-3 sm:p-4">
            <RichTextEditorToolbar />
            <textarea
              className="w-full p-2 sm:p-3 border border-gray-200 rounded-b-lg focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y min-h-[100px] sm:min-h-[120px] text-xs sm:text-sm"
              placeholder="Return to clinic in 3 weeks for reassessment..."
              value={consultNotes.followUpInstructions || ''}
              onChange={(e) => setConsultNoteField('followUpInstructions', e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-3 sm:mt-4">
        <button
          className="px-4 sm:px-6 py-2 bg-[#00AAEE] text-white rounded-full hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          onClick={handleFinalizeNote}
          disabled={isSubmitting || !finalAppointmentId}
        >
          {isSubmitting ? 'Finalizing...' : 'Finalize Note & Complete Appointment'}
        </button>
      </div>
    </div>
  );
}
