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
            <button onClick={onComplete} className="font-semibold text-[14px] text-[#4a454f] hover:text-[#6f5092] transition-colors">
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

               <div className="absolute -bottom-8 -left-10 w-48 glass-card rounded-3xl p-4 z-20 transform -rotate-6 hover:rotate-0 transition-transform duration-500 ease-out shadow-[0_16px_40px_rgba(216,180,254,0.3)]">
                  <div className="flex items-center gap-2 mb-3">
                     <span className="text-[#6f5092] bg-[#dbb8ff]/30 p-1 rounded-full">
                        <Wallet size={16} />
                     </span>
                     <span className="font-medium text-[12px] text-[#4a454f]">Tổng dư</span>
                  </div>
                  <div className="text-[24px] font-bold text-[#6f5092] mb-3 tracking-tight">+ 2.450k</div>
                  <div className="space-y-2">
                     <div className="flex justify-between items-center bg-white/50 rounded-lg p-2 backdrop-blur-sm border border-white/20">
                        <span className="font-medium text-[12px] text-[#4a454f] flex items-center gap-1">
                           <ArrowDown size={14} className="text-[#a93349]" /> Tiền sân
                        </span>
                        <span className="font-bold text-[12px] text-[#a93349]">- 300k</span>
                     </div>
                     <div className="flex justify-between items-center bg-white/50 rounded-lg p-2 backdrop-blur-sm border border-white/20">
                        <span className="font-medium text-[12px] text-[#4a454f] flex items-center gap-1">
                           <ArrowUp size={14} className="text-[#10B981]" /> Thu vãng lai
                        </span>
                        <span className="font-bold text-[12px] text-[#10B981]">+ 800k</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div className="w-full flex flex-col items-center text-center z-10 bg-white/40 backdrop-blur-md rounded-4xl p-6 border border-white/50 shadow-[0_8px_32px_rgba(216,180,254,0.1)]">
            <h1 className="text-[28px] leading-9 font-bold text-[#1a1c1c] mb-4">Theo dõi tài chính</h1>
            <p className="text-base text-[#4a454f] mb-8 max-w-70">Tính toán tự động chi phí sân, cầu và thu nhập sau mỗi buổi host</p>

            <div className="flex items-center justify-center gap-2 mb-8">
               <div className="w-2 h-2 rounded-full bg-[#cdc3d0]/50 transition-all duration-300"></div>
               <div className="w-8 h-2 rounded-full bg-linear-to-r from-[#6f5092] to-[#c185fd] transition-all duration-300 shadow-[0_0_8px_rgba(193,133,253,0.5)]"></div>
               <div className="w-2 h-2 rounded-full bg-[#cdc3d0]/50 transition-all duration-300"></div>
            </div>

            <button
               onClick={onNextPage}
               className="w-full h-14 bg-linear-to-r from-[#6f5092] to-[#c185fd] text-white font-semibold text-[14px] rounded-full shadow-[0_8px_24px_rgba(111,80,146,0.3)] hover:shadow-[0_12px_32px_rgba(111,80,146,0.4)] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group"
            >
               <span className="relative z-10">Tiếp theo</span>
               <ArrowRight size={18} className="relative z-10" />
               <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-linear-to-r from-transparent to-white opacity-20 group-hover:animate-shine"></div>
            </button>
         </div>
      </motion.main>
   );
};

export default ScreenTwo;
