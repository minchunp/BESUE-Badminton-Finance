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
            <button onClick={onComplete} className="font-semibold text-[14px] text-[#4a454f] hover:text-[#6f5092] transition-colors">
               Bỏ qua
            </button>
         </div>

         <div className="flex-1 flex flex-col items-center justify-center space-y-8 mt-8">
            <div className="w-full relative flex justify-center items-center mb-8 animate-float">
               <div className="absolute inset-0 bg-[#6f5092]/10 rounded-full blur-3xl scale-150 -z-10"></div>
               <img src={onboarding_img3} alt="Thống kê" className="w-64 h-64 object-contain drop-shadow-2xl z-10 rounded-xl!" />

               <div className="absolute -bottom-4 right-0 glass-card rounded-3xl p-4 flex items-end space-x-2 z-20">
                  <div className="w-3 bg-[#e2e2e2] rounded-t-full h-8"></div>
                  <div className="w-3 bg-[#d8b4fe] rounded-t-full h-12"></div>
                  <div className="w-3 bg-linear-to-t from-[#6f5092] to-[#c185fd] rounded-t-full h-16 shadow-[0_0_10px_rgba(193,133,253,0.5)]"></div>
                  <div className="w-3 bg-[#d8b4fe] rounded-t-full h-10"></div>
               </div>
            </div>

            <div className="text-center space-y-3 px-4">
               <h1 className="text-[28px] leading-9 font-bold text-[#6f5092]">Thống kê thông minh</h1>
               <p className="text-base text-[#4a454f]">Xem báo cáo chi tiết theo ngày, tuần, tháng với biểu đồ trực quan.</p>
            </div>
         </div>

         <div className="w-full flex flex-col items-center space-y-8 pb-4">
            <div className="flex space-x-2">
               <div className="w-2 h-2 rounded-full bg-[#cdc3d0]/50"></div>
               <div className="w-2 h-2 rounded-full bg-[#cdc3d0]/50"></div>
               <div className="w-6 h-2 rounded-full bg-linear-to-r from-[#6f5092] to-[#c185fd] shadow-[0_0_8px_rgba(193,133,253,0.4)]"></div>
            </div>
            <button
               onClick={onComplete}
               className="w-full h-14 rounded-full bg-linear-to-r from-[#6f5092] to-[#c185fd] text-white font-semibold text-[14px] shadow-[0_8px_32px_rgba(111,80,146,0.3)] hover:opacity-90 active:scale-95 transition-all duration-300"
            >
               Bắt đầu ngay
            </button>
         </div>
      </motion.main>
   );
};

export default ScreenThree;
