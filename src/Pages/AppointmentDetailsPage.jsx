import { useLocation, useNavigate } from 'react-router-dom';
import AppointDetails from '../NewComponents/doctorDashboard/AppointDetails';
import { useAuthStore } from '@/stores/authStore';

export default function AppointmentDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const appointment = location.state?.appointment;
  const { user } = useAuthStore();

  console.log('user in AppointmentDetailsPage:', user?.userType);
 

  const handleBack = () => {

    
    if (user?.userType === 'USER') {
      navigate('/user-dashboard');

      return;
    }
    navigate('/doctor-dashboard');
  };
    


  if (!appointment) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">No appointment data found</h2>
        <button onClick={handleBack} className="px-4 py-2 bg-[#00aaee] text-white rounded-md ">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return <AppointDetails appointment={appointment} onBack={handleBack} />;
}
