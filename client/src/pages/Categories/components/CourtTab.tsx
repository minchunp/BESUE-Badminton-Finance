/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Popconfirm, message, Spin, Empty } from "antd";
import { Pencil, Trash2, MapPin, Search, Calendar, Landmark, Info, Timer } from "lucide-react";
import { useState } from "react";
import { courtApi } from "../../../api/services/categories.api";
import type { ICourt } from "../types";

interface CourtTabProps {
   onEdit: (court: ICourt) => void;
}

const containerVariants = {
   hidden: { opacity: 0 },
   show: {
      opacity: 1,
      transition: {
         staggerChildren: 0.05,
      },
   },
};

const cardVariants = {
   hidden: { opacity: 0, y: 15 },
   show: {
      opacity: 1,
      y: 0,
      transition: {
         type: "spring" as const,
         stiffness: 100,
         damping: 15,
      },
   },
};

const CourtTab = ({ onEdit }: CourtTabProps) => {
   const queryClient = useQueryClient();
   const [searchQuery, setSearchQuery] = useState("");
   const [isSearchOpen, setIsSearchOpen] = useState(false);

   // 1. Fetching data with TanStack Query v5
   const {
      data: response,
      isLoading,
      error,
   } = useQuery({
      queryKey: ["courts"],
      queryFn: courtApi.getAll,
   });

   const courts = response?.data || [];

   // 2. Mutation for deleting court
   const deleteMutation = useMutation({
      mutationFn: courtApi.delete,
      onSuccess: (res) => {
         message.success(res.message || "Đã xóa sân thành công!");
         queryClient.invalidateQueries({ queryKey: ["courts"] });
      },
      onError: (err: any) => {
         message.error(err.response?.data?.message || "Lỗi khi xóa sân!");
      },
   });

   // 3. Filtered courts based on search query
   const filteredCourts = courts.filter(
      (court) =>
         court.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         (court.address && court.address.toLowerCase().includes(searchQuery.toLowerCase())),
   );

   // 4. Compute dynamic summary statistics
   const totalCourts = courts.length;

   let totalSlotsCount = 0;
   let totalPrice = 0;
   courts.forEach((c) => {
      c.timeSlots.forEach((s) => {
         totalPrice += s.pricePerHour;
         totalSlotsCount++;
      });
   });
   const avgPricePerHour = totalSlotsCount > 0 ? Math.round(totalPrice / totalSlotsCount) : 0;

   if (isLoading) {
      return (
         <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Spin size="large" className="text-[#0A84FF]" />
            <span className="text-sm font-semibold text-gray-400">Đang tải danh sách sân...</span>
         </div>
      );
   }

   if (error) {
      return <div className="text-center py-10 text-red-500 font-medium">Có lỗi xảy ra khi tải danh sách sân. Vui lòng thử lại sau!</div>;
   }

   return (
      <div className="space-y-6">
         {/* Summary Statistics Section */}
         <section className="animate-fade-in">
            <h2 className="font-sans text-[13px] font-bold text-black/35 dark:text-white/35 uppercase tracking-wider mb-3 px-1">Tổng quan</h2>
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/6 rounded-[20px] p-4 flex flex-col justify-between min-h-27.5 transition-all">
                  <span className="font-sans text-[10px] font-bold text-black/45 dark:text-white/45 uppercase tracking-wider flex items-center gap-1.5">
                     <Landmark size={14} className="text-[#0A84FF]" /> Tổng số sân
                  </span>
                  <div className="mt-2 flex flex-col">
                     <span className="font-sans text-3xl font-extrabold text-[#0A84FF] tracking-tight">{totalCourts}</span>
                     <span className="font-sans text-xs font-semibold text-gray-400 ml-1">sân</span>
                  </div>
               </div>

               <div className="bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/6 rounded-[20px] p-4 flex flex-col justify-between min-h-27.5 transition-all">
                  <span className="font-sans text-[10px] font-bold text-black/45 dark:text-white/45 uppercase tracking-wider flex items-center gap-1.5">
                     <Calendar size={14} className="text-[#30D158]" /> Giá trung bình
                  </span>
                  <div className="mt-2 flex flex-col">
                     <span className="font-sans text-2xl font-extrabold text-[#30D158] tracking-tight leading-none">
                        {avgPricePerHour > 0 ? `${(avgPricePerHour / 1000).toFixed(0)}k` : "0đ"}
                     </span>
                     <span className="font-sans text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wide">/ giờ thuê</span>
                  </div>
               </div>
            </div>
         </section>

         {/* List Header and Search */}
         <section className="space-y-3">
            <div className="flex justify-between items-center px-1">
               <h3 className="font-sans text-[13px] font-bold text-black/35 dark:text-white/35 uppercase tracking-wider">
                  Danh sách ({filteredCourts.length})
               </h3>

               <div className="flex items-center gap-2">
                  <motion.button
                     whileTap={{ scale: 0.9 }}
                     onClick={() => setIsSearchOpen(!isSearchOpen)}
                     className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors border-none cursor-pointer ${
                        isSearchOpen ? "bg-[#0A84FF]/10 text-[#0A84FF]" : "text-gray-400 dark:text-zinc-500 hover:bg-black/4 dark:hover:bg-white/4"
                     }`}
                  >
                     <Search size={16} strokeWidth={2.5} />
                  </motion.button>
               </div>
            </div>

            {/* Expandable Search Input */}
            {isSearchOpen && (
               <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-1"
               >
                  <input
                     type="text"
                     placeholder="Tìm kiếm tên sân hoặc địa chỉ..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full h-11 bg-white dark:bg-[#1C1C1E] border border-black/6 dark:border-white/6 rounded-xl px-4 font-sans text-sm focus:outline-none focus:border-[#0A84FF] focus:ring-1 focus:ring-[#0A84FF] transition-all text-black dark:text-white"
                     autoFocus
                  />
               </motion.div>
            )}

            {/* List of items */}
            {filteredCourts.length === 0 ? (
               <div className="py-10 bg-white dark:bg-[#1C1C1E] rounded-3xl border border-black/5 dark:border-white/6 flex flex-col items-center justify-center">
                  <Empty
                     description={<span className="text-gray-400 text-xs font-semibold">Không tìm thấy sân nào</span>}
                     image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
               </div>
            ) : (
               <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-3">
                  {filteredCourts.map((court) => (
                     <motion.div
                        key={court._id}
                        variants={cardVariants}
                        whileHover={{ y: -1 }}
                        className="bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/6 rounded-[20px] p-4 flex flex-col gap-3 group transition-all select-none"
                     >
                        <div className="flex items-center gap-4">
                           {/* Court Avatar Icon */}
                           <div className="w-12 h-12 rounded-2xl bg-[#0A84FF]/10 flex items-center justify-center text-[#0A84FF] shrink-0">
                              <Landmark size={20} strokeWidth={2.5} />
                           </div>

                           {/* Court Info */}
                           <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                 <h4 className="font-sans text-[16px] font-extrabold text-black dark:text-white truncate leading-snug pr-2">
                                    {court.name}
                                 </h4>

                                 {/* Inline Controls */}
                                 <div className="flex items-center gap-1.5 shrink-0">
                                    <button
                                       onClick={() => onEdit(court)}
                                       className="p-1.5 rounded-lg hover:bg-[#0A84FF]/10 text-[#0A84FF] active:scale-90 transition-transform cursor-pointer border-none bg-transparent"
                                       title="Sửa"
                                    >
                                       <Pencil size={16} strokeWidth={2.5} />
                                    </button>

                                    <Popconfirm
                                       title="Xác nhận xóa?"
                                       description="Hành động này không thể hoàn tác."
                                       onConfirm={() => deleteMutation.mutate(court._id!)}
                                       okText="Xóa"
                                       cancelText="Hủy"
                                       okButtonProps={{ danger: true, size: "small" }}
                                       cancelButtonProps={{ size: "small" }}
                                       placement="topRight"
                                    >
                                       <button
                                          className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 text-[#FF3B30] active:scale-90 transition-transform cursor-pointer border-none bg-transparent"
                                          title="Xóa"
                                       >
                                          <Trash2 size={16} strokeWidth={2.5} />
                                       </button>
                                    </Popconfirm>
                                 </div>
                              </div>

                              {court.address && (
                                 <div className="flex items-center gap-1 mt-1 text-gray-400 dark:text-zinc-500">
                                    <MapPin size={12} className="shrink-0" />
                                    <span className="font-sans text-xs font-semibold truncate">{court.address}</span>
                                 </div>
                              )}
                           </div>
                        </div>

                        {/* Description (if exists) */}
                        {court.description && (
                           <div className="bg-black/3 dark:bg-white/3 rounded-xl p-2.5 flex items-start gap-1.5 border border-black/4 dark:border-white/4">
                              <Info size={13} className="text-gray-450 dark:text-zinc-500 shrink-0 mt-0.5" />
                              <p className="font-sans text-[11px] font-semibold text-black/50 dark:text-white/50 leading-normal">
                                 {court.description}
                              </p>
                           </div>
                        )}

                        {/* Time Slots Section */}
                        {court.timeSlots && court.timeSlots.length > 0 && (
                           <div className="mt-1 space-y-2">
                              <span className="font-sans text-[11px] font-extrabold text-black/30 dark:text-white/30 uppercase tracking-wider block">
                                 Khung giờ & bảng giá:
                              </span>
                              <div className="flex gap-2 flex-wrap">
                                 {court.timeSlots.map((slot, index) => (
                                    <span
                                       key={index}
                                       className="bg-[#0A84FF]/10 text-[#0A84FF] px-2.5 py-1 rounded-lg font-sans text-[11px] font-extrabold border border-black/4 dark:border-white/4 flex flex-row items-center gap-1 hover:bg-[#0A84FF]/14 transition-all"
                                    >
                                       <Timer size={15} /> {slot.startHour} - {slot.endHour} :{" "}
                                       <span className="font-extrabold text-[#0A84FF]">{slot.pricePerHour.toLocaleString("vi-VN")}đ</span>
                                       <span className="text-[9px] text-gray-400 font-bold">/h</span>
                                    </span>
                                 ))}
                              </div>
                           </div>
                        )}
                     </motion.div>
                  ))}
               </motion.div>
            )}
         </section>
      </div>
   );
};

export default CourtTab;
