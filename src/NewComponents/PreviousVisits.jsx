'use client';

import { useState, useMemo } from 'react';
import { Search, CalendarDays, ChevronDown, ChevronUp } from 'lucide-react';
import { useConsultStore } from '../stores/consultStore';

const VisitCard = ({ doctor, specialty, date, time, summary, fullDescription, fullAppointment }) => {
  const [showFullDetails, setShowFullDetails] = useState(false);

  return (
    <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200 flex items-start space-x-2 sm:space-x-3">
      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0"></div>
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1 space-y-1 sm:space-y-0">
          <h3 className="font-semibold text-blue-600 text-sm sm:text-base">
            Dr. {doctor} <span className="text-gray-500 text-xs sm:text-sm">({specialty})</span>
          </h3>
          <span className="text-gray-500 text-xs sm:text-sm">
            {date} {time}
          </span>
        </div>
        <p className="text-gray-700 text-xs sm:text-sm font-semibold mb-2">Symptoms: {summary}</p>
        {showFullDetails && (
          <div className="mt-2 space-y-1 text-xs sm:text-sm text-gray-700">
            {fullAppointment?.status && (
              <p>
                <strong>Status:</strong> {fullAppointment.status}
              </p>
            )}
            {fullAppointment?.type && (
              <p>
                <strong>Type:</strong> {fullAppointment.type}
              </p>
            )}
            {fullAppointment?.consultation?.chiefComplaint && (
              <p>
                <strong>Chief Complaint:</strong> {fullAppointment.consultation.chiefComplaint}
              </p>
            )}
            {fullAppointment?.consultation?.assessment && (
              <p>
                <strong>Assessment:</strong> {fullAppointment.consultation.assessment}
              </p>
            )}
            {fullAppointment?.consultation?.diagnosis && (
              <p>
                <strong>Diagnosis:</strong> {fullAppointment.consultation.diagnosis}
              </p>
            )}
            {fullAppointment?.consultation?.plan && (
              <p>
                <strong>Plan:</strong> {fullAppointment.consultation.plan}
              </p>
            )}
            {fullAppointment?.consultation?.prescription && (
              <p>
                <strong>Prescription:</strong> {fullAppointment.consultation.prescription}
              </p>
            )}
            {fullAppointment?.consultation?.pdfUrl && (
              <p>
                <strong>Consultation PDF:</strong>{' '}
                <a
                  href={fullAppointment.consultation.pdfUrl || ''}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View PDF
                </a>
              </p>
            )}
            {fullAppointment?.consultation?.labResultsUrl && (
              <p>
                <strong>Lab Results:</strong>{' '}
                <a
                  href={fullAppointment.consultation.labResultsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Results
                </a>
              </p>
            )}
            {fullDescription && <p>{fullDescription}</p>}
          </div>
        )}
        <button
          className="text-blue-600 text-xs font-medium flex items-center hover:underline mt-2"
          onClick={() => setShowFullDetails(!showFullDetails)}
        >
          {showFullDetails ? 'Show Less' : 'More Details'}{' '}
          {showFullDetails ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
        </button>
      </div>
    </div>
  );
};

export default function PreviousVisits() {
  const { previousVisits } = useConsultStore();

  const [searchText, setSearchText] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');

  const uniqueDoctors = useMemo(() => {
    const doctors = previousVisits.map((visit) => visit.doctor);

    return [...new Set(doctors)];
  }, [previousVisits]);

  const filteredVisits = useMemo(() => {
    return previousVisits.filter((visit) => {
      const matchesSearchText =
        searchText === '' ||
        visit.summary.toLowerCase().includes(searchText.toLowerCase()) ||
        visit.doctor.toLowerCase().includes(searchText.toLowerCase()) ||
        visit.specialty.toLowerCase().includes(searchText.toLowerCase()) ||
        (visit.fullDescription && visit.fullDescription.toLowerCase().includes(searchText.toLowerCase()));

      const matchesDate = selectedDate === '' || visit.date === selectedDate;

      const matchesDoctor = selectedDoctor === '' || visit.doctor === selectedDoctor;

      return matchesSearchText && matchesDate && matchesDoctor;
    });
  }, [previousVisits, searchText, selectedDate, selectedDoctor]);

  return (
    <div className="p-3 sm:p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Previous Visits</h2>
      <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-4 mb-4 sm:mb-6">
        <div className="relative w-full md:w-auto flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search visits..."
            className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs sm:text-sm"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <div className="relative w-full md:w-auto">
          <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
          <input
            type="date"
            className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs sm:text-sm"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <div className="relative w-full md:w-auto">
          <select
            className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-3 sm:px-4 pr-6 sm:pr-8 rounded-md leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs sm:text-sm"
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
          >
            <option value="">Filter by Doctor</option>
            {uniqueDoctors.map((doctorName) => (
              <option key={doctorName} value={doctorName}>
                {doctorName}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
          </div>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {filteredVisits.length > 0 ? (
          filteredVisits.map((visit) => (
            <VisitCard
              key={visit.id}
              doctor={visit.doctor}
              specialty={visit.specialty}
              date={visit.date}
              time={visit.time}
              summary={visit.summary}
              fullDescription={visit.fullDescription}
              fullAppointment={visit.fullAppointment}
            />
          ))
        ) : (
          <p className="text-gray-600 text-sm sm:text-base">No previous visits available matching your filters.</p>
        )}
      </div>
    </div>
  );
}
