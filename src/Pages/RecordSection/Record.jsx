import { useState, useEffect } from 'react';
import UpdateVitalsModal from '../../NewComponents/userDashboard/UpdateVitalsModal';
import { useProfileStore } from '@/stores/ProfileStore';
import { updateProfile } from '@/queries/DoctorQueries/update';
import moment from 'moment';
import { getAppointments } from '@/queries/PatientQueries/appointments';
import { useNavigate } from 'react-router-dom';
import { useConsultStore } from '@/stores/consultStore';
import toast from 'react-hot-toast';

export default function RecordPage() {
  // Helper component for SVG icons
  const SvgIcon = ({ iconPath, className }) => (
    <svg className={className}>
      <use xlinkHref={iconPath} />
    </svg>
  );

  const [appointments, setAppointments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSoapDetailsOpen, setIsSoapDetailsOpen] = useState(false);
  const {
    firstName,
    lastName,
    dateOfBirth,
    gender,
    profilePic,
    nationality,
    country,
    email,
    phone,
    allergies,
    chronicCondition,
    heartRate: initialHeartRate,
    emergencyContactPhone,
    setProfileData,
    bloodPressure: initialBloodPressure,
    height: initialHeight,
    weight: initialWeight,
    bmi: initialBMI,
  } = useProfileStore();

  const navigate = useNavigate();
  const { setCurrentPatient, setCurrentAppointmentId } = useConsultStore();
  // Initialize vitals with useProfileStore values
  const [vitals, setVitals] = useState({
    weight: initialWeight || 0.0,
    height: initialHeight || 0.0,
    bloodPressure: initialBloodPressure || '',
    heartRate: initialHeartRate || 0,
    bmi: initialBMI || 0.0,
  });

  const calculateBMI = (weight, height) => {
    if (weight && height) {
      const heightM = height / 100;

      return (weight / (heightM * heightM)).toFixed(1);
    }

    return 'N/A';

  };

  const handleVitalsUpdate = async (updatedData) => {



    const updatedVitals = {
      weight: updatedData.weight,
      height: updatedData.height,
      bmi: calculateBMI(updatedData.weight, updatedData.height),
      heartRate: updatedData.heartRate,
      bloodPressure: updatedData.bloodPressure,
    };

    try {
      setVitals(updatedVitals);
      if (setProfileData) {
        setProfileData(updatedVitals);
      }
      const res = await updateProfile(updatedVitals);
      if (res.success) {
        toast.success('Vitals updated successfully');
      } else {
        toast.error('Failed to update vitals');
      }



    } catch (error) {
      console.error('Error updating vitals:', error);
      setVitals({
        weight: initialWeight || 0.0,
        height: initialHeight || 0.0,
        bloodPressure: initialBloodPressure || '',
        heartRate: initialHeartRate || 0,
        bmi: initialBMI || 0.0,
      });
    }
  };

  useEffect(() => {
    if (setProfileData) {
      setProfileData(vitals);
    }
  }, [vitals, setProfileData]);

  const fetchAppointments = async () => {
    try {
      const result = await getAppointments({ limit: 1 });
      console.log('API Result:', result);



      if (result.success) {
        const formattedAppointments = result.data.map((appointment, index) => ({
          id: appointment.id,
          serialNo: index + 1,
          time: appointment.slotTime || 'N/A',
          date: moment(appointment.createdAt).format('MMM D, YYYY h:mm A'),
          appointmentDate: moment(appointment.scheduledTime).format('MMM D, YYYY h:mm A'),
          doctorName: appointment.doctorName || 'N/A',
          phone: appointment.patient?.phone || 'N/A',
          paymentType: appointment.paymentType || 'N/A',
          status: appointment.status,
          meetingLink: appointment.meetingLink,
          type: appointment.type,
          rawData: appointment,
          symptoms: appointment.symptoms || 'N/A',
          labresultsUrl: appointment.consultation?.labResultsUrl || '#',
          prescriptionUrl: appointment.consultation?.pdfUrl || '#',
          chiefComplaint: appointment.consultation?.chiefComplaint || 'N/A',
          assessment: appointment.consultation?.assessment || 'N/A',
        }));



        setAppointments(formattedAppointments);
      } else {
        console.log('API Error:', result.message);
        setAppointments([]);
      }
    } catch (err) {
      setAppointments([]);
      console.error('Fetch Appointments Error:', err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Handle "View Details" button click to open SoapDetailModal
  const onViewDetails = () => {
    if (appointments.length > 0) {
      setIsSoapDetailsOpen(true);
    }
  };


  const handleViewDetails = (appointmentData) => {
    navigate('/appointment-details', {
      state: { appointment: appointmentData },
    });
  };


  return (
    <div className="min-h-screen mx-auto">
      <main className="mb-4 sm:mb-6 mt-12 sm:mt-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 mt-10">Electronic Medical Record</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Patient Information Card */}
          <div className="bg-white rounded-2xl border border-[#0000004D] shadow-md p-6">
            <div className="flex flex-col items-center md:flex-row md:items-start gap-6">
              <div className="flex flex-col items-center w-full md:w-1/5">
                <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center mb-4">
                  <img src={profilePic} alt="Steve Norman" className="h-full w-full object-cover" />
                </div>
                <div className="text-sm text-center">
                  <span className="text-blue-600 font-medium">Health Insurance:</span>{' '}
                  <span className="text-gray-700">None</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-4">
                <div className="flex items-center mb-1">
                  <h2 className="text-xl font-semibold text-gray-900 mr-2">{firstName} {lastName}</h2>
                  <span className="bg-[#04A4E2] text-white px-2 py-0.5 rounded-full text-xs font-medium">Active</span>
                </div>
                <div className="flex flex-col md:flex-row md:justify-between gap-y-3 md:gap-x-6">
                  <div className="flex flex-col gap-3 text-sm text-gray-700 md:w-2/3">
                    <div className="whitespace-nowrap">
                      <span className="font-bold">Email:</span> {email}
                    </div>
                    <div className="whitespace-nowrap">
                      <span className="font-bold">Phone:</span> {phone}
                    </div>
                    <div>
                      <span className="font-bold">Nationality:</span> {nationality}
                    </div>
                    <div>
                      <span className="font-bold">Country:</span> {country}
                    </div>
                    <div className="whitespace-nowrap">
                      <span className="font-bold">Emergency Contact:</span> {emergencyContactPhone}
                    </div>
                    <div>
                      <span className="font-bold">Patient Since:</span> 02/06/2025
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 text-sm text-gray-700 md:w-1/3">
                    <div>
                      <span className="font-bold">Age:</span> {new Date().getFullYear() - new Date(dateOfBirth).getFullYear()}
                    </div>
                    <div>
                      <span className="font-bold">DOB:</span> {dateOfBirth.slice(0, 10)}
                    </div>
                    <div>
                      <span className="font-bold">Gender:</span> {gender}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Medical History Card */}
          <div className="bg-white rounded-2xl border border-[#0000004D] shadow-md p-6">
            <div className="pb-4">
              <h2 className="text-xl font-semibold text-gray-900">Medical History</h2>
            </div>
            <div className="grid gap-3 text-sm text-gray-700">
              <div className="flex items-start">
                <SvgIcon iconPath="icons/icon0.svg" className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
                <div>
                  <span className="font-medium">Chronic Conditions:</span> {chronicCondition}
                </div>
              </div>
              <div className="flex items-start">
                <SvgIcon iconPath="icons/icon2.svg" className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
                <div>
                  <span className="font-medium">Allergies:</span> {allergies}
                </div>
              </div>
              <div className="flex items-start">
                <SvgIcon iconPath="icons/icon3.svg" className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
                <div>
                  <span className="font-medium">Previous Hospitalizations:</span> None
                </div>
              </div>
              <div className="flex items-start">
                <SvgIcon iconPath="icons/icon4.svg" className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
                <div>
                  <span className="font-medium">Surgical History:</span>
                  <ul className="ml-4">
                    <li>
                      <span className="font-medium">2015:</span> Appendectomy - No complications
                    </li>
                    <li>
                      <span className="font-medium">2018:</span> Tonsillectomy - Recovered well
                    </li>
                  </ul>
                </div>
              </div>
              <div className="flex items-start">
                <SvgIcon iconPath="icons/icon5.svg" className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
                <div>
                  <span className="font-medium">Immunizations:</span>
                  <ul className="ml-4">
                    <li>
                      <span className="font-medium">12-04-2018:</span> Hepatitis B
                    </li>
                    <li>
                      <span className="font-medium">09-12-2018:</span> Tetanus
                    </li>
                    <li>
                      <span className="font-medium">2020:</span> COVID-19 Dose 1
                    </li>
                    <li>
                      <span className="font-medium">2020:</span> COVID-19 Dose 2
                    </li>
                    <li>
                      <span className="font-medium">12-09-2022:</span> COVID-19 Booster
                    </li>
                  </ul>
                </div>
              </div>
              <div className="flex items-start">
                <SvgIcon iconPath="icons/icon6.svg" className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
                <div>
                  <span className="font-medium">Current Medications:</span> See Medications section
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* SOAP Note Card */}
          <div className="bg-white rounded-2xl border border-[#0000004D] shadow-md p-6">
            <div className="flex flex-row items-center justify-between pb-4">
              <h2 className="text-xl font-semibold text-gray-900">SOAP Note</h2>
              {appointments.length > 0 && (
                <button
                  onClick={() => handleViewDetails(appointments[0].rawData)}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-[#04A4E2] bg-[#04A4E2] text-white hover:bg-[#038DC8] h-8 px-3"
                >
                  View Details
                </button>
              )}
            </div>
            <div className="grid gap-3 text-sm text-gray-700">
              <p className="font-medium">Latest SOAP Notes:</p>
              {appointments.length > 0 ? (
                <>
                  <div className="flex items-start">
                    <SvgIcon iconPath="icons/icon7.svg" className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
                    <div>
                      <span className="font-medium">Symptoms:</span> {appointments[0].symptoms}
                    </div>
                  </div>
                  <div className="flex items-start">
                    <SvgIcon iconPath="icons/icon8.svg" className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
                    <div>
                      <span className="font-medium">Lab Results:</span>{' '}
                      <a
                        className="text-[#04A4E2] underline"
                        href={appointments[0].labresultsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Details
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <SvgIcon iconPath="icons/icon10.svg" className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
                    <div>
                      <span className="font-medium">Prescription:</span>{' '}
                      <a
                        className="text-[#04A4E2] underline"
                        href={appointments[0].prescriptionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Details
                      </a>
                    </div>
                  </div>
                </>
              ) : (
                <div>Loading ...</div>
              )}
            </div>
          </div>

          {/* Vitals Card */}
          <div className="bg-white rounded-2xl border border-[#0000004D] shadow-md p-6">
            <div className="flex flex-row items-center justify-between pb-4">
              <h2 className="text-xl font-semibold text-gray-900">Vitals</h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-[#04A4E2] bg-[#04A4E2] text-white hover:bg-[#038DC8] h-8 px-3"
              >
                Update Vitals
              </button>
            </div>
            <div className="grid gap-3 text-sm text-gray-700">
              <p className="font-medium">Vitals Details:</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <SvgIcon iconPath="icons/icon11.svg" className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
                  <span className="font-medium">Heart Rate:</span> {vitals.heartRate} bpm
                </div>
                <div className="flex items-center">
                  <SvgIcon iconPath="icons/icon12.svg" className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
                  <span className="font-medium">BMI:</span> {vitals.bmi}{' '}
                  {vitals.bmi !== 'N/A' && vitals.bmi < 18.5
                    ? '(Underweight)'
                    : vitals.bmi > 24.9
                      ? '(Overweight)'
                      : '(Normal)'}
                </div>
              </div>
              <div className="flex items-center">
                <SvgIcon iconPath="icons/icon13.svg" className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
                <span className="font-medium">Height:</span> {vitals.height}cm
              </div>
              <div className="flex items-center">
                <SvgIcon iconPath="icons/icon14.svg" className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
                <span className="font-medium">Weight:</span> {vitals.weight}Kg
              </div>
              <div className="flex items-center">
                <SvgIcon iconPath="icons/icon15.svg" className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
                <span className="font-medium">Blood Pressure:</span> {vitals.bloodPressure} mmHg
              </div>
            </div>
          </div>

          {/* Medication Card */}
          <div className="bg-white rounded-2xl border border-[#0000004D] shadow-md p-6 lg:col-span-1">
            <div className="pb-4">
              <h2 className="text-xl font-semibold text-gray-900">Medication</h2>
            </div>
            <div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-700">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-2 font-semibold">Name</th>
                      <th scope="col" className="px-4 py-2 font-semibold">Dose</th>
                      <th scope="col" className="px-4 py-2 font-semibold">Frequency</th>
                      <th scope="col" className="px-4 py-2 font-semibold">Condition</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white border-b">
                      <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap">Carvedilol</td>
                      <td className="px-4 py-2">3.5 mg</td>
                      <td className="px-4 py-2">q4t pm</td>
                      <td className="px-4 py-2">3.5 mg</td>
                    </tr>
                    <tr className="bg-white border-b">
                      <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap">Aspitine</td>
                      <td className="px-4 py-2">39 mg</td>
                      <td className="px-4 py-2">1 daily</td>
                      <td className="px-4 py-2">Diabetes</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap">Panadol</td>
                      <td className="px-4 py-2">1.5 mg</td>
                      <td className="px-4 py-2">1 daily</td>
                      <td className="px-4 py-2">Migraine</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      <UpdateVitalsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdateVitals={handleVitalsUpdate}
        initialVitals={vitals}
      />

    </div>
  );
}


// import {
//   Box,
//   Container,
//   Grid,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableRow,
//   Typography,
//   Paper,
//   TableHead,
//   CircularProgress,
//   Button,
//   IconButton,
//   Avatar,
//   Tabs,
//   Tab,
// } from '@mui/material';
// import React, { useContext, useEffect, useState } from 'react';
// import { AuthContext } from '../../Context/Auth';
// import ApiConfig from '../../ApiConfig/ApiConfig';
// import axios from 'axios';
// import moment from 'moment';
// import { ro } from 'date-fns/locale';
// import { useNavigate } from 'react-router-dom';
// import SubscribeUserList from '../SubscribeUserList/SubscribeUserList';
// import { BsCloudDownloadFill } from 'react-icons/bs';
// import { getBase64 } from '../../utils';
// import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';

// pdfMake.vfs = pdfFonts?.pdfMake?.vfs;

// const Record = () => {
//   const navigate = useNavigate();
//   const handleAppoinmet = () => {
//     navigate('/appointment-user');
//   };
//   const auth = useContext(AuthContext);
//   const userData = auth?.userData;
//   const [loading, setLoading] = useState(false);
//   const [doctors, setDoctors] = useState([]);
//   const [selectedDoctor, setSelectedDoctor] = useState(null);
//   const [value, setValue] = React.useState(1);

//   const pdfDownload = async (row) => {
//     const logoBase64 = await getBase64('Images/uhuruMedHDLogo.jpeg');
//     // const parsedReport = JSON.parse(medicalReport || '[]'); // Step 1: Parse JSON string

//     const medicineRows = userData?.medical_report?.map((med, index) => [
//       `${index + 1}`,
//       `${med.name} (${med.id})`, // Medicine name and ID
//       med.description || 'N/A', // Description
//     ]);

//     // console.log("DSgsfdgfsd", medicineRows);
//     const docDefinition = {
//       content: [
//         {
//           columns: [
//             {
//               image: logoBase64,
//               width: 40,
//               alignment: 'center',
//               margin: [0, 0, 0, 20],
//               style: 'logos',
//             },
//             {
//               text: 'UhuruMed',
//               style: 'invoiceTitle',
//             },
//             {
//               text: [
//                 {
//                   text: `Appointment: ${
//                     row?.consultation?.appointmentId || '--'
//                   }`,
//                   bold: true,
//                   fontSize: 10,
//                   alignment: 'right',
//                 },
//                 {
//                   text: '\n',
//                 },
//                 {
//                   text: `Date: ${moment(row?.created_at).format('DD-MM-YYYY')}`,
//                   bold: true,
//                   fontSize: 10,
//                   alignment: 'right',
//                   // margin: [60, 0, 30, 0],
//                 },
//               ],
//               style: 'invoiceTitle',
//             },
//           ],
//         },

//         {
//           text: 'Patient Information:',
//           style: 'sectionHeader',
//           margin: [0, 20, 0, 8],
//         },

//         {
//           table: {
//             widths: ['25%', '75%'],
//             body: [
//               [
//                 { text: 'Full Name:', fontSize: 10 },
//                 {
//                   text: row?.patient?.firstName || '--',
//                   fontSize: 10,
//                 },
//               ],
//               [
//                 { text: 'Email Id:', fontSize: 10 },
//                 {
//                   text: row?.patient?.email || '--',
//                   fontSize: 10,
//                 },
//               ],
//               [
//                 { text: 'Patient ID:', fontSize: 10 },
//                 {
//                   text: row?.patient?.id || '--',
//                   fontSize: 10,
//                 },
//               ],
//               [
//                 { text: 'Phone Number:', fontSize: 10 },
//                 {
//                   text: row?.patient?.phone || '--',
//                   fontSize: 10,
//                 },
//               ],

//             ],
//           },

//           layout: 'noBorders',
//         },

//         {
//           text: 'Doctor Information:',
//           style: 'sectionHeader',
//           margin: [0, 20, 0, 8],
//         },
//         {
//           table: {
//             widths: ['25%', '75%'],
//             body: [
//               [
//                 { text: 'Name:', fontSize: 10 },
//                 {
//                   text: row?.doctorName || '--',
//                   fontSize: 10,
//                 },
//               ],
//               [
//                 { text: 'Specialization:', fontSize: 10 },
//                 {
//                   text: row?.specialization || '--',
//                   fontSize: 10,
//                 },
//               ],
//               [
//                 { text: 'license ID:', fontSize: 10 },
//                 {
//                   text: row?.doctor?.licenseNumber || '--',
//                   fontSize: 10,
//                 },
//               ],
//               [
//                 { text: 'Clinic/Hospital Name:', fontSize: 10 },
//                 {
//                   text: 'UhuruMed' || '--',
//                   fontSize: 10,
//                 },
//               ],
//             ],
//           },

//           layout: 'noBorders',
//         },
//         {
//           text: 'Chief Complaints:',
//           style: 'sectionHeader',
//           margin: [0, 20, 0, 8],
//         },
//         {
//           table: {
//             widths: ['75%'],
//             body: [
//               [
//                 {
//                   text: row?.symptoms || '--',
//                   fontSize: 10,
//                 },
//               ],
//             ],
//           },
//           layout: 'noBorders',
//         },
//         {
//           text: 'Medical History:',
//           style: 'sectionHeader',
//           margin: [0, 20, 0, 8],
//         },
//         {
//           table: {
//             widths: ['25%', '75%'],
//             body: [
//               [
//                 { text: 'Medical History:', fontSize: 10 },
//                 {
//                   text: row?.patient?.medicalHistory || '--',
//                   fontSize: 10,
//                 },
//               ],
//               [
//                 { text: 'Allergiesy:', fontSize: 10 },
//                 {
//                   text: row?.patient?.allergies || '--',
//                   fontSize: 10,
//                 },
//               ],
//             ],
//           },
//           layout: 'noBorders',
//         },
//         {
//           text: 'Prescribed Medications:',
//           style: 'sectionHeader',
//           margin: [0, 10, 0, 10], // left, top, right, bottom
//         },
//         {
//           table: {
//             widths: ['25%', '75%'],
//             body: [
//               [
//                 { text: 'Prescription:', fontSize: 10, margin: [0, 0, 0, 0] },
//                 {
//                   text: row?.consultation?.prescription || '--',
//                   fontSize: 10,
//                   margin: [0, 0, 0, 0],
//                 },
//               ],
//               [
//                 { text: 'Notes:', fontSize: 10, margin: [0, 0, 0, 0] },
//                 {
//                   text: row?.consultation?.notes || '--',
//                   fontSize: 10,
//                   margin: [0, 0, 0, 0],
//                 },
//               ],
//               [
//                 { text: 'Date:', fontSize: 10, margin: [0, 0, 0, 0] },
//                 {
//                   text:
//                     moment(row?.consultation?.createdAt).format('LLL') || '--',
//                   fontSize: 10,
//                   margin: [0, 10, 0, 10], // left, top, right, bottom
//                 },
//               ],
//             ],
//           },
//           layout: {
//             paddingTop: () => 5,
//             paddingBottom: () => 0,
//             paddingLeft: () => 10,
//             paddingRight: () => 0,
//           },
//         },

//         {
//           table: {
//             widths: ['25%', '75%'],
//             body: [
//               [
//                 {
//                   text: 'Follow-up Date:',
//                   fontSize: 10,
//                   margin: [0, 10, 0, 10], // left, top, right, bottom
//                 },
//                 {
//                   text:
//                     moment(row?.consultation?.followUpDate).format('lll') ||
//                     '--',
//                   fontSize: 10,
//                   margin: [0, 10, 0, 10], // left, top, right, bottom
//                 },
//               ],
//             ],
//           },
//           layout: 'noBorders',
//         },
//       ],
//       footer: function (currentPage, pageCount) {
//         return {
//           margin: [40, 10],
//           fontSize: 8,
//           alignment: 'center',
//           stack: [
//             {
//               text: 'Hospital Policies: All patients must carry a valid photo ID. Claims must be submitted within 30 days of treatment. Pre-authorization required for planned procedures. Emergency cases must be reported within 24 hours. Incomplete forms may delay processing. Policies may change without notice.\n Address: 19 Kofi Annan Street, Airport Residential Area, Accra, Ghana \n Phone: 0537587588 \n Email: info@uhurucare.com',
//             },
//           ],
//         };
//       },
//       styles: {
//         invoiceTitle: {
//           fontSize: 22,
//           bold: true,
//           color: '#00077CC',
//         },
//         sectionHeader: {
//           fontSize: 14,
//           bold: true,
//           color: '#154360',
//         },
//         footer: {
//           fontSize: 11,
//           italics: true,
//           color: '#7D6608',
//         },
//       },
//     };

//     pdfMake.createPdf(docDefinition).download('Invoice.pdf');
//   };

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };
//   const birthday = userData?.dateOfBirth
//     ? new Date(userData.dateOfBirth).toISOString().split('T')[0]
//     : '';

//   const patientData = {
//     'Patient Name': userData?.firstName ?? '__',
//     'Date of Birth': birthday ?? '__',
//     Gender: userData?.gender,
//     Email: userData?.email,
//     Phone: userData?.phone,
//     Address: userData?.address,
//   };

//   const visitData = {
//     Medical: userData?.medicalHistory,
//     Allergies: userData?.allergies,
//     'Blood Group': userData?.bloodGroup,
//     Height: userData?.height,
//     Weight: userData?.weight,
//   };

//   const insuranceData = {
//     Provider: 'Blue Cross',
//     Plan: 'Premium Plus',
//     'Member ID': 'BC12345678',
//     'Valid Until': '12/31/2025',
//   };

//   // Additional data for right side papers
//   const medicationData = {
//     'Medication Name': 'Atorvastatin',
//     Dosage: '10 mg',
//     Frequency: 'Once daily',
//     Duration: '6 months',
//     'Start Date': '01/01/2025',
//     'Prescribing Doctor': 'Dr. John Smith',
//     Pharmacy: 'Main Street Pharmacy',
//     'Refills Left': 2,
//     Instructions: 'Take with food in the evening',
//     'Side Effects': 'Muscle pain, dizziness',
//     Severity: 'Moderate',
//   };

//   const rows = [{}];

//   const allergyData = {
//     Allergies: 'Penicillin',
//     Reaction: 'Rash',

//     'Last Reaction Date': '04/15/2023',
//     Plan: 'Premium Plus',
//     'Medication Status': 'Active',
//   };

//   const paperStyle = {
//     borderColor: '#c6d9ec',
//     borderRadius: '8px',
//     overflow: 'hidden',
//     fontFamily: 'Arial, sans-serif',
//     marginTop: '10px',
//   };

//   const headerBoxStyle = {
//     backgroundColor: '#e6f0fb',
//     padding: '10px 16px',
//     borderBottom: '1px solid #c6d9ec',
//   };

//   const labelValueBoxStyle = {
//     display: 'flex',
//     justifyContent: 'space-between',
//     paddingY: '4px',
//     gap: { xs: '4rem', md: '20rem' },
//   };

//   const handleRowClick = (row) => {
//     setSelectedDoctor(row);
//   };

//   useEffect(() => {
//     if (doctors?.length > 0) {
//       setSelectedDoctor(doctors[0]);
//     }
//   }, [doctors]);

//   const getAllDoctors = async () => {
//     const token = window.localStorage.getItem('UhuruMedToken');
//     setLoading(true);

//     try {
//       const response = await axios({
//         method: 'GET',
//         url: ApiConfig.appointmentUserList,
//         headers: {
//           authorization: `Bearer ${token}`,
//         },
//         // params: {
//         //   page: page,
//         //   limit: 200,
//         //   search: searchQuery,
//         // },
//       });
//       console.log('successsuccess', response?.data?.success);
//       if (response?.data?.error === 'false') {
//         setLoading(false);

//         console.log('responseresponse', response);
//         setDoctors(response?.data?.data);
//         // setTotalPages(response?.data?.data?.[0]?.count);
//       }
//     } catch (error) {
//       setDoctors([]);
//       setLoading(false);

//       console.log('errorerror', error);

//       return error?.response;
//     }
//   };

//   useEffect(() => {
//     getAllDoctors();
//   }, []);

//   return (
//     <Container maxWidth="xxl">
//       <Box mb={3} sx={{ display: 'flex', justifyContent: 'center' }}>
//         <Tabs
//           value={value}
//           onChange={handleChange}
//           aria-label="disabled tabs example"
//         >
//           <Tab label="ELECTRONIC MEDICAL RECORD" />
//           <Tab label="MEDICAL REPORT" />
//         </Tabs>
//       </Box>
//       {value === 1 ? (
//         <>
//           <SubscribeUserList />
//         </>
//       ) : (
//         <>
//           <Box>
//             <Box
//               mb={2.5}
//               sx={{
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 flexDirection: { xs: 'column', md: 'row' },
//               }}
//             >
//               <Typography
//                 variant="h4"
//                 sx={{
//                   fontSize: '30px',
//                   fontWeight: '700',
//                   fontFamily: 'rubik',
//                 }}
//               >
//                 {value === 1 ? 'Medical Report' : 'Electronic Medical Record'}
//               </Typography>
//             </Box>
//             <Grid container spacing={2}>
//               {/* Left column */}
//               <Grid item xs={12} sm={6} md={6}>
//                 {/* Patient Profile */}
//                 <Paper variant="outlined" sx={paperStyle}>
//                   <Box sx={headerBoxStyle}>
//                     <Typography
//                       variant="subtitle1"
//                       sx={{ fontWeight: 'bold', color: '#1a1a1a' }}
//                     >
//                       Patient Profile
//                     </Typography>
//                   </Box>

//                   <Box sx={{ padding: '16px' }}>
//                     {Object.entries(patientData).map(([label, value]) => (
//                       <Box key={label} sx={labelValueBoxStyle}>
//                         <Typography
//                           variant="body2"
//                           sx={{
//                             color: '#333',
//                             fontWeight: 400,
//                             fontSize: '14px',
//                           }}
//                         >
//                           {label}
//                         </Typography>
//                         <Typography
//                           variant="body2"
//                           sx={{
//                             color: '#000',
//                             fontWeight: 500,
//                             fontSize: '14px',
//                           }}
//                         >
//                           {value != null ? value : 'N/A'}
//                         </Typography>
//                       </Box>
//                     ))}
//                   </Box>
//                 </Paper>

//                 {/* Medical History */}
//                 <Paper variant="outlined" sx={paperStyle}>
//                   <Box sx={headerBoxStyle}>
//                     <Typography
//                       variant="subtitle1"
//                       sx={{ fontWeight: 'bold', color: '#1a1a1a' }}
//                     >
//                       Medical History
//                     </Typography>
//                   </Box>

//                   <Box sx={{ padding: '16px' }}>
//                     {Object.entries(visitData).map(([label, value]) => (
//                       <Box key={label} sx={labelValueBoxStyle}>
//                         <Typography
//                           variant="body2"
//                           sx={{
//                             color: '#333',
//                             fontWeight: 400,
//                             fontSize: '14px',
//                           }}
//                         >
//                           {label}
//                         </Typography>
//                         <Typography
//                           variant="body2"
//                           sx={{
//                             color: '#000',
//                             fontWeight: 500,
//                             fontSize: '14px',
//                           }}
//                         >
//                           {value != null ? value : 'N/A'}
//                         </Typography>
//                       </Box>
//                     ))}
//                   </Box>
//                 </Paper>
//               </Grid>

//               {/* Right column */}
//               <Grid item xs={12} sm={6} md={6}>
//                 {/* Medication Details */}
//                 <Paper variant="outlined" sx={paperStyle}>
//                   <Box sx={headerBoxStyle}>
//                     <Typography
//                       variant="subtitle1"
//                       sx={{ fontWeight: 'bold', color: '#1a1a1a' }}
//                     >
//                       Medication Details
//                     </Typography>
//                   </Box>
//                   <TableContainer
//                     component={Paper}
//                     sx={{
//                       backgroundColor: '#fff',
//                       color: '#fff',
//                       borderRadius: '8px',
//                       overflow: 'hidden',
//                     }}
//                   >
//                     <Table>
//                       <TableHead>
//                         <TableRow>
//                           <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>
//                             Doctor Name
//                           </TableCell>
//                           <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>
//                             Appointment Date
//                           </TableCell>
//                           <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>
//                             Amount
//                           </TableCell>
//                           <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>
//                             Slot Time
//                           </TableCell>
//                           <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>
//                             Specialization
//                           </TableCell>
//                           <TableCell sx={{ color: '#000', fontWeight: 'bold' }}>
//                             Action
//                           </TableCell>
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>
//                         {loading ? (
//                           <TableRow>
//                             <TableCell colSpan={5} align="center">
//                               <CircularProgress size={24} />
//                             </TableCell>
//                           </TableRow>
//                         ) : doctors?.length === 0 ? (
//                           <TableRow>
//                             <TableCell colSpan={5} align="center">
//                               No data found
//                             </TableCell>
//                           </TableRow>
//                         ) : (
//                           doctors?.slice(0, 4)?.map((row, idx) => (
//                             <TableRow
//                               key={idx}
//                               sx={{
//                                 '&:last-child td, &:last-child th': {
//                                   border: 0,
//                                 },
//                                 borderBottom:
//                                   '1px solid rgba(255, 255, 255, 0.1)',
//                                 cursor: 'pointer',
//                               }}
//                               onClick={() => handleRowClick(row)} // <-- Your click handler
//                               hover
//                             >
//                               <TableCell sx={{ color: '#000' }}>
//                                 {row?.doctorName?.length > 12
//                                   ? `${row.doctorName.slice(0, 12)}...`
//                                   : row?.doctorName}
//                               </TableCell>

//                               <TableCell sx={{ color: '#000' }}>
//                                 {moment(row?.scheduledTime).format('lll')}
//                               </TableCell>
//                               <TableCell sx={{ color: '#000' }}>
//                                 {row?.paymentAmount}
//                               </TableCell>
//                               <TableCell sx={{ color: '#000' }}>
//                                 {row?.slotTime}
//                               </TableCell>

//                               <TableCell sx={{ color: '#000' }}>
//                                 {row?.specialization?.length > 12
//                                   ? `${row.specialization.slice(0, 12)}...`
//                                   : row?.specialization}
//                               </TableCell>
//                               <TableCell sx={{ color: '#000' }}>
//                                 <IconButton onClick={() => pdfDownload(row)}>
//                                   <BsCloudDownloadFill color="#000" size={20} />
//                                 </IconButton>
//                               </TableCell>
//                             </TableRow>
//                           ))
//                         )}
//                       </TableBody>
//                     </Table>
//                   </TableContainer>

//                   {/* <Box sx={{ padding: "16px" }}>
//             {Object.entries(medicationData).map(([label, value]) => (
//               <Box key={label} sx={labelValueBoxStyle}>
//                 <Typography
//                   variant="body2"
//                   sx={{ color: "#333", fontWeight: 400, fontSize: "14px" }}
//                 >
//                   {label}
//                 </Typography>
//                 <Typography
//                   variant="body2"
//                   sx={{ color: "#000", fontWeight: 500, fontSize: "14px" }}
//                 >
//                   {value}
//                 </Typography>
//               </Box>
//             ))}
//           </Box> */}
//                 </Paper>
//                 <Box
//                   sx={{
//                     display: 'flex',
//                     justifyContent: 'flex-end',
//                     marginTop: '5px',
//                   }}
//                 >
//                   <Button
//                     style={{ color: '#2e5ad5' }}
//                     onClick={handleAppoinmet}
//                   >
//                     View More
//                   </Button>
//                 </Box>

//                 <Paper variant="outlined" sx={paperStyle}>
//                   <Box sx={headerBoxStyle}>
//                     <Typography
//                       variant="subtitle1"
//                       sx={{ fontWeight: 'bold', color: '#1a1a1a' }}
//                     >
//                       SOAP Note
//                     </Typography>
//                   </Box>

//                   <Box
//                     sx={{
//                       padding: '16px',
//                       display: 'flex',
//                       justifyContent: 'space-between',
//                       alignItems: 'center',
//                       gap: 3,
//                     }}
//                   >
//                     <Box>
//                       <Typography
//                         variant="body2"
//                         sx={{
//                           color: '#333',
//                           fontWeight: 600,
//                           fontSize: '14px',
//                         }}
//                       >
//                         Symptoms :
//                       </Typography>
//                       <Typography
//                         variant="body2"
//                         sx={{
//                           color: '#000',
//                           fontWeight: 500,
//                           fontSize: '14px',
//                         }}
//                       >
//                         {selectedDoctor?.symptoms}
//                         {/* {doctors?.[0]?.symptoms} */}
//                       </Typography>
//                       <Typography
//                         variant="body2"
//                         sx={{
//                           color: '#333',
//                           fontWeight: 600,
//                           fontSize: '14px',
//                         }}
//                       >
//                         Consultation :
//                       </Typography>
//                       {/* <Typography
//                 variant="body2"
//                 sx={{ color: "#000", fontWeight: 500, fontSize: "14px" }}
//               >
//                 Diagnosis : {selectedDoctor?.consultation?.diagnosis ?? "__"}
//               </Typography> */}
//                       <Box mt={1} sx={{ maxWidth: '470px' }}>
//                         <Typography
//                           variant="body2"
//                           sx={{
//                             color: '#000',
//                             fontWeight: 500,
//                             fontSize: '14px',
//                           }}
//                         >
//                           Notes : {selectedDoctor?.consultation?.notes ?? '__'}
//                         </Typography>
//                       </Box>
//                       <Box mt={1} sx={{ maxWidth: '470px' }}>
//                         <Typography
//                           variant="body2"
//                           sx={{
//                             color: '#000',
//                             fontWeight: 500,
//                             fontSize: '14px',
//                           }}
//                         >
//                           Prescription :{' '}
//                           {selectedDoctor?.consultation?.prescription ?? '__'}
//                         </Typography>
//                       </Box>
//                     </Box>
//                     <Box>
//                       {selectedDoctor?.consultation?.diagnosis && (
//                         <a
//                           href={selectedDoctor?.consultation?.diagnosis}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                         >
//                           <Avatar
//                             src={selectedDoctor?.consultation?.diagnosis}
//                             alt="User"
//                             sx={{
//                               width: 120,
//                               height: 120,
//                               objectFit: 'fill',
//                               borderRadius: '8px',
//                               cursor: 'pointer',
//                             }}
//                           />
//                         </a>
//                       )}
//                       {selectedDoctor?.consultation?.diagnosis && (
//                         <Typography
//                           component="a"
//                           href={selectedDoctor?.consultation?.diagnosis} // replace with your desired URL
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           style={{
//                             fontSize: '14px',
//                             textAlign: 'center',
//                             color: '#2e5ad5',
//                             textDecoration: 'underline',
//                             cursor: 'pointer',
//                             display: 'block', // ensures textAlign works properly
//                           }}
//                         >
//                           Click here
//                         </Typography>
//                       )}
//                     </Box>
//                   </Box>
//                 </Paper>
//                 {/* Allergy Information */}
//                 {/* <Paper variant="outlined" sx={paperStyle}>
//           <Box sx={headerBoxStyle}>
//             <Typography
//               variant="subtitle1"
//               sx={{ fontWeight: "bold", color: "#1a1a1a" }}
//             >
//               Allergy Information
//             </Typography>
//           </Box>

//           <Box sx={{ padding: "16px" }}>
//             {Object.entries(allergyData).map(([label, value]) => (
//               <Box sx={{ marginTop: "1.5px" }}>
//                 <Box key={label} sx={labelValueBoxStyle}>
//                   <Typography
//                     variant="body2"
//                     sx={{ color: "#333", fontWeight: 400, fontSize: "14px" }}
//                   >
//                     {label}
//                   </Typography>
//                   <Typography
//                     variant="body2"
//                     sx={{ color: "#000", fontWeight: 500, fontSize: "14px" }}
//                   >
//                     {value}
//                   </Typography>
//                 </Box>
//               </Box>
//             ))}
//           </Box>
//         </Paper> */}
//               </Grid>
//             </Grid>
//           </Box>
//         </>
//       )}
//     </Container>
//   );
// };

// export default Record;
