'use client';

import { useState } from 'react';
import { Search, Microscope, ChevronDown, ChevronUp } from 'lucide-react';
import { useConsultStore } from '../stores/consultStore';
import { useDoctorProfileStore } from '../stores/DoctorProfileStore';
import { pdf } from '@react-pdf/renderer';
import MedicalSummaryPDF from '../NewComponents/MedicalSummaryPdf';
import { completeAppointment } from '../queries/DoctorQueries/appointments';
import { uploadFile } from '../queries/upload/upload';
import toast from 'react-hot-toast';
import { labTestData } from './LabTestData';

const CategorySection = ({ title, children, onAddTest }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        className="flex justify-between items-center w-full p-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="font-medium text-lg">{title}</h3>
        {isOpen ? <ChevronUp className="w-5 h-5 text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
      </button>
      {isOpen && (
        <div className="p-4 border-t border-gray-200">
          <ul className="space-y-2 text-sm text-gray-700">
            {children.map((test, index) => (
              <li key={index} className="flex justify-between items-center">
                {typeof test === 'object' ? test.testName || test.name || test.title : test}
                <button
                  className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200"
                  onClick={() => onAddTest(typeof test === 'object' ? test.testName || test.name || test.title : test)}
                >
                  Add
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const SubcategorySection = ({ subcategory, onAddTest }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-100 rounded-md overflow-hidden ml-4 mb-2">
      <button
        className="flex justify-between items-center w-full p-3 bg-gray-25 hover:bg-gray-50 transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h4 className="font-medium text-sm text-gray-800">{subcategory.name}</h4>
        {isOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
      </button>
      {isOpen && (
        <div className="p-3 border-t border-gray-100">
          <ul className="space-y-2 text-sm text-gray-700">
            {subcategory.tests.map((test, index) => (
              <li key={index} className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="font-medium">{test.name}</div>
                  <div className="text-xs text-gray-500">{test.description}</div>
                </div>
                <button
                  className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200"
                  onClick={() => onAddTest(test.name)}
                >
                  Add
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default function LabResults() {
  const { selectedLabTests, addLabTest, removeLabTest, currentAppointmentId, clearLabOrders, currentPatient } =
    useConsultStore();

  const { firstName, lastName } = useDoctorProfileStore();

  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filterLabData = (data, query) => {
    if (!query.trim()) return data;

    const searchTerm = query.toLowerCase();

    const filteredCategories = data.categories
      .map((category) => {
        const categoryMatches = category.name.toLowerCase().includes(searchTerm);

        const filteredSubcategories = category.subcategories
          .map((subcategory) => {
            const subcategoryMatches = subcategory.name.toLowerCase().includes(searchTerm);

            const filteredTests = subcategory.tests.filter(
              (test) =>
                test.name.toLowerCase().includes(searchTerm) || test.description.toLowerCase().includes(searchTerm),
            );

            if (subcategoryMatches || filteredTests.length > 0) {
              return {
                ...subcategory,
                tests: subcategoryMatches ? subcategory.tests : filteredTests,
              };
            }

            return null;
          })
          .filter(Boolean);

        if (categoryMatches || filteredSubcategories.length > 0) {
          return {
            ...category,
            subcategories: categoryMatches ? category.subcategories : filteredSubcategories,
          };
        }

        return null;
      })
      .filter(Boolean);

    return { categories: filteredCategories };
  };

  const filteredLabData = filterLabData(labTestData, searchQuery);

  const blobToFile = (blob, fileName) => {
    return new File([blob], fileName, { type: blob.type });
  };

  const generateUploadAndSendLabURL = async () => {
    if (!currentAppointmentId) {
      toast.error('Appointment ID missing. Cannot generate PDF.');

      return;
    }

    if (selectedLabTests.length === 0) {
      toast.error('No lab tests selected. Please add at least one test.');

      return;
    }

    setIsGenerating(true);
    try {
      const pdfDoc = (
        <MedicalSummaryPDF
          prescribedDrugs={[]}
          selectedLabTests={selectedLabTests}
          type="lab-results"
          patientName={currentPatient?.name}
          patientId={currentPatient?.patientId}
          doctorFirstName={firstName}
          doctorLastName={lastName}
        />
      );
      const blob = await pdf(pdfDoc).toBlob();

      const fileName = `lab-results-${currentAppointmentId}-${Date.now()}.pdf`;
      const pdfFile = blobToFile(blob, fileName);

      const uploadResponse = await uploadFile(pdfFile, 'lab-results');

      if (!uploadResponse.success) {
        throw new Error(uploadResponse.message || 'Lab Results PDF upload failed');
      }

      const actualLabResultsUrl = uploadResponse.data;

      toast.success('Lab Results PDF uploaded successfully!');

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      const dataToSend = {
        appointmentId: currentAppointmentId,
        labResultsUrl: actualLabResultsUrl,
      };

      const result = await completeAppointment(dataToSend);

      if (result.success) {
        toast.success('Lab Results PDF URL saved successfully!');
        clearLabOrders();
      } else {
        toast.error(result.error || 'Failed to save Lab Results URL');
      }
    } catch (error) {
      console.error('Error in lab results process:', error);

      if (error.message.includes('File upload failed') || error.message.includes('Upload failed')) {
        toast.error('Failed to upload Lab Results PDF. Please try again.');
      } else if (error.response?.status === 404) {
        toast.error('Appointment not found');
      } else if (error.response?.status === 400) {
        toast.error('Invalid data provided');
      } else {
        toast.error('Failed to save Lab Results URL. Please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="text-xl font-semibold mb-2 sm:mb-0">Lab & Imaging Order</h2>
          <div className="relative w-full sm:w-1/2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tests, categories, or descriptions..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <h3 className="text-lg font-medium mb-3">Select Tests by Category</h3>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredLabData.categories.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-lg font-medium">No tests found</p>
              <p className="text-sm">Try adjusting your search terms</p>
            </div>
          ) : (
            filteredLabData.categories.map((category) => (
              <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-4 bg-gray-50">
                  <h3 className="font-medium text-lg">{category.name}</h3>
                </div>
                <div className="p-4 border-t border-gray-200">
                  {category.subcategories.map((subcategory) => (
                    <SubcategorySection key={subcategory.id} subcategory={subcategory} onAddTest={addLabTest} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col">
        <h2 className="text-xl font-semibold mb-4">Order Summary ({selectedLabTests.length})</h2>
        {selectedLabTests.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500">
            <Microscope className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-lg font-medium">No tests added yet.</p>
            <p className="text-sm">Search or select from categories to add tests.</p>
          </div>
        ) : (
          <ul className="flex-1 space-y-2 text-sm text-gray-700 overflow-auto">
            {selectedLabTests.map((test, index) => (
              <li key={index} className="flex justify-between items-center p-2 border border-gray-100 rounded-full">
                {typeof test === 'object' ? test.testName || test.name || test.title : test}
                <button
                  className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full hover:bg-red-200"
                  onClick={() => removeLabTest(index)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="lg:col-span-2 flex justify-end space-x-3 mt-4">
        <button
          className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50"
          disabled={isGenerating || selectedLabTests.length === 0}
          onClick={() => {
            const generatePreview = async () => {
              const pdfDoc = (
                <MedicalSummaryPDF
                  prescribedDrugs={[]}
                  selectedLabTests={selectedLabTests}
                  type="lab-results"
                  patientName={currentPatient?.name}
                  patientId={currentPatient?.patientId}
                  doctorFirstName={firstName}
                  doctorLastName={lastName}
                />
              );
              const blob = await pdf(pdfDoc).toBlob();
              const url = URL.createObjectURL(blob);
              window.open(url, '_blank');
              URL.revokeObjectURL(url);
            };
            generatePreview();
          }}
        >
          Preview Order PDF
        </button>
        <button
          className="px-6 py-2 bg-[#00AAEE] text-white rounded-full hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={generateUploadAndSendLabURL}
          disabled={isGenerating || !currentAppointmentId || selectedLabTests.length === 0}
        >
          {isGenerating ? 'Processing...' : 'Upload & Send Lab Results'}
        </button>
      </div>
    </div>
  );
}
