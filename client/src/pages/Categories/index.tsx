import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Drawer, message, ConfigProvider, theme, Image } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";

import ShuttleTab from "./components/ShuttleTab";
import CourtTab from "./components/CourtTab";
import ShuttleForm from "./components/ShuttleForm";
import CourtForm from "./components/CourtForm";

import { shuttleApi, courtApi } from "../../api/services/categories.api";
import type { IShuttle, ICourt, ITimeSlot } from "./types";

import courtIcon from "../../assets/imgs/icons/court.png";
import shuttleIcon from "../../assets/imgs/icons/shuttlecock.png";

type TabType = "shuttle" | "court";

// ================================================================
// Types for form payloads — eliminates `any` in onFinish handler
// ================================================================
interface ShuttleFormValues {
   name: string;
   pricePerTube: number;
   quantityPerTube?: number;
}

interface CourtFormValues {
   name: string;
   address?: string;
   description?: string;
   timeSlots?: ITimeSlot[];
}

type FormValues = ShuttleFormValues | CourtFormValues;

interface AxiosErrorResponse {
   response?: { data?: { message?: string } };
}

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
         message.success(res.message ?? "Thêm ống cầu mới thành công!");
         queryClient.invalidateQueries({ queryKey: ["shuttles"] });
         handleCloseDrawer();
      },
      onError: (err: AxiosErrorResponse) => {
         message.error(err.response?.data?.message ?? "Lỗi khi thêm ống cầu!");
      },
   });

   const updateShuttleMutation = useMutation({
      mutationFn: ({ id, data }: { id: string; data: Partial<IShuttle> }) => shuttleApi.update(id, data),
      onSuccess: (res) => {
         message.success(res.message ?? "Cập nhật ống cầu thành công!");
         queryClient.invalidateQueries({ queryKey: ["shuttles"] });
         handleCloseDrawer();
      },
      onError: (err: AxiosErrorResponse) => {
         message.error(err.response?.data?.message ?? "Lỗi khi cập nhật ống cầu!");
      },
   });

   // 3. Court Mutations
   const createCourtMutation = useMutation({
      mutationFn: courtApi.create,
      onSuccess: (res) => {
         message.success(res.message ?? "Thêm sân mới thành công!");
         queryClient.invalidateQueries({ queryKey: ["courts"] });
         handleCloseDrawer();
      },
      onError: (err: AxiosErrorResponse) => {
         message.error(err.response?.data?.message ?? "Lỗi khi thêm sân!");
      },
   });

   const updateCourtMutation = useMutation({
      mutationFn: ({ id, data }: { id: string; data: Partial<ICourt> }) => courtApi.update(id, data),
      onSuccess: (res) => {
         message.success(res.message ?? "Cập nhật sân thành công!");
         queryClient.invalidateQueries({ queryKey: ["courts"] });
         handleCloseDrawer();
      },
      onError: (err: AxiosErrorResponse) => {
         message.error(err.response?.data?.message ?? "Lỗi khi cập nhật sân!");
      },
   });

   // 4. Integrated Form Submission Handler
   const onFinish = (values: FormValues) => {
      if (activeTab === "shuttle") {
         const sv = values as ShuttleFormValues;
         const shuttleData: Omit<IShuttle, "_id"> = {
            name: sv.name,
            pricePerTube: sv.pricePerTube,
            quantityPerTube: sv.quantityPerTube ?? 12,
            pricePerPiece: Math.round(sv.pricePerTube / (sv.quantityPerTube ?? 12)),
         };

         if (editingItem) {
            updateShuttleMutation.mutate({ id: editingItem._id!, data: shuttleData });
         } else {
            createShuttleMutation.mutate(shuttleData);
         }
      } else {
         const cv = values as CourtFormValues;
         const courtData: Omit<ICourt, "_id"> = {
            name: cv.name,
            address: cv.address,
            description: cv.description,
            timeSlots: cv.timeSlots ?? [],
         };

         if (editingItem) {
            updateCourtMutation.mutate({ id: editingItem._id!, data: courtData });
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
               colorPrimary: "#0A84FF",
               borderRadius: 12,
            },
         }}
      >
         <div className="w-full min-h-screen relative pb-20">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-black/90 backdrop-blur-2xl px-5 h-16 flex items-center justify-between transition-colors duration-300 border-b border-black/5 dark:border-white/6 rounded-tl-xl rounded-tr-xl">
               <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigate("/home")}
                  className="w-9 h-9 bg-black/5 dark:bg-white/[0.07] rounded-full flex items-center justify-center text-black/45 dark:text-white/45 hover:text-[#0A84FF] transition-colors cursor-pointer border-none"
               >
                  <ChevronLeft size={18} strokeWidth={2.5} />
               </motion.button>

               <h1 className="font-sans text-md font-bold text-black dark:text-white absolute left-1/2 -translate-x-1/2 uppercase tracking-widest select-none animate-fade-in">
                  Danh mục
               </h1>
            </header>

            {/* iOS Segmented Tab Selector */}
            <div className="px-4 py-3 sticky top-16 z-30 bg-white/90 dark:bg-black/90 backdrop-blur-2xl border-b border-black/5 dark:border-white/6">
               <div className="flex bg-[#F0F0F5] dark:bg-[#2C2C2E] p-1 rounded-[12px] border border-black/4 dark:border-white/4">
                  <button
                     onClick={() => setActiveTab("shuttle")}
                     className={`flex-1 relative flex items-center justify-center gap-2 py-2 rounded-[10px] font-sans text-xs font-bold whitespace-nowrap transition-all duration-300 select-none border-none cursor-pointer ${
                        activeTab === "shuttle"
                           ? "bg-white dark:bg-[#1C1C1E] text-[#0A84FF] shadow-sm border border-black/4"
                           : "bg-transparent text-black/45 dark:text-white/45 hover:text-black/65 dark:hover:text-white/65"
                     }`}
                  >
                     <span className="flex flex-row items-center gap-2">
                        <Image style={{ width: 17, height: 17, marginBottom: 3 }} preview={false} src={shuttleIcon} /> Ống cầu
                     </span>
                  </button>

                  <button
                     onClick={() => setActiveTab("court")}
                     className={`flex-1 relative flex items-center justify-center gap-2 py-2 rounded-[10px] font-sans text-xs font-bold whitespace-nowrap transition-all duration-300 select-none border-none cursor-pointer ${
                        activeTab === "court"
                           ? "bg-white dark:bg-[#1C1C1E] text-[#0A84FF] shadow-sm border border-black/4"
                           : "bg-transparent text-black/45 dark:text-white/45 hover:text-black/65 dark:hover:text-white/65"
                     }`}
                  >
                     <span className="flex flex-row items-center gap-2">
                        <Image style={{ width: 18, height: 18 }} preview={false} src={courtIcon} /> Sân cầu
                     </span>
                  </button>
               </div>
            </div>

            {/* Master Tab Content render */}
            <main className="pt-4 px-2 pb-20">
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
               className="fixed bottom-24 right-5 w-14 h-14 rounded-[12px] bg-[#0A84FF] border-none text-white flex items-center justify-center z-40 select-none cursor-pointer"
            >
               <Plus size={28} strokeWidth={2.5} />
            </motion.button>

            {/* Bottom Sheet Drawer containing modular sub-forms */}
            <Drawer
               title={
                  <div className="mt-2 font-sans text-xs font-bold uppercase tracking-widest text-black/35 dark:text-white/35 text-center flex-1">
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
               destroyOnHidden={true}
               closable={false}
               size="68%"
               styles={{
                  body: {
                     paddingTop: 20,
                     paddingBottom: 0,
                     backgroundColor: isDarkMode ? "#1C1C1E" : "#FFFFFF",
                  },
                  header: {
                     borderBottom: isDarkMode ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.05)",
                     paddingTop: 40,
                     paddingBottom: 20,
                     backgroundColor: isDarkMode ? "#1C1C1E" : "#FFFFFF",
                  },
                  mask: {
                     backdropFilter: "blur(10px)",
                     backgroundColor: "rgba(0,0,0,0.35)",
                  },
               }}
               className="rounded-t-4xl overflow-hidden relative"
            >
               {/* Thin drag handle for premium iOS feel */}
               <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-9 h-1 bg-black/10 dark:bg-white/15 rounded-full z-50 pointer-events-none" />

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
