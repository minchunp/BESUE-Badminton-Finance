import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Layout, Drawer } from "antd";
import { LayoutGrid, PlayCircle, History, BarChart3, Plus, Settings, FileText, LogOut, Mail, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import dayjs from "dayjs";

const MainLayout = () => {
   const location = useLocation();
   const navigate = useNavigate();
   const { user, logout } = useAuth();
   const [isSettingsOpen, setIsSettingsOpen] = useState(false);

   const navItems = [
      { path: "/categories", icon: LayoutGrid, label: "Danh mục" },
      { path: "/host", icon: PlayCircle, label: "Host" },
      { path: "spacer", icon: null, label: "" },
      { path: "/history", icon: History, label: "Lịch sử" },
      { path: "/stats", icon: BarChart3, label: "Thống kê" },
   ];

   const getInitials = (name: string) => {
      if (!name) return "🏆";
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
      <Layout className="min-h-screen bg-[#FDFCFE] dark:bg-zinc-950 font-sans relative overflow-hidden transition-colors duration-300">
         {/* Top dynamic gradient mesh background */}
         <div className="absolute! top-0 right-0 w-125 h-125 bg-linear-to-br from-[#BAE6FD]/20 to-[#F3E8FF]/60 dark:from-[#BAE6FD]/5 dark:to-[#F3E8FF]/10 rounded-full blur-3xl opacity-80 pointer-events-none -translate-y-1/2 translate-x-1/3 transition-opacity duration-300" />

         {location.pathname !== "/notes" && (
            <header className="sticky top-0 z-50 bg-white/70 dark:bg-zinc-900/80 backdrop-blur-xl px-6 py-5 border-b border-gray-100 dark:border-zinc-800/40 transition-colors duration-300">
               <div className="max-w-md mx-auto flex justify-between items-center relative z-10">
                  {/* Left Section: Clickable Logo/Profile to go back Home */}
                  <div onClick={() => navigate("/home")} className="flex items-center gap-3 cursor-pointer group">
                     <div className="w-10 h-10 bg-linear-to-br from-[#D8B4FE] to-[#C084FC] shadow-sm rounded-full flex items-center justify-center overflow-hidden border border-white/50 dark:border-zinc-800/60 group-hover:scale-105 transition-transform duration-200">
                        <span className="text-white font-sans text-xs font-black select-none">{getInitials(user?.fullName || "Suee Nguyen")}</span>
                     </div>
                     <div>
                        <p className="text-[11px] text-gray-400 dark:text-zinc-500 font-bold leading-none mb-1 group-hover:text-[#C084FC] transition-colors duration-250">
                           BESUE Badminton
                        </p>
                        <h1 className="text-xs font-extrabold text-gray-700 dark:text-zinc-300 leading-none tracking-tight">
                           {user?.fullName || "Suee Nguyen"}
                        </h1>
                     </div>
                  </div>

                  <div className="flex items-center gap-2">
                     {/* Notes app shortcut */}
                     <motion.button
                        onClick={() => navigate("/notes")}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center shadow-sm border border-gray-100 dark:border-zinc-800/80 text-gray-500 dark:text-zinc-400 hover:text-[#C084FC] dark:hover:text-[#C084FC] transition-colors cursor-pointer"
                     >
                        <FileText size={18} strokeWidth={2} />
                     </motion.button>

                     {/* Settings Drawer Button */}
                     <motion.button
                        onClick={() => setIsSettingsOpen(true)}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center shadow-sm border border-gray-100 dark:border-zinc-800/80 text-gray-500 dark:text-zinc-400 hover:text-[#C084FC] dark:hover:text-[#C084FC] transition-colors cursor-pointer"
                     >
                        <Settings size={18} strokeWidth={2} />
                     </motion.button>
                  </div>
               </div>
            </header>
         )}

         <main className="pb-32 pt-4 relative z-10">
            <div className="max-w-md mx-auto px-6">
               <Outlet />
            </div>
         </main>

         <nav className="fixed bottom-3 left-0 right-0 z-50 px-6 pointer-events-none">
            <div className="max-w-md mx-auto relative pointer-events-auto">
               <motion.button
                  onClick={() => navigate("/host")}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  className="absolute left-1/2 -translate-x-1/2 -top-4 z-20 w-14 h-14 bg-linear-to-br from-[#D8B4FE] to-[#C084FC] rounded-full shadow-[0_8px_20px_rgba(216,180,254,0.4)] flex items-center justify-center text-white border-4 border-[#FDFCFE] dark:border-zinc-950 cursor-pointer"
               >
                  <Plus size={26} strokeWidth={2.5} />
               </motion.button>

               <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-lg rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] border border-gray-100/50 dark:border-zinc-800/40 flex items-center justify-between px-2 py-2">
                  {navItems.map((item) => {
                     if (item.path === "spacer") return <div key="spacer" className="w-12" />;

                     const Icon = item.icon!;
                     const isActive = location.pathname === item.path;

                     return (
                        <motion.button
                           key={item.path}
                           onClick={() => navigate(item.path)}
                           className="relative flex flex-col items-center justify-center gap-1 w-16 h-14 rounded-2xl cursor-pointer"
                           whileTap={{ scale: 0.95 }}
                        >
                           {isActive && (
                              <motion.div
                                 layoutId="activeTab"
                                 className="absolute inset-0 bg-gray-50/80 dark:bg-zinc-800/50 rounded-xl"
                                 transition={{ type: "spring", stiffness: 400, damping: 30 }}
                              />
                           )}
                           <div className="relative z-10 flex flex-col items-center gap-1">
                              <Icon
                                 size={22}
                                 className={isActive ? "text-[#C084FC]" : "text-gray-400 dark:text-zinc-500"}
                                 strokeWidth={isActive ? 2.5 : 2}
                              />
                              <span
                                 className={`text-[10px] font-bold transition-colors ${isActive ? "text-[#C084FC]" : "text-gray-400 dark:text-zinc-500"}`}
                              >
                                 {item.label}
                              </span>
                           </div>
                        </motion.button>
                     );
                  })}
               </div>
            </div>
         </nav>

         {/* ================================================================
             Setting Drawer (Cài đặt & Theme Switcher)
             ================================================================ */}
         <Drawer
            title={<div className="font-sans font-black text-gray-900 dark:text-white text-base">Cài đặt tài khoản</div>}
            placement="right"
            onClose={() => setIsSettingsOpen(false)}
            open={isSettingsOpen}
            size="70%"
            className="font-sans dark:bg-zinc-900 dark:text-white"
            styles={{
               body: { padding: "20px" },
               mask: { backdropFilter: "blur(4px)" },
            }}
         >
            <div className="flex flex-col gap-6 h-full font-sans">
               {/* 1. Account Details Section */}
               <div className="flex flex-col gap-3">
                  <span className="font-sans text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest pl-1">
                     Thông tin cá nhân
                  </span>

                  <div className="glass-card rounded-2xl p-4 flex flex-col gap-3">
                     <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-linear-to-br from-[#D8B4FE] to-[#C084FC] rounded-full flex items-center justify-center overflow-hidden border border-white">
                           <span className="text-white font-sans text-sm font-black">{getInitials(user?.fullName || "Suee Nguyen")}</span>
                        </div>
                        <div>
                           <h4 className="font-sans text-sm font-extrabold text-gray-800 dark:text-zinc-155 leading-tight">
                              {user?.fullName || "Suee Nguyen"}
                           </h4>
                           <p className="font-sans text-[11px] text-gray-400 dark:text-zinc-500 font-semibold mt-0.5">
                              @{user?.username || "sueenguyen"}
                           </p>
                        </div>
                     </div>

                     <hr className="border-gray-100 dark:border-zinc-800/40 my-1" />

                     {/* Email info */}
                     <div className="flex items-center gap-2.5 text-xs">
                        <Mail size={14} className="text-gray-400 dark:text-zinc-500 shrink-0" />
                        <span className="text-gray-600 dark:text-zinc-300 font-semibold line-clamp-1">{user?.email || "suee@gmail.com"}</span>
                     </div>

                     {/* Calendar/Join Date */}
                     <div className="flex items-center gap-2.5 text-xs">
                        <Calendar size={14} className="text-gray-400 dark:text-zinc-500 shrink-0" />
                        <span className="text-gray-500 dark:text-zinc-400 font-medium">
                           Tham gia từ: {user?.createdAt ? dayjs(user.createdAt).format("DD/MM/YYYY") : "25/05/2026"}
                        </span>
                     </div>
                  </div>
               </div>

               {/* 2. Settings & Themes Section */}
               {/* <div className="flex flex-col gap-3">
                  <span className="font-sans text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest pl-1">
                     Tùy chọn hiển thị
                  </span>

                  <div className="glass-card rounded-2xl p-4 flex flex-col gap-4">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                           {isDarkMode ? (
                              <Moon size={16} className="text-[#C084FC] shrink-0" />
                           ) : (
                              <Sun size={16} className="text-amber-500 shrink-0" />
                           )}
                           <span className="font-sans text-xs font-bold text-gray-700 dark:text-zinc-300">Chế độ Tối (Dark Mode)</span>
                        </div>

                        <div
                           onClick={toggleTheme}
                           className={`w-11 h-6 rounded-full p-1 cursor-pointer flex items-center transition-colors duration-300 ${
                              isDarkMode ? "bg-[#C084FC]" : "bg-gray-200"
                           }`}
                        >
                           <motion.div
                              layout
                              className="w-4 h-4 rounded-full bg-white shadow-md"
                              animate={{ x: isDarkMode ? 20 : 0 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                           />
                        </div>
                     </div>
                  </div>
               </div> */}

               {/* 3. Dangerous / Actions Section */}
               <div className="flex flex-col gap-3 mt-auto">
                  <hr className="border-gray-100 dark:border-zinc-800/40" />

                  {/* Log Out button inside settings */}
                  <motion.button
                     onClick={handleLogoutClick}
                     whileHover={{ scale: 1.01 }}
                     whileTap={{ scale: 0.98 }}
                     className="w-full h-11 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 hover:bg-rose-100/50 dark:hover:bg-rose-950/30 text-rose-500 dark:text-rose-400 rounded-xl font-sans text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                     <LogOut size={15} strokeWidth={2.5} />
                     Đăng xuất tài khoản
                  </motion.button>
               </div>
            </div>
         </Drawer>
      </Layout>
   );
};

export default MainLayout;
