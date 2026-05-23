import { Modal, Input, InputNumber, Button, Empty } from "antd";
import { LayoutGrid, PlayCircle, Clock, Edit3, Trash2, ChevronRight, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { categoryApi } from "../api/services/category.api.ts";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const CategoryPage = () => {
   const [selectedTab, setSelectedTab] = useState<"court" | "shuttle">("court");
   const [modalOpen, setModalOpen] = useState(false);

   const { data: courts, isLoading } = useQuery({
      queryKey: ["courts"],
      queryFn: () => categoryApi.category(),
   });

   return (
      <div className="space-y-8">
         {/* Header */}
         <div className="flex items-end justify-between">
            <div>
               <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">
                  Quản lý
                  <br />
                  Danh mục
               </h2>
            </div>
         </div>

         {/* Stats Cards - Áp dụng Functional Colors */}
         <div className="grid grid-cols-2 gap-4">
            {/* Card Tím: Sân */}
            <div className="bg-white rounded-[20px] p-5 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative overflow-hidden group hover:border-[#F3E8FF] transition-colors">
               <div className="absolute -right-4 -top-4 w-16 h-16 bg-[#F3E8FF]/60 rounded-full blur-xl group-hover:bg-[#F3E8FF] transition-all" />
               <div className="relative z-10 flex items-center gap-2 text-gray-500 mb-3">
                  <div className="w-6 h-6 rounded-md bg-[#F3E8FF] flex items-center justify-center text-[#C084FC]">
                     <LayoutGrid size={12} strokeWidth={2.5} />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider">Tổng sân</span>
               </div>
               <h3 className="relative z-10 text-3xl font-black text-gray-900">14</h3>
            </div>

            {/* Card Xanh Ngọc: Cầu */}
            <div className="bg-white rounded-[20px] p-5 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative overflow-hidden group hover:border-[#10B981]/10 transition-colors">
               <div className="absolute -right-4 -top-4 w-16 h-16 bg-[#10B981]/10 rounded-full blur-xl group-hover:bg-[#10B981]/20 transition-all" />
               <div className="relative z-10 flex items-center gap-2 text-gray-500 mb-3">
                  <div className="w-6 h-6 rounded-md bg-[#10B981]/10 flex items-center justify-center text-[#10B981]">
                     <PlayCircle size={12} strokeWidth={2.5} />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider">Loại cầu</span>
               </div>
               <h3 className="relative z-10 text-3xl font-black text-gray-900">03</h3>
            </div>
         </div>

         {/* Tabs */}
         <div className="bg-gray-100/60 p-1 rounded-2xl flex relative border border-gray-100">
            <TabButton active={selectedTab === "court"} onClick={() => setSelectedTab("court")} label="Sân cầu lông" />
            <TabButton active={selectedTab === "shuttle"} onClick={() => setSelectedTab("shuttle")} label="Quả cầu lông" />
         </div>

         {/* Main Content */}
         <div className="min-h-[300px]">
            <AnimatePresence mode="wait">
               {selectedTab === "court" && (
                  <motion.div
                     key="court"
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -10 }}
                     className="space-y-4"
                  >
                     <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-bold text-gray-500">Danh sách hiện tại</span>
                        <button
                           onClick={() => setModalOpen(true)}
                           className="text-sm font-bold text-[#C084FC] flex items-center gap-1 hover:text-[#9333EA] transition-colors"
                        >
                           Thêm mới <ChevronRight size={16} />
                        </button>
                     </div>

                     {isLoading ? (
                        <div className="flex justify-center py-10">
                           <div className="w-8 h-8 border-2 border-[#D8B4FE] border-t-transparent rounded-full animate-spin" />
                        </div>
                     ) : courts && courts.length > 0 ? (
                        courts.map((court: any, index: number) => <CourtCard key={court._id} court={court} delay={index * 0.05} />)
                     ) : (
                        <div className="py-12 bg-white rounded-[24px] border border-dashed border-gray-200">
                           <Empty description={<span className="text-gray-400 font-medium">Chưa có dữ liệu sân</span>} />
                        </div>
                     )}
                  </motion.div>
               )}

               {selectedTab === "shuttle" && (
                  <motion.div key="shuttle" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                     <div className="py-12 bg-white rounded-[24px] border border-dashed border-gray-200">
                        <Empty description={<span className="text-gray-400 font-medium">Chưa có dữ liệu cầu</span>} />
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>
         </div>

         <AddCourtModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </div>
   );
};

const TabButton = ({ active, onClick, label }: any) => (
   <button onClick={onClick} className="relative flex-1 py-2.5 px-4 rounded-xl text-sm font-bold transition-colors z-10">
      {active && (
         <motion.div
            layoutId="tab-bg"
            className="absolute inset-0 bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100 z-[-1]"
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
         />
      )}
      <span className={active ? "text-gray-900" : "text-gray-500"}>{label}</span>
   </button>
);

const CourtCard = ({ court, delay }: any) => (
   <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      className="bg-white rounded-[24px] p-4 border border-gray-100 shadow-[0_4px_15px_rgba(0,0,0,0.02)] group flex items-center justify-between"
   >
      <div className="flex items-center gap-4">
         <div className="w-12 h-12 bg-[#F3E8FF]/50 border border-[#F3E8FF] rounded-2xl flex items-center justify-center text-[#C084FC]">
            <MapPin size={20} strokeWidth={2} />
         </div>
         <div>
            <h3 className="text-base font-black text-gray-900 leading-none mb-2">{court.name}</h3>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold">
               <Clock size={12} />
               <span>{court.pricePerHour.toLocaleString()}đ / giờ</span>
            </div>
         </div>
      </div>
      <div className="flex items-center gap-1">
         <button className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-[#0EA5E9] hover:bg-[#0EA5E9]/10 transition-all">
            <Edit3 size={16} />
         </button>
         <button className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-all">
            <Trash2 size={16} />
         </button>
      </div>
   </motion.div>
);

const AddCourtModal = ({ open, onClose }: any) => (
   <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={360}
      className="modern-modal"
      classNames={{
         content: "!rounded-[28px] !p-6 !pb-8 shadow-2xl border border-gray-100",
      }}
      closeIcon={false}
   >
      <h2 className="text-xl font-black text-gray-900 mb-6 text-center">Thêm sân mới</h2>
      <div className="space-y-5">
         <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tên sân</label>
            <Input
               placeholder="VD: Sân 1"
               size="large"
               className="rounded-xl border-gray-200 hover:border-[#D8B4FE] focus:border-[#D8B4FE] bg-gray-50 focus:bg-white transition-all px-4 py-3 font-medium"
            />
         </div>
         <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Giá thuê (VNĐ/giờ)</label>
            <InputNumber
               placeholder="50,000"
               size="large"
               className="w-full rounded-xl border-gray-200 hover:border-[#D8B4FE] focus:border-[#D8B4FE] bg-gray-50 focus:bg-white transition-all px-1 py-1.5 font-medium"
               formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            />
         </div>
         <div className="flex gap-3 pt-2">
            <Button size="large" onClick={onClose} className="flex-1 rounded-xl font-bold h-12 border-gray-200 text-gray-600">
               Hủy
            </Button>
            {/* Sử dụng màu xám đen (Gray 900) cho nút call-to-action */}
            <Button
               type="primary"
               size="large"
               className="flex-1 rounded-xl font-bold h-12 bg-gray-900 hover:!bg-gray-800 border-none text-white shadow-md"
            >
               Xác nhận
            </Button>
         </div>
      </div>
   </Modal>
);

export default CategoryPage;
