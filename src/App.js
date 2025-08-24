import React, { useEffect } from 'react';
import Header from './CommonComponenet/Header/Header';
import Login from './Layout/Login';
import Footer from './CommonComponenet/Footer/Footer';
import { ThemeProvider } from '@emotion/react';
import theme from './theme';
import SignUp from './Layout/LoginLayout/SignUp';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import BannerPage from './Pages/BannerPage';
import Specilization from './Pages/Specilization/Specilization';
import Symption from './Pages/Symption/Symption';
import DashboardLayout from './Layout/DashboardLayout/DashboardLayout';
import DashboardPage from './Pages/DashboardPage';
import DashboardOverView from './CommonComponenet/CommonButtons/DashboardOverView';
import PatientTable from './Pages/PatientTable';
import NewPatientForm from './Pages/NewPatientForm';
import DoctorsList from './Pages/Doctors/DoctorList';
import AppointmentList from './Pages/AppointmentList';
import PaymentList from './Pages/PaymentList';
import StaticContent from './Pages/StaticContent';
import AddStatic from './Pages/AddStatic';
import EditStatic from './Pages/EditStatic';
import Subscription from './Pages/Subscription';
import AddSubscription from './Pages/AddSubscription';
import EditSubscription from './Pages/EditSubscription';
import ChatList from './Pages/ChatList';
import TwoFactorSettings from './Pages/TwoFactorSettings';
import ChangePassword from './Pages/ChangePassword';
import EditProfile from './CommonComponenet/CommonButtons/EditProfile';
import UserSubscription from './Pages/Users/UserSubscription';
import UserDoctors from './Pages/Users/UserDoctors';
import Notes from './Pages/Users/Notes';
import MainBanner from './Pages/MainBanner/MainBanner';
import DoctorServices from './Pages/DoctorServices/DoctorServices';
import { Toaster } from 'react-hot-toast';
import AuthProvider from './Context/Auth';
import Contact from './Pages/ContactPage/Contact';
import SpecilistDoc from './Pages/SpecilistDoctors/SpecilistDoc';
import About from './Pages/AboutUsPage/About';
import SlotList from './Pages/DoctorSlot/SlotList';
import AddSlot from './Pages/DoctorSlot/AddSlot';
import PaymentSuccess from './Pages/PaymentSuccess/PaymentSuccess';
import AppointmentUserlist from './Pages/AppointmentUserlist';
import StaticData from './Pages/StaticPage/StaticData';
import PrivacyTitle from './Pages/Privacy&Policy/PrivacyTitle';
import Terms from './Pages/Term&Cond/Terms';
import NoDataFoundPage from './Pages/NoDataFound/NoDataFoundPage';
import Appointments from './Pages/PaymentSuccess/Appointments';
import UserDashboard from './CommonComponenet/CommonButtons/UserDashboard';
import DoctorDashboard from './CommonComponenet/CommonButtons/DoctorDashboard';
import DoctorAppointmentList from './Pages/DoctorAppointmentList';
import CardPage from './Pages/CardPage/CardPage';
import DoctorCard4 from './Pages/DoctorAbout/DoctorAbout';
import HomePage3 from './Pages/HomePage3/HomePage3';
import HomePage4 from './Pages/HomePage4/HomePage4';
import HomePage1 from './Pages/HomePage1/HomePage1';
import HeroSection from './Pages/HeroSection/HeroSection';
import DoctorChatList from './Pages/DoctorChatList';
import SubscribeUserList from './Pages/SubscribeUserList/SubscribeUserList';
import TopService from './Pages/HomePage3.1/TopService';
import { WhiteBanner } from './Pages/WhitBanner/WhiteBanner';
import Location from './Pages/Loaction/Location';
import WhoWeServe from './Pages/WhoWeServe/WhoWeServe';
import { Members } from './Pages/Members/Members';
import Country from './Pages/Country/Country';
import GetUrgent from './Pages/GetUrgent/GetUrgent';
import Record from './Pages/RecordSection/Record';
import AuthGuard from './ApiConfig/AuthGuard';
import HowItswork from './Pages/HowItsWork/HowItswork';
import NewSpecolist from './Pages/NewSpecilist/NewSpecolist';
import { Proposition } from './Pages/Proposition/Proposition';
import AdminConatc from './Pages/AdminContact/AdminConatc';
import EditSlots from './Pages/DoctorSlot/EditSlots';
import DoctorRecord from './Pages/RecordSection/DoctorRecord';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './Pages/CheckoutForm';
import { loadStripe } from '@stripe/stripe-js';
import StripeSuccess from './Pages/PaymentSuccess/StripeSuccess';
import MedicalReports from './CommonComponenet/CommonButtons/MedicalReports';
import DoctorAvailability from './Pages/DoctorAvailability';
import DoctorCreateForm from './Pages/admin/doctors/DoctorCreateForm';
import DoctorEditProfile from './Pages/DoctorEditProfile';
import ConsultDetails from './Pages/ConsultDetails';
import ConsultationMeeting from './NewComponents/ConsultationMeeting';
import AppointmentDetailsPage from './Pages/AppointmentDetailsPage';

const ScrollToTopOnRouteChange = () => {
  const { pathname } = useLocation();


  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  const stripePromise = loadStripe(
    'pk_test_51RUpovAMqg8BSfv5KDRRWYJt2Pi5kNuHy4fs3yA8fz5zsLzq2anwmvTkxsPK0Rk9oJ86ktejMtlqBhJnG8kkJWP700l2knCJ6D'
  ); // Your publishable key


  const Home = () => (
    <>
      <Header />
      {/* <HomePage1 /> */}
      {/* <HeroSection /> */}
      <WhiteBanner />
      <DoctorCard4 />
      <Location />
      <WhoWeServe />
      <Members />
      <Country />
      <Proposition />
      <GetUrgent />
      {/* <StaticData /> */}
      {/* <MainBanner /> */}

      {/* <HomePage3 /> */}
      {/* <TopService /> */}
      {/* <HomePage4 /> */}

      {/* <CardPage /> */}
      {/* {/* <DoctorServices /> */}
      {/* <Specilization /> */}
      {/*
      <Symption />*/}
      {/* <StaticData /> */}
      <Footer />
    </>
  );
  const LoginLayout = () => (
    <>
      <Header />
      <Login />
      <Footer />
    </>
  );
  const SignUpLayout = () => (
    <>
      <Header />
      <SignUp />
      <Footer />
    </>
  );
  const AboutUsLayout = () => (
    <>
      <Header />
      {/* <BannerPage /> */}
      <About />
      <Footer />
    </>
  );
  const ConatctUsLayout = () => (
    <>
      <Header />
      <Contact />
      <Footer />
    </>
  );
  const SpecialistLayout = () => (
    <>
      <Header />
      <SpecilistDoc />
      <Footer />
    </>
  );
  const PrivacyLayout = () => (
    <>
      <Header />
      <PrivacyTitle />
      <Footer />
    </>
  );

  const TermsLayout = () => (
    <>
      <Header />
      <Terms />
      <Footer />
    </>
  );
  const Howworks = () => (
    <>
      <Header />
      <HowItswork />
      <Footer />
    </>
  );
  const Specialist = () => (
    <>
      <Header />
      <NewSpecolist />
      <Footer />
    </>
  );
  const PropositionLayout = () => (
    <>
      <Header />
      <Proposition />
      <Footer />
    </>
  );

  return (
    <div className="App">
      <Toaster
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        // theme={theme.palette.type}
      />
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <Router>
            <ScrollToTopOnRouteChange />
            <Elements stripe={stripePromise}>
              <Routes>

                <Route path="/" element={<Home />} />
                <Route path="/checkout" element={<CheckoutForm />} />
                <Route path="/login" element={<LoginLayout />} />
                <Route path="/signUp" element={<SignUpLayout />} />
                <Route path="/about" element={<AboutUsLayout />} />
                <Route path="/contact" element={<ConatctUsLayout />} />
                <Route path="/expert" element={<SpecialistLayout />} />
                <Route path="/payment/verify" element={<PaymentSuccess />} />
                <Route path="/privacy" element={<PrivacyLayout />} />
                <Route path="/work" element={<Howworks />} />
                <Route path="/appointments/verify" element={<Appointments />} />
                <Route path="/appointments/success" element={<StripeSuccess />} />
                <Route path="/terms" element={<TermsLayout />} />
                {/* <Route path="/proposition" element={<PropositionLayout />} /> */}
                <Route path="/specialist" element={<Specialist />} />
                <Route path="*" element={<NoDataFoundPage />} />
                <Route
                  path="/dashboard"
                  element={
                    <AuthGuard>
                      <DashboardLayout>
                        <DashboardOverView />
                        {/* <DashboardOverView /> */}
                      </DashboardLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/user-dashboard"
                  element={
                    <AuthGuard>
                      <DashboardLayout>
                        <UserDashboard />
                        {/* <DashboardOverView /> */}
                      </DashboardLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/appointment-details"
                  element={
                    <AuthGuard>
                      <DashboardLayout>
                        <AppointmentDetailsPage />
                        {/* <DashboardOverView /> */}
                      </DashboardLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/doctor-dashboard"
                  element={
                    <AuthGuard>
                      <DashboardLayout>
                        <DoctorDashboard />
                        {/* <DashboardOverView /> */}
                      </DashboardLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/Patients"
                  element={
                    <AuthGuard>
                      <DashboardLayout>
                        <PatientTable />
                      </DashboardLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/Newpatients"
                  element={
                    <AuthGuard>
                      <DashboardLayout>
                        <NewPatientForm />
                      </DashboardLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/doctors"
                  element={
                    <AuthGuard>
                      <DashboardLayout>
                        <DoctorsList />
                      </DashboardLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/slot"
                  element={
                    <AuthGuard>
                      <DashboardLayout>
                        <SlotList />
                      </DashboardLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="addSlot"
                  element={
                    <AuthGuard>
                      <DashboardLayout>
                        <AddSlot />
                      </DashboardLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="editSlot"
                  element={
                    <AuthGuard>
                      <DashboardLayout>
                        <EditSlots />
                      </DashboardLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/admin/doctors"
                  element={
                    <AuthGuard>
                      <DashboardLayout>
                        <DoctorCreateForm/>
                      </DashboardLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/appointment"
                  element={
                    <AuthGuard>
                      <DashboardLayout>
                        <AppointmentList />
                      </DashboardLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/contactList"
                  element={
                    <AuthGuard>
                      <DashboardLayout>
                        <AdminConatc />
                      </DashboardLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/record"
                  element={
                    <AuthGuard>
                      <DashboardLayout>
                        <Record />
                      </DashboardLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/doctor-record"
                  element={
                    <AuthGuard>
                      <DashboardLayout>
                        <DoctorRecord />
                      </DashboardLayout>
                    </AuthGuard>
                  }
                />

                <Route
                  path="/appointment-user"
                  element={
                    <AuthGuard>
                      <DashboardLayout>
                        <AppointmentUserlist />
                      </DashboardLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/appointment-doctor"
                  element={
                    <AuthGuard>
                      <DashboardLayout>
                        <DoctorAppointmentList />
                      </DashboardLayout>
                    </AuthGuard>
                  }
                />
                <Route path="/consultation-meeting/:appointmentId" element={ <AuthGuard><ConsultationMeeting /> </AuthGuard>} />
                <Route
                  path="/doctor-availability"
                  element={
                    <AuthGuard>
                      <DashboardLayout>
                        <DoctorAvailability/>
                      </DashboardLayout>
                    </AuthGuard>
                  }
                />

                <Route
                  path="/payments"
                  element={
                    <AuthGuard>
                      <DashboardLayout>
                        <PaymentList />
                      </DashboardLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/subscribe"
                  element={
                    <AuthGuard>
                      <DashboardLayout>
                        <SubscribeUserList />
                      </DashboardLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/static"
                  element={
                    <AuthGuard>
                      <DashboardLayout>
                        <StaticContent />
                      </DashboardLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/addStatic"
                  element={
                    <AuthGuard>
                      <DashboardLayout>
                        <AddStatic />
                      </DashboardLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/editStatic"
                  element={
                    <AuthGuard>
                      <DashboardLayout>
                        <EditStatic />
                      </DashboardLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/subscription"
                  element={
                    <AuthGuard>
                      <DashboardLayout>
                        <Subscription />
                      </DashboardLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/user-subscription"
                  element={
                    <AuthGuard>
                      <DashboardLayout>
                        <UserSubscription />
                      </DashboardLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/notes"
                  element={
                    <AuthGuard>
                      <DashboardLayout>
                        <Notes />
                      </DashboardLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/addSubscription"
                  element={
                    <AuthGuard>
                      <DashboardLayout>
                        <AddSubscription />
                      </DashboardLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/editSubscription"
                  element={
                    <AuthGuard>
                      <DashboardLayout>
                        <EditSubscription />
                      </DashboardLayout>
                    </AuthGuard>
                  }
                />

                <Route
                  path="/medicine"
                  element={
                    <AuthGuard>
                      <DashboardLayout>
                        <DashboardPage />
                      </DashboardLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/chat"
                  element={
                    <AuthGuard>
                      <DashboardLayout>
                        <ChatList />
                      </DashboardLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/doctor-chat"
                  element={
                    <AuthGuard>
                      <DashboardLayout>
                        <DoctorChatList />
                      </DashboardLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <AuthGuard>
                      <DashboardLayout>
                        <TwoFactorSettings />
                      </DashboardLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/medical-report"
                  element={
                    <AuthGuard>
                      <DashboardLayout>
                        <MedicalReports />
                      </DashboardLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/editProfile"
                  element={
                    <AuthGuard>
                      <DashboardLayout>
                        <EditProfile />
                      </DashboardLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/consultation-details"
                  element={
                    <AuthGuard>
                      <DashboardLayout>
                        <ConsultDetails />
                      </DashboardLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/doctor-editProfile"
                  element={
                    <AuthGuard>
                      <DashboardLayout>
                        <DoctorEditProfile/>
                      </DashboardLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/changePassword"
                  element={
                    <AuthGuard>
                      <DashboardLayout>
                        <ChangePassword />
                      </DashboardLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/medicines"
                  element={
                    <AuthGuard>
                      <DashboardLayout>
                        <DashboardPage />
                      </DashboardLayout>
                    </AuthGuard>
                  }
                />
              </Routes>
            </Elements>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
