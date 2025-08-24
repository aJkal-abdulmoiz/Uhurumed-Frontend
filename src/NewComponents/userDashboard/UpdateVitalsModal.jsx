import { useState } from 'react';


// Helper component for SVG icons
const SvgIcon = ({ iconPath, className }) => (
  <svg className={className}>
    <use xlinkHref={iconPath} />
  </svg>
);

export default function UpdateVitalsModal({ isOpen, onClose, onUpdateVitals, initialVitals }) {
  const [weight, setWeight] = useState(initialVitals?.weight);
  const [height, setHeight] = useState(initialVitals?.height);
  const [bloodPressure, setBloodPressure] = useState(initialVitals.bloodPressure);
  const [heartRate, setHeartRate] = useState(initialVitals.heartRate);

  const calculateBMI = (weightKg, heightCm) => {

    if (weightKg && heightCm) {
      const heightM = heightCm / 100;

      return (weightKg / (heightM * heightM)).toFixed(1);
    }

    return 'N/A';
  };



  const handleUpdate = () => {
    const newBmi = calculateBMI(weight, height);
    onUpdateVitals({
      weight,
      height,
      bloodPressure,
      heartRate,
      bmi: Number.parseFloat(newBmi),
    });
    onClose();
  };

  const today = new Date().toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between pb-4">
          <h2 className="text-2xl font-bold text-gray-900">Vital Signs</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Weight */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SvgIcon iconPath="icons/icon16.svg" className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
              <div>
                <h3 className="text-base font-medium text-gray-900">Weight</h3>
                <p className="text-xs text-gray-500">Last Updated: {today}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number.parseFloat(e.target.value))}
                className="w-24 border border-gray-300 rounded-full px-3 py-2 text-right focus:outline-none focus:ring-2 focus:ring-[#04A4E2]"
              />
              <span className="text-sm text-gray-700 w-8 text-left">Kg</span>
            </div>
          </div>

          {/* Height */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SvgIcon iconPath="icons/icon17.svg" className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
              <div>
                <h3 className="text-base font-medium text-gray-900">Height</h3>
                <p className="text-xs text-gray-500">Last Updated: {today}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number.parseFloat(e.target.value))}
                className="w-24 border border-gray-300 rounded-full px-3 py-2 text-right focus:outline-none focus:ring-2 focus:ring-[#04A4E2]"
              />
              <span className="text-sm text-gray-700 w-8 text-left">cm</span>
            </div>
          </div>

          {/* Blood Pressure */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SvgIcon iconPath="icons/icon18.svg" className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
              <div>
                <h3 className="text-base font-medium text-gray-900">Blood Pressure</h3>
                <p className="text-xs text-gray-500">Last Updated: {today}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={bloodPressure}
                onChange={(e) => setBloodPressure(e.target.value)}
                className="w-24 border border-gray-300 rounded-full px-3 py-2 text-right focus:outline-none focus:ring-2 focus:ring-[#04A4E2]"
                placeholder="120/80"
              />
              <span className="text-sm text-gray-700 w-8 text-left">mmHg</span>
            </div>
          </div>

          {/* Heart Rate */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SvgIcon iconPath="icons/icon11.svg" className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
              <div>
                <h3 className="text-base font-medium text-gray-900">Heart Rate</h3>
                <p className="text-xs text-gray-500">Last Updated: {today}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={heartRate}
                onChange={(e) => setHeartRate(Number.parseFloat(e.target.value))}
                className="w-24 border border-gray-300 rounded-full px-3 py-2 text-right focus:outline-none focus:ring-2 focus:ring-[#04A4E2]"
              />
              <span className="text-sm text-gray-700 w-8 text-left">bpm</span>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6">
          <button
            onClick={handleUpdate}
            className="w-full rounded-full bg-[#04A4E2] py-3 text-base font-semibold text-white hover:bg-[#04A4E2] transition-colors"
          >
            Update Vitals
          </button>
        </div>
      </div>
    </div>
  );
}