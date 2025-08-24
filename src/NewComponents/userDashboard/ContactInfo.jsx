import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useProfileStore } from '../../stores/ProfileStore';

export function ContactInfoForm() {
  const {
    email,
    setEmail,
    phone,
    setPhone,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    is2FaEnabled,
    setIs2FaEnabled,
  } = useProfileStore();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      <div>
        <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
          Email
        </label>
        <input
          id="email"
          placeholder="Enter Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:border-[#00AAEE] transition-colors text-sm sm:text-base"
        />
      </div>
      <div>
        <label htmlFor="phone" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
          Phone No
        </label>
        <input
          id="phone"
          placeholder="Enter Phone No"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:border-[#00AAEE] transition-colors text-sm sm:text-base"
        />
      </div>
      {/* <div>
        <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            placeholder="Enter Your Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:border-[#00AAEE] transition-colors pr-10 text-sm sm:text-base"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
          >
            {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
          </button>
        </div>
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
          Confirm Password
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            placeholder="Enter Your Password"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:border-[#00AAEE] transition-colors pr-10 text-sm sm:text-base"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </button>
        </div>
      </div> */}
      <div className="flex items-center space-x-2 col-span-1 md:col-span-2">
        <label htmlFor="2fa" className="text-xs sm:text-sm font-medium text-gray-700">
          2FA Enabled? (Optional)
        </label>
        <button
          id="2fa"
          role="switch"
          aria-checked={is2FaEnabled}
          onClick={() => setIs2FaEnabled(!is2FaEnabled)}
          className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:ring-offset-2 ${
            is2FaEnabled ? 'bg-[#00AAEE]' : 'bg-gray-200'
          }`}
        >
          <span
            aria-hidden="true"
            className={`pointer-events-none inline-block h-4 w-4 sm:h-5 sm:w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              is2FaEnabled ? 'translate-x-4 sm:translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
        <span className="text-xs sm:text-sm text-gray-500">2FA Enable</span>
      </div>
    </div>
  );
}
