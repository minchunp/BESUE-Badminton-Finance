/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Mail, Lock, AlertCircle } from "lucide-react";

const Login = () => {
   const { login } = useAuth();
   const navigate = useNavigate();
   const location = useLocation();

   const [emailOrUsername, setEmailOrUsername] = useState("");
   const [password, setPassword] = useState("");
   const [errorMsg, setErrorMsg] = useState("");
   const [isSubmitting, setIsSubmitting] = useState(false);

   // Retrieve redirect target from routing state, default to /home
   const from = location.state?.from?.pathname || "/home";

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setErrorMsg("");

      if (!emailOrUsername || !password) {
         setErrorMsg("Vui lòng nhập tên đăng nhập/email và mật khẩu!");
         return;
      }

      setIsSubmitting(true);
      try {
         await login(emailOrUsername, password);
         // Redirect back to intended page or home
         navigate(from, { replace: true });
      } catch (err: any) {
         setErrorMsg(err.response?.data?.message || err.message || "Đăng nhập thất bại, vui lòng thử lại!");
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <div className="min-h-screen bg-[#FDFCFE] font-sans flex items-center justify-center p-6 relative overflow-hidden w-full select-none">
         {/* Background soft glowing blur elements */}
         <motion.div
            animate={{
               x: [0, -30, 20, 0],
               y: [0, 20, -30, 0],
            }}
            transition={{
               duration: 9,
               repeat: Infinity,
               ease: "easeInOut",
            }}
            className="absolute top-1/4 -right-12 w-72 h-72 bg-[#D8B4FE]/30 rounded-full blur-3xl pointer-events-none"
         />
         <motion.div
            animate={{
               x: [0, 30, -20, 0],
               y: [0, -30, 20, 0],
            }}
            transition={{
               duration: 8,
               repeat: Infinity,
               ease: "easeInOut",
            }}
            className="absolute bottom-1/4 -left-12 w-64 h-64 bg-[#FFADB5]/30 rounded-full blur-3xl pointer-events-none"
         />

         {/* main Glassmorphism Form container */}
         <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
            className="max-w-md w-full bg-white/70 backdrop-blur-xl shadow-glass border border-white/40 rounded-3xl p-8 relative z-10 flex flex-col items-center gap-6"
         >
            {/* Header logo / Brand info */}
            <div className="flex flex-col items-center gap-3 text-center">
               <h2 className="font-sans text-2xl font-black text-gray-900 leading-tight tracking-tight">Đăng nhập BESUE</h2>
               <p className="font-sans text-xs text-gray-400 font-medium">Bắt đầu quản lý tài chính nhóm cầu lông của bạn</p>
            </div>

            {/* Error messaging bar */}
            <AnimatePresence mode="wait">
               {errorMsg && (
                  <motion.div
                     initial={{ opacity: 0, height: 0, y: -10 }}
                     animate={{ opacity: 1, height: "auto", y: 0 }}
                     exit={{ opacity: 0, height: 0, y: -10 }}
                     className="w-full bg-rose-50 border border-rose-100 rounded-xl px-4 py-2.5 flex items-center gap-2 text-rose-600 font-sans text-xs font-semibold"
                  >
                     <AlertCircle size={14} className="shrink-0" />
                     <span>{errorMsg}</span>
                  </motion.div>
               )}
            </AnimatePresence>

            {/* login form */}
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
               {/* 1. Tên đăng nhập hoặc Email */}
               <div className="flex flex-col gap-1.5 w-full">
                  <label className="font-sans text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">Tên đăng nhập / Email</label>
                  <div className="relative w-full">
                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 select-none">
                        <Mail size={16} />
                     </span>
                     <input
                        type="text"
                        value={emailOrUsername}
                        onChange={(e) => setEmailOrUsername(e.target.value)}
                        placeholder="sueenguyen hoặc suee@gmail.com"
                        className="w-full h-11 bg-gray-50/50 hover:bg-gray-50 border border-gray-100 focus:border-[#C084FC] focus:bg-white rounded-xl pl-11 pr-4 font-sans text-xs font-semibold text-gray-800 outline-none transition-all placeholder-gray-400 shadow-inner-sm"
                     />
                  </div>
               </div>

               {/* 2. Mật khẩu */}
               <div className="flex flex-col gap-1.5 w-full">
                  <div className="flex justify-between items-center px-1">
                     <label className="font-sans text-[10px] font-bold text-gray-400 uppercase tracking-wider">Mật khẩu</label>
                     <a href="#" className="font-sans text-[10px] font-bold text-[#7b41b4] hover:underline">
                        Quên mật khẩu?
                     </a>
                  </div>
                  <div className="relative w-full">
                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 select-none">
                        <Lock size={16} />
                     </span>
                     <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-11 bg-gray-50/50 hover:bg-gray-50 border border-gray-100 focus:border-[#C084FC] focus:bg-white rounded-xl pl-11 pr-4 font-sans text-xs font-semibold text-gray-800 outline-none transition-all placeholder-gray-400 shadow-inner-sm"
                     />
                  </div>
               </div>

               {/* login button with shiny overlays */}
               <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-11 bg-linear-to-r from-[#6f5092] via-[#7b41b4] to-[#c084fc] text-white rounded-xl font-sans text-xs font-extrabold uppercase tracking-wider shadow-[0_6px_20px_rgba(216,180,254,0.3)] mt-2 flex items-center justify-center cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed select-none relative overflow-hidden group"
               >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {isSubmitting ? <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" /> : "Đăng nhập"}
               </motion.button>
            </form>

            {/* redirection to registration */}
            <div className="font-sans text-xs font-medium text-gray-400 mt-2">
               Chưa có tài khoản?{" "}
               <Link to="/register" className="text-[#7b41b4] font-bold hover:underline transition-colors pl-1">
                  Đăng ký ngay
               </Link>
            </div>
         </motion.div>
      </div>
   );
};

export default Login;
