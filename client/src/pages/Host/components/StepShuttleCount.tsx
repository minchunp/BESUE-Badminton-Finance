import { motion } from "framer-motion";
import { Plus, Minus, FileText } from "lucide-react";
import { Image, Input } from "antd";
import type { StepShuttleCountProps } from "../types";
import boxIcon from "../../../assets/imgs/icons/box.png";
import moneyIcon from "../../../assets/imgs/icons/money.png";

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
            <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider text-black/35 dark:text-white/35">
               <span>Bước 3/5</span>
               <span className="text-[#0A84FF]">60%</span>
            </div>
            <div className="h-2 w-full bg-black/6 dark:bg-white/6 rounded-full overflow-hidden">
               <div className="h-full bg-[#0A84FF] w-[60%] rounded-full" />
            </div>
         </div>

         {/* Top overview bar */}
         <div className="bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/6 rounded-[20px] p-4 space-y-3.5">
            <div className="flex items-center gap-2">
               <FileText size={16} className="text-[#0A84FF]" />
               <span className="font-sans text-md font-extrabold text-black dark:text-white">Tổng quan buổi host</span>
            </div>
            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-md font-semibold text-black/55 dark:text-white/55 font-sans">
               <div>
                  <p className="text-[10px] text-black/35 dark:text-white/35 uppercase tracking-wider font-bold">Ngày chơi</p>
                  <p className="font-bold text-black dark:text-white mt-0.5">{getFormattedDate(date)}</p>
               </div>
               <div>
                  <p className="text-[10px] text-black/35 dark:text-white/35 uppercase tracking-wider font-bold">Tiền sân dự kiến</p>
                  <p className="font-bold text-black dark:text-white mt-0.5">{courtCost.toLocaleString("vi-VN")}đ</p>
               </div>
               <div>
                  <p className="text-[10px] text-black/35 dark:text-white/35 uppercase tracking-wider font-bold">Người chơi đăng ký</p>
                  <p className="font-bold text-black dark:text-white mt-0.5">{totalPlayersCount} người vãng lai</p>
               </div>
            </div>
         </div>

         {/* Shuttles calculation card */}
         <div className="bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/6 rounded-[20px] p-4 space-y-4">
            {/* Stepper: Tubes quantity */}
            <div className="flex justify-between items-center">
               <label className="font-sans text-sm font-extrabold text-black dark:text-white">Nhập số ống dùng</label>
               <div className="flex items-center gap-3 bg-black/4 dark:bg-white/4 rounded-full p-1 select-none">
                  <button
                     onClick={() => setUsedTubes(Math.max(0, usedTubes - 1))}
                     className="w-8 h-8 rounded-full bg-white dark:bg-[#2C2C2E] flex items-center justify-center text-black/55 dark:text-white/55 shadow-sm hover:opacity-80 active:scale-95 transition-transform cursor-pointer"
                  >
                     <Minus size={12} strokeWidth={2.5} />
                  </button>
                  <span className="font-sans text-sm font-extrabold w-6 text-center text-black dark:text-white">{usedTubes}</span>
                  <button
                     onClick={() => setUsedTubes(usedTubes + 1)}
                     className="w-8 h-8 rounded-full bg-white dark:bg-[#2C2C2E] flex items-center justify-center text-black/55 dark:text-white/55 shadow-sm hover:opacity-80 active:scale-95 transition-transform cursor-pointer"
                  >
                     <Plus size={12} strokeWidth={2.5} />
                  </button>
               </div>
            </div>

            {/* Stepper: Pieces quantity */}
            <div className="flex justify-between items-center">
               <label className="font-sans text-sm font-extrabold text-black dark:text-white">Nhập số quả lẻ dùng</label>
               <div className="flex items-center gap-3 bg-black/4 dark:bg-white/4 rounded-full p-1 select-none">
                  <button
                     onClick={() => setUsedPieces(Math.max(0, usedPieces - 1))}
                     className="w-8 h-8 rounded-full bg-white dark:bg-[#2C2C2E] flex items-center justify-center text-black/55 dark:text-white/55 shadow-sm hover:opacity-80 active:scale-95 transition-transform cursor-pointer"
                  >
                     <Minus size={12} strokeWidth={2.5} />
                  </button>
                  <span className="font-sans text-sm font-extrabold w-6 text-center text-black dark:text-white">{usedPieces}</span>
                  <button
                     onClick={() => setUsedPieces(usedPieces + 1)}
                     className="w-8 h-8 rounded-full bg-white dark:bg-[#2C2C2E] flex items-center justify-center text-black/55 dark:text-white/55 shadow-sm hover:opacity-80 active:scale-95 transition-transform cursor-pointer"
                  >
                     <Plus size={12} strokeWidth={2.5} />
                  </button>
               </div>
            </div>

            {/* Total Shuttles details display */}
            {activeShuttle && (
               <div className="bg-[#0A84FF]/10 border border-[#0A84FF]/20 rounded-2xl p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <span className="text-base select-none mt-1">
                           <Image style={{ width: 18, height: 18 }} preview={false} src={boxIcon} />
                        </span>
                        <span className="font-sans text-[10px] font-bold text-black/55 dark:text-white/55 uppercase tracking-wider">
                           Tổng số cầu đã dùng
                        </span>
                     </div>
                     <span className="font-sans text-lg font-extrabold text-[#0A84FF]">
                        {usedTubes * (activeShuttle.quantityPerTube || 12) + usedPieces} quả
                     </span>
                  </div>

                  <div className="h-px w-full bg-[#0A84FF]/20" />

                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <span className="text-base select-none mt-1">
                           <Image style={{ width: 21, height: 21 }} preview={false} src={moneyIcon} />
                        </span>
                        <span className="font-sans text-[10px] font-bold text-black/55 dark:text-white/55 uppercase tracking-wider">
                           Tổng tiền cầu tiêu thụ
                        </span>
                     </div>
                     <span className="font-sans text-lg font-extrabold text-[#FF375F]">{shuttleCost.toLocaleString("vi-VN")}đ</span>
                  </div>
               </div>
            )}
         </div>

         {/* Optional notes section */}
         <div className="space-y-1.5">
            <label className="font-sans text-xs font-bold text-black/35 dark:text-white/35 uppercase tracking-wider px-1">
               Ghi chú thêm (Tùy chọn)
            </label>
            <Input.TextArea
               value={notes}
               onChange={(e) => setNotes(e.target.value)}
               placeholder="Ví dụ: Mua thêm nước uống 50k, tiền gửi xe..."
               rows={3}
               className="mt-2! w-full bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/6 rounded-[20px] p-4 font-sans text-xs font-semibold text-black dark:text-white placeholder:text-black/35 focus:ring-1 focus:ring-[#0A84FF] focus:border-[#0A84FF] resize-none"
            />
         </div>

         {/* Sticky Bottom Actions */}
         <div className="pt-0">
            <button
               onClick={onNext}
               disabled={isPending}
               className="w-full h-13 bg-[#0A84FF] text-white rounded-2xl font-sans text-[13px] font-bold flex items-center justify-center gap-1.5 hover:opacity-90 active:scale-[0.98] transition-transform select-none cursor-pointer disabled:opacity-50"
            >
               {isPending ? "Đang kết toán..." : "Xuất báo cáo"}
            </button>
         </div>
      </motion.div>
   );
};

export default StepShuttleCount;
