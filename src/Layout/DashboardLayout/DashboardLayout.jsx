import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../NewComponents/userDashboard/Navbar';

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isMobile]);

  return (
    <div className="flex min-h-screen w-full">
      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="flex-1 p-4 md:px-12 md:py-6 overflow-auto pt-8 sm:pt-20">{children}</main>
      </div>
    </div>
  );

}



// /* eslint-disable react/jsx-key */
// // ... All imports remain unchanged
// import * as React from 'react';
// import {
//   Box,
//   Drawer,
//   AppBar,
//   CssBaseline,
//   Toolbar,
//   List,
//   Typography,
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
//   ListItem,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   IconButton,
//   Collapse,
//   useTheme,
//   useMediaQuery,
// } from '@mui/material';
// import MenuIcon from '@mui/icons-material/Menu';
// import ExitToAppIcon from '@mui/icons-material/ExitToApp';
// import ExpandLess from '@mui/icons-material/ExpandLess';
// import { PiUsersThreeFill } from 'react-icons/pi';
// import { AiOutlineMedicineBox } from 'react-icons/ai';

// import ExpandMore from '@mui/icons-material/ExpandMore';
// import { FaQ } from 'react-icons/fa6';

// import { FaQuinscape } from 'react-icons/fa';
// import {
//   MdDashboard,
//   MdOutlineUnsubscribe,
//   MdPolicy,
//   MdPayments,
//   MdOutlineReportGmailerrorred,
// } from 'react-icons/md';
// import { FaUsers, FaHospitalUser } from 'react-icons/fa6';
// import { GiStaticGuard } from 'react-icons/gi';

// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { AuthContext } from '../../Context/Auth';
// import Btn from '../../CommonComponenet/CommonButtons/Btn';
// import CancelBtn from '../../CommonComponenet/CommonButtons/CancelBtn';

// const drawerWidth = 240;

// export default function DashboardLayout({ children }) {
//   const [openLogoutDialog, setOpenLogoutDialog] = React.useState(false);
//   const [mobileOpen, setMobileOpen] = React.useState(false);
//   const [staticOpen, setStaticOpen] = React.useState(false);

//   const navigate = useNavigate();
//   const location = useLocation();
//   const auth = React.useContext(AuthContext);
//   const userData = auth?.userData;
//   console.log('sdfasdgasdgsa', userData);
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//   const handleLogout = () => {
//     navigate('/login');
//     setOpenLogoutDialog(false);
//     localStorage.removeItem('UhuruMedToken');
//     localStorage.removeItem('userData');
//     window.location.reload(); // Correct method
//   };

//   const icons = [
//     <MdDashboard />,
//     <FaUsers />,
//     <MdOutlineUnsubscribe />,
//     <FaHospitalUser />,
//     <MdPolicy />,
//     <MdPayments />,
//     <AiOutlineMedicineBox />,

//     <MdOutlineReportGmailerrorred />,
//     <GiStaticGuard />,
//     <PiUsersThreeFill />,
//     <FaQ />,
//   ];

//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   React.useEffect(() => {
//     if (isMobile) {
//       setMobileOpen(false);
//     }
//   }, [location.pathname, isMobile]);

//   const handleLogoClick = () => {
//     navigate('/');
//   };

//   const roleBasedMenuItems = {
//     USER: [
//       { text: 'Dashboard', path: '/user-dashboard' },
//       { text: 'Appointment', path: '/appointment-user' },
//       { text: 'Doctors', path: '/user-doctors' },
//       // { text: "Notes", path: "/notes" },
//       { text: 'Chat', path: '/chat' },
//       // { text: "Subscription ", path: "/user-subscription" },
//       { text: 'Record', path: '/record' },
//       { text: 'Settings', path: '/settings' },
//     ],

//     ADMIN: [
//       { text: 'Dashboard', path: '/dashboard' },
//       { text: 'Patients ', path: '/Patients' },
//       // { text: "Subscription ", path: "/subscription" },
//       { text: 'Doctors', path: '/doctors' },
//       // { text: "Chat", path: "/chat" },
//       { text: 'Appointment', path: '/appointment' },
//       { text: 'Payment', path: '/payments' },
//       // { text: "Subscribe User", path: "/subscribe" },
//       { text: 'Static Content', path: '/static' },
//       { text: 'Contact Us', path: '/contactList' },
//       { text: 'Settings', path: '/settings' },
//     ],
//     DOCTOR: [
//       { text: 'Dashboard', path: '/doctor-dashboard' },
//       // { text: "Patients ", path: "/Patients" },

//       { text: 'Chat', path: '/doctor-chat' },
//       { text: 'Appointment', path: '/appointment-doctor' },
//       // { text: "Notes", path: "/notes" },
//       { text: 'Doctor Slot', path: '/slot' },
//       { text: 'Settings', path: '/settings' },
//     ],
//   };

//   const menuItems = roleBasedMenuItems[userData?.userType ?? ''] || [];

//   const drawerContent = (
//     <Box
//       sx={{
//         height: '100%',
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'space-between',
//         p: 1,
//       }}
//     >
//       <Box>
//         <Toolbar />
//         <List>
//           {menuItems?.map((item, index) => {
//             const isParentActive =
//               location.pathname.startsWith(item.path || '') ||
//               (item.children &&
//                 item.children.some((child) =>
//                   location.pathname.startsWith(child.path)
//                 ));
//             const hasChildren = !!item.children;
//             const isStaticItem = item.text === 'Static';
//             const isActive = isParentActive || (isStaticItem && staticOpen);

//             return (
//               <React.Fragment key={item.text}>
//                 <ListItem disablePadding>
//                   <ListItemButton
//                     onClick={() => {
//                       if (hasChildren) {
//                         setStaticOpen((prev) => !prev);
//                       } else {
//                         navigate(item.path);
//                         if (isMobile) setMobileOpen(false);
//                       }
//                     }}
//                     sx={{
//                       backgroundColor: isActive ? '#2e5ad5' : 'transparent',
//                       borderRadius: '8px',
//                       mb: 1,
//                       '&:hover': {
//                         backgroundColor: isActive ? '#2e5ad5' : '#f0f0f0',
//                       },
//                     }}
//                   >
//                     <ListItemIcon
//                       sx={{
//                         color: isActive ? '#fff' : 'inherit',
//                         fontSize: '22px',
//                         minWidth: { xs: '40px', md: '42px' },
//                       }}
//                     >
//                       {item.icon || icons[index]}
//                     </ListItemIcon>
//                     <ListItemText
//                       primary={item.text}
//                       primaryTypographyProps={{
//                         fontSize: '17px', // your custom size
//                         color: isActive ? '#fff' : '#333', // custom color
//                         fontWeight: isActive ? 'bold' : 'normal', // optional
//                       }}
//                       // sx={{ color: isActive ? "#fff" : "inherit",fontSize:'15px' }}
//                     />
//                     {hasChildren &&
//                       (staticOpen ? (
//                         <ExpandLess sx={{ color: '#fff' }} />
//                       ) : (
//                         <ExpandMore sx={{ color: '#fff' }} />
//                       ))}
//                   </ListItemButton>
//                 </ListItem>

//                 {hasChildren && (
//                   <Collapse in={staticOpen} timeout="auto" unmountOnExit>
//                     <List component="div" disablePadding sx={{ pl: 4 }}>
//                       {item.children.map((child) => {
//                         const isChildActive = location.pathname.startsWith(
//                           child.path
//                         );

//                         return (
//                           <ListItem key={child.text} disablePadding>
//                             <ListItemButton
//                               component={Link}
//                               to={child.path}
//                               onClick={() => isMobile && setMobileOpen(false)}
//                               sx={{
//                                 backgroundColor: isChildActive
//                                   ? '#2e5ad5'
//                                   : 'transparent',
//                                 borderRadius: '8px',
//                                 mb: 1,
//                                 '&:hover': {
//                                   backgroundColor: isChildActive
//                                     ? '#2e5ad5'
//                                     : '#f0f0f0',
//                                 },
//                               }}
//                             >
//                               <ListItemText
//                                 primary={child.text}
//                                 sx={{
//                                   color: isChildActive ? '#fff' : 'inherit',
//                                   pl: 2,
//                                 }}
//                               />
//                             </ListItemButton>
//                           </ListItem>
//                         );
//                       })}
//                     </List>
//                   </Collapse>
//                 )}
//               </React.Fragment>
//             );
//           })}
//         </List>
//       </Box>

//       <Box>
//         <Button
//           color="primary"
//           onClick={() => setOpenLogoutDialog(true)}
//           sx={{
//             textTransform: 'capitalize',
//             marginLeft: '10px',
//             fontWeight: '500',
//             color: '#2e5ad5',
//           }}
//           startIcon={<ExitToAppIcon />}
//         >
//           Logout
//         </Button>
//       </Box>
//     </Box>
//   );


//   return (
//     <Box sx={{ display: 'flex', background: '#f7fbfc' }}>
//       <CssBaseline />
//       <AppBar
//         position="fixed"
//         sx={{
//           zIndex: (theme) => theme.zIndex.drawer + 1,
//           background: '#FFF',
//           boxShadow: 'none',
//         }}
//       >
//         <Toolbar
//           sx={{ p: 0, display: 'flex', justifyContent: 'space-between' }}
//         >
//           <Box
//             sx={{
//               display: 'flex',
//               alignItems: 'center',
//               background: '#FFF',
//               padding: '6px 51px',
//               marginLeft: isMobile ? '0px' : '-39px',
//               height: '100%',
//               width: isMobile ? '100%' : 'auto',
//             }}
//           >
//             {isMobile && (
//               <IconButton
//                 color="inherit"
//                 edge="start"
//                 onClick={handleDrawerToggle}
//                 sx={{ mr: 3, color: '#000', marginLeft: { xs: '-30px' } }}
//               >
//                 <MenuIcon />
//               </IconButton>
//             )}
//             <img
//               src="Images/uhuruMedHDLogo.jpeg"
//               alt="logo"
//               style={{
//                 height: '60px',
//                 marginRight: 8,
//                 marginLeft: '-11px',
//                 cursor: 'pointer',
//                 width: '65px',
//               }}
//               onClick={handleLogoClick}
//             />
//             <Typography
//               onClick={handleLogoClick}
//               variant="h6"
//               fontWeight="bold"
//               color="#000"
//               sx={{ fontSize: '24.4px', marginRight: '-23px',cursor:'pointer' }}
//             >
//               UhuruMed
//             </Typography>
//             <div>
//               {drawerContent}
//             </div>
//           </Box>
//         </Toolbar>
//       </AppBar>



//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           p: 3,
//           mt: 8,
//           height: '100%',
//           // height: 'calc(100vh - 60px)',
//           width: '100%',
//           overflow: 'scroll',
//         }}
//       >
//         {children}
//       </Box>

//       <Dialog
//         open={openLogoutDialog}
//         onClose={() => setOpenLogoutDialog(false)}
//         PaperProps={{
//           sx: {
//             padding: '1.5rem',
//             width: '400px',
//             maxWidth: '90%',
//             borderRadius: '12px',
//           },
//         }}
//       >
//         <DialogTitle
//           sx={{ textAlign: 'center', fontWeight: '600', fontSize: '20px' }}
//         >
//           Logout
//         </DialogTitle>
//         <DialogContent>
//           <DialogContentText sx={{ textAlign: 'center' }}>
//             Are you sure you want to log out?
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions
//           sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}
//         >
//           <CancelBtn onClick={() => setOpenLogoutDialog(false)} label="No" />
//           <Btn onClick={handleLogout} label="Yes" />
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// }
