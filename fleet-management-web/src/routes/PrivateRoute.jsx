import { Navigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import MainFooter from "../components/common/MainFooter";
import PrivateMainHeader from "../components/common/PrivateMainHeader";

export default function PrivateRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth();

  // ⏳ Wait for Clerk
  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // 🔒 Not logged in
  if (!isSignedIn) {
    return <Navigate to="/LoginPage" replace />;
  }

  // ✅ Logged in
  return (
    <>
      <PrivateMainHeader />
      {children}
      {/* <MainFooter /> */}
    </>
  );
}
