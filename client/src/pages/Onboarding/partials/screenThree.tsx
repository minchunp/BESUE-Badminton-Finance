import { motion } from "framer-motion";
import onboarding_img3 from "../../../assets/imgs/onboarding_img3.png";
import "../../../index.css";

const ScreenThree = ({ onComplete }: { onComplete: () => void }) => {
   return (
      <motion.main
         key="step3"
         initial={{ opacity: 0, x: 50 }}
         animate={{ opacity: 1, x: 0 }}
         exit={{ opacity: 0, x: -50 }}
         transition={{ duration: 0.5, ease: "easeOut" }}
         className="w-full max-w-md mx-auto h-screen flex flex-col justify-between px-5 py-8"
      >
         <div className="w-full flex justify-end">
            <button onClick={onComplete} className="font-semibold text-[14px] text-black/55 dark:text-white/55 hover:text-[#0A84FF] transition-colors">
               Bỏ qua
            </button>
         </div>

         <div className="flex-1 flex flex-col items-center justify-center space-y-8 mt-8">
            <div className="w-full relative flex justify-center items-center mb-8 animate-float">
               <img src={onboarding_img3} alt="Thống kê" className="w-64 h-64 object-contain drop-shadow-2xl z-10 rounded-xl!" />

               <div className="absolute -bottom-4 right-0 bg-white dark:bg-[#1C1C1E] border border-black/[0.05] dark:border-white/[0.06] shadow-sm rounded-[20px] p-4 flex items-end space-x-2 z-20">
                  <div className="w-3 bg-black/[0.08] dark:bg-white/[0.08] rounded-t-full h-8"></div>
                  <div className="w-3 bg-[#0A84FF]/40 rounded-t-full h-12"></div>
                  <div className="w-3 bg-[#0A84FF] rounded-t-full h-16"></div>
                  <div className="w-3 bg-[#0A84FF]/40 rounded-t-full h-10"></div>
               </div>
            </div>

            <div className="text-center space-y-3 px-4">
               <h1 className="text-[28px] leading-9 font-bold text-[#0A84FF]">Thống kê thông minh</h1>
               <p className="text-base text-black/55 dark:text-white/55">Xem báo cáo chi tiết theo ngày, tuần, tháng với biểu đồ trực quan.</p>
            </div>
         </div>

         <div className="w-full flex flex-col items-center space-y-8 pb-4">
            <div className="flex space-x-2">
               <div className="w-2 h-2 rounded-full bg-black/[0.12] dark:bg-white/[0.12]"></div>
               <div className="w-2 h-2 rounded-full bg-black/[0.12] dark:bg-white/[0.12]"></div>
               <div className="w-6 h-2 rounded-full bg-[#0A84FF]"></div>
            </div>
            <button
               onClick={onComplete}
               className="w-full h-14 rounded-2xl bg-[#0A84FF] text-white font-semibold text-[14px] shadow-[0_4px_16px_rgba(88,86,214,0.28)] hover:opacity-90 active:scale-95 transition-all duration-300"
            >
               Bắt đầu ngay
            </button>
         </div>
      </motion.main>
   );
};

export default ScreenThree;
