import { motion } from "framer-motion";
import { DatePicker, Select, InputNumber } from "antd";
import dayjs from "dayjs";
import { Calendar, MapPin, Layers, Plus, Minus, Sparkles, Coins, Clock, ChevronRight } from "lucide-react";
import type { StepBasicInfoProps } from "../types";

const StepBasicInfo = ({
   date,
   setDate,
   courts,
   selectedCourtId,
   setSelectedCourtId,
   numberOfCourts,
   setNumberOfCourts,
   hours,
   setHours,
   shuttles,
   selectedShuttleId,
   setSelectedShuttleId,
   feeMale,
   setFeeMale,
   feeFemale,
   setFeeFemale,
   activeCourt,
   activeShuttle,
   onNext,
   isPending,
}: StepBasicInfoProps) => {
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
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-5">
         {/* Progress */}
         <div className="space-y-1.5 px-1">
            <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider text-gray-400">
               <span>Bước 1/5</span>
               <span className="text-[#7b41b4]">20%</span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
               <div className="h-full bg-linear-to-r from-[#c185fd] to-[#ffb2b9] w-[20%] rounded-full" />
            </div>
         </div>

         {/* Title box */}
         <div className="glass-card rounded-3xl p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-[#c185fd] to-[#ffb2b9] opacity-10" />
            <div className="relative z-10 flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#7b41b4] flex items-center justify-center shadow-xs shrink-0">
                  <Sparkles size={22} strokeWidth={2.5} />
               </div>
               <div>
                  <h2 className="font-sans text-[15px] font-extrabold text-gray-800 tracking-tight leading-tight">Thiết lập thông tin cơ bản</h2>
                  <p className="font-sans text-xs font-semibold text-gray-400 mt-0.5">Khởi tạo nền tảng cho buổi giao lưu</p>
               </div>
            </div>
         </div>

         {/* Date selection card (Ant Design DatePicker integrated) */}
         <div className="glass-card rounded-[20px] p-4 flex items-center justify-between hover:bg-white/95 transition-all shadow-xs border border-white/50 relative">
            <div className="flex items-center gap-3 w-full">
               <Calendar size={18} className="text-[#7b41b4] shrink-0" />
               <div className="flex-1 min-w-0">
                  <div className="font-sans text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Ngày tổ chức</div>
                  <DatePicker
                     value={date ? dayjs(date) : null}
                     onChange={(dateObj) => setDate(dateObj ? dateObj.format("YYYY-MM-DD") : "")}
                     format="DD/MM/YYYY"
                     allowClear={false}
                     variant="borderless"
                     className="p-0 font-sans text-[13px] font-extrabold text-gray-700 w-full focus:shadow-none focus:ring-0 cursor-pointer"
                  />
               </div>
            </div>
         </div>

         {/* Court selection card (Ant Design Select integrated) */}
         <div className="glass-card rounded-[20px] p-4 space-y-2.5 shadow-xs border border-white/50">
            <div className="flex items-center gap-3">
               <MapPin size={18} className="text-[#7b41b4]" />
               <div className="font-sans text-[10px] font-bold text-gray-400 uppercase tracking-wider">Sân cầu lông</div>
            </div>
            <div className="bg-white/80 rounded-xl px-1.5 py-1 flex items-center justify-between border border-gray-100 shadow-sm relative">
               <Select
                  value={selectedCourtId}
                  onChange={(val) => setSelectedCourtId(val)}
                  variant="borderless"
                  className="w-full font-sans text-[13px] font-extrabold text-gray-700 cursor-pointer"
                  options={courts.map((court) => ({
                     value: court._id,
                     label: `${court.name} - ${court.address || "Địa chỉ"}`,
                  }))}
                  dropdownStyle={{ borderRadius: 12, fontFamily: "Inter, sans-serif" }}
               />
            </div>
            {activeCourt && (
               <div className="px-1 text-[11px] font-extrabold text-[#7b41b4] flex items-center gap-1">
                  <span>⚡ Giá sân mặc định:</span>
                  <span>{activeCourt.timeSlots?.[0]?.pricePerHour.toLocaleString("vi-VN") || "80,000"}đ/giờ</span>
               </div>
            )}
         </div>

         {/* Hours Stepper */}
         <div className="glass-card rounded-[20px] p-4 flex items-center justify-between shadow-xs border border-white/50">
            <div className="flex items-center gap-3">
               <Clock size={18} className="text-[#7b41b4]" />
               <span className="font-sans text-sm font-extrabold text-gray-800">Số giờ chơi</span>
            </div>
            <div className="flex items-center gap-3 bg-gray-100/80 rounded-full p-1 border border-gray-200/20 select-none">
               <button
                  onClick={() => setHours(Math.max(1, hours - 1))}
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#a93349] shadow-sm hover:bg-gray-50 active:scale-90 transition-transform cursor-pointer"
               >
                  <Minus size={12} strokeWidth={2.5} />
               </button>
               <span className="font-sans text-sm font-extrabold w-8 text-center">{hours}</span>
               <button
                  onClick={() => setHours(hours + 1)}
                  className="w-8 h-8 rounded-full bg-[#7b41b4] flex items-center justify-center text-white shadow-sm hover:opacity-90 active:scale-90 transition-transform cursor-pointer"
               >
                  <Plus size={12} strokeWidth={2.5} />
               </button>
            </div>
         </div>

         {/* Court Quantity Stepper */}
         <div className="glass-card rounded-[20px] p-4 flex items-center justify-between shadow-xs border border-white/50">
            <div className="flex items-center gap-3">
               <Layers size={18} className="text-[#7b41b4]" />
               <span className="font-sans text-sm font-extrabold text-gray-800">Số lượng sân</span>
            </div>
            <div className="flex items-center gap-3 bg-gray-100/80 rounded-full p-1 border border-gray-200/20 select-none">
               <button
                  onClick={() => setNumberOfCourts(Math.max(1, numberOfCourts - 1))}
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#a93349] shadow-sm hover:bg-gray-50 active:scale-90 transition-transform cursor-pointer"
               >
                  <Minus size={12} strokeWidth={2.5} />
               </button>
               <span className="font-sans text-sm font-extrabold w-8 text-center">{numberOfCourts}</span>
               <button
                  onClick={() => setNumberOfCourts(numberOfCourts + 1)}
                  className="w-8 h-8 rounded-full bg-[#7b41b4] flex items-center justify-center text-white shadow-sm hover:opacity-90 active:scale-90 transition-transform cursor-pointer"
               >
                  <Plus size={12} strokeWidth={2.5} />
               </button>
            </div>
         </div>

         {/* Shuttle Selection (Ant Design Select integrated) */}
         <div className="glass-card rounded-[20px] p-4 space-y-2.5 shadow-xs border border-white/50">
            <div className="flex items-center gap-3">
               <Sparkles size={18} className="text-[#7b41b4]" />
               <div className="font-sans text-[10px] font-bold text-gray-400 uppercase tracking-wider">Loại cầu sử dụng</div>
            </div>
            <div className="bg-white/80 rounded-xl px-1.5 py-1 flex items-center justify-between border border-gray-100 shadow-sm relative">
               <Select
                  value={selectedShuttleId}
                  onChange={(val) => setSelectedShuttleId(val)}
                  variant="borderless"
                  className="w-full font-sans text-[13px] font-extrabold text-gray-700 cursor-pointer"
                  options={shuttles.map((shuttle) => ({
                     value: shuttle._id,
                     label: shuttle.name,
                  }))}
                  dropdownStyle={{ borderRadius: 12, fontFamily: "Inter, sans-serif" }}
               />
            </div>
            {activeShuttle && (
               <div className="px-1 text-[11px] font-extrabold text-gray-400 flex gap-2">
                  <span>⚡ {activeShuttle.pricePerTube.toLocaleString("vi-VN")}đ/ống</span>
                  <span>•</span>
                  <span>{Math.round(activeShuttle.pricePerTube / (activeShuttle.quantityPerTube || 12)).toLocaleString("vi-VN")}đ/quả</span>
               </div>
            )}
         </div>

         {/* Player Pricing (Ant Design InputNumber integrated) */}
         <div className="glass-card rounded-[20px] p-4 space-y-4 shadow-xs border border-white/50">
            <div className="flex items-center gap-3">
               <Coins size={18} className="text-[#7b41b4]" />
               <span className="font-sans text-sm font-extrabold text-gray-800">Phí tham gia dự kiến</span>
            </div>
            <div className="grid grid-cols-2 gap-3.5">
               <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 px-0.5">Vãng lai Nam (VNĐ)</label>
                  <InputNumber
                     value={feeMale}
                     onChange={(val) => setFeeMale(val || 0)}
                     formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                     parser={(value) => Number(value?.replace(/\$\s?|(,*)/g, "") || 0)}
                     controls={false}
                     className="w-full h-11 flex items-center bg-white/80 rounded-xl border border-gray-200/60 font-sans text-xs font-bold text-gray-700 shadow-xs"
                  />
               </div>
               <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 px-0.5">Vãng lai Nữ (VNĐ)</label>
                  <InputNumber
                     value={feeFemale}
                     onChange={(val) => setFeeFemale(val || 0)}
                     formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                     parser={(value) => Number(value?.replace(/\$\s?|(,*)/g, "") || 0)}
                     controls={false}
                     className="w-full h-11 flex items-center bg-white/80 rounded-xl border border-gray-200/60 font-sans text-xs font-bold text-gray-700 shadow-xs"
                  />
               </div>
            </div>
         </div>

         {/* Summary Card */}
         <div className="glass-card rounded-3xl p-4 border-l-4 border-l-[#7b41b4] shadow-xs">
            <h3 className="font-sans text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Tổng quan nhanh</h3>
            <ul className="space-y-1.5 font-sans text-xs font-semibold text-gray-500">
               <li className="flex justify-between">
                  <span>Thời gian:</span>
                  <span className="font-bold text-gray-700">{getFormattedDate(date)}</span>
               </li>
               <li className="flex justify-between">
                  <span>Địa điểm:</span>
                  <span className="font-bold text-gray-700">
                     {activeCourt ? `${activeCourt.name} (${numberOfCourts} sân x ${hours}h)` : "Đang cấu hình"}
                  </span>
               </li>
               <li className="flex justify-between">
                  <span>Loại cầu:</span>
                  <span className="font-bold text-gray-700">{activeShuttle ? activeShuttle.name : "Đang cấu hình"}</span>
               </li>
               <li className="flex justify-between">
                  <span>Phí dự kiến:</span>
                  <span className="font-bold text-[#7b41b4]">
                     {(feeFemale / 1000).toFixed(0)}k - {(feeMale / 1000).toFixed(0)}k
                  </span>
               </li>
            </ul>
         </div>

         {/* Sticky Bottom Next Button */}
         <div className="pt-2">
            <button
               onClick={onNext}
               disabled={isPending}
               className="w-full h-12 bg-linear-to-r from-[#c185fd] to-[#7b41b4] text-white rounded-xl font-sans text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-[#7b41b4]/20 hover:opacity-90 active:scale-98 transition-all select-none cursor-pointer"
            >
               {isPending ? "Đang xử lý..." : "Tiếp tục (Bước 2)"}
               <ChevronRight size={14} strokeWidth={2.5} />
            </button>
         </div>
      </motion.div>
   );
};

export default StepBasicInfo;
