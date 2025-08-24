// import { useState, useEffect } from 'react';
// import { ChevronDown, Clock } from 'lucide-react';
// import { toast } from 'react-toastify';
// import SlotCard from '../NewComponents/doctorDashboard/SlotCard';
// import AddSlotForm from '../NewComponents/doctorDashboard/AddSlotForm';
// import { getDoctorSlots, createDoctorSlot } from '@/queries/DoctorQueries/slot';
// import { useAuthStore } from '@/stores/authStore';

// export default function AvailabilityPage() {
//   const { user } = useAuthStore();
//   const [slots, setSlots] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showAddSlotForm, setShowAddSlotForm] = useState(false);
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 10,
//     total: 0,
//   });
//   console.log(slots);


//   useEffect(() => {
//     fetchSlots();
//   }, [pagination.page]); // Refetch when page changes

//   const fetchSlots = async () => {
//     try {
//       setLoading(true);
//       const { docs, total } = await getDoctorSlots({
//         page: pagination.page,
//         limit: pagination.limit,
//       });

//       const formattedSlots = docs.map((slot) => {
//         const formatToAmPm = (time24) => {
//           const [h, m] = time24.split(':');

//           return `${h % 12 || 12}:${m} ${h >= 12 ? 'PM' : 'AM'}`;
//         };

//         return {
//           slotId: slot.id,
//           date: new Date(slot.date).toLocaleDateString('en-US', {
//             day: 'numeric',
//             month: 'long',
//             year: 'numeric',
//           }),
//           slotTime: `${formatToAmPm(slot.startTime)} - ${formatToAmPm(slot.endTime)}`,
//           title:slot.title,
//           description:slot.description,
//           rawDate: slot.date,
//           rawStartTime: slot.startTime,
//           rawEndTime: slot.endTime,
//           isBooked:slot.appointment ? true : false
//         };
//       });

//       setSlots(formattedSlots);
//       setPagination((prev) => ({ ...prev, total }));
//     } catch (error) {
//       console.error('Error fetching slots:', error);
//       toast.error('Failed to fetch slots. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteSlot = async () => {
//     try {
//       if (slots.length > 1) {
//         await fetchSlots();
//       } else {
//         setPagination((prev) => ({
//           ...prev,
//           page: Math.max(1, prev.page - 1),
//         }));
//       }
//     } catch (error) {
//       toast.error(error.message || 'Failed to delete slot');
//     }
//   };

//   const handleAddSlot = async (slotData) => {
//     try {
//       setLoading(true);

//       // Check for duplicate slots
//       const isDuplicate = slots.some(
//         (slot) =>
//           slot.rawDate.split('T')[0] === slotData.date &&
//           slot.rawStartTime === slotData.startTime &&
//           slot.rawEndTime === slotData.endTime,
//       );

//       if (isDuplicate) {
//         toast.warning('This time slot is already booked');

//         return;
//       }

//       // Prepare API data
//       const apiData = {
//         title: slotData.title,
//         description: slotData.description,
//         slotDateTime: {
//           [slotData.date]: [
//             {
//               startTime: slotData.startTime,
//               endTime: slotData.endTime,
//             },
//           ],
//         },
//         cancellationDeadlineMinutes: 120,
//         limit: 1,
//       };

//       const response = await createDoctorSlot(apiData);
//       console.log(response);


//       toast.success('Slot added successfully!');
//       setShowAddSlotForm(false);
//       await fetchSlots();
//     } catch (error) {
//       toast.error(error.message || 'Failed to add slot');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex justify-center items-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00AAEE]"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="py-6 mx-auto max-w-8xl px-4">
//       {/* Header section */}
//       <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 mt-14 space-y-4 sm:space-y-0">
//         <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
//           {showAddSlotForm ? 'Slots Management' : 'Available Slots'}
//         </h1>
//         {!showAddSlotForm && (
//           <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
//             <button className="bg-[#00AAEE] text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-sm flex items-center justify-center space-x-2 border border-blue-300 text-sm sm:text-base">
//               <span>Filters</span>
//               <ChevronDown size={16} className="sm:w-[18px] sm:h-[18px]" />
//             </button>
//             <button
//               onClick={() => setShowAddSlotForm(true)}
//               className="bg-[#00AAEE] hover:bg-[#0099DD] text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-sm text-sm sm:text-base"
//             >
//               Add Slot
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Main content area */}
//       {showAddSlotForm ? (
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-2">
//             <AddSlotForm onAddSlot={handleAddSlot} onCancel={() => setShowAddSlotForm(false)} existingSlots={slots} />
//           </div>

//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-lg sm:text-xl font-bold text-gray-900">My Availability</h2>
//                 <button
//                   onClick={() => setShowAddSlotForm(false)}
//                   className="text-[#00AAEE] hover:underline text-xs sm:text-sm font-medium"
//                 >
//                   View All
//                 </button>
//               </div>
//               <div className="space-y-3 sm:space-y-4 max-h-[600px] overflow-y-auto pr-2">
//                 {slots.map((slot, index) => (
//                   <div
//                     key={index}
//                     className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 border border-gray-200 rounded-lg bg-gray-50"
//                   >
//                     <div className="flex-shrink-0 p-1.5 sm:p-2 bg-blue-100 rounded-md">
//                       <Clock size={16} className="sm:w-5 sm:h-5 text-blue-600" />
//                     </div>
//                     <div className="min-w-0 flex-1">
//                       <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{slot.title}</h3>
//                       <p className="text-xs sm:text-sm text-gray-600 truncate">Slot ID: {slot.slotId}</p>
//                       <p className="text-xs sm:text-sm text-gray-600 truncate">Date: {slot.date}</p>
//                       <p className="text-xs sm:text-sm text-gray-600 break-words">Available Time: {slot.slotTime}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <>
//           <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-200">
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
//               {slots.map((slot, index) => (
//                 <SlotCard
//                   key={index}
//                   title={slot.title}
//                   slotId={slot.slotId}
//                   date={slot.date}
//                   slotTime={slot.slotTime}
//                   description={slot.description}
//                   isBooked={slot.isBooked}
//                   onDelete={handleDeleteSlot}
//                 />
//               ))}
//             </div>
//           </div>

//           {/* Pagination controls */}
//           {pagination.total > pagination.limit && (
//             <div className="flex justify-center mt-6 sm:mt-8">
//               <div className="flex items-center gap-2 sm:gap-4">
//                 <button
//                   onClick={() => setPagination((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
//                   disabled={pagination.page === 1}
//                   className={`px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base ${
//                     pagination.page === 1
//                       ? 'bg-gray-200 cursor-not-allowed'
//                       : 'bg-[#00AAEE] text-white hover:bg-[#0099DD]'
//                   }`}
//                 >
//                   Previous
//                 </button>

//                 <span className="text-gray-700 text-sm sm:text-base px-2">
//                   Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
//                 </span>

//                 <button
//                   onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
//                   disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
//                   className={`px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base ${
//                     pagination.page >= Math.ceil(pagination.total / pagination.limit)
//                       ? 'bg-gray-200 cursor-not-allowed'
//                       : 'bg-[#00AAEE] text-white hover:bg-[#0099DD]'
//                   }`}
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }


import { useState, useEffect } from 'react';
import { ChevronDown, Clock, MapPin,Mail,BriefcaseMedical } from 'lucide-react';
import { toast } from 'react-toastify';
import SlotCard from '../NewComponents/doctorDashboard/SlotCard';
import AddSlotForm from '../NewComponents/doctorDashboard/AddSlotForm';
import { getDoctorSlots, createDoctorSlot, editDoctorSlot } from '@/queries/DoctorQueries/slot';
import { useAuthStore } from '@/stores/authStore';
import { date } from 'yup';
import { da } from 'date-fns/locale';

export default function AvailabilityPage() {
  const { user } = useAuthStore();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddSlotForm, setShowAddSlotForm] = useState(false);
  const [editSlot, setEditSlot] = useState(null); // State for slot being rescheduled
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  useEffect(() => {
    fetchSlots();
  }, [pagination.page]);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const { docs, total } = await getDoctorSlots({
        page: pagination.page,
        limit: pagination.limit,
      });
      console.log('docs',docs);
      

      const formattedSlots = docs.map((slot) => {
        const formatToAmPm = (time24) => {
          const [h, m] = time24.split(':');

          return `${h % 12 || 12}:${m} ${h >= 12 ? 'PM' : 'AM'}`;
        };

        return {
          slotId: slot.id,
          date: new Date(slot.date).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
          slotTime: `${formatToAmPm(slot.startTime)} - ${formatToAmPm(slot.endTime)}`,
          title: slot.title,
          description: slot.appointment ? `Consultation meeting with ${slot?.appointment?.patientName} regarding ${slot?.appointment?.symptoms}` : 'Available Slot',
          rawDate: slot.date,
          rawStartTime: slot.startTime,
          rawEndTime: slot.endTime,
          isBooked: slot.appointment ? true : false,
          appointment:slot.appointment || null
        };
      });

      setSlots(formattedSlots);
      setPagination((prev) => ({ ...prev, total }));
    } catch (error) {
      console.error('Error fetching slots:', error);
      toast.error('Failed to fetch slots. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSlot = async () => {
    try {
      if (slots.length > 1) {
        await fetchSlots();
      } else {
        setPagination((prev) => ({
          ...prev,
          page: Math.max(1, prev.page - 1),
        }));
      }
    } catch (error) {
      toast.error(error.message || 'Failed to delete slot');
    }
  };

  const handleAddSlot = async (slotData) => {
    try {
      setLoading(true);

      // Check for duplicate slots
      const isDuplicate = slots.some(
        (slot) =>
          slot.rawDate.split('T')[0] === slotData.date &&
          slot.rawStartTime === slotData.startTime &&
          slot.rawEndTime === slotData.endTime,
      );

      if (isDuplicate) {
        toast.warning('This time slot is already booked');

        return;
      }

      // Prepare API data
      const apiData = {
        title: slotData.title,
        slotDateTime: {
          [slotData.date]: [
            {
              startTime: slotData.startTime,
              endTime: slotData.endTime,
            },
          ],
        },
        cancellationDeadlineMinutes: 120,
        limit: 1,
      };

      await createDoctorSlot(apiData);
      toast.success('Slot added successfully!');
      setShowAddSlotForm(false);
      setEditSlot(null); // Reset edit state
      await fetchSlots();
    } catch (error) {
      toast.error(error.message || 'Failed to add slot');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSlot = async (slotData,id) => {
    console.log('handleUpdate', slotData);
    
    try {
 
      // Prepare API data
      const apiData = {
        date: slotData.date,
        title: slotData.title,
        startTime: slotData.startTime,
        endTime: slotData.endTime,
        cancellationDeadlineMinutes: 120,
        limit: 1,
        
      };
      await editDoctorSlot(apiData,slotData.id);
      setShowAddSlotForm(false);
      setEditSlot(null);
      await fetchSlots();
    } catch (error) {
      toast.error(error.message || 'Failed to update slot');
    } finally {
      setLoading(false);
    }
  };

            


  const handleReschedule = (slot) => {


    setEditSlot(slot); // Set the slot to be rescheduled
    console.log(editSlot);


    setShowAddSlotForm(true); // Show the form
  };
  console.log(editSlot);

  // const date = new Date(editSlot?.date);


  // const formattedDate = date.toLocaleDateString('en-US', {
  //   weekday: 'long',
  //   year: 'numeric',
  //   month: 'long',
  //   day: 'numeric'
  // });
 




  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00AAEE]"></div>
      </div>
    );
  }

  return (

    <div className="py-6 mx-auto max-w-8xl px-4">

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 mt-14 space-y-4 sm:space-y-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {showAddSlotForm ? 'Slots Management' : 'Available Slots'}
        </h1>
        {!showAddSlotForm && (
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            {/* <button className="bg-[#00AAEE] text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-sm flex items-center justify-center space-x-2 border border-blue-300 text-sm sm:text-base">
              <span>Filters</span>
              <ChevronDown size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button> */}
            <button
              onClick={() => {
                setShowAddSlotForm(true);
                setEditSlot(null); // Ensure we're in "add" mode
              }}
              className="bg-[#00AAEE] hover:bg-[#0099DD] text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-sm text-sm sm:text-base"
            >
              Add Slot
            </button>
          </div>
        )}

      </div>


      {showAddSlotForm ? (
        <div className="grid grid-cols-1  ">
          <div className="lg:col-span-2">
            <AddSlotForm
              onAddSlot={handleAddSlot}
              onUpdateSlot={handleUpdateSlot} 
              onCancel={() => {
                setShowAddSlotForm(false);
                setEditSlot(null); // Reset edit state
              }}
              existingSlots={slots}
              initialData={editSlot} // Pass slot data for rescheduling // Pass reschedule handler
            />
          </div>


        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
              {slots.map((slot, index) => (
                <SlotCard
                  key={index}
                  title={slot.title}
                  slotId={slot.slotId}
                  date={slot.date}
                  slotTime={slot.slotTime}
                  description={slot.description}
                  rawStartTime={slot.rawStartTime}
                  rawEndTime={slot.rawEndTime}
                  isBooked={slot.isBooked}
                  appointment={slot.appointment}
                  onDelete={handleDeleteSlot}
                  onReschedule={handleReschedule} // Pass reschedule handler

                />
              ))}
            </div>
          </div>


          {pagination.total > pagination.limit && (

            <div className="flex justify-center mt-6 sm:mt-8">
              <div className="flex items-center gap-2 sm:gap-4">
                <button
                  onClick={() => setPagination((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                  disabled={pagination.page === 1}
                  className={`px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base ${pagination.page === 1
                    ? 'bg-gray-200 cursor-not-allowed'
                    : 'bg-[#00AAEE] text-white hover:bg-[#0099DD]'
                  }`}
                >
                  Previous
                </button>

                <span className="text-gray-700 text-sm sm:text-base px-2">
                  Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
                </span>

                <button
                  onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
                  className={`px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base ${pagination.page >= Math.ceil(pagination.total / pagination.limit)
                    ? 'bg-gray-200 cursor-not-allowed'
                    : 'bg-[#00AAEE] text-white hover:bg-[#0099DD]'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

}
