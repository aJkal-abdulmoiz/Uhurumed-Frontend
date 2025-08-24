'use client';
import { initializePayment, verifyPayment } from '@/queries/PatientQueries/payments';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Mail, MapPin, Clock, BriefcaseMedical, CheckCircle } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'react-hot-toast';
import { useProfileStore } from '@/stores/ProfileStore';

export default function AppointmentSidebar({
  doctor,
  isOpen,
  onClose,
  onSubmit,
  slots = [],
  slotsLoading = false
}) {
  const [step, setStep] = useState(1);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [appointmentId, setAppointmentId] = useState(null);
  const [appointmentStatus, setAppointmentStatus] = useState(null);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [symptoms, setSymptoms] = useState('');
  const paymentVerified = useAuthStore((s) => s.paymentVerified);
  const setPaymentVerified = useAuthStore((s) => s.setPaymentVerified);
  const { country } = useProfileStore.getState();
  // const country = 'Ghana';
  const visibleDaysCount = 4;
  const totalScrollableDays = 30;
  const allFutureDays = Array.from({ length: totalScrollableDays }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);

    return date;
  });



  useEffect(() => {
    const handler = (event) => {
      if (event.key === 'paymentVerified' && event.newValue !== null) {
        setPaymentVerified(JSON.parse(event.newValue));
      }
    };
    window.addEventListener('storage', handler);

    return () => window.removeEventListener('storage', handler);
  }, [setPaymentVerified]);

  const displayedDays = allFutureDays.slice(scrollIndex, scrollIndex + visibleDaysCount);
  const currentMonthName = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();

  // Reset state when sidebar opens/closes
  useEffect(() => {
    if (isOpen) {
      const today = new Date().getDate().toString();
      setSelectedDate(today);
      setScrollIndex(0);
      setStep(1);
      setSymptoms('');
      setSelectedTimeSlot(null);
      setError(null);
      setAppointmentId(null);
      setAppointmentStatus(null);
      setPaymentVerified(false);
    }
  }, [isOpen, setPaymentVerified]);



  // Navigation handlers
  const handlePrevDays = () => setScrollIndex(prev => Math.max(0, prev - visibleDaysCount));
  const handleNextDays = () => setScrollIndex(prev => Math.min(allFutureDays.length - visibleDaysCount, prev + visibleDaysCount));

  const handleBookAndPay = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (step === 1) {
        if (!selectedDate || !selectedTimeSlot) {
          setError('Please select a date and time slot');

          return;
        }
        setStep(2);

        return;
      }

      if (step === 2) {
        const bookingData = {
          doctorId: doctor.id,
          slotId: selectedTimeSlot.id,
          date: selectedTimeSlot.date,
          symptoms,
          type: 'VIDEO',
        };

        const appointmentResponse = await onSubmit(bookingData);

        if (appointmentResponse?.success) {
          setAppointmentId(appointmentResponse.data.appointment.id);
          setAppointmentStatus(appointmentResponse.data.appointment.status);

          if (appointmentResponse.data.appointment.status === 'SCHEDULED') {
            setTimeout(() => onClose(), 2000);
          } else {
            const paymentResponse = await initializePayment(
              appointmentResponse.data.appointment.id,
              country === 'Ghana' ? 'PAYSTACK' : 'STRIPE'
            );
            console.log(paymentResponse);


            if (paymentResponse.success) {
              const paymentWindow = window.open(paymentResponse.paymentUrl, '_blank', 'width=600,height=800');
              // const paymentWindow = window.location.href = paymentResponse.paymentUrl;


              if (!paymentWindow || paymentWindow.closed || typeof paymentWindow.closed === 'undefined') {
                toast.error('Please enable popups to proceed with payment');

                return;
              }

              setStep(3);
            }
          }
        }
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => step > 1 && setStep(step - 1);

  // Get slots for the selected date
  const selectedDateObj = allFutureDays.find(d => d.getDate().toString() === selectedDate);
  const selectedDayOfWeek = selectedDateObj?.toLocaleString('default', { weekday: 'short' }) || '';
  const availableSlotsForSelectedDate = slots.find(slot => slot.date === selectedDate)?.time_slots || [];

  if (!isOpen || !doctor) return null;


  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

      <div className="relative w-full max-w-sm bg-white shadow-lg flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">
            {step === 1 ? 'Select Time Slot' :
              step === 2 ? 'Complete Booking' :
                'Payment Verification'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 flex items-start">
          <img
            src={doctor.image || '/placeholder.svg?height=120&width=120&text=Doctor'}
            alt={doctor.name}
            className="rounded-full w-[80px] h-[80px] object-cover mr-6 border-2 border-gray-100 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{doctor.name}</h3>
            <div className="space-y-1 text-gray-700 text-sm">
              <div className="flex items-center">
                <BriefcaseMedical className="h-4 w-4 mr-2 text-gray-500" />
                <span>{doctor.specialty}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-gray-500" />
                <span className="truncate">{doctor.email}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                <span>{doctor.location}</span>
              </div>
            </div>
          </div>
        </div>

        {step === 1 && (
          <>
            <div className="px-6 pt-2 pb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {currentMonthName} {currentYear}
              </h3>
              <div className="flex items-center justify-between border-b border-gray-200 py-2">
                <button onClick={handlePrevDays} disabled={scrollIndex === 0} className="p-2 rounded-full hover:bg-gray-100">
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <div className="flex overflow-x-auto pb-2 scrollbar-hide flex-grow">
                  {displayedDays.map((dateObj) => {
                    const dayOfWeek = dateObj.toLocaleString('default', { weekday: 'short' });
                    const date = dateObj.getDate().toString();
                    const isSelected = selectedDate === date;
                    const hasSlots = slots.some(slot => slot.date === date);

                    return (
                      <button
                        key={dateObj.toISOString()}
                        onClick={() => setSelectedDate(date)}
                        className={`flex-shrink-0 w-14 h-[56px] flex flex-col items-center justify-center rounded-lg mx-1 border
                          ${isSelected ? 'bg-[#00AAEE] text-white border-[#00AAEE]' : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50'}
                          ${!hasSlots && !isSelected ? 'opacity-50' : ''}`}
                        disabled={!hasSlots && !isSelected}
                      >
                        <span className="text-sm font-medium">{dayOfWeek}</span>
                        <span className="text-xl font-bold">{date}</span>
                      </button>
                    );
                  })}
                </div>
                <button onClick={handleNextDays} disabled={scrollIndex >= allFutureDays.length - visibleDaysCount} className="p-2 rounded-full hover:bg-gray-100">
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="flex-grow px-6 pt-6 pb-6 overflow-y-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Available Time Slots</h3>
              {slotsLoading ? (
                <div className="flex justify-center items-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00AAEE]"></div>
                </div>
              ) : availableSlotsForSelectedDate.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {availableSlotsForSelectedDate.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`flex items-center justify-center py-4 px-2 rounded-lg border
                        ${selectedTimeSlot === slot ? 'border-2 border-[#00AAEE] text-[#00AAEE]' : 'border-gray-300 text-gray-800 hover:bg-gray-50'}`}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="text-sm">{slot.formattedTime}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="col-span-2 text-center text-gray-500 py-10">
                  No slots available for this date.
                </p>
              )}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="px-6 pt-2 pb-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Booking Appointment on:</h3>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-16 h-[56px] flex flex-col items-center justify-center rounded-lg bg-[#00AAEE] text-white">
                  <span className="text-sm font-medium">{selectedDayOfWeek}</span>
                  <span className="text-xl font-bold">{selectedDate}</span>
                </div>
                <div className="flex items-center justify-center flex-grow py-1.5 px-4 rounded-lg border-2 border-[#00AAEE] text-[#00AAEE] font-semibold">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="text-sm">{selectedTimeSlot?.formattedTime}</span>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Consultation Fee:</span>
                <span className="font-bold">{doctor.fee}</span>
              </div>
            </div>

            <div className="flex-grow px-6 pt-6 pb-6 overflow-y-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Symptoms</h3>
              <textarea
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:border-[#00AAEE] resize-none"
                placeholder="Enter Reasons or Symptoms"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
              />
            </div>
          </>
        )}

        {step === 3 && (
          <div className="p-6 flex-1 flex flex-col items-center justify-center">
            <div className="text-center">
              {paymentVerified ? (
                <>
                  <div className="w-full rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-12 h-12 text-[#00aaee]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Appointment Booked Successfully!</h3>
                  <p className="text-gray-600 mb-6">Your appointment has been confirmed.</p>

                  <div className="bg-gray-100 p-4 rounded-lg mb-6 w-full">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700">Date:</span>
                      <span className="font-medium">{selectedDayOfWeek}, {selectedDate}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700">Time:</span>
                      <span className="font-medium">{selectedTimeSlot?.formattedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Doctor:</span>
                      <span className="font-medium">{doctor.name}</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-bold mb-2">Complete Your Payment</h3>
                  <div className="bg-gray-100 p-4 rounded-lg mb-4 w-full">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700">Consultation Fee:</span>
                      <span className="font-bold">{doctor.fee}</span>
                    </div>
                  </div>
                  <p className="mb-4">A payment window should have opened in a new tab.</p>
                  <p className="text-sm text-gray-600 mb-6">
                    Please complete the payment in the new window and wait for verification.
                  </p>
                </>
              )}
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-lg text-sm text-center w-full">
                {error}
              </div>
            )}
          </div>
        )}

        <div className="p-4 border-t border-gray-200 flex justify-between items-center">
          {step > 1 ? (
            <button
              onClick={handleBack}
              disabled={isLoading}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 flex items-center disabled:opacity-50"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back
            </button>
          ) : (
            <span className="text-sm font-semibold text-gray-900">{doctor.fee}</span>
          )}

          <button
            onClick={paymentVerified ? onClose : handleBookAndPay}
            disabled={
              (step === 1 && (!selectedDate || !selectedTimeSlot)) ||
              isLoading
            }
            className={`px-8 py-2 rounded-full font-medium transition-colors
              ${paymentVerified ?
      'bg-[#00AAEE] text-white hover:bg-[#0099DD]' :
      'bg-[#00AAEE] text-white hover:bg-[#0099DD]'}
              ${((step === 1 && (!selectedDate || !selectedTimeSlot)) || isLoading ?
      'opacity-50 cursor-not-allowed' : '')}`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {step === 1 ? 'Processing...' :
                  step === 2 ? 'Booking...' :
                    'Verifying...'}
              </span>
            ) : (
              step === 1 ? 'Next' :
                step === 2 ? 'Book Appointment' :
                  paymentVerified ? 'Done' : 'Pending'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}