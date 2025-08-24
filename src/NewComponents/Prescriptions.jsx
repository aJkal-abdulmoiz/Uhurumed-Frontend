'use client';

import { useState, useEffect } from 'react';
import { Search, Trash2, Pencil, Pill } from 'lucide-react';
import { useConsultStore } from '../stores/consultStore';
import { useDoctorProfileStore } from '@/stores/DoctorProfileStore';
import { pdf } from '@react-pdf/renderer';
import MedicalSummaryPDF from './MedicalSummaryPdf';
import { completeAppointment } from '../queries/DoctorQueries/appointments';
import { uploadFile } from '../queries/upload/upload';
import toast from 'react-hot-toast';

const DrugCard = ({ name, dosage, type, frequency, route, notes, duration, active, onDelete, onEdit }) => (
  <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200 relative">
    {active && (
      <span className="absolute top-2 right-2 bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
        Active
      </span>
    )}
    <h3 className="font-semibold text-base sm:text-lg mb-1">{name}</h3>
    <p className="text-gray-700 text-xs sm:text-sm">
      {dosage} {type}
    </p>
    <p className="text-gray-700 text-xs sm:text-sm">Frequency: {frequency}</p>
    <p className="text-gray-700 text-xs sm:text-sm">Route: {route}</p>
    <p className="text-gray-700 text-xs sm:text-sm">Notes: {notes}</p>
    <p className="text-gray-700 text-xs sm:text-sm">Duration: {duration}</p>
    <div className="flex justify-end space-x-2 mt-3">
      <button className="p-1 rounded-full hover:bg-gray-100" onClick={onEdit}>
        <Pencil className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
      </button>
      <button className="p-1 rounded-full hover:bg-gray-100" onClick={onDelete}>
        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
      </button>
    </div>
  </div>
);

export default function Prescriptions() {
  const {
    prescriptionEntry,
    setPrescriptionEntryField,
    prescribedDrugs,
    addPrescribedDrug,
    updatePrescribedDrug,
    deletePrescribedDrug,
    currentAppointmentId,
    clearPrescription,
    currentPatient,
  } = useConsultStore();


  const { firstName, lastName } = useDoctorProfileStore();

  const [editingIndex, setEditingIndex] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isAutoFilling, setIsAutoFilling] = useState(false);

  useEffect(() => {
    const searchTerm = prescriptionEntry.drugSearch;

    if (!searchTerm || searchTerm.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);

      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(`https://rxnav.nlm.nih.gov/REST/approximateTerm.json?term=${searchTerm}`);

        if (response.ok) {
          const data = await response.json();
          const medicineData =
            data.approximateGroup?.candidate?.filter(
              (candidate, index, self) => candidate.name && self.findIndex((c) => c.name === candidate.name) === index,
            ) || [];

          setSuggestions(medicineData);
          setShowDropdown(medicineData.length > 0);
        } else {
          setSuggestions([]);
          setShowDropdown(false);
        }
      } catch (error) {
        console.error('Error fetching medicine suggestions:', error);
        setSuggestions([]);
        setShowDropdown(false);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [prescriptionEntry.drugSearch]);

  const handleSuggestionClick = (suggestion) => {
    setPrescriptionEntryField('drugSearch', suggestion.name);
    setShowDropdown(false);
    setSuggestions([]);
    setTimeout(() => {
      const searchInput = document.querySelector('input[placeholder*="Search for medicine"]');
      if (searchInput) {
        searchInput.focus();
      }
    }, 100);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setShowDropdown(false);
    }, 300);
  };

  const resetForm = () => {
    setPrescriptionEntryField('drugSearch', '');
    setPrescriptionEntryField('dosage', '');
    setPrescriptionEntryField('frequency', '');
    setPrescriptionEntryField('route', '');
    setPrescriptionEntryField('duration', '');
    setPrescriptionEntryField('notes', '');
    setEditingIndex(null);
    setSuggestions([]);
    setShowDropdown(false);
  };

  const handleAddOrUpdatePrescription = () => {
    if (prescriptionEntry.drugSearch && prescriptionEntry.dosage) {
      const newDrugData = {
        name: prescriptionEntry.drugSearch,
        dosage: prescriptionEntry.dosage,
        type: 'Capsule',
        frequency: prescriptionEntry.frequency,
        route: prescriptionEntry.route,
        notes: prescriptionEntry.notes,
        duration: prescriptionEntry.duration,
      };

      if (editingIndex !== null) {
        updatePrescribedDrug(editingIndex, newDrugData);
      } else {
        addPrescribedDrug(newDrugData);
      }
      resetForm();
    } else {
      alert('Please fill in drug search and dosage.');
    }
  };

  const handleEditDrug = (index) => {
    const drugToEdit = prescribedDrugs[index];
    setPrescriptionEntryField('drugSearch', drugToEdit.name);
    setPrescriptionEntryField('dosage', drugToEdit.dosage);
    setPrescriptionEntryField('frequency', drugToEdit.frequency);
    setPrescriptionEntryField('route', drugToEdit.route);
    setPrescriptionEntryField('duration', drugToEdit.duration);
    setPrescriptionEntryField('notes', drugToEdit.notes);
    setEditingIndex(index);
  };

  const blobToFile = (blob, fileName) => {
    return new File([blob], fileName, { type: blob.type });
  };

  const generateUploadAndSendURL = async () => {
    if (!currentAppointmentId) {
      toast.error('Appointment ID missing. Cannot generate PDF.');

      return;
    }

    if (prescribedDrugs.length === 0) {
      toast.error('No prescriptions added. Please add at least one prescription.');

      return;
    }

    setIsGenerating(true);
    try {
      const pdfDoc = (
        <MedicalSummaryPDF
          prescribedDrugs={prescribedDrugs}
          selectedLabTests={[]}
          type="prescriptions"
          patientName={currentPatient.name}
          patientId={currentPatient.patientId}
          doctorFirstName={firstName}
          doctorLastName={lastName}
        />
      );
      const blob = await pdf(pdfDoc).toBlob();

      const fileName = `prescriptions-${currentAppointmentId}-${Date.now()}.pdf`;
      const pdfFile = blobToFile(blob, fileName);

      const uploadResponse = await uploadFile(pdfFile, 'Pateint/prescriptions');

      if (!uploadResponse.success) {
        throw new Error(uploadResponse.message || 'Upload failed');
      }

      const actualPdfUrl = uploadResponse.data;

      toast.success('PDF uploaded successfully!');

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      const dataToSend = {
        appointmentId: currentAppointmentId,
        pdfUrl: actualPdfUrl,
      };

      const result = await completeAppointment(dataToSend);

      if (result.success) {
        toast.success('Prescription PDF URL saved successfully!');
        clearPrescription();
      } else {
        toast.error(result.error || 'Failed to save PDF URL');
      }
    } catch (error) {
      console.error('Error in prescription process:', error);

      if (error.message.includes('File upload failed') || error.message.includes('Upload failed')) {
        toast.error('Failed to upload PDF. Please try again.');
      } else if (error.response?.status === 404) {
        toast.error('Appointment not found');
      } else if (error.response?.status === 400) {
        toast.error('Invalid data provided');
      } else {
        toast.error('Failed to save PDF URL. Please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAutoFillDosage = async () => {
    if (!prescriptionEntry.drugSearch) {
      toast.error('Please select a medicine first');

      return;
    }

    setIsAutoFilling(true);
    try {
      const fdaResponse = await fetch(
        `https://api.fda.gov/drug/label.json?search=openfda.generic_name.exact=="${prescriptionEntry.drugSearch}"`,
      );

      if (!fdaResponse.ok) {
        throw new Error('Failed to fetch drug information');
      }

      const fdaData = await fdaResponse.json();

      if (!fdaData.results || fdaData.results.length === 0) {
        toast.error('No drug information found for this medicine');

        return;
      }

      const extractResponse = await fetch('https://full-lemur-full.ngrok-free.app/api/v1/gemini-autoFill/extract-prescription-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fdaData }),
      });

      const extractData = await extractResponse.json();

      if (extractData.error) {
        throw new Error(extractData.message);
      }

      const { dosage, frequency, route, duration } = extractData.prescriptionData;

      setPrescriptionEntryField('dosage', dosage);
      setPrescriptionEntryField('frequency', frequency);
      setPrescriptionEntryField('route', route);
      setPrescriptionEntryField('duration', duration);

      toast.success('All prescription fields auto-filled successfully!');
    } catch (error) {
      console.error('Auto-fill prescription error:', error);
      toast.error('Failed to auto-fill prescription data. Please enter manually.');
    } finally {
      setIsAutoFilling(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <div className="bg-white p-3 sm:p-6 rounded-lg shadow-sm">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Prescription Entry</h2>
        <div className="mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-medium mb-2">Drug Search</h3>
          <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">Find and select a drug from FDA database.</p>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search for medicine (e.g., Panadol, Amoxicillin)"
              className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs sm:text-sm"
              value={prescriptionEntry.drugSearch}
              onChange={(e) => setPrescriptionEntryField('drugSearch', e.target.value)}
              onBlur={handleInputBlur}
              onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
            />
            {showDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                {isSearching ? (
                  <div className="p-3 text-center text-gray-500 text-sm">Searching medicines...</div>
                ) : suggestions.length > 0 ? (
                  suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="p-3 hover:bg-gray-100 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Pill className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="font-medium">{suggestion.name}</span>
                        </div>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {suggestion.source || 'RxNav'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-gray-500 text-sm">No medicines found</div>
                )}
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-base sm:text-lg font-medium mb-2">Prescription Details</h3>
          <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">
            Specify dosage, frequency, and other instructions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div>
              <label htmlFor="dosage" className="sr-only">
                Dosage
              </label>
              <input
                id="dosage"
                type="text"
                placeholder="Enter dosage (e.g., 500mg, 250mg)"
                className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-3 sm:px-4 rounded-full leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs sm:text-sm"
                value={prescriptionEntry.dosage}
                onChange={(e) => setPrescriptionEntryField('dosage', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="frequency" className="sr-only">
                Frequency
              </label>
              <input
                id="frequency"
                type="text"
                placeholder="Enter frequency (e.g., Once daily, Twice daily)"
                className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-3 sm:px-4 rounded-full leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs sm:text-sm"
                value={prescriptionEntry.frequency}
                onChange={(e) => setPrescriptionEntryField('frequency', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="route" className="sr-only">
                Route
              </label>
              <input
                id="route"
                type="text"
                placeholder="Enter route (e.g., Oral, Topical)"
                className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-3 sm:px-4 rounded-full leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs sm:text-sm"
                value={prescriptionEntry.route}
                onChange={(e) => setPrescriptionEntryField('route', e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="duration" className="sr-only">
                Duration
              </label>
              <input
                id="duration"
                type="text"
                placeholder="Enter duration (e.g., 7 days, 10 days)"
                className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-3 sm:px-4 rounded-full leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs sm:text-sm"
                value={prescriptionEntry.duration}
                onChange={(e) => setPrescriptionEntryField('duration', e.target.value)}
              />
            </div>
          </div>
          <div className="mb-3 sm:mb-4">
            <label htmlFor="notes" className="sr-only">
              Notes/Instructions
            </label>
            <textarea
              id="notes"
              placeholder="e.g., Take with food, complete full course"
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y min-h-[60px] sm:min-h-[80px] text-xs sm:text-sm"
              value={prescriptionEntry.notes}
              onChange={(e) => setPrescriptionEntryField('notes', e.target.value)}
            ></textarea>
          </div>
          <div className="flex justify-end mb-3 sm:mb-4">
            <button
              className="text-blue-600 text-xs sm:text-sm font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleAutoFillDosage}
              disabled={isAutoFilling || !prescriptionEntry.drugSearch}
            >
              {isAutoFilling ? 'Auto-filling...' : 'Auto-fill all fields'}
            </button>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            {editingIndex !== null && (
              <button
                className="flex-1 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition-colors duration-200 text-xs sm:text-sm"
                onClick={resetForm}
              >
                Cancel Edit
              </button>
            )}
            <button
              className="flex-1 py-2 bg-[#00AAEE] text-white rounded-full hover:bg-blue-700 transition-colors duration-200 text-xs sm:text-sm"
              onClick={handleAddOrUpdatePrescription}
            >
              {editingIndex !== null ? 'Update Prescription' : 'Add to Prescription'}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-3 sm:p-6 rounded-lg shadow-sm flex flex-col">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Prescribed Drugs ({prescribedDrugs.length})</h2>
        {prescribedDrugs.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500">
            <Pill className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-lg font-medium">No prescriptions added yet.</p>
            <p className="text-sm">Add drugs using the form to see them here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {prescribedDrugs.map((drug, index) => (
              <DrugCard
                key={index}
                {...drug}
                onDelete={() => deletePrescribedDrug(index)}
                onEdit={() => handleEditDrug(index)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="lg:col-span-2 flex justify-end mt-3 sm:mt-4">
        <button
          className="px-4 sm:px-6 py-2 bg-[#00AAEE] text-white rounded-full hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
          onClick={generateUploadAndSendURL}
          disabled={isGenerating || !currentAppointmentId || prescribedDrugs.length === 0}
        >
          {isGenerating ? 'Processing...' : 'E-sign & Upload'}
        </button>
      </div>
    </div>
  );
}
