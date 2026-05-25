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
               <Route path="/" element={<MainLayout />}>
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
      </QueryClientProvider>
   );
};

export default App;
