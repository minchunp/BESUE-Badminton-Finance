import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Button } from "antd";
import type { StepSuccessProps } from "../types";

const StepSuccess = ({ date, sessionData, onFinish }: StepSuccessProps) => {
   const getFormattedDate = (dateStr: string) => {
      try {
         const d = new Date(dateStr);
         const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
         return `${days[d.getDay()]} , ${d.getDate()}/${d.getMonth() + 1}`;
      } catch {
         return dateStr;
      }
   };

   return (
      <motion.div
         initial={{ scale: 0.9, opacity: 0 }}
         animate={{ scale: 1, opacity: 1 }}
         className="flex flex-col items-center justify-center text-center space-y-6 pt-5"
      >
         {/* Huge success check circle animation */}
         <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ type: "spring", delay: 0.2, stiffness: 120 }}
            className="w-20 h-20 rounded-full bg-[#30D158]/12 border-4 border-[#30D158] flex items-center justify-center text-[#30D158] shadow-lg"
         >
            <CheckCircle size={44} strokeWidth={2.5} />
         </motion.div>

         <div className="space-y-2">
            <h2 className="font-sans text-2xl font-extrabold text-black dark:text-white tracking-tight leading-tight">Lưu buổi host thành công!</h2>
            <p className="font-sans text-xs font-semibold text-black/55 dark:text-white/55 max-w-70">
               Báo cáo tài chính buổi host đã được đồng bộ hóa và lưu vĩnh viễn.
            </p>
         </div>

         {/* Completed details card */}
         <div className="bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/6 rounded-3xl p-5 w-full text-left space-y-3 font-sans">
            <span className="text-[12px] font-bold text-black/35 dark:text-white/35 uppercase tracking-wider block">
               Thông số tổng kết buổi chơi:
            </span>

            <div className="grid grid-cols-2 gap-4 text-[16px] font-semibold text-black/55 dark:text-white/55">
               <div>
                  <p className="text-[10px] text-black/35 dark:text-white/35 uppercase tracking-wider font-bold">Ngày chơi</p>
                  <p className="font-bold text-black dark:text-white mt-0.5">{getFormattedDate(date)}</p>
               </div>
               <div>
                  <p className="text-[10px] text-black/35 dark:text-white/35 uppercase tracking-wider font-bold">Địa điểm</p>
                  <p className="font-bold text-black dark:text-white mt-0.5 truncate">{sessionData.court.name}</p>
               </div>
               <div>
                  <p className="text-[10px] text-black/35 dark:text-white/35 uppercase tracking-wider font-bold">Tổng doanh thu</p>
                  <p className="font-bold text-[#30D158] mt-0.5">{sessionData.summary.totalRevenue.toLocaleString("vi-VN")}đ</p>
               </div>
               <div>
                  <p className="text-[10px] text-black/35 dark:text-white/35 uppercase tracking-wider font-bold">Thực thu Lợi nhuận</p>
                  <p className={`font-bold mt-0.5 ${sessionData.summary.profit >= 0 ? "text-[#30D158]" : "text-[#FF375F]"}`}>
                     {sessionData.summary.profit.toLocaleString("vi-VN")}đ
                  </p>
               </div>
            </div>
         </div>

         {/* Sticky Bottom Actions */}
         <div className="w-full pt-2">
            <Button
               type="primary"
               block
               onClick={onFinish}
               className="h-13! rounded-2xl! text-[13px] font-bold border-none text-white flex items-center justify-center cursor-pointer"
               style={{ background: "#0A84FF" }}
            >
               Quay về trang chủ
            </Button>
         </div>
      </motion.div>
   );
};

export default StepSuccess;
