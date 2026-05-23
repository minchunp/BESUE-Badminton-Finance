import { motion } from "framer-motion";
import onboarding_img1 from "../../../assets/imgs/onboarding_img1.png";
import { ArrowRight } from "lucide-react";
import "../../../index.css";

const ScreenOne = ({ onNextPage }: { onNextPage: () => void }) => {
   return (
      <motion.main
         key="step1"
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, x: -50 }}
         transition={{ duration: 0.5, ease: "easeOut" }}
         className="w-full max-w-md mx-auto px-5 h-screen flex flex-col justify-between relative z-10"
      >
         <div className="flex-1"></div>

         <div className="w-full flex justify-center items-center relative h-64 mb-8 animate-float">
            <div className="absolute w-48 h-48 bg-[#d8b4fe] rounded-full blur-3xl opacity-40 animate-pulse"></div>
            <img
               src={onboarding_img1}
               alt="Cầu lông"
               className="w-full h-full object-contain relative z-10 drop-shadow-[0_16px_32px_rgba(216,180,254,0.3)] rounded-xl!"
            />
         </div>

         <div className="glass-card rounded-2xl p-6 w-full">
            <div className="text-center mb-8">
               <h1 className="text-[28px] leading-9 font-bold text-[#1a1c1c] mb-2 tracking-tight">Chào mừng đến BESUE</h1>
               <p className="text-base text-[#4a454f]">Quản lý tài chính cầu lông vãng lai một cách thông minh và dễ dàng</p>
            </div>

            <div className="flex justify-center items-center gap-2 mb-8">
               <div className="h-2 w-8 rounded-full bg-linear-to-r from-[#6f5092] to-[#c185fd] transition-all duration-300"></div>
               <div className="h-2 w-2 rounded-full bg-[#cdc3d0]/40 transition-all duration-300"></div>
               <div className="h-2 w-2 rounded-full bg-[#cdc3d0]/40 transition-all duration-300"></div>
            </div>

            <button
               onClick={onNextPage}
               className="w-full h-14 bg-linear-to-r from-[#6f5092] to-[#c185fd] text-white font-semibold text-[14px] rounded-full shadow-[0_8px_24px_rgba(111,80,146,0.3)] hover:shadow-[0_12px_32px_rgba(111,80,146,0.4)] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group"
            >
               <span>Tiếp theo</span>
               <ArrowRight size={18} className="ml-1" />
            </button>
         </div>
         <div className="flex-1 max-h-12"></div>
      </motion.main>
   );
};

export default ScreenOne;
