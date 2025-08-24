import React from 'react';

const WaitingScreen= () => {
  return (
    <div className="flex flex-col items-center justify-center bg-white w-[95%] h-[90vh] rounded-[25px] shadow-lg">
      <div className='flex flex-col items-center justify-center '>
        {/* Image */}
        <img
          src="/Images/Waiting.svg"
          alt="Waiting for the doctor"
          className="w-[300px] h-auto mb-6"
        />
        <p className="text-lg font-semibold text-center text-black">
        Waiting For the doctor to join the Meeting!!!
        </p>
      </div>

    </div>
  );
};

export default WaitingScreen;
