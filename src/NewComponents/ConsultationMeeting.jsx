import { useParams, useNavigate } from 'react-router-dom';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useConsultStore } from '@/stores/consultStore';
import { uploadAudioToDeepgram } from '@/queries/PatientQueries/deepgram';
import { ExtractWithGemini } from '@/queries/PatientQueries/gemini';
import { useAudioRecorder } from '@/utils/useAudioRecorder';
import PatientInfoPanel from './PatientInfoPanel';
import WaitingScreen from './WaitingScreen';

const ConsultationMeeting = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isDoctor = user?.userType === 'DOCTOR';
  
  const { 
    currentPatient, 
    setConsultNotes,
    consultNotes
  } = useConsultStore();
  const [showConsentModal, setShowConsentModal] = useState(!isDoctor);
  const [processingStatus, setProcessingStatus] = useState(null);
  const [AIResult, setAIResult] = useState(null);
  const [waiting, setWaiting] = useState(!isDoctor);
  const [consentAccepted, setConsentAccepted] = useState(isDoctor); // Doctors don't need consent
  const [shouldEndMeeting, setShouldEndMeeting] = useState(false);
  
  const jitsiApiRef = useRef(null);
  const [showCustomEndButton, setShowCustomEndButton] = useState(true);

  const {
    startRecording,
    stopRecording,
    status: recordingStatus,
    error: recordingError,
    isConverting,
    audioBlob
  } = useAudioRecorder();

  // Auto-start recording for doctors when meeting starts
  useEffect(() => {
    if (isDoctor) {
      startRecording();
      console.log('Doctor recording started');
    }
  }, [isDoctor, startRecording]);

  // Monitor recording status
  useEffect(() => {
    console.log('Recording status:', recordingStatus);
    if (recordingError) {
      console.error('Recording error:', recordingError);
      setProcessingStatus('Recording error - continuing without recording');
    }
  }, [recordingStatus, recordingError]);

  const handleUploadRecording = async (blob) => {
    if (!blob) {
      console.error('No audio blob provided for upload');
      throw new Error('No audio data to upload');
    }
  
    setProcessingStatus('Processing Consultation with AI...');
    try {
      const result = await uploadAudioToDeepgram(blob, appointmentId);
      const consultation_result = await ExtractWithGemini(result);
      console.log(consultation_result);
  
      // Set consult notes from Gemini response
      if (consultation_result?.keyNotes) {
        const formattedNotes = {
          chiefComplaint: consultation_result.keyNotes.chief_complaint || '',
          assessment: consultation_result.keyNotes.assessment || '',
          historyOfPresentIllness: consultation_result.keyNotes.history_of_present_illness || '',
          plan: consultation_result.keyNotes.plan || '',
          followUpInstructions: consultation_result.keyNotes.follow_up_instructions || '',
          diagnosis: '',
          prescription: '',
          followUpNeeded: 'false',
          followUpDate: null,
        };
        setConsultNotes(formattedNotes);
        
        if(isDoctor){
          // navigate(
          //   `/consultation-details?appointmentId=${appointmentId}`,
          //   { state: { patientData: currentPatient } }
          // );
        }
  
      }
  
      return result;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    } finally {
      setProcessingStatus(null);
    }
  };

  // Handle consent response
  const handleConsentResponse = (accepted) => {
    setConsentAccepted(accepted);
    setShowConsentModal(false);
    // For patients, we don't start recording regardless of consent
    // since we're only recording doctor's audio now
  };

  // End meeting handler - only doctors process the recording
  const handleEndMeeting = async () => {
    setShowCustomEndButton(false);
    setProcessingStatus('Ending meeting...');
    
    try {
      if (isDoctor) {
        setProcessingStatus('Finalizing recording...');
        const blob = await stopRecording();
        console.log('Doctor recording stopped, blob:', blob);
        
        if (blob) {
          await handleUploadRecording(blob);
        } else {
          jitsiApiRef.current?.executeCommand('endConference');
          console.warn('No audio blob received from recording');
          // Simply navigate without ending conference
          // navigate(
          //   `/consultation-details?appointmentId=${appointmentId}`,
          //   { state: { patientData: currentPatient } }
          // );
        }
      }
    } catch (error) {
      console.error('Meeting end error:', error);
      // navigate(isDoctor ? '/doctor-dashboard' : '/appointment-user');
    }
  };

  // Handle Jitsi API ready
  const handleApiReady = (api) => {
    jitsiApiRef.current = api;
    api.executeCommand('toggleToolbar', false);

    // Participant tracking
    api.addListener('videoConferenceJoined', () => {
      const count = api.getNumberOfParticipants();
      console.log(`Joined meeting, participants: ${count}`);

      if (!isDoctor && count < 2) {
        setWaiting(true);
      } else {
        setWaiting(false);
      }
    });

    api.addListener('participantJoined', () => {
      const count = api.getNumberOfParticipants();
      console.log(`Participant joined, total: ${count}`);

      if (!isDoctor && count < 2) {
        setWaiting(true);
      } else {
        setWaiting(false);
      }
    });

    api.addListener('participantLeft', () => {
      const count = api.getNumberOfParticipants();
      console.log(`Participant left, total: ${count}`);
      if (!isDoctor && count < 2) {
        if (consultNotes) {
          // navigate('/appointment-user');
        }else{
          setWaiting(true);
        }
      
      }
    });
  };

  return (
    <div className="relative h-screen">
      {/* Consent Modal (only for patients) */}
      {showConsentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-sm mx-4">
            <h3 className="text-lg font-medium mb-4">AI Meeting Recording</h3>
            <p className="mb-6">Your doctor may record this session to help with diagnosis. Do you consent to this recording?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleConsentResponse(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Accept
              </button>
              <button
                onClick={() => handleConsentResponse(false)}
                className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Processing Overlay */}
      {processingStatus && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <h3 className="text-lg font-medium">{processingStatus}</h3>
              {isConverting && <p>Converting audio format...</p>}
            </div>
          </div>
        </div>
      )}

      {/* Waiting Screen */}
      {waiting && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#f2f2f2] z-40">
          <WaitingScreen />
        </div>
      )}

      {/* End Meeting Button */}
      {showCustomEndButton && !waiting && isDoctor && (
        <div className="fixed bottom-4 right-4 z-40">
          <button 
            onClick={handleEndMeeting}
            className="bg-red-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-red-600 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            End Meeting
          </button>
        </div>
      )}

      {/* Jitsi Meeting */}
      <div className="h-full">
        <JitsiMeeting
          roomName={appointmentId}
          domain="uhurumeet.com"
          configOverwrite={{
            prejoinConfig: { enabled: false },
            startWithAudioMuted: false,
            disableModeratorIndicator: true,
            toolbarButtons: [
              'microphone', 'camera', 'closedcaptions', 'desktop',
              'fullscreen', 'fodeviceselection', 'profile', 'info',
              'chat', 'recording', 'livestreaming', 'etherpad',
              'sharedvideo', 'settings', 'raisehand', 'videoquality',
              'filmstrip', 'invite', 'feedback', 'stats',
              'shortcuts', 'tileview', 'select-background',
              'download', 'help', 'mute-everyone', 'security'
            ],
            disableRemoteMute: true
          }}
          userInfo={{
            displayName: `${user.firstName} ${user.lastName}`,
          }}
          getIFrameRef={(iframeRef) => {
            iframeRef.style.height = '100%';
            iframeRef.style.width = '100%';
          }}
          onApiReady={handleApiReady}
        />
      </div>

      {isDoctor && (
        <PatientInfoPanel appointmentId={appointmentId} currentPatient={currentPatient} />
      )}
    </div>
  );
};

export default ConsultationMeeting;