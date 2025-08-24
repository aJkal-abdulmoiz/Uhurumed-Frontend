import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Link, Stethoscope, Calendar, Pill, FlaskConical, User,ChevronDown,ChevronUp } from 'lucide-react';
import { useConsultStore } from '../stores/consultStore';
import { useAuthStore } from '@/stores/authStore';
import axios from 'axios';
import ApiConfig from '@/ApiConfig/ApiConfig';

const PatientInfoPanel = () => {
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('patient-info');

  const currentPatientFromStore = useConsultStore((state) => state.currentPatient);
  const { setPreviousVisits, setPrescribedDrugs, setSelectedLabTests, setCurrentPatient } = useConsultStore();

  const { user } = useAuthStore();
  const doctorId = user?.id;
  const isDoctor = user?.userType === 'DOCTOR';

  useEffect(() => {
    const fetchPatientAppointments = async () => {
      if (!currentPatientFromStore?.patientId || !user || !user.id || user.userType !== 'DOCTOR') {
        setLoading(false);
        setError('Patient ID or Doctor authentication details are missing/invalid.');
        setPatientData(null);

        return;
      }

      setLoading(true);
      setError(null);
      setPatientData(null);

      try {
        const response = await axios.get(ApiConfig.fetchPatientAppointments, {
          params: {
            patientId: currentPatientFromStore.patientId,
            limit: 100,
          },
          headers: {
            authorization: `Bearer ${user.token}`,
          },
        });

        const appointments = response.data.data.docs;

        if (appointments && appointments.length > 0) {
          const firstAppointment = appointments[0];
          const patientDetails = firstAppointment.patient;

          const mappedPatientData = {
            name: `${patientDetails.firstName || ''} ${patientDetails.lastName || ''}`.trim(),
            age: patientDetails.age || 'Unknown',
            gender: patientDetails.gender || 'Unknown',
            patientId: patientDetails.id,
            phone: patientDetails.phone || 'N/A',
            email: patientDetails.email || 'N/A',
            address: patientDetails.address || 'N/A',
            preferredPharmacy: 'N/A',
            allergies: patientDetails.allergies || [],

            consultNotes: appointments
              .filter((appt) => appt.consultation)
              .map((appt) => ({
                id: appt.consultation.id,
                date: new Date(appt.scheduledTime).toISOString().split('T')[0],
                title: `Consultation on ${new Date(appt.scheduledTime).toLocaleDateString()}`,
                fullDetails: appt.consultation,
              })),

            previousVisits: appointments.map((appt) => ({
              id: appt.id,
              date: new Date(appt.scheduledTime).toISOString().split('T')[0],
              doctor: `${appt.doctor?.firstName || ''} ${appt.doctor?.lastName || ''}`.trim(),
              summary: appt.symptoms || 'No symptoms recorded.',
              fullAppointment: appt,
            })),

            prescriptions: appointments
              .filter((appt) => appt.consultation?.prescription || appt.consultation?.pdfUrl || '')
              .map((appt) => ({
                id: appt.consultation.id + '-rx',
                date: new Date(appt.scheduledTime).toISOString().split('T')[0],
                medication: appt.consultation.prescription || 'See attached PDF',
                dosage: 'N/A',
                instructions: appt.consultation.prescription ? 'See prescription details' : 'See attached PDF',
                pdfUrl: appt.consultation.pdfUrl || '',
              })),
            labResults: appointments
              .filter((appt) => appt.consultation?.labResultsUrl)
              .map((appt) => ({
                id: appt.consultation.id + '-lab',
                date: new Date(appt.scheduledTime).toISOString().split('T')[0],
                testName: 'Lab Results',
                result: 'See details',
                details: { 'Report Link': appt.consultation.labResultsUrl },
                url: appt.consultation.labResultsUrl,
              })),
          };
          setPatientData(mappedPatientData);
          // Populate the Zustand store with the fetched data
          setPreviousVisits(mappedPatientData.previousVisits);
          // setPrescribedDrugs(mappedPatientData.prescriptions);
          // setSelectedLabTests(mappedPatientData.labResults);
          setError(null);
        } else {
          setPatientData(null);
          setError('No appointments found for this patient with this doctor.');
        }
      } catch (err) {
        console.error('Error fetching patient appointments:', err);
        setError('Failed to fetch patient data. Please ensure the API is running and accessible.');
        setPatientData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPatientAppointments();
  }, [currentPatientFromStore?.patientId, user]);

  const renderContent = () => {
    if (loading) {
      return <p className="text-sm sm:text-base">Loading patient info...</p>;
    }
    if (error) {
      return <p className="text-red-500 text-sm sm:text-base">{error}</p>;
    }
    if (!patientData) {
      return <p className="text-sm sm:text-base">No patient data available.</p>;
    }
    switch (activeTab) {
    case 'patient-info':
      return (
        <div className="space-y-4 sm:space-y-6">
          {/* Patient Header Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <img
              src="/patient-avatar.png"
              alt="Patient Avatar"
              width={60}
              height={60}
              className="w-15 h-15 sm:w-20 sm:h-20 rounded-full border-2 border-gray-200 object-cover"
            />
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{patientData.name}</h2>
              <p className="text-xs sm:text-sm text-gray-600">
                {patientData.age} years old • {patientData.gender} • Patient ID: {patientData.patientId}
              </p>
              {patientData.allergies && patientData.allergies.length > 0 && (
                <div className="mt-2 flex items-center gap-1 bg-blue-100 text-blue-700 px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
                  <Stethoscope className="w-3 h-3" />

                    Allergies: {patientData.allergies || ''}
                </div>
              )} 
            </div>
          </div>
          {/* Contact and Location Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-gray-700 text-sm sm:text-base">
            <div className="flex items-center gap-2">
              <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
              <span className="text-xs sm:text-sm">{patientData.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
              <span className="text-xs sm:text-sm">{patientData.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
              <span className="text-xs sm:text-sm">{patientData.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Link className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
              <span className="text-xs sm:text-sm">Preferred Pharmacy: {patientData.preferredPharmacy}</span>
            </div>
          </div>
        </div>
      );
    case 'consult-notes':
      return (
        <div className="space-y-3 sm:space-y-4">
          {patientData.consultNotes.length > 0 ? (
            patientData.consultNotes.map((note) => (
              <div key={note.id} className="p-3 sm:p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mb-2">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{note.date}</span>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">{note.title}</h3>
                {note.fullDetails?.chiefComplaint && (
                  <p className="text-gray-700 text-xs sm:text-sm mt-1">
                      Chief Complaint: {note.fullDetails.chiefComplaint}
                  </p>
                )}
                {note.fullDetails?.assessment && (
                  <p className="text-gray-700 text-xs sm:text-sm mt-1">Assessment: {note.fullDetails.assessment}</p>
                )}
                {note.fullDetails?.historyOfPresentIllness && (
                  <p className="text-gray-700 text-xs sm:text-sm mt-1">
                      History of Present Illness: {note.fullDetails.historyOfPresentIllness}
                  </p>
                )}
                {note.fullDetails?.plan && (
                  <p className="text-gray-700 text-xs sm:text-sm mt-1">Plan: {note.fullDetails.plan}</p>
                )}
                {note.fullDetails?.diagnosis && (
                  <p className="text-gray-700 text-xs sm:text-sm mt-1">Diagnosis: {note.fullDetails.diagnosis}</p>
                )}
                {note.fullDetails?.prescription && (
                  <p className="text-gray-700 text-xs sm:text-sm mt-1">
                      Prescription: {note.fullDetails.prescription}
                  </p>
                )}
                {note.fullDetails?.pdfUrl && (
                  <a
                    href={note.fullDetails.pdfUrl || ''}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-xs sm:text-sm mt-1 block"
                  >
                      View Consultation PDF
                  </a>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-sm sm:text-base">
                No consult notes available from fetched appointments.
            </p>
          )}
        </div>
      );
    case 'previous-visits':
      return (
        <div className="space-y-3 sm:space-y-4">
          {patientData.previousVisits.length > 0 ? (
            patientData.previousVisits.map((visit) => (
              <div
                key={visit.id}
                className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200 flex items-start space-x-2 sm:space-x-3"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1 space-y-1 sm:space-y-0">
                    <h3 className="font-semibold text-blue-600 text-sm sm:text-base">
                        Dr. {visit.doctor}{' '}
                      <span className="text-gray-500 text-xs sm:text-sm">
                          ({visit.fullAppointment?.specialization || 'General'})
                      </span>
                    </h3>
                    <span className="text-gray-500 text-xs sm:text-xs">{visit.date}</span>
                  </div>
                  <p className="text-gray-700 text-xs sm:text-xs font-semibold mb-2">Symptoms: {visit.summary}</p>
                  <p className="text-gray-700 text-xs sm:text-xs font-semibold mb-2">Status: {visit.fullAppointment.status}
                  </p>
                  <p className="text-gray-700 text-xs sm:text-xs font-semibold mb-2">Type: {visit.fullAppointment.type}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-sm sm:text-base">No previous visits recorded.</p>
          )}
        </div>
      );
    case 'prescriptions':
      return (
        <div className="space-y-3 sm:space-y-4">
          {patientData.prescriptions.length > 0 ? (
            patientData.prescriptions.map((rx) => (
              <div key={rx.id} className="p-3 sm:p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mb-2">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{rx.date}</span>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">
                  <Pill className="inline-block w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-500" />
                  {rx.medication} {rx.dosage !== 'N/A' && `(${rx.dosage})`}
                </h3>
                <p className="text-gray-700 text-xs sm:text-sm">Instructions: {rx.instructions}</p>
                {rx.pdfUrl && (
                  <a
                    href={rx.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-xs sm:text-sm mt-1 block"
                  >
                      View Prescription PDF
                  </a>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-sm sm:text-base">No prescriptions issued from fetched appointments.</p>
          )}
        </div>
      );
    case 'lab-results':
      return (
        <div className="space-y-3 sm:space-y-4">
          {patientData.labResults.length > 0 ? (
            patientData.labResults.map((lab) => (
              <div key={lab.id} className="p-3 sm:p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mb-2">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{lab.date}</span>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">
                  <FlaskConical className="inline-block w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-500" />
                  {lab.testName}: <span className="font-bold">{lab.result}</span>
                </h3>
                {lab.details && (
                  <ul className="list-disc list-inside text-xs sm:text-sm text-gray-700 mt-2">
                    {Object.entries(lab.details).map(([key, value]) => (
                      <li key={key}>
                        <strong>{key}:</strong> {value}
                      </li>
                    ))}
                  </ul>
                )}
                {lab.url && (
                  <a
                    href={lab.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-xs sm:text-sm mt-1 block"
                  >
                      View Lab Results
                  </a>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-sm sm:text-base">No lab results available from fetched appointments.</p>
          )}
        </div>
      );
    default:
      return null;
    }
  };

  return (
    <div className="w-full md:w-3/5 p-3 sm:p-4 bg-white rounded-xl shadow-lg border">
      {/* Tabs for Patient Information */}
      <div className="flex space-x-1 sm:space-x-2 mb-4 sm:mb-6 border-b pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('patient-info')}
          className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium ${
            activeTab === 'patient-info' ? 'bg-[#00AAEE] text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Patient Info
        </button>
        <button
          onClick={() => setActiveTab('consult-notes')}
          className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium ${
            activeTab === 'consult-notes' ? 'bg-[#00AAEE] text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Consult Notes
        </button>
        <button
          onClick={() => setActiveTab('previous-visits')}
          className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium ${
            activeTab === 'previous-visits' ? 'bg-[#00AAEE] text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Previous Visits
        </button>
        <button
          onClick={() => setActiveTab('prescriptions')}
          className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium ${
            activeTab === 'prescriptions' ? 'bg-[#00AAEE] text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Prescriptions
        </button>
        <button
          onClick={() => setActiveTab('lab-results')}
          className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium ${
            activeTab === 'lab-results' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Lab Results
        </button>
      </div>

      {/* Content based on active tab */}
      <div className="p-3 sm:p-4 rounded-lg border border-gray-100 max-h-[400px] sm:max-h-[550px] overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default PatientInfoPanel;
