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
      <div className="min-h-screen bg-[#F0F0F5] dark:bg-black font-sans flex items-center justify-center px-6 w-full select-none">
         {/* main Form container */}
         <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
            className="w-full max-w-sm bg-white dark:bg-[#1C1C1E] rounded-[20px] p-6 border border-black/[0.08] dark:border-white/[0.06] shadow-md flex flex-col items-center gap-6"
         >
            {/* Header logo / Brand info */}
            <div className="flex flex-col items-center gap-3 text-center">
               <div className="w-16 h-16 rounded-full bg-[#0A84FF] flex items-center justify-center shadow-[0_4px_16px_rgba(88, 86, 214, 0.28)]">
                  <span className="text-white font-black text-xl tracking-tight">BS</span>
               </div>
               <h2 className="font-sans text-2xl font-black text-black dark:text-white leading-tight tracking-tight">Đăng nhập BESUE</h2>
               <p className="font-sans text-xs text-black/55 dark:text-white/55 font-medium">Bắt đầu quản lý tài chính nhóm cầu lông của bạn</p>
            </div>

            {/* Error messaging bar */}
            <AnimatePresence mode="wait">
               {errorMsg && (
                  <motion.div
                     initial={{ opacity: 0, height: 0, y: -10 }}
                     animate={{ opacity: 1, height: "auto", y: 0 }}
                     exit={{ opacity: 0, height: 0, y: -10 }}
                     className="w-full bg-[#FF375F]/10 border border-[#FF375F]/20 rounded-xl px-4 py-2.5 flex items-center gap-2 text-[#FF375F] font-sans text-xs font-semibold"
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
                  <label className="font-sans text-[10px] font-bold text-black/35 dark:text-white/35 uppercase tracking-wider pl-1">
                     Tên đăng nhập / Email
                  </label>
                  <div className="relative w-full">
                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black/35 dark:text-white/35 select-none">
                        <Mail size={16} />
                     </span>
                     <input
                        type="text"
                        value={emailOrUsername}
                        onChange={(e) => setEmailOrUsername(e.target.value)}
                        placeholder="sueenguyen hoặc suee@gmail.com"
                        className="w-full h-11 bg-black/[0.04] dark:bg-white/[0.04] hover:bg-black/[0.06] dark:hover:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.06] focus:border-[#0A84FF] focus:bg-white dark:focus:bg-[#2C2C2E] rounded-xl pl-11 pr-4 font-sans text-sm font-medium text-black dark:text-white outline-none transition-all placeholder-black/35 dark:placeholder-white/35"
                     />
                  </div>
               </div>

               {/* 2. Mật khẩu */}
               <div className="flex flex-col gap-1.5 w-full">
                  <div className="flex justify-between items-center px-1">
                     <label className="font-sans text-[10px] font-bold text-black/35 dark:text-white/35 uppercase tracking-wider">Mật khẩu</label>
                     <a href="#" className="font-sans text-[10px] font-bold text-[#0A84FF] hover:underline">
                        Quên mật khẩu?
                     </a>
                  </div>
                  <div className="relative w-full">
                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black/35 dark:text-white/35 select-none">
                        <Lock size={16} />
                     </span>
                     <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full h-11 bg-black/[0.04] dark:bg-white/[0.04] hover:bg-black/[0.06] dark:hover:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.06] focus:border-[#0A84FF] focus:bg-white dark:focus:bg-[#2C2C2E] rounded-xl pl-11 pr-4 font-sans text-sm font-medium text-black dark:text-white outline-none transition-all placeholder-black/35 dark:placeholder-white/35"
                     />
                  </div>
               </div>

               {/* login button */}
               <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-[52px] bg-[#0A84FF] text-white rounded-[10px] font-sans text-[15px] font-bold mt-2 flex items-center justify-center cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed select-none"
               >
                  {isSubmitting ? <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" /> : "Đăng nhập"}
               </motion.button>
            </form>

            {/* redirection to registration */}
            <div className="font-sans text-xs font-medium text-black/55 dark:text-white/55 mt-2">
               Chưa có tài khoản?{" "}
               <Link to="/register" className="text-[#0A84FF] font-bold hover:underline transition-colors pl-1">
                  Đăng ký ngay
               </Link>
            </div>
         </motion.div>
      </div>
   );
};

export default Login;
