import { Mail, MapPin, BriefcaseMedical } from 'lucide-react';

export default function DoctorCard({ doctor, onBookAppointment }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 relative">
      <div className="flex items-start gap-3 sm:gap-4">
        <img
          src={
            doctor.image || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=80&h=80&fit=crop&crop=face'
          }
          alt={doctor.name}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-gray-100 flex-shrink-0"
        />
        <div className="flex-1 min-w-0 pr-16 sm:pr-0">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{doctor.name}</h3>
          <div className="space-y-1.5 sm:space-y-2 text-gray-700 text-xs sm:text-sm">
            <div className="flex items-center">
              <BriefcaseMedical className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 text-gray-500 flex-shrink-0" />
              <span>{doctor.specialty}</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 text-gray-500 flex-shrink-0" />
              <span className="truncate">{doctor.email}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 text-gray-500 flex-shrink-0" />
              <span>{doctor.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 text-right">
        <div className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 sm:mb-3">{doctor.fee}</div>
        <button
          onClick={() => onBookAppointment(doctor)}
          className="px-3 py-1.5 sm:px-6 sm:py-2 bg-[#00AAEE] text-white rounded-full font-medium hover:bg-[#0099DD] transition-colors text-xs sm:text-sm"
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
}
