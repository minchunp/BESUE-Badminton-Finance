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
      <div className="min-h-screen bg-[#FDFCFE] font-sans flex items-center justify-center p-6 relative overflow-hidden w-full select-none">
         {/* Animated Backdrop Blobs */}
         <motion.div
            animate={{
               x: [0, 20, -10, 0],
               y: [0, -30, 20, 0],
            }}
            transition={{
               duration: 8,
               repeat: Infinity,
               ease: "easeInOut",
            }}
            className="absolute top-1/4 -left-12 w-64 h-64 bg-[#D8B4FE]/30 rounded-full blur-3xl pointer-events-none"
         />
         <motion.div
            animate={{
               x: [0, -20, 30, 0],
               y: [0, 20, -30, 0],
            }}
            transition={{
               duration: 10,
               repeat: Infinity,
               ease: "easeInOut",
            }}
            className="absolute bottom-1/4 -right-12 w-80 h-80 bg-[#FFADB5]/30 rounded-full blur-3xl pointer-events-none"
         />

         {/* Center Container Card */}
         <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
            className="max-w-md w-full bg-white/70 backdrop-blur-xl shadow-glass border border-white/40 rounded-3xl p-8 relative z-10 flex flex-col items-center gap-6"
         >
            {/* Header logo */}
            <div className="flex flex-col items-center gap-1.5 text-center">
               <h2 className="font-sans text-2xl font-black text-gray-900 leading-tight tracking-tight">Đăng ký BESUE</h2>
               <p className="font-sans text-xs text-gray-400 font-medium">Bắt đầu quản trị tài chính buổi host cầu lông</p>
            </div>

            {/* Error alerts */}
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
               {/* 1. Họ và tên */}
               <div className="flex flex-col gap-1.5 w-full">
                  <label className="font-sans text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">Họ và tên</label>
                  <div className="relative w-full">
                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 select-none">
                        <UserCheck size={16} />
                     </span>
                     <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Nguyễn Văn A"
                        className="w-full h-11 bg-gray-50/50 hover:bg-gray-50 border border-gray-100 focus:border-[#C084FC] focus:bg-white rounded-xl pl-11 pr-4 font-sans text-xs font-semibold text-gray-800 outline-none transition-all placeholder-gray-400 shadow-inner-sm"
                     />
                  </div>
               </div>

               {/* 2. Tên đăng nhập */}
               <div className="flex flex-col gap-1.5 w-full">
                  <label className="font-sans text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">Tên đăng nhập</label>
                  <div className="relative w-full">
                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 select-none">
                        <User size={16} />
                     </span>
                     <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="sueenguyen"
                        className="w-full h-11 bg-gray-50/50 hover:bg-gray-50 border border-gray-100 focus:border-[#C084FC] focus:bg-white rounded-xl pl-11 pr-4 font-sans text-xs font-semibold text-gray-800 outline-none transition-all placeholder-gray-400 shadow-inner-sm"
                     />
                  </div>
               </div>

               {/* 3. Email */}
               <div className="flex flex-col gap-1.5 w-full">
                  <label className="font-sans text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">Email</label>
                  <div className="relative w-full">
                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 select-none">
                        <Mail size={16} />
                     </span>
                     <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="suee@gmail.com"
                        className="w-full h-11 bg-gray-50/50 hover:bg-gray-50 border border-gray-100 focus:border-[#C084FC] focus:bg-white rounded-xl pl-11 pr-4 font-sans text-xs font-semibold text-gray-800 outline-none transition-all placeholder-gray-400 shadow-inner-sm"
                     />
                  </div>
               </div>

               {/* 4. Mật khẩu */}
               <div className="flex flex-col gap-1.5 w-full">
                  <label className="font-sans text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">Mật khẩu</label>
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

               {/* Submit Button */}
               <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-11 bg-linear-to-r from-[#6f5092] via-[#7b41b4] to-[#c084fc] text-white rounded-xl font-sans text-xs font-extrabold uppercase tracking-wider shadow-[0_6px_20px_rgba(216,180,254,0.3)] mt-2 flex items-center justify-center cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed select-none relative overflow-hidden group"
               >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {isSubmitting ? (
                     <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : (
                     "Đăng ký tài khoản"
                  )}
               </motion.button>
            </form>

            {/* Redirection link */}
            <div className="font-sans text-xs font-medium text-gray-400 mt-2">
               Đã có tài khoản?{" "}
               <Link to="/login" className="text-[#7b41b4] font-bold hover:underline transition-colors pl-1">
                  Đăng nhập ngay
               </Link>
            </div>
         </motion.div>
      </div>
   );
};

export default Register;
