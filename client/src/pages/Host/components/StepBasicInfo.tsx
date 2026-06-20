import { motion } from "framer-motion";
import { DatePicker, InputNumber, ConfigProvider, theme, Tag } from "antd";
import dayjs from "dayjs";
import { Calendar, MapPin, Layers, Plus, Minus, Sparkles, Coins, Clock, ChevronRight } from "lucide-react";
import type { StepBasicInfoProps } from "../types";
import { useTheme } from "../../../contexts/ThemeContext";
import CustomSelect from "../../../components/CustomSelect";
import { formatShortDate } from "../../../utils/playerUtils";

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
   const { isDarkMode } = useTheme();
   return (
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-5">
         {/* Progress */}
         <div className="space-y-1.5 px-1">
            <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider text-black/35 dark:text-white/35">
               <span>Bước 1/5</span>
               <span className="text-[#0A84FF]">20%</span>
            </div>
            <div className="h-2 w-full bg-black/6 dark:bg-white/6 rounded-full overflow-hidden">
               <div className="h-full bg-[#0A84FF] w-[20%] rounded-full" />
            </div>
         </div>

         {/* Date selection card */}
         <div className="bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/6 rounded-[14px] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3 w-full">
               <Calendar size={18} className="text-[#0A84FF] shrink-0" />
               <div className="flex-1 min-w-0">
                  <div className="font-sans text-[10px] font-bold text-black/35 dark:text-white/35 uppercase tracking-wider mb-0.5">Ngày tổ chức</div>
                  <ConfigProvider
                     theme={{
                        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                        token: {
                           colorBgContainer: "transparent",
                           colorText: isDarkMode ? "#ffffff" : "#000000",
                           colorTextPlaceholder: isDarkMode ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)",
                        },
                     }}
                  >
                     <DatePicker
                        value={date ? dayjs(date) : null}
                        onChange={(dateObj) => setDate(dateObj ? dateObj.format("YYYY-MM-DD") : "")}
                        format="DD/MM/YYYY"
                        allowClear={false}
                        variant="borderless"
                        className="p-0 font-sans text-[13px] font-extrabold text-black dark:text-white w-full focus:shadow-none focus:ring-0 cursor-pointer"
                        style={{ background: "transparent", color: isDarkMode ? "#ffffff" : "#000000" }}
                     />
                  </ConfigProvider>
               </div>
            </div>
         </div>

         {/* Court selection card */}
         <div className="bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/6 rounded-[14px] p-4 space-y-2.5">
            <div className="flex items-center gap-3">
               <MapPin size={18} className="text-[#0A84FF]" />
               <div className="font-sans text-[10px] font-bold text-black/35 dark:text-white/35 uppercase tracking-wider">Sân cầu lông</div>
            </div>
            <div className="bg-black/4 dark:bg-white/4 rounded-xl px-1.5 py-1 flex items-center justify-between border border-black/5 dark:border-white/6 relative">
               <CustomSelect
                  value={selectedCourtId}
                  onChange={(val) => setSelectedCourtId(val)}
                  isDarkMode={isDarkMode}
                  placeholder="Chọn sân cầu lông..."
                  options={courts.map((court) => ({
                     value: court._id,
                     label: `${court.name} - ${court.address || "Địa chỉ"}`,
                  }))}
               />
            </div>
            {activeCourt && (
               <div className="px-1 text-[11px] font-extrabold text-[#0A84FF] flex items-center gap-1">
                  <span>⚡ Giá sân mặc định:</span>
                  <span>{activeCourt.timeSlots?.[0]?.pricePerHour.toLocaleString("vi-VN") || "80,000"}đ/giờ</span>
               </div>
            )}
         </div>

         {/* Shuttle Selection */}
         <div className="bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/6 rounded-[14px] p-4 space-y-2.5">
            <div className="flex items-center gap-3">
               <Sparkles size={18} className="text-[#0A84FF]" />
               <div className="font-sans text-[10px] font-bold text-black/35 dark:text-white/35 uppercase tracking-wider">Loại cầu sử dụng</div>
            </div>
            <div className="bg-black/4 dark:bg-white/4 rounded-xl px-1.5 py-1 flex items-center justify-between border border-black/5 dark:border-white/6 relative">
               <CustomSelect
                  value={selectedShuttleId}
                  onChange={(val) => setSelectedShuttleId(val)}
                  isDarkMode={isDarkMode}
                  placeholder="Chọn loại cầu..."
                  options={shuttles.map((shuttle) => ({
                     value: shuttle._id,
                     label: shuttle.name,
                  }))}
               />
            </div>
            {activeShuttle && (
               <div className="px-1 text-[11px] font-extrabold text-[#0A84FF] flex gap-2">
                  <span>⚡ {activeShuttle.pricePerTube.toLocaleString("vi-VN")}đ/ống</span>
                  <span>•</span>
                  <span>{Math.round(activeShuttle.pricePerTube / (activeShuttle.quantityPerTube || 12)).toLocaleString("vi-VN")}đ/quả</span>
               </div>
            )}
         </div>

         <div className="p-2.5 pt-5 relative flex flex-col gap-3 border-2 border-[#0A84FF] rounded-2xl">
            <div className="absolute -top-3">
               <Tag color="#0A84FF" className="font-bold py-1!">
                  Quan trọng
               </Tag>
            </div>
            {/* Hours Stepper */}
            <div className="bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/6 rounded-[14px] p-4 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <Clock size={18} className="text-[#0A84FF]" />
                  <span className="font-sans text-sm font-extrabold text-black dark:text-white">Số giờ chơi</span>
               </div>
               <div className="flex items-center gap-3 bg-black/4 dark:bg-white/4 rounded-full p-1 select-none">
                  <button
                     onClick={() => setHours(Math.max(1, hours - 1))}
                     className="w-8 h-8 rounded-full bg-white dark:bg-[#2C2C2E] flex items-center justify-center text-[#FF375F] shadow-sm hover:opacity-80 active:scale-90 transition-transform cursor-pointer"
                  >
                     <Minus size={12} strokeWidth={2.5} />
                  </button>
                  <span className="font-sans text-sm font-extrabold w-8 text-center text-black dark:text-white">{hours}</span>
                  <button
                     onClick={() => setHours(hours + 1)}
                     className="w-8 h-8 rounded-full bg-[#0A84FF] flex items-center justify-center text-white shadow-sm hover:opacity-90 active:scale-90 transition-transform cursor-pointer"
                  >
                     <Plus size={12} strokeWidth={2.5} />
                  </button>
               </div>
            </div>

            {/* Court Quantity Stepper */}
            <div className="bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/6 rounded-[14px] p-4 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <Layers size={18} className="text-[#0A84FF]" />
                  <span className="font-sans text-sm font-extrabold text-black dark:text-white">Số lượng sân</span>
               </div>
               <div className="flex items-center gap-3 bg-black/4 dark:bg-white/4 rounded-full p-1 select-none">
                  <button
                     onClick={() => setNumberOfCourts(Math.max(1, numberOfCourts - 1))}
                     className="w-8 h-8 rounded-full bg-white dark:bg-[#2C2C2E] flex items-center justify-center text-[#FF375F] shadow-sm hover:opacity-80 active:scale-90 transition-transform cursor-pointer"
                  >
                     <Minus size={12} strokeWidth={2.5} />
                  </button>
                  <span className="font-sans text-sm font-extrabold w-8 text-center text-black dark:text-white">{numberOfCourts}</span>
                  <button
                     onClick={() => setNumberOfCourts(numberOfCourts + 1)}
                     className="w-8 h-8 rounded-full bg-[#0A84FF] flex items-center justify-center text-white shadow-sm hover:opacity-90 active:scale-90 transition-transform cursor-pointer"
                  >
                     <Plus size={12} strokeWidth={2.5} />
                  </button>
               </div>
            </div>

            {/* Player Pricing */}
            <div className="bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/6 rounded-[14px] p-4 space-y-4">
               <div className="flex items-center gap-3">
                  <Coins size={18} className="text-[#0A84FF]" />
                  <span className="font-sans text-sm font-extrabold text-black dark:text-white">Phí tham gia dự kiến</span>
               </div>
               <div className="grid grid-cols-2 gap-3.5">
                  <div>
                     <label className="block text-[10px] font-bold text-black/35 dark:text-white/35 uppercase tracking-wider mb-1 px-0.5">
                        Vãng lai Nam (VNĐ)
                     </label>
                     <InputNumber
                        value={feeMale}
                        onChange={(val) => setFeeMale(val || 0)}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        parser={(value) => Number(value?.replace(/\$\s?|(,*)/g, "") || 0)}
                        controls={false}
                        className="w-full h-11 flex items-center bg-black/4 dark:bg-white/4 rounded-xl! border border-black/5 dark:border-white/6 font-sans text-xs font-bold text-black dark:text-white"
                     />
                  </div>
                  <div>
                     <label className="block text-[10px] font-bold text-black/35 dark:text-white/35 uppercase tracking-wider mb-1 px-0.5">
                        Vãng lai Nữ (VNĐ)
                     </label>
                     <InputNumber
                        value={feeFemale}
                        onChange={(val) => setFeeFemale(val || 0)}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        parser={(value) => Number(value?.replace(/\$\s?|(,*)/g, "") || 0)}
                        controls={false}
                        className="w-full h-11 flex items-center bg-black/4 dark:bg-white/4 rounded-xl! border border-black/5 dark:border-white/6 font-sans text-xs font-bold text-black dark:text-white"
                     />
                  </div>
               </div>
            </div>
         </div>

         {/* Summary Card */}
         <div className="bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/6 rounded-3xl p-4 border-l-4 border-l-[#0A84FF] dark:border-l-[#0A84FF]">
            <h3 className="font-sans text-[12px] font-bold text-black/55 dark:text-white/55 uppercase tracking-wider mb-4">Tổng quan nhanh</h3>
            <ul className="space-y-1.5 font-sans text-[13px] font-semibold text-black/55 dark:text-white/55">
               <li className="flex justify-between">
                  <span>Thời gian:</span>
                  <span className="font-bold text-black dark:text-white">{formatShortDate(date)}</span>
               </li>
               <li className="flex justify-between">
                  <span>Địa điểm:</span>
                  <span className="font-bold text-black dark:text-white">
                     {activeCourt ? `${activeCourt.name} (${numberOfCourts} sân x ${hours}h)` : "Đang cấu hình"}
                  </span>
               </li>
               <li className="flex justify-between">
                  <span>Loại cầu:</span>
                  <span className="font-bold text-black dark:text-white">{activeShuttle ? activeShuttle.name : "Đang cấu hình"}</span>
               </li>
               <li className="flex justify-between">
                  <span>Phí dự kiến:</span>
                  <span className="font-extrabold text-[#0A84FF]">
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
               className="w-full h-13 bg-[#0A84FF] text-white rounded-2xl font-sans text-xs font-bold flex items-center justify-center gap-1.5 hover:opacity-90 active:scale-[0.98] transition-all select-none cursor-pointer disabled:opacity-50"
            >
               {isPending ? "Đang xử lý..." : "Tiếp tục (Bước 2)"}
               <ChevronRight size={14} strokeWidth={2.5} />
            </button>
         </div>
      </motion.div>
   );
};

export default StepBasicInfo;
