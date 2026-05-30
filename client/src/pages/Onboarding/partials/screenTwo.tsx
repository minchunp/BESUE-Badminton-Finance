import { motion } from "framer-motion";
import onboarding_img2 from "../../../assets/imgs/onboarding_img2.png";
import { ArrowDown, ArrowRight, ArrowUp, Wallet } from "lucide-react";
import "../../../index.css";

interface ScreenOnboardingProps {
   onNextPage: () => void;
   onComplete: () => void;
}

const ScreenTwo = ({ onNextPage, onComplete }: ScreenOnboardingProps) => {
   return (
      <motion.main
         key="step2"
         initial={{ opacity: 0, x: 50 }}
         animate={{ opacity: 1, x: 0 }}
         exit={{ opacity: 0, x: -50 }}
         transition={{ duration: 0.5, ease: "easeOut" }}
         className="flex-1 flex flex-col w-full max-w-md mx-auto relative h-screen px-5 py-8"
      >
         <div className="flex justify-end w-full absolute top-8 right-5 z-20">
            <button onClick={onComplete} className="font-semibold text-[14px] text-black/55 dark:text-white/55 hover:text-[#0A84FF] transition-colors">
               Bỏ qua
            </button>
         </div>

         <div className="flex-1 flex items-center justify-center relative mt-12 mb-8">
            <div className="relative w-full max-w-70 aspect-square animate-float">
               <img
                  src={onboarding_img2}
                  alt="Tài chính"
                  className="w-full h-full object-contain drop-shadow-2xl z-10 relative scale-110 rounded-xl!"
               />

               <div className="absolute -bottom-8 -left-10 w-48 bg-white dark:bg-[#1C1C1E] border border-black/[0.05] dark:border-white/[0.06] shadow-sm rounded-[20px] p-4 z-20 transform -rotate-6 hover:rotate-0 transition-transform duration-500 ease-out">
                  <div className="flex items-center gap-2 mb-3">
                     <span className="text-[#0A84FF] bg-[#0A84FF]/12 p-1 rounded-full">
                        <Wallet size={16} />
                     </span>
                     <span className="font-medium text-[12px] text-black/55 dark:text-white/55">Tổng dư</span>
                  </div>
                  <div className="text-[24px] font-bold text-[#0A84FF] mb-3 tracking-tight">+ 2.450k</div>
                  <div className="space-y-2">
                     <div className="flex justify-between items-center bg-black/[0.04] dark:bg-white/[0.04] rounded-lg p-2 border border-black/[0.06] dark:border-white/[0.06]">
                        <span className="font-medium text-[12px] text-black/55 dark:text-white/55 flex items-center gap-1">
                           <ArrowDown size={14} className="text-[#FF375F]" /> Tiền sân
                        </span>
                        <span className="font-bold text-[12px] text-[#FF375F]">- 300k</span>
                     </div>
                     <div className="flex justify-between items-center bg-black/[0.04] dark:bg-white/[0.04] rounded-lg p-2 border border-black/[0.06] dark:border-white/[0.06]">
                        <span className="font-medium text-[12px] text-black/55 dark:text-white/55 flex items-center gap-1">
                           <ArrowUp size={14} className="text-[#30D158]" /> Thu vãng lai
                        </span>
                        <span className="font-bold text-[12px] text-[#30D158]">+ 800k</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div className="w-full flex flex-col items-center text-center z-10 bg-white dark:bg-[#1C1C1E] rounded-[24px] p-6 border border-black/[0.05] dark:border-white/[0.06] shadow-sm">
            <h1 className="text-[28px] leading-9 font-bold text-black dark:text-white mb-4">Theo dõi tài chính</h1>
            <p className="text-base text-black/55 dark:text-white/55 mb-8 max-w-70">Tính toán tự động chi phí sân, cầu và thu nhập sau mỗi buổi host</p>

            <div className="flex items-center justify-center gap-2 mb-8">
               <div className="w-2 h-2 rounded-full bg-black/[0.12] dark:bg-white/[0.12] transition-all duration-300"></div>
               <div className="w-8 h-2 rounded-full bg-[#0A84FF] transition-all duration-300"></div>
               <div className="w-2 h-2 rounded-full bg-black/[0.12] dark:bg-white/[0.12] transition-all duration-300"></div>
            </div>

            <button
               onClick={onNextPage}
               className="w-full h-14 bg-[#0A84FF] text-white font-semibold text-[14px] rounded-2xl shadow-[0_4px_16px_rgba(88,86,214,0.28)] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
            >
               <span>Tiếp theo</span>
               <ArrowRight size={18} />
            </button>
         </div>
      </motion.main>
   );
};

export default ScreenTwo;
