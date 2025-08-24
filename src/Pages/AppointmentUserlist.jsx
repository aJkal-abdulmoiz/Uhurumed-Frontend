import { useState, useEffect } from 'react';
import { getAppointments } from '@/queries/PatientQueries/appointments';
import moment from 'moment';
import { Video, Ban,Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cancelAppointment } from '@/queries/DoctorQueries/appointments';

export default function AppointmentsPage() {
  const [searchValue, setSearchValue] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate=useNavigate();

  // Fetch appointments from API
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getAppointments();

      if (result.success) {
        // Transform API data to match your frontend structure
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
        }));

        setAppointments(formattedAppointments);
      } else {
        setError(result.message);
        setAppointments([]);
      }
    } catch (err) {
      setError('Failed to fetch appointments');
      setAppointments([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    if (value.trim() === '') {
      fetchAppointments(); // Refetch original data when search is cleared
    } else {
      const filtered = appointments.filter((appointment) =>
        appointment.doctorName?.toLowerCase().includes(value.toLowerCase()),
      );
      setAppointments(filtered);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    // TODO: Implement cancel appointment functionality
    console.log('Cancel appointment:', appointmentId);


    const res = await cancelAppointment(appointmentId);
    console.log(res);



  };


  const handleViewDetails = (appointmentData) => {
    navigate('/appointment-details', {
      state: { appointment: appointmentData },
    });
  };



  const bookNewAppointment=()=>{
    navigate('/doctors');
  };

  const statusColors = {
    SCHEDULED: 'bg-cyan-100 text-cyan-700',
    PENDING: 'bg-orange-100 text-orange-700',
    COMPLETED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
  };

  if (loading) {
    return (
      <div className="min-h-screen h-full flex justify-center items-center mx-auto px-4 py-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-6 border-[#3fa2df]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mx-auto">
      {/* Header Section */}
      <div className="mb-4 sm:mb-6 mt-12 sm:mt-16">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 mt-16">All Appointments</h1>
          <button
            className="bg-[#00AAEE] hover:bg-[#0099DD] text-white px-6 sm:px-8 py-3 rounded-full font-medium shadow-sm text-sm sm:text-base w-full sm:w-auto"
            onClick={() => bookNewAppointment()}
          >
            New Appointment
          </button>
        </div>

        {appointments.length > 0 && (
          <p className="font-semibold text-base sm:text-lg text-gray-700">
            Next appointment:{' '}
            <span className="text-base sm:text-lg text-gray-700">
              {moment(appointments[0].appointmentDate).format('dddd, MMMM D [at] h:mm A')} with{' '}
              {appointments[0].doctorName}
            </span>
          </p>
        )}
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center w-full gap-2">
          <input
            type="text"
            placeholder="Search by Doctor Name"
            className="flex-1 px-4 sm:px-5 py-3 border border-gray-300 rounded-full bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
            value={searchValue}
            onChange={handleSearch}
          />
          <button
            className="bg-[#00AAEE] hover:bg-[#0099DD] text-white px-6 sm:px-8 py-3 rounded-full font-medium shadow-sm text-sm sm:text-base"
            onClick={() => handleSearch({ target: { value: searchValue } })}
          >
            Search
          </button>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 h-full border border-[#0000004D]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Appointments</h2>
        </div>

        {error ? (
          <div className="text-red-500 p-4">{error}</div>
        ) : appointments.length === 0 ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500 text-base sm:text-lg">
              {searchValue ? 'No matching appointments found' : 'No appointments available'}
            </p>
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-[900px] w-full text-left">
                <thead>
                  <tr className="bg-gray-50 rounded-lg">
                    <th className="px-4 py-2 font-medium text-gray-600 rounded-l-lg">Serial No</th>
                    <th className="px-4 py-2 font-medium text-gray-600">Time</th>
                    <th className="px-4 py-2 font-medium text-gray-600">Date</th>
                    <th className="px-4 py-2 font-medium text-gray-600">Appointment Date</th>
                    <th className="px-4 py-2 font-medium text-gray-600">Doctor Name</th>
                    <th className="px-4 py-2 font-medium text-gray-600">Phone</th>
                    <th className="px-4 py-2 font-medium text-gray-600">Payment Type</th>
                    <th className="px-4 py-2 font-medium text-gray-600">Status</th>
                    <th className="px-4 py-2 font-medium text-gray-600 rounded-r-lg text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment.id} className="border-b border-gray-200 last:border-b-0">
                      <td className="px-4 py-3 font-medium text-gray-800">{appointment.serialNo}</td>
                      <td className="px-4 py-3 text-gray-700">{appointment.time}</td>
                      <td className="px-4 py-3 text-gray-700">{appointment.date}</td>
                      <td className="px-4 py-3 text-gray-700">{appointment.appointmentDate}</td>
                      <td className="px-4 py-3 text-gray-700">{appointment.doctorName}</td>
                      <td className="px-4 py-3 text-gray-700">{appointment.phone}</td>
                      <td className="px-4 py-3 text-gray-700">{appointment.paymentType}</td>
                      <td className="px-4 py-3 text-gray-700">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            statusColors[appointment.status] || 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center space-x-2">
                          {appointment.type === 'VIDEO' && appointment.status !== 'CANCELLED' &&(
                            <a
                              href={`/consultation-meeting/${appointment.meetingLink?.split('/').pop() || ''}`}
                              className={`p-2 rounded-full   ${
                                appointment.meetingLink && appointment.status === 'SCHEDULED'
                                  ? 'bg-[#00AAEE] text-white hover:bg-[#0099DD]'
                                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              }`}
                              onClick={(e) => {
                                if (!appointment.meetingLink || appointment.status !== 'SCHEDULED') {
                                  e.preventDefault();
                                }
                              }}
                            >
                              <Video className="h-4 w-4" />
                            </a>
                          )}

                          {
                            appointment.status !== 'CANCELLED' && (
                              <button
                                onClick={() => handleCancelAppointment(appointment.id)}
                                className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                                title="Cancel Appointment"
                              >
                                <Ban className="h-4 w-4" />
                              </button>
                            )
                          }



                          <button
                            onClick={() => handleViewDetails(appointment.rawData)}
                            className="text-[#00AAEE] hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm">#{appointment.serialNo}</h3>
                      <p className="text-lg font-medium text-gray-800 mt-1">{appointment.doctorName}</p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        statusColors[appointment.status] || 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                    <div>
                      <p className="text-gray-500 font-medium">Time</p>
                      <p className="text-gray-800">{appointment.time}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Phone</p>
                      <p className="text-gray-800">{appointment.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Appointment Date</p>
                      <p className="text-gray-800">{appointment.appointmentDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Payment</p>
                      <p className="text-gray-800">{appointment.paymentType}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-gray-200">
                    {appointment.type === 'VIDEO' && (
                      <a
                        href={`/consultation-meeting/${appointment.meetingLink?.split('/').pop() || ''}`}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium ${
                          appointment.meetingLink && appointment.status === 'SCHEDULED'
                            ? 'bg-[#00AAEE] text-white hover:bg-[#0099DD]'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                        onClick={(e) => {
                          if (!appointment.meetingLink || appointment.status !== 'SCHEDULED') {
                            e.preventDefault();
                          }
                        }}
                      >
                        <Video className="h-4 w-4" />
                        Join Meeting
                      </a>
                    )}

                    <button
                      onClick={() => handleCancelAppointment(appointment.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 text-sm font-medium"
                      title="Cancel Appointment"
                    >
                      <Ban className="h-4 w-4" />
                      Cancel
                    </button>

                  </div>
                  <button onClick={() => handleViewDetails(appointment.rawData)} className='mt-3 text-sm text-[#00AAEE] hover:text-gray-700'>
                      View Details

                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
