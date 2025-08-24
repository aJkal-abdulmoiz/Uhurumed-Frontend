import { useEffect, useState } from 'react';
import DateTimeSelector from './DateTimeSelector';
import toast from 'react-hot-toast';
import { Clock, MapPin, Mail } from 'lucide-react';
import moment from 'moment';
import { use } from 'react';
import { set } from 'date-fns';
import { init } from 'aos';

export default function AddSlotForm({ onAddSlot,onUpdateSlot, onCancel, existingSlots, initialData }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSlotClick = async () => {
    if (!selectedDate || !selectedTimeSlot) {
      toast.error('Please fill in all required fields (Title, Date, Time Slot)');

      return;
    }

    try {
      setIsSubmitting(true);

      const year = selectedDate.getFullYear();
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
      const day = selectedDate.getDate().toString().padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      const [startTime, endTime] = selectedTimeSlot.split(' - ');


      const payload = {
        title,
        date: formattedDate,
        startTime,
        endTime,
      };
 


      

      // 👇 Check if editing or adding
      if (initialData) {
        console.log(initialData.slotId);
        
        await onUpdateSlot({ ...payload, id: initialData.slotId });
        toast.success('Slot updated successfully!');
      } else {
        await onAddSlot(payload);
        toast.success('Slot added successfully!');
      }

      setTitle('');

      setSelectedTimeSlot('');
      setSelectedDate(new Date());
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };


 


  const convertTo24Hour = (slotTime) => {
    if (!slotTime) return '';


    const [start, end] = slotTime.split(' - ');

    const formattedStart = moment(start.trim(), 'h:mm A').format('HH:mm');
    const formattedEnd = moment(end.trim(), 'h:mm A').format('HH:mm');

    return `${formattedStart} - ${formattedEnd}`;
  };

  useEffect(() => {
    if (initialData || initialData?.slotTime) {
      const convertedTime = convertTo24Hour(initialData.slotTime);
      console.log(convertedTime);

      setSelectedTimeSlot(convertedTime);
      setSelectedDate(new Date(initialData.date));
      setTitle(initialData.title || '');
    }
  }, [initialData]);


  



  return (
    <div className="bg-white rounded-xl justify-around shadow-lg p-6 flex flex-col md:flex-row gap-6">

      <div className='border border-gray-200 p-4'>
        <h2 className="text-2xl  font-bold text-gray-900 mb-6">Add New Slot</h2>

        <DateTimeSelector
          onDateChange={setSelectedDate}
          onTimeSlotChange={setSelectedTimeSlot}
          initialDate={selectedDate}
          initialTimeSlot={selectedTimeSlot}
          existingSlots={existingSlots}
        />

        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title (Optional)
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Title"
            disabled={isSubmitting}
          />
        </div>



        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-6 py-3 rounded-full shadow-sm"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleAddSlotClick}
            className="bg-[#00AAEE] hover:bg-[#0099DD] text-white font-semibold px-6 py-3 rounded-full shadow-sm"
            disabled={isSubmitting}
          >{
              initialData ? 'Update Slot' : 'Add Slot'
            }
          </button>
        </div>

      </div>


      {/* Siderbar  */}
      <div className=" border-2 sm:w-[400px] w-full  border-gray-300 ">
        <>
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900"> My Availabilty </h2>
          </div>

          {
            initialData && initialData?.appointment &&
       
          <div className="p-6 flex items-start">
            <img
              src={initialData?.appointment?.patientProfilePic || '/placeholder.svg?height=120&width=120&text=Doctor'}
              alt={initialData?.appointment?.patientName}
              className="rounded-full w-[80px] h-[80px] object-cover mr-6 border-2 border-gray-100 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{initialData?.appointment?.patientName}</h3>
              <div className="space-y-1 text-gray-700 text-sm">
                <div className="flex items-center">

                  <span>
                    {
                      initialData?.appointment?.patientDateOfBirth
                        ? `${new Date().getFullYear() - new Date(initialData.appointment.patientDateOfBirth).getFullYear()} Year old`
                        : 'N/A'
                    }
                  </span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="truncate">{initialData?.appointment?.patientEmail || 'N/A'}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Pakistan</span>
                </div>
              </div>
            </div>
          </div>

          }

          <div className="px-6 pt-2  pb-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Adding slot on:</h3>
            <div className=" flex flex-col ">
              <div className="w-full mb-4">
                <label className="text-sm font-bold text-gray-500">Title</label>
                <p className="text-sm border-1 border mt-1 p-3 bg-gray-50 rounded-md">
                  {title}
                </p>
              </div>
              <div className='flex gap-4'>

                <div className="flex-shrink-0 w-16 h-[56px] flex flex-col items-center justify-center rounded-lg bg-[#00AAEE] text-white">
                  <span className="text-sm font-medium">{selectedDate.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                  <span className="text-xl font-bold">{selectedDate.getDate().toString().padStart(2, '0')}</span>
                </div>
                <div className="flex items-center justify-center flex-grow py-1.5 px-4 rounded-lg border-2 border-[#00AAEE] text-[#00AAEE] font-semibold">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="text-sm"> {selectedTimeSlot}</span>
                </div>
              </div>
            </div>
          </div>


        </>
      </div>


    </div>
  );
}