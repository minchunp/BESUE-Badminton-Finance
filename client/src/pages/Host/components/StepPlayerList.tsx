import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Popconfirm, Modal, Image } from "antd";
import { Calendar, Check, Users, ChevronRight, Trash2, Pencil, QrCode, Swords } from "lucide-react";
import type { IPlayer, IPersonPayment } from "../../../api/services/session.api";
import type { StepPlayerListProps } from "../types";
import QRBanking from "../../../assets/imgs/QR.png";
import MatchTrackingTab from "./MatchTrackingTab";
import PaymentModal from "./PaymentModal";
import { expandPlayers, getPaymentBadgeInfo } from "../../../utils/playerUtils";
import type { PaymentBadgeInfo } from "../../../utils/playerUtils";

// ================================================================
// Animation variants
// ================================================================

const containerVariants = {
   hidden: { opacity: 0 },
   show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const cardVariants = {
   hidden: { opacity: 0, y: 15 },
   show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } },
};

type TabKey = "players" | "matches";

// ================================================================
// PaymentBadge — visual chip derived from badge info
// ================================================================

const PaymentBadge = ({ info, onClick }: { info: PaymentBadgeInfo; onClick: () => void }) => {
   const base = "px-2 py-0.5 rounded-full font-sans text-[9px] font-extrabold uppercase tracking-wider cursor-pointer transition-colors";

   if (info.type === "unchecked") {
      return (
         <span onClick={onClick} className={`${base} bg-gray-100 text-gray-400 hover:bg-gray-200`}>
            Chưa chọn
         </span>
      );
   }
   if (info.type === "unpaid") {
      return (
         <span onClick={onClick} className={`${base} bg-red-50 text-red-500 hover:bg-red-100`}>
            Nợ phí
         </span>
      );
   }
   if (info.type === "partial") {
      return (
         <span onClick={onClick} className={`${base} bg-amber-50 text-amber-600 hover:bg-amber-100`}>
            {info.paidCount}/{info.total} đã đóng
         </span>
      );
   }
   if (info.type === "mixed_method") {
      return (
         <span onClick={onClick} className={`${base} bg-purple-50 text-[#7b41b4] hover:bg-purple-100`}>
            Hỗn hợp
         </span>
      );
   }
   // all_paid
   return (
      <span
         onClick={onClick}
         className={`${base} ${
            info.method === "cash" ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : "bg-blue-50 text-blue-600 hover:bg-blue-100"
         }`}
      >
         {info.method === "cash" ? "Tiền mặt" : "Chuyển khoản"}
      </span>
   );
};

// ================================================================
// Main component
// ================================================================

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
   onConfirmPayment,
   onUpdateMatches,
   onNext,
   isPending,
}: StepPlayerListProps) => {
   const [isQrOpen, setIsQrOpen] = useState(false);
   const [paymentModalPlayer, setPaymentModalPlayer] = useState<IPlayer | null>(null);
   const [paymentModalIdx, setPaymentModalIdx] = useState<number | null>(null);
   const [activeTab, setActiveTab] = useState<TabKey>("players");

   const getFormattedDate = (dateStr: string) => {
      try {
         const d = new Date(dateStr);
         const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
         return `${days[d.getDay()]} , ${d.getDate()}/${d.getMonth() + 1}`;
      } catch {
         return dateStr;
      }
   };

   const allPlayersChecked = playersList.length > 0 && playersList.every((p) => p.isCheckedIn);

   /** Open PaymentModal for a player (first time check-in or edit) */
   const openPaymentModal = (idx: number) => {
      setPaymentModalPlayer(playersList[idx]);
      setPaymentModalIdx(idx);
   };

   /** When checkbox is clicked on an already-checked player → uncheck directly */
   const handleCheckboxClick = (idx: number) => {
      const player = playersList[idx];
      if (player.isCheckedIn) {
         // Reset all payments when unchecking
         onConfirmPayment(
            idx,
            false,
            playersList[idx].individualPayments.map(() => ({ isPaid: false })),
         );
      } else {
         openPaymentModal(idx);
      }
   };

   const handlePaymentConfirm = (playerIdx: number, payments: IPersonPayment[]) => {
      onConfirmPayment(playerIdx, true, payments);
      setPaymentModalPlayer(null);
      setPaymentModalIdx(null);
   };

   const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
      { key: "players", label: "Danh sách", icon: <Users size={13} strokeWidth={2.5} /> },
      { key: "matches", label: "Số trận", icon: <Swords size={13} strokeWidth={2.5} /> },
   ];

   const totalMatchesBadge = expandPlayers(playersList).reduce((a, p) => a + p.matches, 0);

   return (
      <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-5">
         {/* Progress bar */}
         <div className="space-y-1.5 px-1">
            <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider text-gray-400">
               <span>Bước 2/5</span>
               <span className="text-[#7b41b4]">40%</span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
               <div className="h-full bg-linear-to-r from-[#c185fd] to-[#ffb2b9] w-[40%] rounded-full" />
            </div>
         </div>

         {/* Overview bar */}
         <div className="glass-card rounded-3xl p-4 flex justify-between items-center shadow-xs border border-white/50 animate-fade-in">
            <div className="flex items-center gap-2 text-gray-500">
               <Calendar size={16} className="text-[#7b41b4]" />
               <span className="font-sans text-[11px] font-extrabold tracking-wide uppercase">
                  {getFormattedDate(date)} • {numberOfCourts} sân • {activeShuttle?.name}
               </span>
            </div>
         </div>

         {/* Stats bento grid */}
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

         {/* Tab Navigation */}
         <div className="flex gap-2 bg-gray-100/70 p-1 rounded-2xl">
            {tabs.map((tab) => (
               <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-sans text-xs font-extrabold transition-all select-none cursor-pointer ${
                     activeTab === tab.key ? "bg-white text-[#7b41b4] shadow-sm border border-purple-100/60" : "text-gray-400 hover:text-gray-600"
                  }`}
               >
                  {tab.icon}
                  {tab.label}
                  {tab.key === "matches" && playersList.length > 0 && (
                     <span
                        className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold ${
                           activeTab === "matches" ? "bg-purple-100 text-[#7b41b4]" : "bg-gray-200 text-gray-400"
                        }`}
                     >
                        {totalMatchesBadge}
                     </span>
                  )}
               </button>
            ))}
         </div>

         {/* Tab content */}
         <AnimatePresence mode="wait">
            {activeTab === "players" ? (
               <motion.div key="players-tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
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
                           const totalFee = player.maleCount * feeMale + player.femaleCount * feeFemale;
                           const badgeInfo = getPaymentBadgeInfo(player);

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
                                          player.isCheckedIn
                                             ? "bg-[#7b41b4] border-[#7b41b4] text-white"
                                             : "bg-white border-gray-200 text-transparent"
                                       }`}
                                    >
                                       <Check size={14} strokeWidth={3} />
                                    </button>

                                    {/* Avatar */}
                                    <div
                                       onClick={() => onEditPlayer(idx)}
                                       className={`w-11 h-11 rounded-full flex items-center justify-center font-sans text-base font-extrabold border shrink-0 cursor-pointer transition-colors ${
                                          idx % 2 === 0
                                             ? "bg-purple-50 text-[#7b41b4] border-purple-100"
                                             : "bg-pink-50 text-[#a93349] border-pink-100"
                                       }`}
                                    >
                                       {player.name.charAt(0).toUpperCase()}
                                    </div>

                                    {/* Name + count */}
                                    <div className="min-w-0 cursor-pointer" onClick={() => onEditPlayer(idx)}>
                                       <h3 className="font-sans text-[14px] font-extrabold text-gray-800 pr-2 leading-none mb-1 truncate">
                                          {player.name}
                                       </h3>
                                       <p className="font-sans text-[10px] font-bold text-gray-400 flex items-center">
                                          <Users size={10} className="mr-0.5" />
                                          {player.maleCount > 0 && `${player.maleCount} Nam`}
                                          {player.maleCount > 0 && player.femaleCount > 0 && ", "}
                                          {player.femaleCount > 0 && `${player.femaleCount} Nữ`}
                                       </p>
                                    </div>
                                 </div>

                                 {/* Price + badge + actions */}
                                 <div className="flex flex-col items-end gap-1.5 shrink-0">
                                    <span className="font-sans text-sm font-extrabold text-gray-800">{totalFee.toLocaleString("vi-VN")}đ</span>

                                    <div className="flex items-center gap-1.5">
                                       <PaymentBadge
                                          info={badgeInfo}
                                          onClick={() => (player.isCheckedIn ? openPaymentModal(idx) : handleCheckboxClick(idx))}
                                       />

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

                  {!allPlayersChecked && playersList.length > 0 && (
                     <div className="px-1 text-[10px] font-bold text-rose-500 uppercase tracking-wide text-center">
                        ⚠️ Vui lòng tick chọn trạng thái thanh toán cho tất cả người chơi để tiếp tục
                     </div>
                  )}
               </motion.div>
            ) : (
               <motion.div key="matches-tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <MatchTrackingTab playersList={playersList} onUpdateMatches={onUpdateMatches} />
               </motion.div>
            )}
         </AnimatePresence>

         {/* Floating QR button */}
         <button
            onClick={() => setIsQrOpen(true)}
            aria-label="Hiện mã QR"
            className="fixed bottom-20 right-4 z-60! bg-linear-to-br from-[#7b41b4] to-[#a93349] shadow-lg rounded-full px-4 py-2.5 flex items-center space-x-1.5 text-white hover:scale-105 active:scale-95 transition-transform border border-white/20 select-none cursor-pointer"
         >
            <QrCode size={18} strokeWidth={2.5} />
            <span className="font-sans text-xs font-extrabold tracking-wide">QR</span>
         </button>

         {/* Sticky bottom actions */}
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

         {/* QR Modal */}
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

         {/* Payment Modal */}
         <PaymentModal
            player={paymentModalPlayer}
            playerIdx={paymentModalIdx}
            onConfirm={handlePaymentConfirm}
            onClose={() => {
               setPaymentModalPlayer(null);
               setPaymentModalIdx(null);
            }}
            feeMale={feeMale}
            feeFemale={feeFemale}
         />
      </motion.div>
   );
};

export default StepPlayerList;
