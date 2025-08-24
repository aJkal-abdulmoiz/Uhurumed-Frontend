import {useEffect} from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, formData, isAuthenticated, logout } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const userNavItems = [
    { name: 'Dashboard', route: '/user-dashboard' },
    { name: 'Appointments', route: '/appointment-user' },
    { name: 'Records', route: '/record' },
    { name: 'Messages', route: '/messages' },
    { name: 'Insurance', route: '/insurance' },
    { name: 'Doctors', route: '/doctors' },
    { name: 'Profile', route: '/editProfile' },
  ];

  const doctorNavItems = [
    { name: 'Dashboard', route: '/doctor-dashboard' },
    { name: 'Appointments', route: '/appointment-doctor' },
    { name: 'Messages', route: '/messages' },
    { name: 'Patients', route: '/patients' },
    { name: 'Availability', route: '/doctor-availability' },
    { name: 'Profile', route: '/doctor-editProfile' },
  ];

  const adminNavItems = [
    { name: 'Admin Dashboard', route: '/admin-dashboard' },
    { name: 'User Management', route: '/user-management' },
    { name: 'Doctor Management', route: '/doctor-management' },
    { name: 'System Settings', route: '/system-settings' },
    { name: 'Reports', route: '/reports' },
    { name: 'Profile', route: '/admin-profile' },
  ];

  const userType = user?.userType || formData?.userType;
  const getNavItems = () => {
    if (!formData) return userNavItems;

    switch (userType) {
    case 'DOCTOR':
      return doctorNavItems;
    case 'ADMIN':
      return adminNavItems;
    default:
      return userNavItems;
    }
  };

  const navItems = getNavItems();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isSidebarOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between md:px-12 py-4 px-8 shadow-sm bg-white">
      <div className="flex items-center gap-x-12">
        <NavLink to="/" className="flex items-center">
          <img src="/images/uhuruMedLogoSVG.svg" alt="UhuruMed Logo" width={40} height={30} />
          <h1 className="pl-1 text-[25px] text-[#04A4DF] cursor-pointer font-[600]">UhuruMed</h1>
        </NavLink>
        <div className="hidden md:flex space-x-8 text-gray-600 font-medium">
          {navItems.map((item) => (
            <NavLink
              key={item.route}
              to={item.route}
              className={({ isActive }) =>
                `hover:text-[#00AAEE] pb-1 ${isActive ? 'text-[#00AAEE] border-b-2 border-[#00AAEE]' : ''}`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>
      {/* Desktop Logout Button and Mobile Hamburger Icon */}
      <div className="flex items-center gap-x-4">
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="hidden md:block px-4 py-2 rounded-full text-white bg-[#00AAEE] hover:bg-[#0099DD] focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:ring-offset-2"
          >
            Logout
          </button>
        )}
        <div className="md:hidden">
          <button
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open menu"
            aria-expanded={isSidebarOpen}
            className="text-gray-600 hover:text-[#00AAEE] focus:outline-none focus:ring-2 focus:ring-[#00AAEE]"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Overlay */}
        {isSidebarOpen && (
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          ></div>
        )}

        {/* Sidebar Content */}
        <div
          className={`fixed inset-y-0 right-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <NavLink to="/" className="flex items-center" onClick={() => setIsSidebarOpen(false)}>
              <img src="/images/navbarLogo.png" alt="UhuruMed Logo" width={150} height={25} />
            </NavLink>
            <button
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close menu"
              className="text-gray-600 hover:text-[#00AAEE] focus:outline-none focus:ring-2 focus:ring-[#00AAEE]"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex flex-col p-4 space-y-4 text-gray-700 font-medium">
            {navItems.map((item) => (
              <NavLink
                key={item.route}
                to={item.route}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  `block hover:text-[#00AAEE] ${isActive ? 'text-[#00AAEE] font-semibold' : ''}`
                }
              >
                {item.name}
              </NavLink>
            ))}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="w-[50%] text-left px-4 py-2 rounded-full text-white bg-[#00AAEE] hover:bg-[#0099DD] focus:outline-none focus:ring-2 focus:ring-[#00AAEE] focus:ring-offset-2"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}