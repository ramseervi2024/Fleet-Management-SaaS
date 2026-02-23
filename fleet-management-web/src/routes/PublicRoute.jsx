import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import MainFooter from "../components/common/MainFooter";
import MainHeader from "../components/common/MainHeader";
import PrivateMainHeader from "../components/common/PrivateMainHeader";

const AUTH_PAGES = [
  "/LoginPage",
  "/SignupPage",
  "/GmailLogin",
  "/MobileLogin",
  "/ForgetPassword",
  "/CheckEmailOTP",
  "/CheckMobileOTP",
  "/NewPassword",
  "/WelcomePage",
];

export default function PublicRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth();
  const location = useLocation();

  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // 🔒 Block auth pages if already logged in
  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      {/* {isSignedIn ? <PrivateMainHeader /> : <MainHeader />} */}
      {children}
      {/* <MainFooter /> */}
    </>
  );
}
