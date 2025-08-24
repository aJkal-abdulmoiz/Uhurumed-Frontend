'use client';

import { useState } from 'react';
import ConsultNotes from '../NewComponents/ConsultNotes';
import PreviousVisits from '../NewComponents/PreviousVisits';
import Prescriptions from '../NewComponents/Prescriptions';
import LabResults from '../NewComponents/LabResults';

export default function ConsultDetails() {
  const [activeTab, setActiveTab] = useState('Consult Notes');

  const renderContent = () => {
    switch (activeTab) {
    case 'Consult Notes':
      return <ConsultNotes />;
    case 'Previous Visits':
      return <PreviousVisits />;
    case 'Prescriptions':
      return <Prescriptions />;
    case 'Lab Results':
      return <LabResults />;
    default:
      return null;
    }
  };

  return (
    <div className="min-h-screen mt-6 sm:mt-4 md:mt-8 p-2 sm:p-4 md:p-6">
      <div className="flex justify-center mb-3 sm:mb-4 md:mb-6">
        <div className="flex space-x-1 sm:space-x-2 md:space-x-4 bg-gray-100 rounded-md p-1 overflow-x-auto whitespace-nowrap w-full max-w-full sm:w-auto">
          {['Consult Notes', 'Previous Visits', 'Prescriptions', 'Lab Results'].map((tab) => (
            <button
              key={tab}
              className={`px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-md transition-colors duration-200 flex-shrink-0 min-w-fit ${
                activeTab === tab ? 'bg-white shadow text-gray-800' : 'text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {renderContent()}
    </div>
  );
}
