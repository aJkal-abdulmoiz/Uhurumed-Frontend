'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';

export default function DateTimeSelector({
  onDateChange,
  onTimeSlotChange,
  initialDate,
  initialTimeSlot,
  existingSlots,
}) {
  // Get today's date at the start of the day
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);

    return d;
  }, []);

  console.log('initial time slot: ', initialTimeSlot);
  
  // Calculate the maximum selectable date
  const maxSelectableDate = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + 29);

    return d;
  }, [today]);

  const [selectedDate, setSelectedDate] = useState(() => {
    const initial = initialDate || today;
    if (initial > maxSelectableDate) {
      return maxSelectableDate;
    }

    return initial;
  });

  // visibleStartDate controls the first day shown in the window
  const [visibleStartDate, setVisibleStartDate] = useState(() => {
    return today;
  });

  const [selectedTimeSlot, setSelectedTimeSlot] = useState(initialTimeSlot || '');

  const [visibleDatesCount, setVisibleDatesCount] = useState(9);

  useEffect(() => {
    const updateVisibleDatesCount = () => {
      const width = window.innerWidth;
      if (width < 475) {
        setVisibleDatesCount(4);
      } else if (width < 640) {
        setVisibleDatesCount(3);
      } else if (width < 768) {
        setVisibleDatesCount(4);
      } else if (width < 900) {
        setVisibleDatesCount(5);
      } else if (width < 1024) {
        setVisibleDatesCount(6);
      } else if (width < 1280) {
        setVisibleDatesCount(7);
      } else {
        setVisibleDatesCount(9);
      }
    };

    updateVisibleDatesCount();
    window.addEventListener('resize', updateVisibleDatesCount);

    return () => window.removeEventListener('resize', updateVisibleDatesCount);
  }, []);

  const displayedDays = useMemo(() => {
    const days = [];
    const current = new Date(visibleStartDate);
    for (let i = 0; i < visibleDatesCount; i++) {
      const dayToAdd = new Date(current);
      if (dayToAdd <= maxSelectableDate) {
        days.push(dayToAdd);
      } else {
        break;
      }
      current.setDate(current.getDate() + 1);
    }

    return days;
  }, [visibleStartDate, maxSelectableDate, visibleDatesCount]);

  const generateTimeSlots = useCallback(() => {
    const slots = [];
    const now = new Date();
    const currentDateStr = selectedDate.toISOString().split('T')[0];
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
  
    for (let hour = currentHour; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const start24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const endHour = minute === 30 ? hour + 1 : hour;
        const endMinute = minute === 30 ? '00' : '30';
        const end24 = `${endHour.toString().padStart(2, '0')}:${endMinute}`;
        const slot24 = `${start24} - ${end24}`;

        const displayTime = slot24;

        const isBooked = existingSlots?.some(
          (slot) =>
            new Date(slot.rawDate).toISOString().split('T')[0] === currentDateStr &&
            slot.rawStartTime === start24 &&
            slot.rawEndTime === end24,
        );

        if (!isBooked) {
          slots.push({
            display: displayTime,
            value: slot24,
          });
        }
      }
    }

    return slots;
  }, [selectedDate, existingSlots]);

  const timeSlots = useMemo(() => generateTimeSlots(), [generateTimeSlots]);

  const handlePrevRange = () => {
    setVisibleStartDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - visibleDatesCount);
      if (newDate < today) {
        return today;
      }

      return newDate;
    });
  };

  const handleNextRange = () => {
    setVisibleStartDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + visibleDatesCount);

      return newDate;
    });
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTimeSlot('');
    onDateChange?.(date);
  };

  const handleTimeSlotSelect = (slot) => {
    setSelectedTimeSlot(slot.value);
    onTimeSlotChange?.(slot.value);
  };

  // Disable previous button if the current visible range starts on today
  const isPrevDisabled = visibleStartDate.toDateString() === today.toDateString();

  // Disable next button if the last day currently displayed is the max selectable date
  const isNextDisabled =
    displayedDays.length === 0 ||
    displayedDays[displayedDays.length - 1]?.toDateString() === maxSelectableDate.toDateString();

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Date Selection Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={handlePrevRange}
              className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              disabled={isPrevDisabled}
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex-1 overflow-x-auto">
              <div className="flex space-x-1 sm:space-x-2 justify-start min-w-max px-1 sm:px-2">
                {displayedDays.map((day) => (
                  <button
                    key={day.toISOString()}
                    onClick={() => handleDateSelect(day)}
                    className={`flex flex-col items-center justify-center p-1.5 sm:p-2 rounded-lg w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 flex-shrink-0 transition-all duration-200 ${
                      selectedDate.toDateString() === day.toDateString()
                        ? 'bg-[#00AAEE] text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-xs font-medium">{day.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                    <span className="text-xs sm:text-sm md:text-base lg:text-lg font-bold">{day.getDate()}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleNextRange}
              className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              disabled={isNextDisabled}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Time Slot Selection Section */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-3">Time Slot</label>
        {timeSlots.length > 0 ? (
          <div className="w-full">
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
              {timeSlots.map((slot, index) => (
                <button
                  key={index}
                  onClick={() => handleTimeSlotSelect(slot)}
                  className={`flex items-center justify-center p-3 sm:p-4 md:p-4 border-2 rounded-lg text-xs sm:text-sm md:text-sm font-medium transition-all duration-200 min-h-[48px] sm:min-h-[52px] md:min-h-[56px] w-full ${
                    selectedTimeSlot === slot.value
                      ? 'border-[#00AAEE] bg-blue-50 text-[#00AAEE]'
                      : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 hover:border-gray-300'
                  }`}
                >
                  <Clock size={14} className="mr-1 sm:mr-2 flex-shrink-0" />
                  <span className="truncate text-center leading-tight">{slot.display}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">No available time slots for this date</p>
          </div>
        )}
      </div>
    </div>
  );
}
