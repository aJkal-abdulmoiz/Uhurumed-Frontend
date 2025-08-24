import { useState } from 'react';
import { da } from 'date-fns/locale';
import { ChangePassword } from '@/queries/PatientQueries/changePass';

export function ChangePasswordModal({ isOpen, onClose }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isOpen) return null;



  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match.');

      return;
    }
    console.log({ oldPassword, newPassword, confirmPassword });
    // Add your password change logic here

    const res = await ChangePassword(oldPassword,newPassword,confirmPassword);
    console.log(res);
    

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
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

        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Change Your Password</h2>
          <p className="text-gray-600 mt-2">Enter a new password below to change your password</p>
        </div>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label htmlFor="old-password" className="text-sm font-medium text-gray-700">
              Old Password
            </label>
            <input
              id="old-password"
              type="password"
              placeholder="Enter Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:border-[#00AAEE] transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="new-password" className="text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              id="new-password"
              type="password"
              placeholder="Enter New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:border-[#00AAEE] transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type="password"
              placeholder="Enter Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:border-[#00AAEE] transition-colors"
            />
          </div>
        </div>
        <div className="mt-6">
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full px-6 py-3 bg-[#00AAEE] text-white rounded-full font-medium hover:bg-[#0099DD] transition-colors"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}
