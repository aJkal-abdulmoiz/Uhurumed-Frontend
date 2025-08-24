'use client';

import { useParams } from 'react-router-dom';
import { JaaSMeeting } from '@jitsi/react-sdk';
import { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '@/stores/authStore';

const ConsultationMeeting = () => {
  const params = useParams();
  const appointmentId = params?.appointmentId;
  const [patientData, setPatientData] = useState(null);
  const { user } = useAuthStore();
  const userType = user?.userType || 'USER';
  const [isDoctorPresent, setIsDoctorPresent] = useState(userType === 'DOCTOR');
  const apiRef = useRef(null);

  useEffect(() => {
    setPatientData({
      name: 'John Doe',
      age: 34,
      condition: 'Hypertension',
      lastVisit: '2025-07-20',
    });
  }, []);

  const handleApiReady = (externalApi) => {
    apiRef.current = externalApi;

    externalApi.executeCommand('subject', `Consultation for ${patientData?.name || 'Patient'}`);

    if (userType === 'DOCTOR') {
      externalApi.executeCommand('toggleLobby', true);
    }

    if (userType !== 'DOCTOR') {
      const interval = setInterval(() => {
        const count = externalApi.getNumberOfParticipants();
        if (count > 0) {
          setIsDoctorPresent(true);
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      {/* Meeting Section (only show for doctor or if doctor present) */}
      {userType === 'DOCTOR' || isDoctorPresent ? (
        <div className="w-full md:w-1/2 bg-gray-800">
          <JaaSMeeting
            appId="vpaas-magic-cookie-d8e38c2d1b0046b0b885726e43867c39"
            roomName={appointmentId}
            configOverwrite={{
              startWithAudioMuted: userType !== 'DOCTOR',
              startWithVideoMuted: userType !== 'DOCTOR',
              disableModeratorIndicator: false,
              enableWelcomePage: false,
              enableClosePage: false,
              enableNoAudioDetection: true,
              enableNoisyMicDetection: true,
              prejoinPageEnabled: userType !== 'DOCTOR',
              toolbarButtons: [
                'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
                'livestreaming', 'settings', 'raisehand', 'videoquality', 'filmstrip',
                'invite', 'feedback', 'stats', 'shortcuts', 'tileview', 'select-background',
                'download', 'help', 'mute-everyone', 'security'
              ],
            }}
            interfaceConfigOverwrite={{
              DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
              SHOW_CHROME_EXTENSION_BANNER: false,
              MOBILE_APP_PROMO: false,
              DEFAULT_REMOTE_DISPLAY_NAME: 'Patient',
              DEFAULT_LOCAL_DISPLAY_NAME: userType === 'DOCTOR' ? 'Doctor' : 'Patient',
            }}
            userInfo={{
              displayName: `${user?.firstName || ''} ${user?.lastName || ''}`,
              email: user?.email,
            }}
            onApiReady={handleApiReady}
            getIFrameRef={(iframeRef) => {
              iframeRef.style.height = '100%';
              iframeRef.style.width = '100%';
              iframeRef.style.border = 'none';
            }}
            spinner={() => (
              <div className="flex items-center justify-center h-full bg-gray-800">
                <div className="text-white text-xl">Loading consultation room...</div>
              </div>
            )}
          />
        </div>
      ) : (
        userType === 'USER' && (
          <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-100 p-8">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded shadow text-center max-w-md">
              <p className="text-yellow-700 text-sm font-medium">
                Waiting for the doctor to start the consultation...
              </p>
            </div>
          </div>
        )
      )}

      {/* Patient Info (only show to doctor) */}
      {userType === 'DOCTOR' && (
        <div className="w-full md:w-1/2 p-6 bg-white shadow-md overflow-y-auto">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">Patient Information</h3>
            {patientData ? (
              <ul className="space-y-3">
                <li className="flex justify-between"><span>Name:</span><span>{patientData.name}</span></li>
                <li className="flex justify-between"><span>Age:</span><span>{patientData.age}</span></li>
                <li className="flex justify-between"><span>Condition:</span><span>{patientData.condition}</span></li>
                <li className="flex justify-between"><span>Last Visit:</span><span>{patientData.lastVisit}</span></li>
              </ul>
            ) : (
              <p>Loading patient info...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationMeeting;
