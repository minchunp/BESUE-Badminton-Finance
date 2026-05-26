/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Drawer, message, ConfigProvider, theme } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";

import ShuttleTab from "./components/ShuttleTab";
import CourtTab from "./components/CourtTab";
import ShuttleForm from "./components/ShuttleForm";
import CourtForm from "./components/CourtForm";

import { shuttleApi, courtApi } from "../../api/services/categories.api";
import type { IShuttle, ICourt } from "./types";

type TabType = "shuttle" | "court";

const CategoriesPage = () => {
   const { isDarkMode } = useTheme();
   const navigate = useNavigate();
   const queryClient = useQueryClient();

   // 1. Core States
   const [activeTab, setActiveTab] = useState<TabType>("shuttle");
   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
   const [editingItem, setEditingItem] = useState<IShuttle | ICourt | null>(null);

   const handleOpenCreate = () => {
      setEditingItem(null);
      setIsDrawerOpen(true);
   };

   const handleOpenEdit = (item: IShuttle | ICourt) => {
      setEditingItem(item);
      setIsDrawerOpen(true);
   };

   const handleCloseDrawer = () => {
      setIsDrawerOpen(false);
      setEditingItem(null);
   };

   // 2. Shuttle Mutations
   const createShuttleMutation = useMutation({
      mutationFn: shuttleApi.create,
      onSuccess: (res) => {
         message.success(res.message || "Thêm ống cầu mới thành công!");
         queryClient.invalidateQueries({ queryKey: ["shuttles"] });
         handleCloseDrawer();
      },
      onError: (err: any) => {
         message.error(err.response?.data?.message || "Lỗi khi thêm ống cầu!");
      },
   });

   const updateShuttleMutation = useMutation({
      mutationFn: ({ id, data }: { id: string; data: Partial<IShuttle> }) => shuttleApi.update(id, data),
      onSuccess: (res) => {
         message.success(res.message || "Cập nhật ống cầu thành công!");
         queryClient.invalidateQueries({ queryKey: ["shuttles"] });
         handleCloseDrawer();
      },
      onError: (err: any) => {
         message.error(err.response?.data?.message || "Lỗi khi cập nhật ống cầu!");
      },
   });

   // 3. Court Mutations
   const createCourtMutation = useMutation({
      mutationFn: courtApi.create,
      onSuccess: (res) => {
         message.success(res.message || "Thêm sân mới thành công!");
         queryClient.invalidateQueries({ queryKey: ["courts"] });
         handleCloseDrawer();
      },
      onError: (err: any) => {
         message.error(err.response?.data?.message || "Lỗi khi thêm sân!");
      },
   });

   const updateCourtMutation = useMutation({
      mutationFn: ({ id, data }: { id: string; data: Partial<ICourt> }) => courtApi.update(id, data),
      onSuccess: (res) => {
         message.success(res.message || "Cập nhật sân thành công!");
         queryClient.invalidateQueries({ queryKey: ["courts"] });
         handleCloseDrawer();
      },
      onError: (err: any) => {
         message.error(err.response?.data?.message || "Lỗi khi cập nhật sân!");
      },
   });

   // 4. Integrated Form Submission Handler
   const onFinish = (values: any) => {
      if (activeTab === "shuttle") {
         const shuttleData: Omit<IShuttle, "_id"> = {
            name: values.name,
            pricePerTube: values.pricePerTube,
            quantityPerTube: values.quantityPerTube || 12,
            pricePerPiece: Math.round(values.pricePerTube / (values.quantityPerTube || 12)),
         };

         if (editingItem) {
            updateShuttleMutation.mutate({
               id: editingItem._id!,
               data: shuttleData,
            });
         } else {
            createShuttleMutation.mutate(shuttleData);
         }
      } else {
         const courtData: Omit<ICourt, "_id"> = {
            name: values.name,
            address: values.address,
            description: values.description,
            timeSlots: values.timeSlots || [],
         };

         if (editingItem) {
            updateCourtMutation.mutate({
               id: editingItem._id!,
               data: courtData,
            });
         } else {
            createCourtMutation.mutate(courtData);
         }
      }
   };

   return (
      <ConfigProvider
         theme={{
            algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
            token: {
               colorPrimary: "#7b41b4",
               borderRadius: 16,
            },
         }}
      >
         <div className="w-full min-h-screen relative pb-20">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-40 w-full glass-card border-b border-gray-100 px-4 h-16 flex items-center justify-between transition-all duration-300 rounded-tl-xl rounded-tr-xl">
               <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigate("/home")}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-700 animate-fade-in"
               >
                  <ChevronLeft size={20} strokeWidth={2.5} />
               </motion.button>

               <h1 className="font-sans text-lg font-extrabold tracking-tight text-gray-900 absolute left-1/2 -translate-x-1/2 select-none animate-fade-in">
                  Danh mục
               </h1>
            </header>

            {/* Premium Tab Selector */}
            <div className="rounded-bl-xl rounded-br-xl px-4 py-3 flex gap-3 overflow-x-auto hide-scrollbar sticky top-16 z-30 bg-[#FDFCFE]/80 backdrop-blur-md border-b border-gray-50/50">
               <button
                  onClick={() => setActiveTab("shuttle")}
                  className={`relative flex items-center gap-2 px-5 py-2 rounded-full font-sans text-xs font-bold whitespace-nowrap transition-all duration-300 select-none ${
                     activeTab === "shuttle" ? "text-white shadow-md shadow-[#7b41b4]/20" : "text-gray-500 hover:bg-gray-100"
                  }`}
               >
                  {activeTab === "shuttle" && (
                     <motion.div
                        layoutId="activeCategoryTab"
                        className="absolute inset-0 bg-[#7b41b4] rounded-full z-0"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                     />
                  )}
                  <span className="relative z-10">🏸 Ống cầu</span>
               </button>

               <button
                  onClick={() => setActiveTab("court")}
                  className={`relative flex items-center gap-2 px-5 py-2 rounded-full font-sans text-xs font-bold whitespace-nowrap transition-all duration-300 select-none ${
                     activeTab === "court" ? "text-white shadow-md shadow-[#7b41b4]/20" : "text-gray-500 hover:bg-gray-100"
                  }`}
               >
                  {activeTab === "court" && (
                     <motion.div
                        layoutId="activeCategoryTab"
                        className="absolute inset-0 bg-[#7b41b4] rounded-full z-0"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                     />
                  )}
                  <span className="relative z-10">🏟️ Sân cầu</span>
               </button>
            </div>

            {/* Master Tab Content render */}
            <main className="px-4 pt-4 pb-20">
               <AnimatePresence mode="wait">
                  <motion.div
                     key={activeTab}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -10 }}
                     transition={{ duration: 0.25 }}
                  >
                     {activeTab === "shuttle" ? <ShuttleTab onEdit={handleOpenEdit} /> : <CourtTab onEdit={handleOpenEdit} />}
                  </motion.div>
               </AnimatePresence>
            </main>

            {/* Floating Action Button (FAB) */}
            <motion.button
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.9 }}
               onClick={handleOpenCreate}
               className="fixed bottom-24 right-5 w-14 h-14 rounded-2xl bg-linear-to-br from-[#D8B4FE] to-[#FB7185] shadow-[0_8px_32px_rgba(216,180,254,0.45)] flex items-center justify-center text-white z-40 select-none cursor-pointer"
            >
               <Plus size={28} strokeWidth={2.5} />
            </motion.button>

            {/* Bottom Sheet Drawer containing modular sub-forms */}
            <Drawer
               title={
                  <div className="font-sans text-base font-extrabold text-gray-800 tracking-tight">
                     {editingItem
                        ? activeTab === "shuttle"
                           ? "Chỉnh sửa ống cầu"
                           : "Chỉnh sửa sân bãi"
                        : activeTab === "shuttle"
                          ? "Thêm ống cầu mới"
                          : "Thêm sân mới"}
                  </div>
               }
               placement="bottom"
               onClose={handleCloseDrawer}
               open={isDrawerOpen}
               size="65%"
               styles={{
                  body: {
                     paddingTop: 16,
                     paddingBottom: 40,
                     backgroundColor: isDarkMode ? "#18181b" : "#f9f9f9",
                  },
                  header: {
                     borderBottom: isDarkMode ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.05)",
                     paddingTop: 20,
                     paddingBottom: 16,
                  },
               }}
               className="rounded-t-4xl overflow-hidden"
            >
               {activeTab === "shuttle" ? (
                  <ShuttleForm
                     initialValues={editingItem as IShuttle | null}
                     onFinish={onFinish}
                     loading={createShuttleMutation.isPending || updateShuttleMutation.isPending}
                  />
               ) : (
                  <CourtForm
                     initialValues={editingItem as ICourt | null}
                     onFinish={onFinish}
                     loading={createCourtMutation.isPending || updateCourtMutation.isPending}
                  />
               )}
            </Drawer>
         </div>
      </ConfigProvider>
   );
};

export default CategoriesPage;
