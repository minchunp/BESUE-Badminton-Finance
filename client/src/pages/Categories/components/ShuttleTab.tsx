/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Popconfirm, message, Spin, Empty } from "antd";
import { Pencil, Trash2, Box, Sparkles, TrendingUp, Search } from "lucide-react";
import { useState } from "react";
import { shuttleApi } from "../../../api/services/categories.api";
import type { IShuttle } from "../types";

interface ShuttleTabProps {
   onEdit: (shuttle: IShuttle) => void;
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

const ShuttleTab = ({ onEdit }: ShuttleTabProps) => {
   const queryClient = useQueryClient();
   const [searchQuery, setSearchQuery] = useState("");
   const [isSearchOpen, setIsSearchOpen] = useState(false);

   // 1. Fetching data with TanStack Query v5
   const {
      data: response,
      isLoading,
      error,
   } = useQuery({
      queryKey: ["shuttles"],
      queryFn: shuttleApi.getAll,
   });

   const shuttles = response?.data || [];

   // 2. Mutation for deleting shuttle
   const deleteMutation = useMutation({
      mutationFn: shuttleApi.delete,
      onSuccess: (res) => {
         message.success(res.message || "Đã xóa ống cầu thành công!");
         queryClient.invalidateQueries({ queryKey: ["shuttles"] });
      },
      onError: (err: any) => {
         message.error(err.response?.data?.message || "Lỗi khi xóa ống cầu!");
      },
   });

   // 3. Filtered shuttles based on search query
   const filteredShuttles = shuttles.filter((shuttle) => shuttle.name.toLowerCase().includes(searchQuery.toLowerCase()));

   // 4. Compute dynamic summary statistics
   const totalShuttles = shuttles.length;
   const avgPricePerTube = totalShuttles > 0 ? Math.round(shuttles.reduce((acc, curr) => acc + curr.pricePerTube, 0) / totalShuttles) : 0;

   if (isLoading) {
      return (
         <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Spin size="large" className="text-[#0A84FF]" />
            <span className="text-sm font-semibold text-gray-400">Đang tải danh sách ống cầu...</span>
         </div>
      );
   }

   if (error) {
      return <div className="text-center py-10 text-red-500 font-medium">Có lỗi xảy ra khi tải danh sách ống cầu. Vui lòng thử lại sau!</div>;
   }

   return (
      <div className="space-y-6">
         {/* Summary Statistics Section */}
         <section className="animate-fade-in">
            <h2 className="font-sans text-[13px] font-bold text-black/35 dark:text-white/35 uppercase tracking-wider mb-3 px-1">Tổng quan</h2>
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/6 rounded-[20px] p-4 flex flex-col justify-between min-h-27.5 transition-all">
                  <span className="font-sans text-[10px] font-bold text-black/45 dark:text-white/45 uppercase tracking-wider flex items-center gap-1.5">
                     <Box size={14} className="text-[#0A84FF]" /> Tổng loại cầu
                  </span>
                  <div className="mt-2 flex flex-col">
                     <span className="font-sans text-3xl font-extrabold text-[#0A84FF] tracking-tight">{totalShuttles}</span>
                     <span className="font-sans text-xs font-semibold text-gray-400 ml-1">loại</span>
                  </div>
               </div>

               <div className="bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/6 rounded-[20px] p-4 flex flex-col justify-between min-h-27.5 transition-all">
                  <span className="font-sans text-[10px] font-bold text-black/45 dark:text-white/45 uppercase tracking-wider flex items-center gap-1.5">
                     <TrendingUp size={14} className="text-[#30D158]" /> Giá trung bình
                  </span>
                  <div className="mt-2 flex flex-col">
                     <span className="font-sans text-2xl font-extrabold text-[#30D158] tracking-tight leading-none">
                        {avgPricePerTube > 0 ? `${(avgPricePerTube / 1000).toFixed(0)}k` : "0đ"}
                     </span>
                     <span className="font-sans text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wide">/ ống cầu</span>
                  </div>
               </div>
            </div>
         </section>

         {/* List Header and Search */}
         <section className="space-y-3">
            <div className="flex justify-between items-center px-1">
               <h3 className="font-sans text-[13px] font-bold text-black/35 dark:text-white/35 uppercase tracking-wider">
                  Danh sách ({filteredShuttles.length})
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
                     placeholder="Tìm kiếm tên ống cầu..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full h-11 bg-white dark:bg-[#1C1C1E] border border-black/6 dark:border-white/6 rounded-xl px-4 font-sans text-sm focus:outline-none focus:border-[#0A84FF] focus:ring-1 focus:ring-[#0A84FF] transition-all text-black dark:text-white"
                     autoFocus
                  />
               </motion.div>
            )}

            {/* List of items */}
            {filteredShuttles.length === 0 ? (
               <div className="py-10 bg-white dark:bg-[#1C1C1E] rounded-3xl border border-black/5 dark:border-white/6 flex flex-col items-center justify-center">
                  <Empty
                     description={<span className="text-gray-400 text-xs font-semibold">Không tìm thấy ống cầu nào</span>}
                     image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
               </div>
            ) : (
               <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-3">
                  {filteredShuttles.map((shuttle) => (
                     <motion.div
                        key={shuttle._id}
                        variants={cardVariants}
                        whileHover={{ y: -1 }}
                        className="bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/6 rounded-[20px] p-4 flex items-center gap-4 group transition-all select-none"
                     >
                        {/* Shuttle Avatar Icon */}
                        <div className="w-12 h-12 rounded-2xl bg-[#0A84FF]/10 flex items-center justify-center text-[#0A84FF] shrink-0">
                           <Sparkles size={20} strokeWidth={2.5} />
                        </div>

                        {/* Shuttle Info */}
                        <div className="flex-1 min-w-0">
                           <div className="flex justify-between items-start">
                              <h4 className="font-sans text-[15px] font-extrabold text-black dark:text-white truncate leading-snug pr-2">
                                 {shuttle.name}
                              </h4>

                              {/* Inline Controls */}
                              <div className="flex items-center gap-1.5 shrink-0">
                                 <button
                                    onClick={() => onEdit(shuttle)}
                                    className="p-1.5 rounded-lg hover:bg-[#0A84FF]/10 text-[#0A84FF] active:scale-90 transition-transform cursor-pointer border-none bg-transparent"
                                    title="Sửa"
                                 >
                                    <Pencil size={16} strokeWidth={2.5} />
                                 </button>

                                 <Popconfirm
                                    title="Xác nhận xóa?"
                                    description="Hành động này không thể hoàn tác."
                                    onConfirm={() => deleteMutation.mutate(shuttle._id!)}
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

                           {/* Price breakdown */}
                           <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                              <span className="font-sans text-[14px] font-extrabold text-black dark:text-white">
                                 {shuttle.pricePerTube.toLocaleString("vi-VN")}đ
                                 <span className="text-gray-400 dark:text-zinc-500 font-bold text-[10px] uppercase ml-0.5 tracking-wider">/ ống</span>
                              </span>
                              <span className="w-1 h-1 rounded-full bg-black/10 dark:bg-white/10"></span>
                              <span className="font-sans text-xs font-bold text-black/50 dark:text-white/50">
                                 {shuttle.pricePerPiece?.toLocaleString("vi-VN") ||
                                    Math.round(shuttle.pricePerTube / shuttle.quantityPerTube).toLocaleString("vi-VN")}
                                 đ<span className="text-gray-400 dark:text-zinc-500 font-semibold text-[10px] ml-0.5 lowercase">/ quả</span>
                              </span>
                           </div>

                           {/* Metadata Badges */}
                           <div className="flex gap-2 flex-wrap mt-2.5">
                              <span className="bg-black/4 dark:bg-white/4 text-black/45 dark:text-white/45 px-2 py-0.5 rounded-lg font-sans text-[10px] font-extrabold tracking-wide uppercase">
                                 {shuttle.quantityPerTube} quả / ống
                              </span>
                              <span className="bg-[#30D158]/10 text-[#30D158] px-2 py-0.5 rounded-lg font-sans text-[10px] font-extrabold tracking-wide uppercase">
                                 Sẵn có
                              </span>
                           </div>
                        </div>
                     </motion.div>
                  ))}
               </motion.div>
            )}
         </section>
      </div>
   );
};

export default ShuttleTab;
