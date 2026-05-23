import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider, theme } from "antd";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import CategoryPage from "./pages/CategoryPage";
import { useState } from "react";
import Onboarding from "./pages/Onboaring";
import HomePage from "./pages/Home";

const queryClient = new QueryClient();

const App = () => {
   const [isFirstVisit, setIsFirstVisit] = useState<boolean>(() => {
      const visited = localStorage.getItem("besue_visited");
      return !visited;
   });

   const handleOnboardingComplete = () => {
      localStorage.setItem("besue_visited", "true");
      setIsFirstVisit(false);
   };

   if (isFirstVisit) {
      return <Onboarding onComplete={handleOnboardingComplete} />;
   }

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
               <Routes>
                  <Route path="/" element={<MainLayout />}>
                     <Route index element={<Navigate to="/home" />} />
                     <Route path="home" element={<HomePage />} />
                     <Route path="categories" element={<CategoryPage />} />
                  </Route>
               </Routes>
            </BrowserRouter>
         </ConfigProvider>
      </QueryClientProvider>
   );
};

export default App;
