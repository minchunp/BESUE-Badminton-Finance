import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider, theme } from "antd";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import { useState } from "react";
import Onboarding from "./pages/Onboarding";
import HomePage from "./pages/Home";
import CategoriesPage from "./pages/Categories";
import HostPage from "./pages/Host";
import HistoryPage from "./pages/History";
import StatsPage from "./pages/Stats";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import AuthGuard from "./components/AuthGuard";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const AppContent = () => {
   const navigate = useNavigate();
   const [isFirstVisit, setIsFirstVisit] = useState<boolean>(() => {
      const visited = localStorage.getItem("besue_visited");
      return !visited;
   });

   const handleOnboardingComplete = () => {
      localStorage.setItem("besue_visited", "true");
      setIsFirstVisit(false);
      navigate("/home");
   };

   return (
      <Routes>
         {isFirstVisit ? (
            <Route path="*" element={<Onboarding onComplete={handleOnboardingComplete} />} />
         ) : (
            <>
               {/* Authentication Routes */}
               <Route path="login" element={<Login />} />
               <Route path="register" element={<Register />} />

               {/* Protected Application Routes */}
               <Route
                  path="/"
                  element={
                     <AuthGuard>
                        <MainLayout />
                     </AuthGuard>
                  }
               >
                  <Route index element={<Navigate to="/home" />} />
                  <Route path="home" element={<HomePage />} />
                  <Route path="categories" element={<CategoriesPage />} />
                  <Route path="host" element={<HostPage />} />
                  <Route path="host/create" element={<HostPage />} />
                  <Route path="host/report/:id" element={<HostPage />} />
                  <Route path="history" element={<HistoryPage />} />
                  <Route path="stats" element={<StatsPage />} />
               </Route>
            </>
         )}
      </Routes>
   );
};

const App = () => {
   return (
      <QueryClientProvider client={queryClient}>
         <AuthProvider>
            <ConfigProvider
               theme={{
                  token: {
                     colorPrimary: "#D8B4FE",
                     borderRadius: 16,
                     fontFamily: "Inter, system-ui, sans-serif",
                  },
                  algorithm: theme.defaultAlgorithm,
               }}
            >
               <BrowserRouter>
                  <AppContent />
               </BrowserRouter>
            </ConfigProvider>
         </AuthProvider>
      </QueryClientProvider>
   );
};

export default App;
