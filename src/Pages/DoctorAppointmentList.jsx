import { useEffect, useState } from 'react';
import { Eye, XCircle, FileText, Video } from 'lucide-react';
import { getAllAppointments, getAppointmentHistory } from '@/queries/DoctorQueries/appointments';
import { useAuthStore } from '@/stores/authStore';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { cancelAppointment } from '@/queries/DoctorQueries/appointments';
import { useConsultStore } from '@/stores/consultStore';

export default function DoctorAppointmentList() {
  const { token } = useAuthStore();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [currentTime, setCurrentTime] = useState(moment());
  const navigate = useNavigate();

  const { setCurrentPatient, setCurrentAppointmentId } = useConsultStore();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const data = await getAllAppointments({ limit: 10 });
        console.log('Fetched appointments data:', data);

        const formattedAppointments = data.map((appointment, index) => ({
          id: appointment.id,
          time: appointment.slotTime || '',
          date: moment(appointment.scheduledTime).format('MMM D, YYYY h:mm A'),
          phone: appointment.patient?.phone || '',
          patientName: appointment.patientName || '',
          email: appointment.patient?.email || '',
          status: appointment.status || 'Pending',
          type: appointment.type || '',
          meetingLink: appointment.meetingLink || '',
          rawData: appointment,
        }));

        setAppointments(formattedAppointments);
        setFilteredAppointments(formattedAppointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        toast.error('Failed to fetch appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(moment());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = appointments.filter(
        (appointment) =>
          appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.phone.includes(searchTerm),
      );
      setFilteredAppointments(filtered);
    } else {
      setFilteredAppointments(appointments);
    }
  }, [searchTerm, appointments]);

  const getStatusClasses = (status) => {
    const statusColors = {
      SCHEDULED: 'bg-cyan-100 text-cyan-700',
      PENDING: 'bg-orange-100 text-orange-700',
      COMPLETED: 'bg-green-100 text-green-700',
      CANCELLED: 'bg-red-100 text-red-700',
      UNPAID: 'bg-red-100 text-red-700',
      PAID: 'bg-green-100 text-green-700',
    };

    return statusColors[status] || 'bg-gray-100 text-gray-700';
  };

  const canStartMeeting = (appointment) => {
    const appointmentTime = moment(appointment.rawData.scheduledTime);
    const appointmentEndTime = appointmentTime.clone().add(1, 'hour'); // Assuming 1 hour meeting duration

    // Meeting can be started from the scheduled time onwards until it ends
    return currentTime.isSameOrAfter(appointmentTime) && currentTime.isBefore(appointmentEndTime);
  };

  const handleViewDetails = (appointment) => {
    setCurrentAppointmentId(appointment.id);
    console.log('Setting appointment ID in store:', appointment.id);

    navigate('/appointment-details', {
      state: { appointment: appointment.rawData },
    });
  };

  const openCancelModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  const handleCancelAppointment = async () => {
    if (!cancellationReason) {
      toast.error('Please enter a cancellation reason');

      return;
    }

    try {
      setLoading(true);
      const response = await cancelAppointment({
        appointmentId: selectedAppointment.id,
        reason: cancellationReason,
      });

      if (response.error === 'false') {
        toast.success(response.message);
        const updatedAppointments = appointments.map((appt) =>
          appt.id === selectedAppointment.id ? { ...appt, status: 'CANCELLED' } : appt,
        );
        setAppointments(updatedAppointments);
        setFilteredAppointments(updatedAppointments);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error('Failed to cancel appointment');
    } finally {
      setLoading(false);
      setShowCancelModal(false);
      setCancellationReason('');
    }
  };

  const handleViewRecords = (appointment) => {
    setCurrentAppointmentId(appointment.id);

    navigate(`/patient-records/${appointment.rawData.patientId}`, {
      state: { patient: appointment.rawData.patient },
    });
  };

  const handleStartVideoCall = (appointment) => {
    if (canStartMeeting(appointment)) {
      toast.error('Meeting can only be started at the scheduled time');

      return;
    }

    if (appointment.type === 'VIDEO' && appointment.meetingLink) {
      setCurrentAppointmentId(appointment.id);
      console.log('Setting appointment ID for video call:', appointment.id);

      const patientDetails = {
        name: appointment.patientName,
        age: appointment.rawData.patient?.age || 'N/A',
        gender: appointment.rawData.patient?.gender || 'N/A',
        patientId: appointment.rawData.patient?.id || 'N/A',
        dob: appointment.rawData.patient?.dateOfBirth || 'N/A',
        allergies: appointment.rawData.patient?.allergies || [],
        phone: appointment.phone,
        email: appointment.email,
        address: appointment.rawData.patient?.address || 'N/A',
        preferredPharmacy: appointment.rawData.patient?.preferredPharmacy || 'N/A',
      };
      setCurrentPatient(patientDetails);

      // Navigate to video consultation page
      navigate(`/consultation-meeting/${appointment.meetingLink.split('/').pop()}`);
    } else {
      toast.error('Video call not available for this appointment');
    }
  };

  // const handleStartChat = (appointment) => {
  //   if (!canStartMeeting(appointment)) {
  //     toast.error('Chat can only be started at the scheduled time');

  //     return;
  //   }

  //   if (appointment.type === 'CHAT') {
  //     setCurrentAppointmentId(appointment.id);

  //     navigate('/doctor-chat', {
  //       state: { appointment: appointment.rawData },
  //     });
  //   } else {
  //     toast.error('Chat not available for this appointment');
  //   }
  // };

  const handleOpenConsultNotes = (appointment) => {
    setCurrentAppointmentId(appointment.id);
    console.log('Opening consult notes for appointment:', appointment.id);

    const patientDetails = {
      name: appointment.patientName,
      age: appointment.rawData.patient?.age || 'N/A',
      gender: appointment.rawData.patient?.gender || 'N/A',
      patientId: appointment.rawData.patient?.id || 'N/A',
      dob: appointment.rawData.patient?.dateOfBirth || 'N/A',
      allergies: appointment.rawData.patient?.allergies || [],
      phone: appointment.phone,
      email: appointment.email,
      address: appointment.rawData.patient?.address || 'N/A',
      preferredPharmacy: appointment.rawData.patient?.preferredPharmacy || 'N/A',
    };
    setCurrentPatient(patientDetails);

    // Navigate to consultation notes page
    navigate(`/consult-notes/${appointment.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00AAEE]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mx-auto">
      {/* Header Section */}
      <div className="mb-4 sm:mb-6 mt-12 sm:mt-16">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">All Appointments</h1>
        <p className="text-gray-600 font-semibold text-base sm:text-lg">
          Next appointment:{' '}
          {appointments[0] ? `${appointments[0].date} with ${appointments[0].patientName}` : 'No upcoming appointments'}
        </p>
      </div>

      {/* Search Bar Section */}
      <div className="flex flex-col md:flex-row items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <input
          type="text"
          placeholder="Search by Patient Name, Email or Phone"
          className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-sm sm:text-base"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="bg-[#00AAEE] text-white px-4 sm:px-6 py-2 rounded-full hover:bg-[#0099DD] transition-colors w-full md:w-auto text-sm sm:text-base">
          Search
        </button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-xl shadow-md overflow-hidden border border-[#0000004D]">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">All Appointments</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Serial No', 'Time', 'Date', 'Phone No', 'Patient Name', 'Email', 'Status', 'Action'].map(
                  (heading, i) => (
                    <th
                      key={i}
                      scope="col"
                      className={`px-3 lg:px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider ${
                        heading === 'Serial No'
                          ? 'w-20'
                          : heading === 'Time'
                            ? 'w-24'
                            : heading === 'Date'
                              ? 'w-32'
                              : heading === 'Phone No'
                                ? 'w-32'
                                : heading === 'Patient Name'
                                  ? 'w-40'
                                  : heading === 'Email'
                                    ? 'w-48'
                                    : heading === 'Status'
                                      ? 'w-28'
                                      : 'w-32'
                      }`}
                    >
                      {heading}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((row, index) => (
                  <tr key={row.id} className="bg-white hover:bg-gray-50">
                    <td className="px-3 lg:px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                    <td className="px-3 lg:px-6 py-4 text-sm text-gray-900">{row.time}</td>
                    <td className="px-3 lg:px-6 py-4 text-sm text-gray-900">{row.date}</td>
                    <td className="px-3 lg:px-6 py-4 text-sm text-gray-900 break-all">{row.phone}</td>
                    <td className="px-3 lg:px-6 py-4 text-sm text-gray-900 break-words">{row.patientName}</td>
                    <td className="px-3 lg:px-6 py-4 text-sm text-gray-900 break-all">{row.email}</td>
                    <td className="px-3 lg:px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusClasses(row.status)}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-3 lg:px-6 py-4">
                      <div className="flex items-center space-x-1 lg:space-x-2">
                        <button
                          onClick={() => handleViewDetails(row)}
                          className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
                          title="View Details"
                        >
                          <Eye size={20} />
                        </button>

                        {row.status === 'SCHEDULED' && (
                          <>
                            {row.type === 'VIDEO' && (
                              <button
                                onClick={() => handleStartVideoCall(row)}
                                // className={`p-1 rounded-full ${
                                //   row.meetingLink && canStartMeeting(row)
                                //     ? 'text-[#00AAEE] hover:bg-blue-100'
                                //     : 'text-gray-400 cursor-not-allowed'
                                // }`}
                                className='p-1 rounded-full text-[#00AAEE] hover:bg-blue-100'
                                title={canStartMeeting(row) ? 'Video Call' : 'Meeting time not reached yet'}
                                // disabled={!row.meetingLink || !canStartMeeting(row)}
                              >
                                <Video size={20} />
                              </button>
                            )}
                            <button
                              onClick={() => openCancelModal(row)}
                              className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
                              title="Cancel Appointment"
                            >
                              <XCircle size={20} />
                            </button>

        

                            {/* {row.type === 'CHAT' && (
                              <button
                                onClick={() => handleStartChat(row)}
                                className={`p-1 rounded-full ${
                                  canStartMeeting(row)
                                    ? 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                    : 'text-gray-400 cursor-not-allowed'
                                }`}
                                title={canStartMeeting(row) ? 'Start Chat' : 'Meeting time not reached yet'}
                                disabled={!canStartMeeting(row)}
                              >
                                <FileText size={16} />
                              </button>
                            )} */}
                            {/* 
                            <button
                              onClick={() => handleOpenConsultNotes(row)}
                              className="text-green-600 hover:text-green-700 p-1 rounded-full hover:bg-green-100 transition-colors"
                              title="Open Consult Notes"
                            >
                              <FileText size={16} />
                            </button> */}
                          </>
                        )}
                        {/* 
                        <button
                          onClick={() => handleViewRecords(row)}
                          className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
                          title="View Records"
                        >
                          <FileText size={16} />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-gray-500 text-lg">
                    {searchTerm ? 'No matching appointments found' : 'No appointments found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#0000004D]">
          <div className="p-3 sm:p-4 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">All Appointments</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((row, index) => (
                <div key={row.id} className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-base">{row.patientName}</h3>
                      <p className="text-sm text-gray-600">{row.email}</p>
                      <p className="text-sm text-gray-600">{row.phone}</p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusClasses(row.status)}`}
                    >
                      {row.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Date:</span>
                      <p className="text-gray-600">{row.date}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Time:</span>
                      <p className="text-gray-600">{row.time}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <button
                      onClick={() => handleViewDetails(row)}
                      className="flex items-center gap-1 text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors text-sm"
                      title="View Details"
                    >
                      <Eye size={16} />
                      <span>Details</span>
                    </button>

                    {row.status === 'SCHEDULED' && (
                      <>
                        <button
                          onClick={() => openCancelModal(row)}
                          className="flex items-center gap-1 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors text-sm"
                          title="Cancel Appointment"
                        >
                          <XCircle size={16} />
                          <span>Cancel</span>
                        </button>

                        {row.type === 'VIDEO' && (
                          <button
                            onClick={() => handleStartVideoCall(row)}
                            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm ${
                              row.meetingLink && canStartMeeting(row)
                                ? 'text-[#00AAEE] hover:text-[#0099DD] bg-blue-50 hover:bg-blue-100'
                                : 'text-gray-400 bg-gray-50 cursor-not-allowed'
                            }`}
                            title={canStartMeeting(row) ? 'Video Call' : 'Meeting time not reached yet'}
                            disabled={!row.meetingLink || !canStartMeeting(row)}
                          >
                            <Video size={16} />
                            <span>Video</span>
                          </button>
                        )}

                        {/* {row.type === 'CHAT' && (
                          <button
                            onClick={() => handleStartChat(row)}
                            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm ${
                              canStartMeeting(row)
                                ? 'text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200'
                                : 'text-gray-400 bg-gray-50 cursor-not-allowed'
                            }`}
                            title={canStartMeeting(row) ? 'Start Chat' : 'Meeting time not reached yet'}
                            disabled={!canStartMeeting(row)}
                          >
                            <FileText size={16} />
                            <span>Chat</span>
                          </button>
                        )} */}

                        <button
                          onClick={() => handleOpenConsultNotes(row)}
                          className="flex items-center gap-1 text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100 px-3 py-2 rounded-lg transition-colors text-sm"
                          title="Open Consult Notes"
                        >
                          <FileText size={16} />
                          <span>Notes</span>
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => handleViewRecords(row)}
                      className="flex items-center gap-1 text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors text-sm"
                      title="View Records"
                    >
                      <FileText size={16} />
                      <span>Records</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                {searchTerm ? 'No matching appointments found' : 'No appointments found'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Appointment Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md">
            <h2 className="text-lg sm:text-xl font-bold mb-4">Cancel Appointment</h2>
            <p className="mb-4 text-sm sm:text-base">
              Are you sure you want to cancel the appointment with {selectedAppointment?.patientName}?
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Cancellation</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                rows={3}
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="Please provide a reason for cancellation"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancellationReason('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleCancelAppointment}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-300 text-sm"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
