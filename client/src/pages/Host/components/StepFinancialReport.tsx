import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { StepFinancialReportProps } from "../types";
import stampIcon from "../../../assets/imgs/icons/stamp.png";
import { Image } from "antd";

const StepFinancialReport = ({ sessionData, notes, onFinish, isViewOnly }: StepFinancialReportProps) => {
   return (
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-5">
         {/* Progress */}
         <div className="space-y-1.5 px-1">
            <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider text-black/35 dark:text-white/35">
               <span>Bước 4/5</span>
               <span className="text-[#0A84FF]">80%</span>
            </div>
            <div className="h-2 w-full bg-black/6 dark:bg-white/6 rounded-full overflow-hidden">
               <div className="h-full bg-[#0A84FF] w-[80%] rounded-full" />
            </div>
         </div>

         {/* Top audited stats hero */}
         <div className="bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/6 rounded-3xl p-5 flex flex-col items-center justify-center text-center">
            <Image style={{ width: 60, height: 60, marginBottom: 15 }} src={stampIcon} preview={false} />
            <span className="font-sans text-[11px] font-bold text-black/35 dark:text-white/35 uppercase tracking-wider mb-1">Kết quả lợi nhuận</span>
            <h2
               className={`font-sans text-3xl font-extrabold tracking-tight ${sessionData.summary.profit >= 0 ? "text-[#30D158]" : "text-[#FF375F]"}`}
            >
               {sessionData.summary.profit >= 0 ? "+" : ""}
               {sessionData.summary.profit.toLocaleString("vi-VN")}đ
            </h2>
            <p className="font-sans text-xs font-semibold text-black/55 dark:text-white/55 mt-2 max-w-75">
               {sessionData.summary.profit >= 0
                  ? "Tuyệt vời! Buổi giao lưu đã có số dư tích lũy!"
                  : "Giá thuê sân và tiền cầu lớn hơn số tiền thu được."}
            </p>
         </div>

         {/* Detailed breakdown list */}
         <div className="bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/6 rounded-3xl p-4 space-y-4">
            <h3 className="font-sans text-[12px] font-bold text-black/35 dark:text-white/35 uppercase tracking-wider border-b border-black/6 dark:border-white/6 pb-2 mb-1 px-1">
               Chi tiết tài chính
            </h3>

            <div className="space-y-2 font-sans text-[15px] font-semibold text-black/55 dark:text-white/55 px-1 py-2">
               <div className="flex justify-between items-center">
                  <span>🏟️ Chi phí tiền sân:</span>
                  <span className="font-bold text-black dark:text-white">{sessionData.summary.courtCost.toLocaleString("vi-VN")}đ</span>
               </div>
               <div className="px-3 text-[12px] text-black/35 dark:text-white/35 font-bold border-l-2 border-[#0A84FF]/30">
                  {sessionData.court.name} • {sessionData.court.numberOfCourts} sân • {sessionData.court.hours} giờ
               </div>

               <div className="flex justify-between items-center mt-2.5">
                  <span>📦 Chi phí tiền cầu:</span>
                  <span className="font-bold text-black dark:text-white">{sessionData.summary.shuttleCost.toLocaleString("vi-VN")}đ</span>
               </div>
               <div className="px-3 text-[12px] text-black/35 dark:text-white/35 font-bold border-l-2 border-[#0A84FF]/30">
                  {sessionData.shuttle.name} • {sessionData.shuttle.usedQuantity} quả
               </div>

               <div className="h-px w-full bg-black/6 dark:bg-white/6 my-3" />

               <div className="flex justify-between items-center text-[#0A84FF]">
                  <span className="font-extrabold uppercase tracking-wide">Doanh thu thu được:</span>
                  <span className="font-extrabold text-sm">{sessionData.summary.totalRevenue.toLocaleString("vi-VN")}đ</span>
               </div>
               <div className="px-3 text-[12px] text-black/35 dark:text-white/35 font-bold border-l-2 border-[#30D158]/40 flex justify-between">
                  <span>
                     Tiền mặt: <span className="text-[#0A84FF]">{sessionData.summary.totalCash.toLocaleString("vi-VN")}đ</span>
                  </span>
                  <span>
                     Chuyển khoản: <span className="text-[#0A84FF]">{sessionData.summary.totalTransfer.toLocaleString("vi-VN")}đ</span>
                  </span>
               </div>

               {notes && (
                  <>
                     <div className="h-px w-full bg-black/6 dark:bg-white/6 my-3" />
                     <div>
                        <span className="font-extrabold text-[10px] text-black/35 dark:text-white/35 uppercase tracking-wider block mb-1">
                           Ghi chú thêm:
                        </span>
                        <p className="font-semibold text-black/55 dark:text-white/55 bg-black/4 dark:bg-white/4 rounded-xl p-3 border border-black/5 dark:border-white/6 leading-relaxed italic">
                           {notes}
                        </p>
                     </div>
                  </>
               )}
            </div>
         </div>

         {/* Sticky Bottom Actions */}
         <div className="pt-0">
            <button
               onClick={onFinish}
               className="w-full h-13 bg-[#0A84FF] text-white rounded-2xl font-sans text-[13px] font-bold flex items-center justify-center gap-1.5 hover:opacity-90 active:scale-[0.98] transition-transform select-none cursor-pointer"
            >
               {isViewOnly ? "Quay lại Lịch sử" : "Hoàn tất & Lưu Buổi Host"}
               <Check size={14} strokeWidth={2.5} className="ml-0.5" />
            </button>
         </div>
      </motion.div>
   );
};

export default StepFinancialReport;
