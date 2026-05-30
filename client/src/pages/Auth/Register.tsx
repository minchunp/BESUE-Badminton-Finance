/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { User, Mail, Lock, UserCheck, AlertCircle } from "lucide-react";

const Register = () => {
   const { register } = useAuth();
   const navigate = useNavigate();

   const [fullName, setFullName] = useState("");
   const [username, setUsername] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [errorMsg, setErrorMsg] = useState("");
   const [isSubmitting, setIsSubmitting] = useState(false);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setErrorMsg("");

      // Simple validations
      if (!fullName || !username || !email || !password) {
         setErrorMsg("Vui lòng điền đầy đủ tất cả các trường!");
         return;
      }

      if (username.includes(" ")) {
         setErrorMsg("Tên đăng nhập không được chứa khoảng trắng!");
         return;
      }

      if (password.length < 6) {
         setErrorMsg("Mật khẩu phải có độ dài tối thiểu 6 ký tự!");
         return;
      }

      setIsSubmitting(true);
      try {
         await register(username, email, password, fullName);
         // Redirect home after successful register
         navigate("/home", { replace: true });
      } catch (err: any) {
         setErrorMsg(err.response?.data?.message || err.message || "Đăng ký tài khoản thất bại!");
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <div className="min-h-screen bg-[#F2F2F7] dark:bg-black font-sans flex items-center justify-center px-6 w-full select-none">
         {/* Center Container Card */}
         <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
            className="w-full max-w-sm bg-white dark:bg-[#1C1C1E] rounded-[28px] p-6 border border-black/[0.05] dark:border-white/[0.06] shadow-md flex flex-col items-center gap-6"
         >
            {/* Header logo */}
            <div className="flex flex-col items-center gap-3 text-center">
               <div className="w-16 h-16 rounded-full bg-[#0A84FF] flex items-center justify-center shadow-[0_4px_16px_rgba(88, 86, 214, 0.28)]">
                  <span className="text-white font-black text-xl tracking-tight">BS</span>
               </div>
               <h2 className="font-sans text-2xl font-black text-black dark:text-white leading-tight tracking-tight">Đăng ký BESUE</h2>
               <p className="font-sans text-xs text-black/55 dark:text-white/55 font-medium">Bắt đầu quản trị tài chính buổi host cầu lông</p>
            </div>

            {/* Error alerts */}
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
               {/* 1. Họ và tên */}
               <div className="flex flex-col gap-1.5 w-full">
                  <label className="font-sans text-[10px] font-bold text-black/35 dark:text-white/35 uppercase tracking-wider pl-1">Họ và tên</label>
                  <div className="relative w-full">
                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black/35 dark:text-white/35 select-none">
                        <UserCheck size={16} />
                     </span>
                     <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Nguyễn Văn A"
                        className="w-full h-11 bg-black/[0.04] dark:bg-white/[0.04] hover:bg-black/[0.06] dark:hover:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.06] focus:border-[#0A84FF] focus:bg-white dark:focus:bg-[#2C2C2E] rounded-xl pl-11 pr-4 font-sans text-sm font-medium text-black dark:text-white outline-none transition-all placeholder-black/35 dark:placeholder-white/35"
                     />
                  </div>
               </div>

               {/* 2. Tên đăng nhập */}
               <div className="flex flex-col gap-1.5 w-full">
                  <label className="font-sans text-[10px] font-bold text-black/35 dark:text-white/35 uppercase tracking-wider pl-1">Tên đăng nhập</label>
                  <div className="relative w-full">
                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black/35 dark:text-white/35 select-none">
                        <User size={16} />
                     </span>
                     <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="sueenguyen"
                        className="w-full h-11 bg-black/[0.04] dark:bg-white/[0.04] hover:bg-black/[0.06] dark:hover:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.06] focus:border-[#0A84FF] focus:bg-white dark:focus:bg-[#2C2C2E] rounded-xl pl-11 pr-4 font-sans text-sm font-medium text-black dark:text-white outline-none transition-all placeholder-black/35 dark:placeholder-white/35"
                     />
                  </div>
               </div>

               {/* 3. Email */}
               <div className="flex flex-col gap-1.5 w-full">
                  <label className="font-sans text-[10px] font-bold text-black/35 dark:text-white/35 uppercase tracking-wider pl-1">Email</label>
                  <div className="relative w-full">
                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black/35 dark:text-white/35 select-none">
                        <Mail size={16} />
                     </span>
                     <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="suee@gmail.com"
                        className="w-full h-11 bg-black/[0.04] dark:bg-white/[0.04] hover:bg-black/[0.06] dark:hover:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.06] focus:border-[#0A84FF] focus:bg-white dark:focus:bg-[#2C2C2E] rounded-xl pl-11 pr-4 font-sans text-sm font-medium text-black dark:text-white outline-none transition-all placeholder-black/35 dark:placeholder-white/35"
                     />
                  </div>
               </div>

               {/* 4. Mật khẩu */}
               <div className="flex flex-col gap-1.5 w-full">
                  <label className="font-sans text-[10px] font-bold text-black/35 dark:text-white/35 uppercase tracking-wider pl-1">Mật khẩu</label>
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

               {/* Submit Button */}
               <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-[52px] bg-[#0A84FF] text-white rounded-2xl font-sans text-[15px] font-bold shadow-[0_4px_16px_rgba(88, 86, 214, 0.28)] mt-2 flex items-center justify-center cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed select-none"
               >
                  {isSubmitting ? (
                     <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : (
                     "Đăng ký tài khoản"
                  )}
               </motion.button>
            </form>

            {/* Redirection link */}
            <div className="font-sans text-xs font-medium text-black/55 dark:text-white/55 mt-2">
               Đã có tài khoản?{" "}
               <Link to="/login" className="text-[#0A84FF] font-bold hover:underline transition-colors pl-1">
                  Đăng nhập ngay
               </Link>
            </div>
         </motion.div>
      </div>
   );
};

export default Register;
