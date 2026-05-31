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
import NotesPage from "./pages/Notes";
import AuthGuard from "./components/AuthGuard";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";

const queryClient = new QueryClient();

/* ─────────────────────────────────────────────────────────────────
   Apple iOS Design Token Maps for Ant Design ConfigProvider
   ───────────────────────────────────────────────────────────────── */

/** Shared tokens independent of light/dark */
const SHARED_TOKENS = {
   // Typography
   fontFamily: "'SF Pro Display', 'SF Pro Text', 'Inter', system-ui, -apple-system, sans-serif",
   fontSize: 15,
   fontSizeSM: 13,
   fontSizeLG: 17,

   // Motion
   motionDurationSlow: "0.35s",
   motionDurationMid: "0.25s",
   motionDurationFast: "0.15s",
   motionEaseInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
   motionEaseOut: "cubic-bezier(0.0, 0, 0.2, 1)",

   // Shape — Apple Squircle baseline
   borderRadius: 16, // --radius-btn (buttons, items)
   borderRadiusLG: 28, // --radius-card (modals, drawers, containers)
   borderRadiusSM: 10, // --radius-chip (badges)
   borderRadiusXS: 8,

   // Line
   lineWidth: 1,
   lineType: "solid" as const,
};

/** Light mode semantic tokens — Apple Fitness: systemBlue accent */
const LIGHT_TOKENS = {
   ...SHARED_TOKENS,

   // Tint — Apple systemBlue (Fitness accent)
   colorPrimary: "#0A84FF",
   colorPrimaryHover: "#0070E0",
   colorPrimaryActive: "#005DC5",
   colorPrimaryBg: "rgba(10, 132, 255, 0.10)",
   colorPrimaryBgHover: "rgba(10, 132, 255, 0.16)",
   colorPrimaryBorder: "rgba(10, 132, 255, 0.22)",
   colorPrimaryText: "#0A84FF",

   // Link
   colorLink: "#0A84FF",
   colorLinkHover: "#0070E0",

   // Functional — Apple Fitness ring colors
   colorSuccess: "#30D158", // Activity ring green (Exercise)
   colorWarning: "#FF9F0A", // Activity ring orange (Stand)
   colorError: "#FF375F", // Activity ring pink-red (Move)
   colorInfo: "#0A84FF", // systemBlue

   // Backgrounds
   colorBgBase: "#F2F2F7",
   colorBgContainer: "#FFFFFF",
   colorBgElevated: "#FFFFFF",
   colorBgLayout: "#F2F2F7",
   colorBgSpotlight: "#FFFFFF",
   colorBgMask: "rgba(0, 0, 0, 0.28)",

   // Text
   colorText: "#000000",
   colorTextSecondary: "rgba(60, 60, 67, 0.60)",
   colorTextTertiary: "rgba(60, 60, 67, 0.35)",
   colorTextQuaternary: "rgba(60, 60, 67, 0.18)",
   colorTextPlaceholder: "rgba(60, 60, 67, 0.28)",
   colorTextDisabled: "rgba(60, 60, 67, 0.22)",
   colorTextHeading: "#000000",
   colorTextLabel: "rgba(60, 60, 67, 0.60)",
   colorTextDescription: "rgba(60, 60, 67, 0.42)",

   // Border / Separator
   colorBorder: "rgba(60, 60, 67, 0.15)",
   colorBorderSecondary: "rgba(60, 60, 67, 0.08)",
   colorSplit: "rgba(60, 60, 67, 0.06)",

   // Fill
   colorFill: "rgba(60, 60, 67, 0.07)",
   colorFillSecondary: "rgba(60, 60, 67, 0.04)",
   colorFillTertiary: "rgba(60, 60, 67, 0.02)",
   colorFillQuaternary: "rgba(60, 60, 67, 0.01)",
};

/** Dark mode semantic tokens — Apple Fitness dark palette */
const DARK_TOKENS = {
   ...SHARED_TOKENS,

   // Tint — Apple systemBlue (same across light/dark in Fitness)
   colorPrimary: "#0A84FF",
   colorPrimaryHover: "#3399FF",
   colorPrimaryActive: "#0070E0",
   colorPrimaryBg: "rgba(10, 132, 255, 0.15)",
   colorPrimaryBgHover: "rgba(10, 132, 255, 0.22)",
   colorPrimaryBorder: "rgba(10, 132, 255, 0.28)",
   colorPrimaryText: "#0A84FF",

   // Link
   colorLink: "#0A84FF",
   colorLinkHover: "#3399FF",

   // Functional — Apple Fitness ring colors (dark)
   colorSuccess: "#30D158", // Activity ring green
   colorWarning: "#FF9F0A", // Activity ring orange
   colorError: "#FF375F", // Activity ring pink-red
   colorInfo: "#0A84FF", // systemBlue

   // Backgrounds — pure black system
   colorBgBase: "#000000",
   colorBgContainer: "#1C1C1E",
   colorBgElevated: "#1C1C1E",
   colorBgLayout: "#000000",
   colorBgSpotlight: "#2C2C2E",
   colorBgMask: "rgba(0, 0, 0, 0.65)",

   // Text
   colorText: "#FFFFFF",
   colorTextSecondary: "rgba(235, 235, 245, 0.60)",
   colorTextTertiary: "rgba(235, 235, 245, 0.30)",
   colorTextQuaternary: "rgba(235, 235, 245, 0.16)",
   colorTextPlaceholder: "rgba(235, 235, 245, 0.25)",
   colorTextDisabled: "rgba(235, 235, 245, 0.18)",
   colorTextHeading: "#FFFFFF",
   colorTextLabel: "rgba(235, 235, 245, 0.60)",
   colorTextDescription: "rgba(235, 235, 245, 0.42)",

   // Border / Separator
   colorBorder: "rgba(255, 255, 255, 0.10)",
   colorBorderSecondary: "rgba(255, 255, 255, 0.06)",
   colorSplit: "rgba(255, 255, 255, 0.04)",

   // Fill
   colorFill: "rgba(255, 255, 255, 0.07)",
   colorFillSecondary: "rgba(255, 255, 255, 0.04)",
   colorFillTertiary: "rgba(255, 255, 255, 0.02)",
   colorFillQuaternary: "rgba(255, 255, 255, 0.01)",
};

/* ─────────────────────────────────────────────────────────────────
   AppThemeWrapper — ConfigProvider with full Apple component tokens
   ───────────────────────────────────────────────────────────────── */
const AppThemeWrapper = ({ children }: { children: React.ReactNode }) => {
   const { isDarkMode } = useTheme();

   const tokens = isDarkMode ? DARK_TOKENS : LIGHT_TOKENS;

   return (
      <ConfigProvider
         theme={{
            algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
            token: tokens,

            components: {
               /* ──────────────────────────────────────────────
                  BUTTON — Apple filled primary style
                  ────────────────────────────────────────────── */
               Button: {
                  borderRadius: 14,
                  borderRadiusLG: 14,
                  borderRadiusSM: 10,
                  controlHeight: 44, // Apple HIG minimum tap target
                  controlHeightLG: 50,
                  controlHeightSM: 36,
                  fontWeight: 600,
                  primaryShadow: "none", // No colored shadows in Fitness style
               },

               /* ──────────────────────────────────────────────
                  INPUT / SELECT — Clean Apple text fields
                  ────────────────────────────────────────────── */
               Input: {
                  borderRadius: 12,
                  borderRadiusLG: 12,
                  borderRadiusSM: 8,
                  controlHeight: 44,
                  paddingBlock: 10,
                  paddingInline: 14,
               },
               Select: {
                  borderRadius: 12,
                  borderRadiusLG: 12,
                  controlHeight: 44,
                  controlItemBgActive: isDarkMode ? "rgba(94, 92, 230, 0.15)" : "rgba(88, 86, 214, 0.08)",
               },
               DatePicker: {
                  borderRadius: 12,
                  controlHeight: 44,
                  cellWidth: 36,
                  cellHeight: 28,
               },

               /* ──────────────────────────────────────────────
                  MODAL — Apple Sheet style
                  • centered: true (set via component props defaultly)
                  • border-radius 28px  → borderRadiusLG used
                  • no harsh X button (handled in CSS + component defaults)
                  • subtle backdrop blur
                  ────────────────────────────────────────────── */
               Modal: {
                  borderRadiusLG: 28,
                  paddingMD: 24,
                  paddingContentHorizontalLG: 24,
                  headerBg: isDarkMode ? "#1C1C1E" : "#FFFFFF",
                  contentBg: isDarkMode ? "#1C1C1E" : "#FFFFFF",
                  footerBg: isDarkMode ? "#1C1C1E" : "#FFFFFF",
                  titleFontSize: 17,
                  titleLineHeight: 1.4,
                  boxShadow: isDarkMode ? "0 20px 60px rgba(0,0,0,0.55)" : "0 16px 48px rgba(0,0,0,0.12)",
               },

               /* ──────────────────────────────────────────────
                  DRAWER — Apple Bottom Sheet style
                  • opens from bottom, rounded top corners (32px)
                  • drag handle via CSS pseudo-element in index.css
                  • solid white / dark background (no glass)
                  • destroyOnHide handled via component prop globally
                  ────────────────────────────────────────────── */
               Drawer: {
                  borderRadiusLG: 32, // top corners round
                  paddingLG: 24,
                  colorBgElevated: isDarkMode ? "#1C1C1E" : "#FFFFFF",
               },

               /* ──────────────────────────────────────────────
                  TABS — Apple Segmented Control style
                  Pill-wrapped, gray container, white active tab + shadow
                  ────────────────────────────────────────────── */
               Tabs: {
                  borderRadius: 8,
                  cardBg: isDarkMode ? "#2C2C2E" : "#E5E5EA",
                  inkBarColor: "transparent", // hide sliding bar
                  itemColor: isDarkMode ? "rgba(235, 235, 245, 0.55)" : "rgba(60, 60, 67, 0.55)",
                  itemSelectedColor: isDarkMode ? "#FFFFFF" : "#000000",
                  itemHoverColor: isDarkMode ? "#FFFFFF" : "#000000",
                  titleFontSize: 14,
                  titleFontSizeLG: 15,
                  titleFontSizeSM: 13,
               },

               /* ──────────────────────────────────────────────
                  SEGMENTED — Apple Segmented Control (if used)
                  ────────────────────────────────────────────── */
               Segmented: {
                  borderRadius: 8,
                  borderRadiusLG: 10,
                  trackBg: isDarkMode ? "#2C2C2E" : "#E5E5EA",
                  itemSelectedBg: isDarkMode ? "#3A3A3C" : "#FFFFFF",
                  itemSelectedColor: isDarkMode ? "#FFFFFF" : "#000000",
                  itemColor: isDarkMode ? "rgba(235, 235, 245, 0.55)" : "rgba(60, 60, 67, 0.55)",
                  itemHoverColor: isDarkMode ? "#FFFFFF" : "#000000",
                  itemHoverBg: isDarkMode ? "rgba(255, 255, 255, 0.06)" : "rgba(60, 60, 67, 0.04)",
               },

               /* ──────────────────────────────────────────────
                  TABLE — Clean Apple list style
                  ────────────────────────────────────────────── */
               Table: {
                  borderRadius: 16,
                  headerBg: isDarkMode ? "#2C2C2E" : "#F2F2F7",
                  headerColor: isDarkMode ? "#FFFFFF" : "#000000",
                  rowHoverBg: isDarkMode ? "rgba(255, 255, 255, 0.04)" : "rgba(60, 60, 67, 0.03)",
                  bodySortBg: isDarkMode ? "#2C2C2E" : "#F9F9F9",
               },

               /* ──────────────────────────────────────────────
                  CARD — Apple grouped card
                  ────────────────────────────────────────────── */
               Card: {
                  borderRadius: 28,
                  headerBg: "transparent",
                  colorBorderSecondary: isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(60, 60, 67, 0.12)",
               },

               /* ──────────────────────────────────────────────
                  TAG / BADGE — Apple pill chips
                  ────────────────────────────────────────────── */
               Tag: {
                  borderRadius: 10,
                  fontSizeSM: 12,
               },
               Badge: {
                  colorBgContainer: isDarkMode ? "#1C1C1E" : "#FFFFFF",
               },

               /* ──────────────────────────────────────────────
                  NOTIFICATION / MESSAGE — Apple HUD style
                  ────────────────────────────────────────────── */
               Notification: {
                  borderRadiusLG: 16,
                  colorBgElevated: isDarkMode ? "#2C2C2E" : "#FFFFFF",
                  width: 320,
               },
               Message: {
                  borderRadius: 12,
                  colorBgElevated: isDarkMode ? "#2C2C2E" : "#FFFFFF",
               },

               /* ──────────────────────────────────────────────
                  TOOLTIP / POPOVER — Apple popover style
                  ────────────────────────────────────────────── */
               Tooltip: {
                  borderRadius: 10,
                  colorBgSpotlight: isDarkMode ? "#2C2C2E" : "#333333",
               },
               Popover: {
                  borderRadiusLG: 16,
                  colorBgElevated: isDarkMode ? "#1C1C1E" : "#FFFFFF",
               },

               /* ──────────────────────────────────────────────
                  AVATAR
                  ────────────────────────────────────────────── */
               Avatar: {
                  colorBgContainer: isDarkMode ? "#2C2C2E" : "#E5E5EA",
               },

               /* ──────────────────────────────────────────────
                  FORM
                  ────────────────────────────────────────────── */
               Form: {
                  labelColor: isDarkMode ? "rgba(235, 235, 245, 0.60)" : "rgba(60, 60, 67, 0.70)",
                  labelFontSize: 13,
                  itemMarginBottom: 20,
               },

               /* ──────────────────────────────────────────────
                  SWITCH — Apple toggle style
                  ────────────────────────────────────────────── */
               Switch: {
                  colorPrimary: isDarkMode ? "#30D158" : "#34C759", // systemGreen
                  colorPrimaryHover: isDarkMode ? "#40E168" : "#40D365",
                  handleSize: 22,
                  trackMinWidth: 51,
                  trackHeight: 31,
               },
            },
         }}
      >
         {children}
      </ConfigProvider>
   );
};

/* ─────────────────────────────────────────────────────────────────
   AppContent — Routes (unchanged)
   ───────────────────────────────────────────────────────────────── */
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
                  <Route path="notes" element={<NotesPage />} />
               </Route>
            </>
         )}
      </Routes>
   );
};

/* ─────────────────────────────────────────────────────────────────
   App root
   ───────────────────────────────────────────────────────────────── */
const App = () => {
   return (
      <QueryClientProvider client={queryClient}>
         <AuthProvider>
            <ThemeProvider>
               <BrowserRouter>
                  <AppThemeWrapper>
                     <AppContent />
                  </AppThemeWrapper>
               </BrowserRouter>
            </ThemeProvider>
         </AuthProvider>
      </QueryClientProvider>
   );
};

export default App;
