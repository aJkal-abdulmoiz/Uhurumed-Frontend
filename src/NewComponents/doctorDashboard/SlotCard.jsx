// import { CalendarCheck } from 'lucide-react';
// import { deleteDoctorSlot } from '@/queries/DoctorQueries/slot';
// import toast from 'react-hot-toast';
// import { useState } from 'react';

// export default function SlotCard({ title, slotId, date, slotTime, description, isBooked, onDelete }) {
//   const [isDeleting, setIsDeleting] = useState(false);


//   const handleDelete = async () => {
//     if (isBooked) {
//       toast.error('You cannot delete a booked appointment');

//       return;
//     }

//     if (window.confirm('Are you sure you want to cancel this slot?')) {
//       try {
//         setIsDeleting(true);
//         await deleteDoctorSlot(slotId);
//         toast.success('Slot cancelled successfully');
//         if (onDelete) onDelete(slotId); // Call parent component's callback if provided
//       } catch (error) {
//         toast.error(error.message || 'Failed to cancel slot');
//       } finally {
//         setIsDeleting(false);
//       }
//     }
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col p-3">
//       {/* Top Blue Section - now nested and rounded */}
//       <div className="bg-[#00AAEE] rounded-2xl p-3 flex items-center justify-between text-white flex-shrink-0 mb-3">
//         <div className="flex-1 pr-2">
//           <p className="text-[0.8rem] font-medium opacity-80">Title:</p>
//           <h3 className="text-sm font-semibold leading-tight">{title}</h3>
//           <p className="text-[0.8rem] font-medium opacity-80 mt-1">Slot id :</p>
//           <p className="text-xs font-bold">{slotId}</p>
//         </div>
//         <div className="flex-shrink-0 w-14 h-14 bg-white rounded-full flex items-center justify-center">
//           <CalendarCheck size={28} className="text-[#00AAEE]" />
//         </div>
//       </div>
//       {/* Middle White Section */}
//       <div className="flex-1 flex flex-col justify-between">
//         <div className="grid grid-cols-2 gap-y-1 mb-2">
//           <div>
//             <p className="text-[0.8rem] font-medium text-gray-600">Date :</p>
//             <p className="text-xs font-semibold text-gray-800">{date}</p>
//           </div>
//           <div>
//             <p className="text-[0.8rem] font-medium text-gray-600">Slot time:</p>
//             <p className="text-xs font-semibold text-gray-800">{slotTime}</p>
//           </div>
//         </div>
//         <div>
//           <p className="text-[0.8rem] font-medium text-gray-600">Description :</p>
//           <p className="text-[0.65rem] text-gray-700 leading-tight">{description}</p>
//         </div>
//       </div>
//       {/* Bottom Buttons Section - now directly at the bottom, centered */}
//       <div className="mt-auto flex justify-center space-x-2 pt-3">
//         <button  className="bg-[#00AAEE] hover:bg-[#0099DD] text-white font-semibold px-3 py-1.5 rounded-full shadow-sm text-xs">
//           Reschedule
//         </button>
//         <button
//           onClick={handleDelete}
//           disabled={isDeleting}
//           className={`${isDeleting ? 'bg-gray-300' : 'bg-gray-200 hover:bg-gray-300'} text-gray-800 font-semibold px-7 py-1.5 rounded-full shadow-sm text-xs`}
//         >
//           {isDeleting ? 'Cancelling...' : 'Cancel'}
//         </button>
//       </div>
//     </div>
//   );
// }

import { CalendarCheck } from 'lucide-react';
import { deleteDoctorSlot } from '@/queries/DoctorQueries/slot';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function SlotCard({ title, slotId, date,appointment, slotTime, description, isBooked,rawStartTime ,rawEndTime, onDelete, onReschedule }) {
  const [isDeleting, setIsDeleting] = useState(false);

  
  const handleDelete = async () => {
    if (isBooked) {
      toast.error('You cannot delete a booked appointment');

      return;
    }

    if (window.confirm('Are you sure you want to cancel this slot?')) {
      try {
        setIsDeleting(true);
        await deleteDoctorSlot(slotId);
        toast.success('Slot cancelled successfully');
        if (onDelete) onDelete(slotId);
      } catch (error) {
        toast.error(error.message || 'Failed to cancel slot');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleReschedule = () => {
    if (!isBooked) {
      toast.error('You cannot reschedule a available appointment');

      return;
    }

    
    onReschedule({ title, slotId, date, slotTime, description, rawStartTime,rawEndTime,appointment });
  };

  



  return (

    <div className="bg-white relative rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col p-3">
      <div className={`absolute -right-2 ${appointment ? 'bg-cyan-100 text-cyan-700' : 'bg-orange-100 text-orange-700'}  top-4 rotate-45  h-5 bg-black w-20 text-center text-sm rounded-md `}>{appointment ? 'Shedule' : 'Pending'}</div>

      <div className="bg-[#00AAEE] rounded-2xl p-3 flex items-center justify-between text-white flex-shrink-0 mb-3">
        <div className="flex-1 pr-2">
          <p className="text-[0.8rem] font-medium opacity-80">Title:</p>
          <h3 className="text-sm font-semibold leading-tight">{title}</h3>
          <p className="text-[0.8rem] font-medium opacity-80 mt-1">Slot id :</p>
          <p className="text-xs font-bold">{slotId}</p>
        </div>
        <div className="flex-shrink-0 w-14 h-14 bg-white rounded-full flex items-center justify-center">
          <CalendarCheck size={28} className="text-[#00AAEE]" />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div className="grid grid-cols-2 gap-y-1 mb-2">
          <div>
            <p className="text-[0.8rem] font-medium text-gray-600">Date :</p>
            <p className="text-xs font-semibold text-gray-800">{date}</p>
          </div>
          <div>
            <p className="text-[0.8rem] font-medium text-gray-600">Slot time:</p>
            <p className="text-xs font-semibold text-gray-800">{slotTime}</p>
          </div>
        </div>
        <div>
          <p className="text-[0.8rem] font-medium text-gray-600">Description :</p>
          <p className="text-xs text-gray-700 leading-tight">{description}</p>
        </div>
      </div>

      <div className="mt-auto flex justify-center space-x-2 pt-3">
        <button
          onClick={handleReschedule}
          disabled={isDeleting || !appointment}
          
          className={`${isDeleting || !appointment ?  'bg-gray-300' : 'bg-[#00AAEE] hover:bg-[#0099DD]'} text-white font-semibold px-3 py-1.5 rounded-full shadow-sm text-xs`}
        >
          Reschedule
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className={`${isDeleting ? 'bg-gray-300' : 'bg-gray-200 hover:bg-gray-300'} text-gray-800 font-semibold px-7 py-1.5 rounded-full shadow-sm text-xs`}
        >
          {isDeleting ? 'Cancelling...' : 'Cancel'}
        </button>
      </div>
    </div>
  );
}