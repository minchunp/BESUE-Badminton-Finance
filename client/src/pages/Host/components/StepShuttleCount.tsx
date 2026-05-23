import { motion } from "framer-motion";
import { Plus, Minus, FileText } from "lucide-react";
import { Input } from "antd";
import type { StepShuttleCountProps } from "../types";

const StepShuttleCount = ({
   date,
   courtCost,
   totalPlayersCount,
   usedTubes,
   setUsedTubes,
   usedPieces,
   setUsedPieces,
   notes,
   setNotes,
   activeShuttle,
   shuttleCost,
   onNext,
   isPending,
}: StepShuttleCountProps) => {
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
      <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-5">
         {/* Progress */}
         <div className="space-y-1.5 px-1">
            <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider text-gray-400">
               <span>Bước 3/5</span>
               <span className="text-[#7b41b4]">60%</span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
               <div className="h-full bg-linear-to-r from-[#c185fd] to-[#ffb2b9] w-[60%] rounded-full" />
            </div>
         </div>

         {/* Top overview bar */}
         <div className="glass-card rounded-[20px] p-4 space-y-3.5 shadow-xs border border-white/50">
            <div className="flex items-center gap-2 text-gray-600">
               <FileText size={16} className="text-[#7b41b4]" />
               <span className="font-sans text-xs font-extrabold text-gray-800">Tổng quan buổi host</span>
            </div>
            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs font-semibold text-gray-500 font-sans">
               <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Ngày chơi</p>
                  <p className="font-bold text-gray-700 mt-0.5">{getFormattedDate(date)}</p>
               </div>
               <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Tiền sân dự kiến</p>
                  <p className="font-bold text-gray-700 mt-0.5">{courtCost.toLocaleString("vi-VN")}đ</p>
               </div>
               <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Người chơi đăng ký</p>
                  <p className="font-bold text-gray-700 mt-0.5">{totalPlayersCount} người vãng lai</p>
               </div>
            </div>
         </div>

         {/* Shuttles calculation card */}
         <div className="glass-card rounded-[20px] p-4 space-y-4 shadow-xs border border-white/50">
            {/* Stepper: Tubes quantity */}
            <div className="flex justify-between items-center">
               <label className="font-sans text-sm font-extrabold text-gray-700">Nhập số ống dùng</label>
               <div className="flex items-center gap-3 bg-gray-100/80 rounded-lg p-1 border border-gray-200/20 select-none">
                  <button
                     onClick={() => setUsedTubes(Math.max(0, usedTubes - 1))}
                     className="w-8 h-8 rounded-md bg-white flex items-center justify-center text-gray-500 shadow-sm hover:bg-gray-50 active:scale-95 transition-transform cursor-pointer"
                  >
                     <Minus size={12} strokeWidth={2.5} />
                  </button>
                  <span className="font-sans text-sm font-extrabold w-6 text-center">{usedTubes}</span>
                  <button
                     onClick={() => setUsedTubes(usedTubes + 1)}
                     className="w-8 h-8 rounded-md bg-white flex items-center justify-center text-gray-500 shadow-sm hover:bg-gray-50 active:scale-95 transition-transform cursor-pointer"
                  >
                     <Plus size={12} strokeWidth={2.5} />
                  </button>
               </div>
            </div>

            {/* Stepper: Pieces quantity */}
            <div className="flex justify-between items-center">
               <label className="font-sans text-sm font-extrabold text-gray-700">Nhập số quả lẻ dùng</label>
               <div className="flex items-center gap-3 bg-gray-100/80 rounded-lg p-1 border border-gray-200/20 select-none">
                  <button
                     onClick={() => setUsedPieces(Math.max(0, usedPieces - 1))}
                     className="w-8 h-8 rounded-md bg-white flex items-center justify-center text-gray-500 shadow-sm hover:bg-gray-50 active:scale-95 transition-transform cursor-pointer"
                  >
                     <Minus size={12} strokeWidth={2.5} />
                  </button>
                  <span className="font-sans text-sm font-extrabold w-6 text-center">{usedPieces}</span>
                  <button
                     onClick={() => setUsedPieces(usedPieces + 1)}
                     className="w-8 h-8 rounded-md bg-white flex items-center justify-center text-gray-500 shadow-sm hover:bg-gray-50 active:scale-95 transition-transform cursor-pointer"
                  >
                     <Plus size={12} strokeWidth={2.5} />
                  </button>
               </div>
            </div>

            {/* Total Shuttles details display */}
            {activeShuttle && (
               <div className="bg-[#efdbff]/50 backdrop-blur-md border border-purple-100 rounded-2xl p-4 flex flex-col gap-3 shadow-xs">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <span className="text-base select-none">📦</span>
                        <span className="font-sans text-[10px] font-bold text-gray-500 uppercase tracking-wider">Tổng số cầu đã dùng</span>
                     </div>
                     <span className="font-sans text-lg font-extrabold text-[#7b41b4]">
                        {usedTubes * (activeShuttle.quantityPerTube || 12) + usedPieces} quả
                     </span>
                  </div>

                  <div className="h-px w-full bg-purple-200/40" />

                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <span className="text-base select-none">💰</span>
                        <span className="font-sans text-[10px] font-bold text-gray-500 uppercase tracking-wider">Tổng tiền cầu tiêu thụ</span>
                     </div>
                     <span className="font-sans text-lg font-extrabold text-[#a93349]">{shuttleCost.toLocaleString("vi-VN")}đ</span>
                  </div>
               </div>
            )}
         </div>

         {/* Optional notes section (Antd Input.TextArea integrated) */}
         <div className="space-y-1.5">
            <label className="font-sans text-xs font-bold text-gray-500 uppercase tracking-wider px-1">Ghi chú thêm (Tùy chọn)</label>
            <Input.TextArea
               value={notes}
               onChange={(e) => setNotes(e.target.value)}
               placeholder="Ví dụ: Mua thêm nước uống 50k, tiền gửi xe..."
               rows={3}
               className="w-full glass-card rounded-[20px] p-4 font-sans text-xs font-semibold text-gray-700 placeholder:text-gray-400 focus:ring-1 focus:ring-[#7b41b4] focus:border-[#7b41b4] resize-none shadow-xs border border-white/50"
               style={{ background: "rgba(255, 255, 255, 0.7)" }}
            />
         </div>

         {/* Sticky Bottom Actions */}
         <div className="pt-0">
            <button
               onClick={onNext}
               disabled={isPending}
               className="w-full h-12 bg-linear-to-r from-[#c185fd] to-[#7b41b4] text-white rounded-xl font-sans text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-[#7b41b4]/20 hover:opacity-90 active:scale-98 transition-transform select-none cursor-pointer"
            >
               {isPending ? "Đang kết toán..." : "Xuất báo cáo"}
            </button>
         </div>
      </motion.div>
   );
};

export default StepShuttleCount;
