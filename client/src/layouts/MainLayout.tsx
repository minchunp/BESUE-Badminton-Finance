import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Layout, Drawer, Image } from "antd";
import { LayoutGrid, PlayCircle, History, BarChart3, Plus, Settings, FileText, LogOut, Mail, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import dayjs from "dayjs";
import lightIcon from "../assets/imgs/icons/sun.png";
import darkIcon from "../assets/imgs/icons/night-mode.png";

const MainLayout = () => {
   const location = useLocation();
   const navigate = useNavigate();
   const { user, logout } = useAuth();
   const { theme, setTheme } = useTheme();
   const [isSettingsOpen, setIsSettingsOpen] = useState(false);

   const navItems = [
      { path: "/categories", icon: LayoutGrid, label: "Danh mục" },
      { path: "/host", icon: PlayCircle, label: "Host" },
      { path: "spacer", icon: null, label: "" },
      { path: "/history", icon: History, label: "Lịch sử" },
      { path: "/stats", icon: BarChart3, label: "Thống kê" },
   ];

   const getInitials = (name: string) => {
      if (!name) return "🏸";
      const parts = name.split(" ");
      return parts
         .map((p) => p[0])
         .slice(0, 2)
         .join("")
         .toUpperCase();
   };

   const handleLogoutClick = () => {
      setIsSettingsOpen(false);
      logout();
   };

   return (
      <Layout className="min-h-screen bg-[#F2F2F7] dark:bg-black font-sans relative transition-colors duration-300">
         {/* ── Frosted Header (hidden on /notes) ── */}
         {location.pathname !== "/notes" && (
            <header className="sticky top-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-2xl px-5 py-3 border-b border-black/5 dark:border-white/6 transition-colors duration-300">
               <div className="max-w-md mx-auto flex justify-between items-center">
                  {/* Left: Logo / User avatar */}
                  <div onClick={() => navigate("/home")} className="flex items-center gap-3 cursor-pointer group">
                     <div className="w-9 h-9 bg-[#0A84FF] rounded-full flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                        <span className="text-white font-bold text-xs select-none">{getInitials(user?.fullName || "SN")}</span>
                     </div>
                     <div>
                        <p className="text-[10px] text-[#0A84FF] font-bold leading-none mb-0.5 uppercase tracking-wider">BESUE Badminton</p>
                        <p className="text-xs font-bold text-black dark:text-white leading-none tracking-tight">{user?.fullName || "Suee Nguyen"}</p>
                     </div>
                  </div>

                  {/* Right: Action buttons */}
                  <div className="flex items-center gap-1.5">
                     <motion.button
                        onClick={() => navigate("/notes")}
                        whileTap={{ scale: 0.92 }}
                        className="w-9 h-9 bg-black/5 dark:bg-white/[0.07] rounded-full flex items-center justify-center text-black/45 dark:text-white/45 hover:text-[#0A84FF] hover:bg-[#0A84FF]/10 transition-colors cursor-pointer"
                     >
                        <FileText size={17} strokeWidth={2} />
                     </motion.button>

                     <motion.button
                        onClick={() => setIsSettingsOpen(true)}
                        whileTap={{ scale: 0.92 }}
                        className="w-9 h-9 bg-black/5 dark:bg-white/[0.07] rounded-full flex items-center justify-center text-black/45 dark:text-white/45 hover:text-[#0A84FF] hover:bg-[#0A84FF]/10 transition-colors cursor-pointer"
                     >
                        <Settings size={17} strokeWidth={2} />
                     </motion.button>
                  </div>
               </div>
            </header>
         )}

         {/* ── Page Content ── */}
         <main className="pb-32 pt-4 relative z-10">
            <div className="max-w-md mx-auto px-4">
               <Outlet />
            </div>
         </main>

         {/* ── Bottom Navigation Bar ── */}
         <nav className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
            <div className="max-w-md mx-auto relative pointer-events-auto">
               {/* Center FAB — Host */}
               <motion.button
                  onClick={() => navigate("/host")}
                  whileTap={{ scale: 0.88 }}
                  whileHover={{ scale: 1.05 }}
                  className="absolute left-1/2 -translate-x-1/2 -top-6 z-20 w-18 h-18 bg-[#0A84FF] rounded-full flex items-center justify-center text-white border-[3px] border-[#F2F2F7] dark:border-black cursor-pointer shadow-[0_8px_24px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.40)]"
               >
                  <Plus size={24} strokeWidth={2.5} />
               </motion.button>

               {/* Nav bar container — iOS tab bar style */}
               <div className="bg-white/90 dark:bg-[#1C1C1E]/95 backdrop-blur-xl border-t border-black/6 dark:border-white/6 flex items-center justify-between px-2 pt-2 pb-[max(12px,env(safe-area-inset-bottom))]">
                  {navItems.map((item) => {
                     if (item.path === "spacer") return <div key="spacer" className="w-14" />;

                     const Icon = item.icon!;
                     const isActive = location.pathname === item.path;

                     return (
                        <motion.button
                           key={item.path}
                           onClick={() => navigate(item.path)}
                           className="relative flex flex-col items-center justify-center gap-1 w-16 h-12 cursor-pointer"
                           whileTap={{ scale: 0.88 }}
                        >
                           <Icon
                              size={22}
                              className={isActive ? "text-[#0A84FF]" : "text-black/30 dark:text-white/30"}
                              strokeWidth={isActive ? 2.5 : 1.8}
                           />
                           <span
                              className={`text-[10px] font-semibold transition-colors ${
                                 isActive ? "text-[#0A84FF]" : "text-black/30 dark:text-white/30"
                              }`}
                           >
                              {item.label}
                           </span>
                        </motion.button>
                     );
                  })}
               </div>
            </div>
         </nav>

         {/* ── Settings Drawer ── */}
         <Drawer
            title={<span className="font-bold text-[17px] text-black dark:text-white">Cài đặt tài khoản</span>}
            placement="right"
            onClose={() => setIsSettingsOpen(false)}
            open={isSettingsOpen}
            size="82%"
            styles={{
               body: { padding: "20px", background: "var(--bg-card)" },
               header: { background: "var(--bg-card)", borderBottom: "1px solid var(--border-divider)" },
               mask: { backdropFilter: "blur(10px)", backgroundColor: "rgba(0,0,0,0.35)" },
            }}
         >
            <div className="flex flex-col gap-5 h-full">
               {/* Section label */}
               <span className="text-[11px] font-bold text-black/35 dark:text-white/35 uppercase tracking-widest px-1">Thông tin cá nhân</span>

               {/* Account Card */}
               <div className="bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-[20px] p-4 flex flex-col gap-3">
                  {/* Avatar + name */}
                  <div className="flex items-center gap-3">
                     <div className="w-12 h-12 bg-[#0A84FF] rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{getInitials(user?.fullName || "SN")}</span>
                     </div>
                     <div>
                        <h4 className="font-bold text-sm text-black dark:text-white leading-tight">{user?.fullName || "Suee Nguyen"}</h4>
                        <p className="text-[11px] text-black/40 dark:text-white/40 font-medium mt-0.5">@{user?.username || "sueenguyen"}</p>
                     </div>
                  </div>

                  <div className="h-px bg-black/5 dark:bg-white/5" />

                  {/* Email */}
                  <div className="flex items-center gap-2.5 text-xs">
                     <Mail size={14} className="text-black/30 dark:text-white/30 shrink-0" />
                     <span className="text-black/65 dark:text-white/65 font-medium line-clamp-1">{user?.email || "suee@gmail.com"}</span>
                  </div>

                  {/* Join date */}
                  <div className="flex items-center gap-2.5 text-xs">
                     <Calendar size={14} className="text-black/30 dark:text-white/30 shrink-0" />
                     <span className="text-black/45 dark:text-white/45 font-medium">
                        Tham gia: {user?.createdAt ? dayjs(user.createdAt).format("DD/MM/YYYY") : "25/05/2026"}
                     </span>
                  </div>
               </div>

               {/* Section label */}
               <span className="text-[11px] font-bold text-black/35 dark:text-white/35 uppercase tracking-widest px-1">Giao diện</span>

               {/* Theme Selector Card */}
               <div className="bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-[20px] p-1.5 flex gap-1.5 border border-black/4 dark:border-white/4">
                  <button
                     onClick={() => setTheme("light")}
                     className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl font-sans text-xs font-bold transition-all cursor-pointer border-none ${
                        theme === "light"
                           ? "bg-white text-[#0A84FF] shadow-sm border border-black/4"
                           : "bg-transparent text-black/45 dark:text-white/45 hover:text-black/65 dark:hover:text-white/65"
                     }`}
                  >
                     <Image style={{ height: 18, width: 18 }} preview={false} src={lightIcon} /> Sáng
                  </button>
                  <button
                     onClick={() => setTheme("dark")}
                     className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl font-sans text-xs font-bold transition-all cursor-pointer border-none ${
                        theme === "dark"
                           ? "bg-[#1C1C1E] text-[#0A84FF] shadow-sm border border-white/6"
                           : "bg-transparent text-black/45 dark:text-white/45 hover:text-black/65 dark:hover:text-white/65"
                     }`}
                  >
                     <Image style={{ height: 19, width: 19 }} preview={false} src={darkIcon} /> Tối
                  </button>
               </div>

               {/* Logout */}
               <div className="flex flex-col gap-3 mt-auto">
                  <div className="h-px bg-black/5 dark:bg-white/5" />
                  <motion.button
                     onClick={handleLogoutClick}
                     whileTap={{ scale: 0.97 }}
                     className="w-full h-12 bg-[#FF375F]/10 hover:bg-[#FF375F]/16 text-[#FF375F] rounded-2xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                     <LogOut size={16} strokeWidth={2.5} />
                     Đăng xuất tài khoản
                  </motion.button>
               </div>
            </div>
         </Drawer>
      </Layout>
   );
};

export default MainLayout;
