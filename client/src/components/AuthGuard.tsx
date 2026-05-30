import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface AuthGuardProps {
   children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
   const { isAuthenticated, isLoading } = useAuth();
   const location = useLocation();

   if (isLoading) {
      return (
         <div className="flex flex-col items-center justify-center min-h-screen bg-[#FDFCFE] w-full p-6">
            <div className="relative w-16 h-16">
               <div className="absolute inset-0 rounded-full border-4 border-[#BAE6FD]/30" />
               <div className="absolute inset-0 rounded-full border-4 border-[#C084FC] border-t-transparent animate-spin" />
            </div>
            <p className="font-sans text-xs font-bold text-gray-400 mt-4 tracking-widest uppercase">Đang kết nối...</p>
         </div>
      );
   }

   if (!isAuthenticated) {
      // Redirect to login page and preserve the location to redirect back after login
      return <Navigate to="/login" state={{ from: location }} replace />;
   }

   return <>{children}</>;
};

export default AuthGuard;
