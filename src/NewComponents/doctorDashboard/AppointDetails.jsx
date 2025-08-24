import { Calendar, User, Phone, Mail, MapPin, CreditCard, Stethoscope, Video, FileText, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

const AppointmentDetails = ({ appointment, onBack }) => {
  const { user } = useAuthStore();
 
  console.log(appointment);
  

  
  

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
    case 'confirmed':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-orange-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'completed':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    return type?.toLowerCase() === 'video' ? <Video className="h-4 w-4" /> : <Stethoscope className="h-4 w-4" />;
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-6">

          {/* Conditional Profile Display */}
          {user?.userType === 'USER' ? (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-left">
                  <User className="h-5 w-5" />
                  Doctor Information
                </h3>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    {appointment.doctor?.profilePic ? (
                      <img
                        src={appointment.doctor.profilePic || '/placeholder.svg'}
                        alt="Doctor"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-medium text-gray-600">
                        {appointment.doctorId
                          ?.split('-')
                          .map((n) => n[0])
                          .join('')}
                      </span>
                    )}
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-semibold">Dr. {appointment.doctorName}</h3>
                    <p className="text-gray-600">{appointment.doctor.specialization} Specialist</p>
                  </div>
                </div>

                <hr className="border-gray-200" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-left">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{appointment.doctor?.email || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-left">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{appointment.doctor?.phone || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-left">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{appointment.doctor?.address || 'Not provided'}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-left">
                  <User className="h-5 w-5" />
                  Patient Information
                </h3>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    {appointment.patient?.profilePic ? (
                      <img
                        src={appointment.patient.profilePic || '/placeholder.svg'}
                        alt="Patient"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-medium text-gray-600">
                        {appointment.patientName
                          ?.split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </span>
                    )}
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-semibold">{appointment.patientName}</h3>
                    <p className="text-gray-600">
                      {appointment.patientAge} years old • {appointment.patientGender}
                    </p>
                  </div>
                </div>

                <hr className="border-gray-200" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-left">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{appointment.patient?.email || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-left">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{appointment.patient?.phone || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-left">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{appointment.patient?.address || 'Not provided'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Appointment Details */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-left">
                <Calendar className="h-5 w-5" />
                Appointment Details
              </h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-left">
                  <label className="text-sm font-medium text-gray-500">Date</label>
                  <p className="text-lg">{formatDate(appointment.scheduledTime)}</p>
                </div>
                <div className="text-left">
                  <label className="text-sm font-medium text-gray-500">Time</label>
                  <p className="text-lg">
                    {appointment.slot?.startTime && appointment.slot?.endTime
                      ? `${String(appointment.slot.startTime)} - ${String(appointment.slot.endTime)}`
                      : appointment.slotTime
                        ? String(appointment.slotTime)
                        : 'Time not specified'}
                  </p>
                </div>
                <div className="text-left">
                  <label className="text-sm font-medium text-gray-500">Type</label>
                  <div className="flex items-center gap-2">
                    {getTypeIcon(appointment.type)}
                    <span className="text-lg capitalize">
                      {appointment.type ? String(appointment.type).toLowerCase() : 'Not specified'}
                    </span>
                  </div>
                </div>
                <div className="text-left">
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <span
                    className={`inline-flex ml-[10px] items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${getStatusColor(appointment.status)}`}
                  >
                    {appointment.status ? String(appointment.status) : 'Unknown'}
                  </span>
                </div>
              </div>

              {appointment.symptoms && (
                <>
                  <hr className="border-gray-200" />
                  <div className="text-left">
                    <label className="text-sm font-medium text-gray-500">Symptoms/Reason</label>
                    <p className="text-sm mt-1 p-3 bg-gray-50 rounded-md">
                      {appointment.symptoms ? String(appointment.symptoms) : 'No symptoms provided'}
                    </p>
                  </div>
                </>
              )}

              {appointment.slot?.description && (
                <div className="text-left">
                  <label className="text-sm font-medium text-gray-500">Slot Description</label>
                  <p className="text-sm mt-1 p-3 bg-gray-50 rounded-md">{String(appointment.slot.description)}</p>
                </div>
              )}
            </div>
          </div>


          {/* Consultation Notes */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-left">
                Consultation Details
              </h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div className="text-left">
                  <label className="text-sm  text-gray-500 font-bold">Cheif Complaint</label>
                  <p className="text-sm mt-1 p-3 bg-gray-50 rounded-md">{appointment.consultation?.chiefComplaint || 'N/A'}</p>
                </div>
                <div className="text-left">
                  <label className="text-sm font-bold text-gray-500">Assesment</label>
                  <p className="text-sm mt-1 p-3 bg-gray-50 rounded-md">
                    {appointment?.consultation?.assessment || 'N/A'}
                  </p>
                </div>
                <div className="text-left">
                  <label className="text-sm font-bold text-gray-500">Plan</label>       
                  <p className='text-sm mt-1 p-3 bg-gray-50 rounded-md'>{appointment?.consultation?.plan || 'N/A'}</p>
                </div>
                <div className="text-left">
                  <label className="text-sm font-bold text-gray-500">Follow up</label>
                  <p className='text-sm mt-1 p-3 bg-gray-50 rounded-md'>{appointment?.consultation?.assessment || 'N/A'}</p>
                </div>
              </div>




            </div>
          </div>



        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payment Information */}

          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-left">
                <CreditCard className="h-5 w-5" />
                Payment Details
              </h3>
            </div>
            <div className="px-6 py-4 space-y-3">
              <div className="text-left">
                <label className="text-sm font-medium text-gray-500">Amount</label>
                <p className="text-2xl font-bold">${appointment.paymentAmount}</p>
              </div>
              <div className="text-left">
                <label className="text-sm font-medium text-gray-500">Payment Method</label>
                <p className="text-sm capitalize">{appointment.paymentType?.toLowerCase()}</p>
              </div>
              <div className="text-left">
                <label className="text-sm font-medium text-gray-500">Payment ID</label>
                <p className="text-xs font-mono bg-gray-50 p-2 rounded break-all">{appointment.paymentId}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-left">
               
                Lab Reports
              </h3>
            </div>
            <div className="px-6 py-4 space-y-3">
              <div className="text-left">
                <label className="text-sm font-bold text-gray-500">Symptoms : </label> 
                <span className='text-sm '>{ appointment.symptoms || 'N/A'}</span>
              </div>

              <div className="text-left">
                <label className="text-sm font-bold text-gray-500">Prescription :</label> 
                <a className='text-sm font-medium text-blue-500' href={appointment?.consultation?.pdfUrl || ''} target='_blank' rel='noreferrer'> View Details</a> 
              </div>
              <div className="text-left">
                <label className="text-sm font-bold text-gray-500">Lab Results :</label> 
                <a className='text-sm font-medium text-blue-500' href={appointment?.consultation?.labResultsUrl || ''} target='_blank' rel='noreferrer'> View Details</a> 
              </div>
             
            </div>
          </div>


 



        </div>
      </div>
    </div>
  );
};

export default AppointmentDetails;