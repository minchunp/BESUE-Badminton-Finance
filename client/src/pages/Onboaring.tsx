import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Wallet, ArrowDown, ArrowUp } from "lucide-react";
import onboarding_img1 from "../assets/imgs/onboarding_img1.png";
import onboarding_img2 from "../assets/imgs/onboarding_img2.png";
import onboarding_img3 from "../assets/imgs/onboarding_img3.png";
import "../index.css";

const Onboarding = ({ onComplete }: { onComplete: () => void }) => {
   const [step, setStep] = useState(0);

   const handleNext = () => {
      if (step < 2) {
         setStep(step + 1);
      } else {
         onComplete();
      }
   };

   // Xác định class background tùy theo bước
   const bgClass = step === 0 ? "bg-mesh-0" : step === 1 ? "bg-mesh-1" : "bg-mesh-2";

   return (
      <div className={`fixed inset-0 ${bgClass} transition-colors duration-700 ease-in-out font-sans overflow-hidden`}>
         <AnimatePresence mode="wait">
            {/* ======================= MÀN HÌNH 1 ======================= */}
            {step === 0 && (
               <motion.main
                  key="step1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="w-full max-w-md mx-auto px-5 h-screen flex flex-col justify-between relative z-10"
               >
                  <div className="flex-1"></div>

                  {/* Hình ảnh quả cầu 3D */}
                  <div className="w-full flex justify-center items-center relative h-64 mb-8">
                     <div className="absolute w-48 h-48 bg-[#d8b4fe] rounded-full blur-3xl opacity-40 animate-pulse"></div>
                     <img
                        src={onboarding_img1}
                        alt="Cầu lông"
                        className="w-full h-full object-contain relative z-10 animate-float! drop-shadow-[0_16px_32px_rgba(216,180,254,0.3)]"
                     />
                  </div>

                  {/* Bảng Glassmorphism */}
                  <div className="glass-card rounded-2xl p-6 w-full">
                     <div className="text-center mb-8">
                        <h1 className="text-[28px] leading-[36px] font-bold text-[#1a1c1c] mb-2 tracking-tight">Chào mừng đến BESUE</h1>
                        <p className="text-base text-[#4a454f]">Quản lý tài chính cầu lông vãng lai một cách thông minh và dễ dàng</p>
                     </div>

                     <div className="flex justify-center items-center gap-2 mb-8">
                        <div className="h-2 w-8 rounded-full bg-gradient-to-r from-[#6f5092] to-[#c185fd] transition-all duration-300"></div>
                        <div className="h-2 w-2 rounded-full bg-[#cdc3d0]/40 transition-all duration-300"></div>
                        <div className="h-2 w-2 rounded-full bg-[#cdc3d0]/40 transition-all duration-300"></div>
                     </div>

                     <button
                        onClick={handleNext}
                        className="w-full h-[56px] bg-gradient-to-r from-[#6f5092] to-[#c185fd] text-white font-semibold text-[14px] rounded-full shadow-[0_8px_24px_rgba(111,80,146,0.3)] hover:shadow-[0_12px_32px_rgba(111,80,146,0.4)] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group"
                     >
                        <span>Tiếp theo</span>
                        <ArrowRight size={18} className="ml-1" />
                     </button>
                  </div>
                  <div className="flex-1 max-h-12"></div>
               </motion.main>
            )}

            {/* ======================= MÀN HÌNH 2 ======================= */}
            {step === 1 && (
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

                  {/* Hình ảnh 3D & Bảng Dashboard bay */}
                  <div className="flex-1 flex items-center justify-center relative mt-12 mb-8">
                     <div className="relative w-full max-w-[280px] aspect-square">
                        <img
                           src={onboarding_img2}
                           alt="Tài chính"
                           className="w-full h-full object-contain drop-shadow-2xl z-10 relative scale-110 rounded-2xl"
                        />

                        <div className="absolute -bottom-8 -left-10 w-48 glass-card rounded-[24px] p-4 z-20 transform -rotate-6 hover:rotate-0 transition-transform duration-500 ease-out shadow-[0_16px_40px_rgba(216,180,254,0.3)]">
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

                  {/* Bảng Nội Dung Glassmorphism */}
                  <div className="w-full flex flex-col items-center text-center z-10 bg-white/40 backdrop-blur-md rounded-[32px] p-6 border border-white/50 shadow-[0_8px_32px_rgba(216,180,254,0.1)]">
                     <h1 className="text-[28px] leading-[36px] font-bold text-[#1a1c1c] mb-4">Theo dõi tài chính</h1>
                     <p className="text-base text-[#4a454f] mb-8 max-w-[280px]">Tính toán tự động chi phí sân, cầu và thu nhập sau mỗi buổi host</p>

                     <div className="flex items-center justify-center gap-2 mb-8">
                        <div className="w-2 h-2 rounded-full bg-[#cdc3d0]/50 transition-all duration-300"></div>
                        <div className="w-8 h-2 rounded-full bg-gradient-to-r from-[#6f5092] to-[#c185fd] transition-all duration-300 shadow-[0_0_8px_rgba(193,133,253,0.5)]"></div>
                        <div className="w-2 h-2 rounded-full bg-[#cdc3d0]/50 transition-all duration-300"></div>
                     </div>

                     <button
                        onClick={handleNext}
                        className="w-full h-[56px] bg-gradient-to-r from-[#6f5092] to-[#c185fd] text-white font-semibold text-[14px] rounded-full shadow-[0_8px_24px_rgba(111,80,146,0.3)] hover:shadow-[0_12px_32px_rgba(111,80,146,0.4)] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group"
                     >
                        <span className="relative z-10">Tiếp theo</span>
                        <ArrowRight size={18} className="relative z-10" />
                        <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine"></div>
                     </button>
                  </div>
               </motion.main>
            )}

            {/* ======================= MÀN HÌNH 3 ======================= */}
            {step === 2 && (
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
                        <img src={onboarding_img3} alt="Thống kê" className="w-64 h-64 object-contain drop-shadow-2xl z-10" />

                        {/* Biểu đồ bay */}
                        <div className="absolute -bottom-4 right-0 glass-card rounded-[24px] p-4 flex items-end space-x-2 z-20">
                           <div className="w-3 bg-[#e2e2e2] rounded-t-full h-8"></div>
                           <div className="w-3 bg-[#d8b4fe] rounded-t-full h-12"></div>
                           <div className="w-3 bg-gradient-to-t from-[#6f5092] to-[#c185fd] rounded-t-full h-16 shadow-[0_0_10px_rgba(193,133,253,0.5)]"></div>
                           <div className="w-3 bg-[#d8b4fe] rounded-t-full h-10"></div>
                        </div>
                     </div>

                     <div className="text-center space-y-3 px-4">
                        <h1 className="text-[28px] leading-[36px] font-bold text-[#6f5092]">Thống kê thông minh</h1>
                        <p className="text-base text-[#4a454f]">Xem báo cáo chi tiết theo ngày, tuần, tháng với biểu đồ trực quan.</p>
                     </div>
                  </div>

                  <div className="w-full flex flex-col items-center space-y-8 pb-4">
                     <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-[#cdc3d0]/50"></div>
                        <div className="w-2 h-2 rounded-full bg-[#cdc3d0]/50"></div>
                        <div className="w-6 h-2 rounded-full bg-gradient-to-r from-[#6f5092] to-[#c185fd] shadow-[0_0_8px_rgba(193,133,253,0.4)]"></div>
                     </div>
                     <button
                        onClick={onComplete}
                        className="w-full h-[56px] rounded-full bg-gradient-to-r from-[#6f5092] to-[#c185fd] text-white font-semibold text-[14px] shadow-[0_8px_32px_rgba(111,80,146,0.3)] hover:opacity-90 active:scale-95 transition-all duration-300"
                     >
                        Bắt đầu ngay
                     </button>
                  </div>
               </motion.main>
            )}
         </AnimatePresence>
      </div>
   );
};

export default Onboarding;
