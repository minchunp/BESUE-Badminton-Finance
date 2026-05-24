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
         className="flex flex-col items-center justify-center text-center space-y-6 pt-12"
      >
         {/* Huge success check circle animation */}
         <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ type: "spring", delay: 0.2, stiffness: 120 }}
            className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-400 flex items-center justify-center text-emerald-500 shadow-lg shadow-emerald-200"
         >
            <CheckCircle size={44} strokeWidth={2.5} />
         </motion.div>

         <div className="space-y-2">
            <h2 className="font-sans text-2xl font-extrabold text-gray-800 tracking-tight leading-tight">Lưu buổi host thành công!</h2>
            <p className="font-sans text-xs font-semibold text-gray-400 max-w-70">
               Báo cáo tài chính buổi host đã được đồng bộ hóa và lưu vĩnh viễn.
            </p>
         </div>

         {/* Completed details card */}
         <div className="glass-card rounded-3xl p-5 w-full text-left shadow-glass border border-white/50 space-y-3 font-sans">
            <span className="text-[12px] font-bold text-gray-400 uppercase tracking-wider block">Thông số tổng kết buổi chơi:</span>

            <div className="grid grid-cols-2 gap-4 text-[16px] font-semibold text-gray-500">
               <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Ngày chơi</p>
                  <p className="font-bold text-gray-700 mt-0.5">{getFormattedDate(date)}</p>
               </div>
               <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Địa điểm</p>
                  <p className="font-bold text-gray-700 mt-0.5 truncate">{sessionData.court.name}</p>
               </div>
               <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Tổng doanh thu</p>
                  <p className="font-bold text-emerald-600 mt-0.5">{sessionData.summary.totalRevenue.toLocaleString("vi-VN")}đ</p>
               </div>
               <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Thực thu Lợi nhuận</p>
                  <p className={`font-bold mt-0.5 ${sessionData.summary.profit >= 0 ? "text-emerald-600" : "text-rose-500"}`}>
                     {sessionData.summary.profit.toLocaleString("vi-VN")}đ
                  </p>
               </div>
            </div>
         </div>

         {/* Sticky Bottom Actions */}
         <div className="w-full pt-4">
            <Button
               type="primary"
               block
               onClick={onFinish}
               className="h-12! rounded-xl! text-sm font-bold shadow-md shadow-[#7b41b4]/20 bg-linear-to-r! from-[#c185fd] to-[#7b41b4] border-none text-white flex items-center justify-center cursor-pointer"
            >
               Quay về trang chủ
            </Button>
         </div>
      </motion.div>
   );
};

export default StepSuccess;
