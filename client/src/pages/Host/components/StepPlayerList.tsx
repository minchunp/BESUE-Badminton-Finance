import { useState } from "react";
import { motion } from "framer-motion";
import { Popconfirm, Modal, Radio, Button, Image } from "antd";
import { Calendar, Check, Users, ChevronRight, Trash2, Pencil, QrCode } from "lucide-react";
import type { StepPlayerListProps } from "../types";
import QRBanking from "../../../assets/imgs/QR.png";

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

const StepPlayerList = ({
   date,
   numberOfCourts,
   activeShuttle,
   playersList,
   feeMale,
   feeFemale,
   totalPlayersCount,
   totalExpectedRevenue,
   totalCollectedRevenue,
   selectedPlayersCount,
   onAddPlayer,
   onEditPlayer,
   onDeletePlayer,
   onTogglePlayerStatus,
   onNext,
   isPending,
}: StepPlayerListProps) => {
   // Local states for QR code & Payment modals
   const [isQrOpen, setIsQrOpen] = useState(false);
   const [paymentModalIdx, setPaymentModalIdx] = useState<number | null>(null);
   const [localIsPaid, setLocalIsPaid] = useState<boolean>(false);
   const [localPaymentMethod, setLocalPaymentMethod] = useState<"cash" | "transfer">("cash");

   const getFormattedDate = (dateStr: string) => {
      try {
         const d = new Date(dateStr);
         const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
         return `${days[d.getDay()]} , ${d.getDate()}/${d.getMonth() + 1}`;
      } catch {
         return dateStr;
      }
   };

   // Check if all players are checked in
   const allPlayersChecked = playersList.length > 0 && playersList.every((p) => p.isCheckedIn);

   const handleCheckboxClick = (index: number) => {
      const player = playersList[index];
      if (player.isCheckedIn) {
         // Direct uncheck
         onTogglePlayerStatus(index, false, false, undefined);
      } else {
         // Open payment modal to check them in
         setPaymentModalIdx(index);
         setLocalIsPaid(false);
         setLocalPaymentMethod("cash");
      }
   };

   const handleOpenPaymentStatusEdit = (index: number) => {
      const player = playersList[index];
      setPaymentModalIdx(index);
      setLocalIsPaid(player.isPaid);
      setLocalPaymentMethod(player.paymentMethod || "cash");
   };

   const handleConfirmPayment = () => {
      if (paymentModalIdx === null) return;
      onTogglePlayerStatus(
         paymentModalIdx,
         true, // isCheckedIn is true when payment is set
         localIsPaid,
         localIsPaid ? localPaymentMethod : undefined,
      );
      setPaymentModalIdx(null);
   };

   return (
      <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-5">
         {/* Progress */}
         <div className="space-y-1.5 px-1">
            <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider text-gray-400">
               <span>Bước 2/5</span>
               <span className="text-[#7b41b4]">40%</span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
               <div className="h-full bg-linear-to-r from-[#c185fd] to-[#ffb2b9] w-[40%] rounded-full" />
            </div>
         </div>

         {/* Top overview bar */}
         <div className="glass-card rounded-3xl p-4 flex justify-between items-center shadow-xs border border-white/50 animate-fade-in">
            <div className="flex items-center gap-2 text-gray-500">
               <Calendar size={16} className="text-[#7b41b4]" />
               <span className="font-sans text-[11px] font-extrabold tracking-wide uppercase">
                  {getFormattedDate(date)} • {numberOfCourts} sân • {activeShuttle?.name}
               </span>
            </div>
         </div>

         {/* Stats Bento Grid */}
         <div className="grid grid-cols-3 gap-3">
            <div className="glass-card rounded-2xl p-3 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-xs">
               <div className="absolute -right-4 -top-4 w-10 h-10 bg-purple-500/10 rounded-full blur-lg" />
               <span className="font-sans text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Tổng người</span>
               <span className="font-sans text-lg font-extrabold text-[#7b41b4] leading-none">{totalPlayersCount}</span>
            </div>

            <div className="glass-card rounded-2xl p-3 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-xs">
               <div className="absolute -left-4 -top-4 w-10 h-10 bg-pink-500/10 rounded-full blur-lg" />
               <span className="font-sans text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Tổng tiền</span>
               <span className="font-sans text-lg font-extrabold text-[#7b41b4] leading-none">
                  {totalExpectedRevenue > 0 ? `${(totalExpectedRevenue / 1000).toFixed(0)}k` : "0đ"}
               </span>
            </div>

            <div className="glass-card rounded-2xl p-3 flex flex-col items-center justify-center text-center bg-emerald-50/50 border border-emerald-100/50 shadow-xs">
               <span className="font-sans text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Đã thu</span>
               <span className="font-sans text-lg font-extrabold text-[#10b981] leading-none">
                  {totalCollectedRevenue > 0 ? `${(totalCollectedRevenue / 1000).toFixed(0)}k` : "0đ"}
               </span>
            </div>
         </div>

         {/* Floating QR Action Button */}
         <button
            onClick={() => setIsQrOpen(true)}
            aria-label="Hiện mã QR"
            className="fixed bottom-20 right-4 z-60! bg-linear-to-br from-[#7b41b4] to-[#a93349] shadow-lg rounded-full px-4 py-2.5 flex items-center space-x-1.5 text-white hover:scale-105 active:scale-95 transition-transform border border-white/20 select-none cursor-pointer"
         >
            <QrCode size={18} strokeWidth={2.5} />
            <span className="font-sans text-xs font-extrabold tracking-wide">QR</span>
         </button>

         {/* Player List Canvas */}
         <div className="space-y-3">
            <h2 className="font-sans text-[15px] font-extrabold text-gray-500 uppercase tracking-wider px-1">Danh sách khách vãng lai</h2>

            {playersList.length === 0 ? (
               <div className="py-12 bg-white/40 backdrop-blur-md rounded-3xl border border-gray-100/50 flex flex-col items-center justify-center">
                  <Users size={32} className="text-gray-300 mb-2" />
                  <span className="text-xs font-semibold text-gray-400">Chưa có người chơi vãng lai</span>
                  <button
                     onClick={onAddPlayer}
                     className="mt-3 bg-linear-to-r! from-[#c185fd] to-[#7b41b4] text-white px-4 py-2 rounded-xl font-sans text-xs font-bold shadow-sm cursor-pointer"
                  >
                     + Thêm người chơi
                  </button>
               </div>
            ) : (
               <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-3">
                  {playersList.map((player, idx) => {
                     const maleFee = player.maleCount * feeMale;
                     const femaleFee = player.femaleCount * feeFemale;
                     const totalFee = maleFee + femaleFee;

                     return (
                        <motion.div
                           key={idx}
                           variants={cardVariants}
                           className={`glass-card rounded-3xl p-4 flex items-center justify-between transition-all border border-white/50 shadow-xs group ${
                              player.isCheckedIn ? "bg-white/95" : "opacity-75"
                           }`}
                        >
                           <div className="flex items-center gap-3.5 min-w-0">
                              {/* Checkbox */}
                              <button
                                 onClick={() => handleCheckboxClick(idx)}
                                 className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 shadow-sm border transition-all cursor-pointer ${
                                    player.isCheckedIn ? "bg-[#7b41b4] border-[#7b41b4] text-white" : "bg-white border-gray-200 text-transparent"
                                 }`}
                              >
                                 <Check size={14} strokeWidth={3} />
                              </button>

                              {/* Circular Avatar */}
                              <div
                                 onClick={() => onEditPlayer(idx)}
                                 className={`w-11 h-11 rounded-full flex items-center justify-center font-sans text-base font-extrabold border shrink-0 cursor-pointer transition-colors ${
                                    idx % 2 === 0 ? "bg-purple-50 text-[#7b41b4] border-purple-100" : "bg-pink-50 text-[#a93349] border-pink-100"
                                 }`}
                              >
                                 {player.name.charAt(0).toUpperCase()}
                              </div>

                              <div className="min-w-0 cursor-pointer" onClick={() => onEditPlayer(idx)}>
                                 <h3 className="font-sans text-[14px] font-extrabold text-gray-800 pr-2 leading-none mb-1 truncate">{player.name}</h3>
                                 <p className="font-sans text-[10px] font-bold text-gray-400 flex items-center">
                                    <Users size={10} className="mr-0.5" />
                                    {player.maleCount > 0 && `${player.maleCount} Nam`}
                                    {player.maleCount > 0 && player.femaleCount > 0 && ", "}
                                    {player.femaleCount > 0 && `${player.femaleCount} Nữ`}
                                 </p>
                              </div>
                           </div>

                           {/* Price & payment state */}
                           <div className="flex flex-col items-end gap-1.5 shrink-0">
                              <span className="font-sans text-sm font-extrabold text-gray-800">{totalFee.toLocaleString("vi-VN")}đ</span>

                              <div className="flex items-center gap-1.5">
                                 {player.isCheckedIn ? (
                                    player.isPaid ? (
                                       <span
                                          onClick={() => handleOpenPaymentStatusEdit(idx)}
                                          className={`px-2 py-0.5 rounded-full font-sans text-[9px] font-extrabold uppercase tracking-wider cursor-pointer ${
                                             player.paymentMethod === "cash"
                                                ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                                : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                                          }`}
                                       >
                                          {player.paymentMethod === "cash" ? "Tiền mặt" : "Chuyển khoản"}
                                       </span>
                                    ) : (
                                       <span
                                          onClick={() => handleOpenPaymentStatusEdit(idx)}
                                          className="px-2 py-0.5 bg-red-50 text-red-500 rounded-full font-sans text-[9px] font-extrabold uppercase tracking-wider cursor-pointer hover:bg-red-100"
                                       >
                                          Nợ phí
                                       </span>
                                    )
                                 ) : (
                                    <span
                                       onClick={() => handleCheckboxClick(idx)}
                                       className="px-2 py-0.5 bg-gray-100 text-gray-400 rounded-full font-sans text-[9px] font-bold uppercase tracking-wide cursor-pointer hover:bg-gray-200"
                                    >
                                       Chưa chọn
                                    </span>
                                 )}

                                 <button
                                    onClick={() => onEditPlayer(idx)}
                                    className="text-gray-300 hover:text-purple-600 p-0.5 rounded-md hover:bg-purple-50/50 transition-colors cursor-pointer"
                                    title="Sửa"
                                 >
                                    <Pencil size={13} strokeWidth={2.5} className="w-3.5 h-3.5" />
                                 </button>

                                 <Popconfirm
                                    title="Xác nhận xóa?"
                                    onConfirm={() => onDeletePlayer(idx)}
                                    okText="Xóa"
                                    cancelText="Hủy"
                                    okButtonProps={{ danger: true, size: "small" }}
                                    cancelButtonProps={{ size: "small" }}
                                 >
                                    <button
                                       className="text-gray-300 hover:text-rose-500 p-0.5 rounded-md hover:bg-rose-50/50 transition-colors cursor-pointer"
                                       title="Xóa"
                                    >
                                       <Trash2 size={13} strokeWidth={2.5} className="w-3.5 h-3.5" />
                                    </button>
                                 </Popconfirm>
                              </div>
                           </div>
                        </motion.div>
                     );
                  })}
               </motion.div>
            )}
         </div>

         {/* Warning note if not checked all */}
         {!allPlayersChecked && playersList.length > 0 && (
            <div className="px-1 text-[10px] font-bold text-rose-500 uppercase tracking-wide text-center">
               ⚠️ Vui lòng tick chọn trạng thái thanh toán cho tất cả người chơi để tiếp tục
            </div>
         )}

         {/* Sticky Bottom Actions */}
         <div className="pt-4 flex items-center justify-between gap-4">
            <div className="flex flex-col select-none">
               <span className="font-sans text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none">Tham gia:</span>
               <span className="font-sans text-base font-extrabold text-[#7b41b4] mt-1 leading-none">
                  {selectedPlayersCount}/{totalPlayersCount} khách
               </span>
            </div>
            <button
               onClick={onNext}
               disabled={isPending || !allPlayersChecked}
               className={`h-12 px-6 rounded-xl font-sans text-xs font-bold flex items-center transition-all select-none ${
                  allPlayersChecked
                     ? "bg-linear-to-r from-[#c185fd] to-[#7b41b4] text-white shadow-md shadow-[#7b41b4]/20 hover:opacity-90 active:scale-98 cursor-pointer"
                     : "bg-gray-200 text-gray-400 cursor-not-allowed"
               }`}
            >
               {isPending ? "Đang lưu..." : "Tiếp tục"}
               <ChevronRight size={14} strokeWidth={2.5} className="ml-1" />
            </button>
         </div>

         {/* QR CODE PAYMENT POP-UP MODAL */}
         <Modal
            title={<div className="font-sans font-extrabold text-gray-800 text-sm select-none">Mã QR Thanh Toán</div>}
            open={isQrOpen}
            onCancel={() => setIsQrOpen(false)}
            footer={null}
            centered
            styles={{ body: { borderRadius: 24 } }}
            className="rounded-3xl overflow-hidden shadow-glass"
         >
            <div className="flex flex-col items-center justify-center p-6 space-y-4 font-sans select-none">
               <div className="p-3 bg-purple-50 rounded-3xl border border-purple-100/50 shadow-xs">
                  <Image preview={false} src={QRBanking} />
               </div>
               <div className="text-center space-y-1">
                  <p className="text-xs font-extrabold text-[#7b41b4] uppercase tracking-wider">Mã QR Chuyển Khoản Nhanh</p>
                  <p className="text-[11px] font-semibold text-gray-400 max-w-60 leading-relaxed mx-auto">
                     Người chơi vãng lai quét mã QR này để thanh toán phí tham gia nhanh chóng cho Host.
                  </p>
               </div>
            </div>
         </Modal>

         {/* PAYMENT STATUS CONFIRMATION MODAL */}
         <Modal
            title={
               <div className="font-sans font-extrabold text-gray-800 text-sm select-none">
                  {paymentModalIdx !== null ? `Thanh toán: ${playersList[paymentModalIdx].name}` : "Chọn thanh toán"}
               </div>
            }
            open={paymentModalIdx !== null}
            onCancel={() => setPaymentModalIdx(null)}
            footer={[
               <Button key="cancel" size="large" className="rounded-xl font-sans font-bold" onClick={() => setPaymentModalIdx(null)}>
                  Hủy
               </Button>,
               <Button
                  key="ok"
                  type="primary"
                  size="large"
                  className="rounded-xl font-sans font-bold bg-linear-to-r! from-[#c185fd] to-[#7b41b4]"
                  onClick={handleConfirmPayment}
               >
                  Xác nhận
               </Button>,
            ]}
            centered
            className="rounded-3xl overflow-hidden"
         >
            <div className="py-4 space-y-4 font-sans select-none">
               <div className="space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block px-0.5">Trạng thái đóng phí</span>

                  <Radio.Group value={localIsPaid} onChange={(e) => setLocalIsPaid(e.target.value)} className="w-full grid grid-cols-2 gap-2">
                     <Radio.Button
                        value={false}
                        className="h-11 rounded-xl rounded-tr-none rounded-br-none text-center leading-10.5 font-bold text-xs cursor-pointer"
                     >
                        Nợ phí
                     </Radio.Button>
                     <Radio.Button
                        value={true}
                        className="h-11 rounded-xl rounded-tl-none rounded-bl-none text-center leading-10.5 font-bold text-xs cursor-pointer"
                     >
                        Đã đóng
                     </Radio.Button>
                  </Radio.Group>
               </div>

               {localIsPaid && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                     <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block px-0.5">Hình thức thanh toán</span>

                     <Radio.Group
                        value={localPaymentMethod}
                        onChange={(e) => setLocalPaymentMethod(e.target.value)}
                        className="w-full grid grid-cols-2 gap-2"
                     >
                        <Radio.Button
                           value="cash"
                           className="h-11 rounded-xl rounded-tr-none rounded-br-none text-center leading-10.5 font-bold text-xs cursor-pointer"
                        >
                           Tiền mặt
                        </Radio.Button>
                        <Radio.Button
                           value="transfer"
                           className="h-11 rounded-xl rounded-tl-none rounded-bl-none text-center leading-10.5 font-bold text-xs cursor-pointer"
                        >
                           Chuyển khoản
                        </Radio.Button>
                     </Radio.Group>
                  </motion.div>
               )}
            </div>
         </Modal>
      </motion.div>
   );
};

export default StepPlayerList;
