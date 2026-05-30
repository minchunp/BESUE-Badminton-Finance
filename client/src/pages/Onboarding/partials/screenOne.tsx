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
            <img
               src={onboarding_img1}
               alt="Cầu lông"
               className="w-full h-full object-contain relative z-10 drop-shadow-[0_16px_32px_rgba(88, 86, 214, 0.18)] rounded-xl!"
            />
         </div>

         <div className="bg-white dark:bg-[#1C1C1E] rounded-[24px] p-6 w-full border border-black/[0.05] dark:border-white/[0.06] shadow-sm">
            <div className="text-center mb-8">
               <h1 className="text-[28px] leading-9 font-bold text-black dark:text-white mb-2 tracking-tight">Chào mừng đến BESUE</h1>
               <p className="text-base text-black/55 dark:text-white/55">Quản lý tài chính cầu lông vãng lai một cách thông minh và dễ dàng</p>
            </div>

            <div className="flex justify-center items-center gap-2 mb-8">
               <div className="h-2 w-8 rounded-full bg-[#0A84FF] transition-all duration-300"></div>
               <div className="h-2 w-2 rounded-full bg-black/[0.12] dark:bg-white/[0.12] transition-all duration-300"></div>
               <div className="h-2 w-2 rounded-full bg-black/[0.12] dark:bg-white/[0.12] transition-all duration-300"></div>
            </div>

            <button
               onClick={onNextPage}
               className="w-full h-14 bg-[#0A84FF] text-white font-semibold text-[14px] rounded-2xl shadow-[0_4px_16px_rgba(88, 86, 214, 0.28)] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
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
