import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Layout } from "antd";
import { LayoutGrid, PlayCircle, History, BarChart3, Plus, Bell, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";

const MainLayout = () => {
   const location = useLocation();
   const navigate = useNavigate();
   const { user, logout } = useAuth();

   const navItems = [
      { path: "/categories", icon: LayoutGrid, label: "Danh mục" },
      { path: "/host", icon: PlayCircle, label: "Host" },
      { path: "spacer", icon: null, label: "" },
      { path: "/history", icon: History, label: "Lịch sử" },
      { path: "/stats", icon: BarChart3, label: "Thống kê" },
   ];

   // Generate dynamic initials for the user avatar
   const getInitials = (name: string) => {
      if (!name) return "🏆";
      const parts = name.split(" ");
      return parts
         .map((p) => p[0])
         .slice(0, 2)
         .join("")
         .toUpperCase();
   };

   return (
      <Layout className="min-h-screen bg-[#FDFCFE] font-sans relative overflow-hidden">
         {/* Top gradient glow bloby */}
         <div className="absolute! top-0 right-0 w-125 h-125 bg-linear-to-br from-[#BAE6FD]/20 to-[#F3E8FF]/60 rounded-full blur-3xl opacity-80 pointer-events-none -translate-y-1/2 translate-x-1/3" />

         <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl px-6 py-5 border-b border-gray-100">
            <div className="max-w-md mx-auto flex justify-between items-center relative z-10">
               <div className="flex items-center gap-3">
                  <div
                     onClick={() => navigate("/home")}
                     className="w-10 h-10 bg-linear-to-br from-[#D8B4FE] to-[#C084FC] shadow-sm rounded-full flex items-center justify-center overflow-hidden border border-white/50"
                  >
                     <span className="text-white font-sans text-xs font-black select-none">{getInitials(user?.fullName || "Suee Nguyen")}</span>
                  </div>
                  <div>
                     <p className="text-[13px] text-gray-500 font-medium leading-none mb-1">Chào buổi sáng,</p>
                     <h1 className="text-sm font-black text-gray-900 leading-none tracking-tight">{user?.fullName || "Suee Nguyen"}</h1>
                  </div>
               </div>

               <div className="flex items-center gap-2">
                  {/* Notifications bell button */}
                  <motion.button
                     whileTap={{ scale: 0.95 }}
                     className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 relative text-gray-600 hover:text-[#C084FC] transition-colors cursor-pointer"
                  >
                     <Bell size={20} strokeWidth={2} />
                     <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 border-2 border-white rounded-full" />
                  </motion.button>

                  {/* Elegant dynamic Logout button */}
                  <motion.button
                     onClick={logout}
                     whileTap={{ scale: 0.95 }}
                     className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 text-rose-500 hover:text-rose-600 hover:bg-rose-50/50 transition-colors cursor-pointer"
                  >
                     <LogOut size={16} strokeWidth={2.5} />
                  </motion.button>
               </div>
            </div>
         </header>

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
                  className="absolute left-1/2 -translate-x-1/2 -top-4 z-20 w-14 h-14 bg-linear-to-br from-[#D8B4FE] to-[#C084FC] rounded-full shadow-[0_8px_20px_rgba(216,180,254,0.4)] flex items-center justify-center text-white border-4 border-[#FDFCFE] cursor-pointer"
               >
                  <Plus size={26} strokeWidth={2.5} />
               </motion.button>

               <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100/50 flex items-center justify-between px-2 py-2">
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
                                 className="absolute inset-0 bg-gray-50/80 rounded-xl"
                                 transition={{ type: "spring", stiffness: 400, damping: 30 }}
                              />
                           )}
                           <div className="relative z-10 flex flex-col items-center gap-1">
                              <Icon size={22} className={isActive ? "text-[#C084FC]" : "text-gray-400"} strokeWidth={isActive ? 2.5 : 2} />
                              <span className={`text-[10px] font-bold transition-colors ${isActive ? "text-[#C084FC]" : "text-gray-400"}`}>
                                 {item.label}
                              </span>
                           </div>
                        </motion.button>
                     );
                  })}
               </div>
            </div>
         </nav>
      </Layout>
   );
};

export default MainLayout;
