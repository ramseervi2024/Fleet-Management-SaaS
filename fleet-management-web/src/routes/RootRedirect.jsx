import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import MainHomePage from "../pages/MainHomePage";
import PublicRoute from "./PublicRoute";
import LoginForm from "../clerk/LoginForm";
// import loader from '../assets/images/._Medirect Loader.json'

export default function RootRedirect() {
    const { isLoaded, isSignedIn } = useAuth();

    // Wait until Clerk loads
    if (!isLoaded) {
        return 
        // <div className="h-screen flex items-center justify-center">Loading...</div>;
        // <div className="h-screen flex items-center justify-center">
        //     <img src={loader} alt="" />
        // </div>
        ;
    }

    // Logged in → Dashboard
    if (isSignedIn) {
        return <Navigate to="/dashboard" replace />;
    }

    // Not logged in → Public Home
    return <PublicRoute><LoginForm /></PublicRoute>;
}
