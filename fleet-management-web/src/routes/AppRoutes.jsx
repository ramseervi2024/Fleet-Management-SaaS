// AppRoutes.jsx
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import RootRedirect from "./RootRedirect";

import PublicRoute from "../routes/PublicRoute";
import NotFound from "../components/common/NotFound";

import DashboardLayout from "../pages/DashboardLayout/DashboardLayout";
import MainDashboard from "../pages/Dashboard/MainDashboard";
import Appointments from "../pages/Appointments/Appointments";
import AppointmentDetailsPage from "../pages/Appointments/AppointmentDetailsPage";
import Calendar from "../pages/Calendar/Calendar";
import LabRadiology from "../pages/LabRadiology/LabRadiology";
import ManagePatient from "../pages/ManagePatient/ManagePatient";
import Revenue from "../pages/Revenue/Revenue";
import Profile from "../clerk/Profile";
import LandingPage from "../pages/LandingPage/LandingPage";
import LoginForm from "../clerk/LoginForm";
import RegisterForm from "../clerk/RegisterForm";
import ForgotPassword from "../clerk/ForgotPassword";
import ProfileUpdate from "../clerk/ProfileUpdate";

import { useSession, useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import Onboarding from "../pages/Onboarding/Onboarding";
import OnboardingFlow from "../pages/OnboardingFlow";
import ProfileLayout from "../pages/Profile/ProfileLayout";
import Settings from "../pages/Settings/Settings";
import SettingsLayout from "../pages/Settings/SettingsLayout";
import PatientDetails from "../pages/ManagePatient/PatientDetails";

// ======================
// ProtectedRoute: Redirects to login if session is missing
// ======================
function ProtectedRoute() {
  const { session, isLoaded } = useSession();

  if (!isLoaded) return null; // wait for Clerk to load session

  if (!session) {
    return <Navigate to="/login" replace />; // redirect to login
  }

  return <Outlet />; // render nested routes
}

// ======================
// AutoLogoutWrapper: forces full reload if session disappears
// ======================
function AutoLogoutWrapper({ children }) {
  const { session, isLoaded } = useSession();
  const { signOut } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;

    if (!session) {
      // Session expired or account removed → sign out & reload
      signOut().then(() => {
        window.location.href = "/login";
      });
    }
  }, [session, isLoaded, signOut]);

  return children;
}

// ======================
// Main AppRoutes
// ======================
export default function AppRoutes() {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<RootRedirect />} />

      {/* Public routes */}
      <Route path="/login" element={<PublicRoute><LoginForm /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><RegisterForm /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />

      {/* Protected dashboard routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AutoLogoutWrapper><DashboardLayout /></AutoLogoutWrapper>}>
          <Route path="" element={<MainDashboard />} />
          <Route path="dashboard" element={<MainDashboard />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="onboarding" element={<Onboarding />} />
          <Route path="onboarding-flow" element={<OnboardingFlow />} />
          <Route path="appointment/:appointmentId" element={<AppointmentDetailsPage />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="lab-radiology" element={<LabRadiology />} />
          <Route path="patients" element={<ManagePatient />} />
          <Route path="patients/:patientId" element={<PatientDetails />} />
          <Route path="revenue" element={<Revenue />} />
          {/* <Route path="profile" element={<Profile />} /> */}
          <Route path="landing" element={<LandingPage />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="profile-update" element={<ProfileUpdate />} />
          <Route path="profile" element={<ProfileLayout />} />
          <Route path="settings" element={<SettingsLayout />} />
          <Route path="settingslayout" element={<SettingsLayout />} />
        </Route>
      </Route>

      {/* Fallback for unknown routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
