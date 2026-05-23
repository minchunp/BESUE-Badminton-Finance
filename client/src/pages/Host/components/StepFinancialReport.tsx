import { motion } from "framer-motion";
import { Award, Check } from "lucide-react";
import type { StepFinancialReportProps } from "../types";

const StepFinancialReport = ({ sessionData, notes, onFinish }: StepFinancialReportProps) => {
   return (
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-5">
         {/* Progress */}
         <div className="space-y-1.5 px-1">
            <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider text-gray-400">
               <span>Bước 4/5</span>
               <span className="text-[#7b41b4]">80%</span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
               <div className="h-full bg-linear-to-r from-[#c185fd] to-[#ffb2b9] w-[80%] rounded-full" />
            </div>
         </div>

         {/* Top audited stats hero */}
         <div className="glass-card rounded-3xl p-5 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-glass border border-white/50 animate-fade-in">
            <div className="absolute inset-0 bg-linear-to-br from-[#c185fd] to-[#ffb2b9] opacity-10" />

            <Award size={32} className="text-[#7b41b4] mb-2 animate-float" />
            <span className="font-sans text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Kết quả lợi nhuận</span>
            <h2
               className={`font-sans text-3xl font-extrabold tracking-tight ${
                  sessionData.summary.profit >= 0 ? "text-emerald-600" : "text-rose-500"
               }`}
            >
               {sessionData.summary.profit >= 0 ? "+" : ""}
               {sessionData.summary.profit.toLocaleString("vi-VN")}đ
            </h2>
            <p className="font-sans text-xs font-semibold text-gray-400 mt-2 max-w-70">
               {sessionData.summary.profit >= 0 ? "Tuyệt vời! Buổi giao lưu đã có số dư tích lũy!" : "Giá thuê sân và cầu lớn hơn số tiền thu được."}
            </p>
         </div>

         {/* Detailed breakdown list */}
         <div className="glass-card rounded-3xl p-4 space-y-4 shadow-xs border border-white/50 animate-fade-in">
            <h3 className="font-sans text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100 pb-2 mb-1 px-1">
               Chi tiết tài chính
            </h3>

            <div className="space-y-3 font-sans text-xs font-semibold text-gray-500 px-1">
               <div className="flex justify-between items-center">
                  <span>🏟️ Chi phí tiền sân:</span>
                  <span className="font-bold text-gray-700">{sessionData.summary.courtCost.toLocaleString("vi-VN")}đ</span>
               </div>
               <div className="px-3 text-[10px] text-gray-400 font-bold border-l-2 border-purple-200">
                  {sessionData.court.name} • {sessionData.court.numberOfCourts} sân • {sessionData.court.hours} giờ
               </div>

               <div className="flex justify-between items-center mt-2.5">
                  <span>📦 Chi phí tiền cầu:</span>
                  <span className="font-bold text-gray-700">{sessionData.summary.shuttleCost.toLocaleString("vi-VN")}đ</span>
               </div>
               <div className="px-3 text-[10px] text-gray-400 font-bold border-l-2 border-purple-200">
                  {sessionData.shuttle.name} • {sessionData.shuttle.usedQuantity} quả
               </div>

               <div className="h-px w-full bg-gray-100 my-3" />

               <div className="flex justify-between items-center text-[#7b41b4]">
                  <span className="font-extrabold uppercase tracking-wide">Doanh thu thu được:</span>
                  <span className="font-extrabold text-sm">{sessionData.summary.totalRevenue.toLocaleString("vi-VN")}đ</span>
               </div>
               <div className="px-3 text-[10px] text-gray-400 font-bold border-l-2 border-emerald-200 flex justify-between">
                  <span>Tiền mặt: {sessionData.summary.totalCash.toLocaleString("vi-VN")}đ</span>
                  <span>Chuyển khoản: {sessionData.summary.totalTransfer.toLocaleString("vi-VN")}đ</span>
               </div>

               {notes && (
                  <>
                     <div className="h-px w-full bg-gray-100 my-3" />
                     <div>
                        <span className="font-extrabold text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Ghi chú thêm:</span>
                        <p className="font-semibold text-gray-600 bg-gray-50 rounded-xl p-3 border border-gray-100/50 leading-relaxed italic">
                           {notes}
                        </p>
                     </div>
                  </>
               )}
            </div>
         </div>

         {/* Sticky Bottom Actions */}
         <div className="pt-4">
            <button
               onClick={onFinish}
               className="w-full h-12 bg-linear-to-r from-[#c185fd] to-[#7b41b4] text-white rounded-xl font-sans text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-[#7b41b4]/20 hover:opacity-90 active:scale-98 transition-transform select-none cursor-pointer"
            >
               Hoàn tất & Lưu Buổi Host
               <Check size={14} strokeWidth={2.5} className="ml-0.5" />
            </button>
         </div>
      </motion.div>
   );
};

export default StepFinancialReport;
