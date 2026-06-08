import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Popconfirm, Modal, Image, ConfigProvider, theme } from "antd";
import { Calendar, Check, Users, ChevronRight, Trash2, Pencil, QrCode, Swords, Plus, Search, X } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";
import type { IPlayer, IPersonPayment } from "../../../api/services/session.api";
import type { StepPlayerListProps } from "../types";
import QRBanking from "../../../assets/imgs/QR.png";
import MatchTrackingTab from "./MatchTrackingTab";
import PaymentModal from "./PaymentModal";
import { expandPlayers, getPaymentBadgeInfo, formatShortDate, getPlayerTotalFee, initIndividualPayments } from "../../../utils/playerUtils";
import type { PaymentBadgeInfo } from "../../../utils/playerUtils";
import { useDebounce } from "../../../hooks/useDebounce";

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
   const base = "px-3 py-1 rounded-full font-sans text-[9px] font-extrabold uppercase tracking-wider cursor-pointer transition-colors";

   if (info.type === "unchecked") {
      return (
         <span onClick={onClick} className={`${base} bg-black/6 dark:bg-white/8 text-black/35 dark:text-white/35 hover:bg-black/10`}>
            Chưa chọn
         </span>
      );
   }
   if (info.type === "unpaid") {
      return (
         <span onClick={onClick} className={`${base} bg-[#FF375F]/10 text-[#FF375F] hover:bg-[#FF375F]/20`}>
            Nợ phí
         </span>
      );
   }
   if (info.type === "partial") {
      return (
         <span onClick={onClick} className={`${base} bg-[#FF9F0A]/12 text-[#FF9F0A] hover:bg-[#FF9F0A]/20`}>
            {info.paidCount}/{info.total} đã đóng
         </span>
      );
   }
   if (info.type === "mixed_method") {
      return (
         <span onClick={onClick} className={`${base} bg-[#0A84FF]/10 text-[#0A84FF] hover:bg-[#0A84FF]/20`}>
            Hỗn hợp
         </span>
      );
   }
   // all_paid
   return (
      <span
         onClick={onClick}
         className={`${base} ${
            info.method === "cash" ? "bg-[#30D158]/12 text-[#30D158] hover:bg-[#30D158]/20" : "bg-[#007AFF]/10 text-[#007AFF] hover:bg-[#007AFF]/20"
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
   setFeeMale,
   setFeeFemale,
   totalPlayersCount,
   totalExpectedRevenue,
   totalCollectedRevenue,
   selectedPlayersCount,
   onAddPlayer,
   onEditPlayer,
   onDeletePlayer,
   onConfirmPayment,
   onTogglePresence,
   onUpdatePlayerNote,
   onUpdateMatches,
   onNext,
   isPending,
}: StepPlayerListProps) => {
   const { isDarkMode } = useTheme();
   const bg = isDarkMode ? "#1C1C1E" : "#ffffff";
   const bgBody = isDarkMode ? "#000000" : "#F2F2F7";
   const border = isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
   const [isQrOpen, setIsQrOpen] = useState(false);
   const [paymentModalPlayer, setPaymentModalPlayer] = useState<IPlayer | null>(null);
   const [paymentModalIdx, setPaymentModalIdx] = useState<number | null>(null);
   const [activeTab, setActiveTab] = useState<TabKey>("players");
   const [isAdjustFeesOpen, setIsAdjustFeesOpen] = useState(false);

   // Search states
   const [searchQuery, setSearchQuery] = useState("");
   const debouncedSearchQuery = useDebounce(searchQuery, 300);

   // Presence modal states
   const [presenceModalPlayer, setPresenceModalPlayer] = useState<IPlayer | null>(null);
   const [presenceModalIdx, setPresenceModalIdx] = useState<number | null>(null);
   const [presenceModalPayments, setPresenceModalPayments] = useState<IPersonPayment[]>([]);

   // handlePresenceClick callback
   const handlePresenceClick = useCallback(
      (idx: number) => {
         const player = playersList[idx];
         if (!player) return;

         const totalCount = player.maleCount + player.femaleCount;
         const payments = [...(player.individualPayments ?? [])];
         if (payments.length < totalCount) {
            const seeded = initIndividualPayments(player.maleCount, player.femaleCount);
            payments.push(...seeded.slice(payments.length));
         }

         if (totalCount === 1) {
            onTogglePresence(idx);
         } else {
            setPresenceModalPlayer(player);
            setPresenceModalIdx(idx);
            setPresenceModalPayments(payments.map((p) => ({ ...p })));
         }
      },
      [playersList, onTogglePresence],
   );

   // Filter playersList for "Danh sách" tab
   const filteredPlayersList = useMemo(() => {
      if (!debouncedSearchQuery.trim()) return playersList;
      const query = debouncedSearchQuery.toLowerCase().trim();
      return playersList.filter((player) => {
         const nameMatch = player.name.toLowerCase().includes(query);
         const noteMatch = player.individualPayments?.some((p) => p.note && p.note.toLowerCase().includes(query)) ?? false;

         const total = player.maleCount + player.femaleCount;
         let friendNameMatch = false;
         for (let i = 0; i < total; i++) {
            const friendName = i === 0 ? player.name : i === 1 ? `Bạn của ${player.name}` : `Bạn của ${player.name} ${i - 1}`;
            if (friendName.toLowerCase().includes(query)) {
               friendNameMatch = true;
               break;
            }
         }

         return nameMatch || noteMatch || friendNameMatch;
      });
   }, [playersList, debouncedSearchQuery]);

   const allPlayersChecked = useMemo(() => playersList.length > 0 && playersList.every((p) => p.isCheckedIn), [playersList]);

   const totalMatchesBadge = useMemo(() => expandPlayers(playersList).reduce((a, p) => a + p.matches, 0), [playersList]);

   /** Open PaymentModal for a player (first time check-in or edit) */
   const openPaymentModal = useCallback(
      (idx: number) => {
         setPaymentModalPlayer(playersList[idx] ?? null);
         setPaymentModalIdx(idx);
      },
      [playersList],
   );

   /** When checkbox is clicked on an already-checked player → uncheck directly */
   const handleCheckboxClick = useCallback(
      (idx: number) => {
         const player = playersList[idx];
         if (!player) return;
         if (player.isCheckedIn) {
            // Reset all payments when unchecking
            onConfirmPayment(
               idx,
               false,
               playersList[idx]!.individualPayments.map(() => ({ isPaid: false })),
            );
         } else {
            openPaymentModal(idx);
         }
      },
      [playersList, onConfirmPayment, openPaymentModal],
   );

   const handlePaymentConfirm = useCallback(
      (playerIdx: number, payments: IPersonPayment[]) => {
         onConfirmPayment(playerIdx, true, payments);
         setPaymentModalPlayer(null);
         setPaymentModalIdx(null);
      },
      [onConfirmPayment],
   );

   const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = useMemo(
      () => [
         { key: "players" as TabKey, label: "Danh sách", icon: <Users size={13} strokeWidth={2.5} /> },
         { key: "matches" as TabKey, label: "Số trận", icon: <Swords size={13} strokeWidth={2.5} /> },
      ],
      [],
   );

   return (
      <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-5">
         {/* Progress bar */}
         <div className="space-y-1.5 px-1">
            <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider text-black/35 dark:text-white/35">
               <span>Bước 2/5</span>
               <span className="text-[#0A84FF]">40%</span>
            </div>
            <div className="h-2 w-full bg-black/6 dark:bg-white/6 rounded-full overflow-hidden">
               <div className="h-full bg-[#0A84FF] w-[40%] rounded-full" />
            </div>
         </div>

         {/* Overview bar */}
         <div className="bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/6 rounded-2xl p-4 flex justify-between items-center">
            <div className="flex items-center gap-2 text-black/55 dark:text-white/55">
               <Calendar size={16} className="text-[#0A84FF]" />
               <span className="font-sans text-[11px] font-extrabold tracking-wide uppercase">
                  {formatShortDate(date)} • {numberOfCourts} sân • {activeShuttle?.name}
               </span>
            </div>
            <button
               onClick={() => setIsAdjustFeesOpen(!isAdjustFeesOpen)}
               className="text-[10px] font-extrabold uppercase tracking-wider text-[#0A84FF] hover:opacity-85 transition-opacity cursor-pointer bg-transparent border-none outline-none select-none"
            >
               {isAdjustFeesOpen ? "Đóng chỉnh phí" : "Chỉnh phí thu"}
            </button>
         </div>

         {/* Fees Adjustment Section */}
         <AnimatePresence>
            {isAdjustFeesOpen && (
               <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/6 rounded-2xl p-4 space-y-3"
               >
                  <p className="font-sans text-[10px] font-black tracking-wide uppercase text-black/45 dark:text-white/45">
                     Điều chỉnh số tiền thu vãng lai
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                     <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-black/35 dark:text-white/35">Nam (đ)</label>
                        <input
                           type="number"
                           value={feeMale}
                           onChange={(e) => setFeeMale(Number(e.target.value))}
                           className="w-full h-10 px-3 rounded-xl bg-black/4 dark:bg-white/4 border border-black/5 dark:border-white/5 text-xs font-bold focus:outline-none focus:border-[#0A84FF] text-black dark:text-white"
                        />
                     </div>
                     <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-black/35 dark:text-white/35">Nữ (đ)</label>
                        <input
                           type="number"
                           value={feeFemale}
                           onChange={(e) => setFeeFemale(Number(e.target.value))}
                           className="w-full h-10 px-3 rounded-xl bg-black/4 dark:bg-white/4 border border-black/5 dark:border-white/5 text-xs font-bold focus:outline-none focus:border-[#0A84FF] text-black dark:text-white"
                        />
                     </div>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>

         {/* Stats bento grid */}
         <div className="grid grid-cols-3 gap-3">
            <div className="bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/6 rounded-[14px] p-3 flex flex-col items-center justify-center text-center">
               <span className="font-sans text-[10px] font-bold text-black/35 dark:text-white/35 uppercase tracking-wider mb-1">Tổng người</span>
               <span className="font-sans text-lg font-extrabold text-[#0A84FF] leading-none">{totalPlayersCount}</span>
            </div>
            <div className="bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/6 rounded-[14px] p-3 flex flex-col items-center justify-center text-center">
               <span className="font-sans text-[10px] font-bold text-black/35 dark:text-white/35 uppercase tracking-wider mb-1">Tổng tiền</span>
               <span className="font-sans text-lg font-extrabold text-[#0A84FF] leading-none">
                  {totalExpectedRevenue > 0 ? `${(totalExpectedRevenue / 1000).toFixed(0)}k` : "0đ"}
               </span>
            </div>
            <div className="bg-[#30D158]/12 border border-[#30D158]/20 rounded-[14px] p-3 flex flex-col items-center justify-center text-center">
               <span className="font-sans text-[10px] font-bold text-[#30D158] uppercase tracking-wider mb-1">Đã thu</span>
               <span className="font-sans text-lg font-extrabold text-[#30D158] leading-none">
                  {totalCollectedRevenue > 0 ? `${(totalCollectedRevenue / 1000).toFixed(0)}k` : "0đ"}
               </span>
            </div>
         </div>

         {/* Checkbox Legend */}
         <div className="flex justify-center gap-4 text-[9px] font-bold uppercase tracking-wider text-black/35 dark:text-white/35 px-1 select-none">
            <span className="flex items-center gap-1">
               <span className="w-2.5 h-2.5 rounded bg-[#30D158]" /> Điểm danh (Có mặt)
            </span>
            <span className="flex items-center gap-1">
               <span className="w-2.5 h-2.5 rounded bg-[#0A84FF]" /> Đóng phí (Thanh toán)
            </span>
         </div>

         {/* Tab Navigation */}
         <div className="flex gap-2 bg-black/4 dark:bg-white/4 p-1 rounded-2xl">
            {tabs.map((tab) => (
               <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-sans text-xs font-extrabold transition-all select-none cursor-pointer ${
                     activeTab === tab.key
                        ? "bg-white dark:bg-[#2C2C2E] text-[#0A84FF] border border-black/5 dark:border-white/6"
                        : "text-black/35 dark:text-white/35 hover:text-black/55 dark:hover:text-white/55"
                  }`}
               >
                  {tab.icon}
                  {tab.label}
                  {tab.key === "matches" && playersList.length > 0 && (
                     <span
                        className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold ${
                           activeTab === "matches" ? "bg-[#0A84FF]/12 text-[#0A84FF]" : "bg-black/6 dark:bg-white/8 text-black/35 dark:text-white/35"
                        }`}
                     >
                        {totalMatchesBadge}
                     </span>
                  )}
               </button>
            ))}
         </div>

         {/* Search Input */}
         <div className="px-1">
            <div className="relative">
               <input
                  type="text"
                  placeholder="Tìm kiếm vãng lai hoặc ghi chú..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-10 pr-10 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/6 text-sm font-semibold focus:outline-none focus:border-[#0A84FF] text-black dark:text-white placeholder-black/25 dark:placeholder-white/25"
               />
               <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/25 dark:text-white/25" />
               {searchQuery && (
                  <button
                     onClick={() => setSearchQuery("")}
                     className="absolute right-3.5 top-1/2 -translate-y-1/2 text-black/35 dark:text-white/35 hover:text-black/55 dark:hover:text-white/55 bg-transparent border-none cursor-pointer flex items-center justify-center p-0.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
                  >
                     <X size={14} strokeWidth={2.5} />
                  </button>
               )}
            </div>
         </div>

         {/* Tab content */}
         <AnimatePresence mode="wait">
            {activeTab === "players" ? (
               <motion.div key="players-tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                  <h2 className="font-sans text-[15px] font-extrabold text-black/55 dark:text-white/55 uppercase tracking-wider px-1">
                     Danh sách khách vãng lai
                  </h2>

                  {playersList.length === 0 ? (
                     <div className="py-12 bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/6 rounded-3xl flex flex-col items-center justify-center">
                        <Users size={32} className="text-black/20 dark:text-white/20 mb-2" />
                        <span className="text-xs font-semibold text-black/35 dark:text-white/35">Chưa có người chơi vãng lai</span>
                        <button
                           onClick={onAddPlayer}
                           className="mt-3 bg-[#0A84FF] text-white px-4 py-2 rounded-xl font-sans text-xs font-bold shadow-sm cursor-pointer"
                        >
                           + Thêm người chơi
                        </button>
                     </div>
                  ) : filteredPlayersList.length === 0 ? (
                     <div className="py-12 bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/6 rounded-3xl flex flex-col items-center justify-center">
                        <Users size={32} className="text-black/20 dark:text-white/20 mb-2" />
                        <span className="text-xs font-semibold text-black/35 dark:text-white/35">Không tìm thấy kết quả phù hợp</span>
                     </div>
                  ) : (
                     <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-3">
                        {filteredPlayersList.map((player) => {
                           const idx = playersList.indexOf(player);
                           if (idx === -1) return null;
                           const totalFee = getPlayerTotalFee(player, feeMale, feeFemale);
                           const badgeInfo = getPaymentBadgeInfo(player);

                           const presentCount = player.individualPayments?.filter((p) => p.isPresent).length ?? 0;
                           const totalCount = player.maleCount + player.femaleCount;

                           return (
                              <motion.div
                                 key={idx}
                                 variants={cardVariants}
                                 className={`bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/6 rounded-2xl p-4 flex items-center justify-between transition-all group ${
                                    player.isCheckedIn ? "" : "opacity-75"
                                 }`}
                              >
                                 <div className="flex items-center gap-2.5 min-w-0">
                                    {/* Check-in Attendance Checkbox */}
                                    <button
                                       onClick={() => handlePresenceClick(idx)}
                                       title={presentCount === totalCount ? "Đã có mặt ở sân" : "Chưa có mặt ở sân"}
                                       className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border transition-all cursor-pointer ${
                                          presentCount === totalCount
                                             ? "bg-[#30D158] border-[#30D158] text-white"
                                             : presentCount > 0
                                               ? "bg-[#30D158]/20 border-[#30D158] text-[#30D158]"
                                               : "bg-white dark:bg-[#2C2C2E] border-black/10 dark:border-white/10 text-transparent"
                                       }`}
                                    >
                                       {presentCount === totalCount ? (
                                          <Check size={14} strokeWidth={3} />
                                       ) : presentCount > 0 ? (
                                          <span className="text-[9px] font-black">
                                             {presentCount}/{totalCount}
                                          </span>
                                       ) : (
                                          <Check size={14} strokeWidth={3} />
                                       )}
                                    </button>

                                    {/* Payment Checkbox */}
                                    <button
                                       onClick={() => handleCheckboxClick(idx)}
                                       title={player.isCheckedIn ? "Đã thanh toán" : "Chưa thanh toán"}
                                       className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border transition-all cursor-pointer ${
                                          player.isCheckedIn
                                             ? "bg-[#0A84FF] border-[#0A84FF] text-white"
                                             : "bg-white dark:bg-[#2C2C2E] border-black/10 dark:border-white/10 text-transparent"
                                       }`}
                                    >
                                       <Check size={14} strokeWidth={3} />
                                    </button>

                                    {/* Name + count */}
                                    <div className="min-w-0 cursor-pointer" onClick={() => onEditPlayer(idx)}>
                                       <h3 className="font-sans text-[14px] font-extrabold text-black dark:text-white pr-2 leading-none mb-1 truncate">
                                          {player.name}
                                       </h3>
                                       <p className="font-sans text-[10px] font-bold text-black/35 dark:text-white/35 flex items-center">
                                          <Users size={10} className="mr-0.5" />
                                          {player.maleCount > 0 && `${player.maleCount} Nam`}
                                          {player.maleCount > 0 && player.femaleCount > 0 && ", "}
                                          {player.femaleCount > 0 && `${player.femaleCount} Nữ`}
                                       </p>
                                    </div>
                                 </div>

                                 {/* Price + badge + actions */}
                                 <div className="flex flex-col items-end gap-2 shrink-0">
                                    <span className="font-sans text-sm font-extrabold text-black dark:text-white">
                                       {totalFee.toLocaleString("vi-VN")}đ
                                    </span>

                                    <div className="flex items-center gap-2.5">
                                       <PaymentBadge
                                          info={badgeInfo}
                                          onClick={() => (player.isCheckedIn ? openPaymentModal(idx) : handleCheckboxClick(idx))}
                                       />

                                       <button
                                          onClick={() => onEditPlayer(idx)}
                                          className="text-black/20 dark:text-white/20 hover:text-[#0A84FF] p-0.5 rounded-md hover:bg-[#0A84FF]/10 transition-colors cursor-pointer"
                                          title="Sửa"
                                       >
                                          <Pencil size={13} strokeWidth={2.5} className="w-4 h-4" />
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
                                             className="text-black/20 dark:text-white/20 hover:text-[#FF375F] p-0.5 rounded-md hover:bg-[#FF375F]/10 transition-colors cursor-pointer"
                                             title="Xóa"
                                          >
                                             <Trash2 size={13} strokeWidth={2.5} className="w-4 h-4" />
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
                     <div className="px-1 text-[10px] font-bold text-[#FF375F] uppercase tracking-wide text-center">
                        ⚠️ Vui lòng tick chọn trạng thái thanh toán cho tất cả người chơi để tiếp tục
                     </div>
                  )}
               </motion.div>
            ) : (
               <motion.div key="matches-tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <MatchTrackingTab
                     playersList={playersList}
                     onUpdateMatches={onUpdateMatches}
                     onUpdateNote={onUpdatePlayerNote}
                     searchQuery={debouncedSearchQuery}
                  />
               </motion.div>
            )}
         </AnimatePresence>

         {/* Floating Add button */}
         <button
            onClick={onAddPlayer}
            aria-label="Thêm người chơi"
            className="fixed bottom-32 right-4 z-60! w-24 h-10 bg-[#30D158] shadow-[0_4px_16px_rgba(48,209,88,0.28)] rounded-full flex items-center justify-center space-x-1 text-white hover:scale-105 active:scale-95 transition-transform select-none cursor-pointer border-none"
         >
            <Plus size={18} strokeWidth={2.5} />
            <span className="font-sans text-xs font-extrabold tracking-wide">Thêm</span>
         </button>

         {/* Floating QR button */}
         <button
            onClick={() => setIsQrOpen(true)}
            aria-label="Hiện mã QR"
            className="fixed bottom-20 right-4 z-60! w-24 h-10 bg-[#0A84FF] shadow-[0_4px_16px_rgba(10,132,255,0.28)] rounded-full flex items-center justify-center space-x-1 text-white hover:scale-105 active:scale-95 transition-transform select-none cursor-pointer border-none"
         >
            <QrCode size={18} strokeWidth={2.5} />
            <span className="font-sans text-xs font-extrabold tracking-wide">QR</span>
         </button>

         {/* Presence Attendance Modal */}
         <ConfigProvider
            theme={{
               algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
               token: { colorPrimary: "#0A84FF", borderRadius: 18 },
            }}
         >
            <Modal
               open={!!presenceModalPlayer}
               onCancel={() => {
                  setPresenceModalPlayer(null);
                  setPresenceModalIdx(null);
               }}
               footer={null}
               centered
               closable={false}
               width={360}
               className="apple-payment-modal"
               wrapClassName="apple-payment-modal-wrap"
               classNames={{ body: "apple-modal-body-inner" }}
               styles={{
                  mask: {
                     backdropFilter: "blur(16px)",
                     WebkitBackdropFilter: "blur(16px)",
                     background: "rgba(0,0,0,0.5)",
                  },
                  body: { padding: 0, background: "transparent" },
               }}
            >
               <div className="font-sans select-none">
                  {/* Header */}
                  <div
                     style={{
                        padding: "10px 0px 15px",
                        borderBottom: `1px solid ${border}`,
                        background: bg,
                     }}
                  >
                     <div className="flex items-center justify-between">
                        <h3 className="text-[16px] font-black text-black dark:text-white m-0 leading-tight">
                           Điểm danh vãng lai: {presenceModalPlayer?.name}
                        </h3>
                        <button
                           type="button"
                           onClick={() => {
                              setPresenceModalPlayer(null);
                              setPresenceModalIdx(null);
                           }}
                           className="w-7.5 h-7.5 rounded-full flex items-center justify-center cursor-pointer border-none transition-opacity hover:opacity-70"
                           style={{
                              background: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(60,60,67,0.08)",
                              color: isDarkMode ? "rgba(235,235,245,0.6)" : "rgba(60,60,67,0.6)",
                           }}
                        >
                           <X size={14} strokeWidth={2.5} />
                        </button>
                     </div>
                  </div>

                  {/* Body */}
                  <div
                     style={{
                        padding: "16px 20px",
                        background: bgBody,
                        maxHeight: "44vh",
                        overflowY: "auto",
                     }}
                     className="space-y-2.5"
                  >
                     {presenceModalPlayer &&
                        expandPlayers([presenceModalPlayer]).map((person) => {
                           const payment = presenceModalPayments[person.personIdx] ?? { isPaid: false, isPresent: false };
                           const isMale = person.gender === "male";
                           return (
                              <div
                                 key={person.personIdx}
                                 className="rounded-xl p-3.5 transition-all duration-200"
                                 style={{
                                    background: bg,
                                    border: payment.isPresent ? "1px solid rgba(48,209,88,0.25)" : `1px solid ${border}`,
                                 }}
                              >
                                 <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                       <div
                                          className="w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-black"
                                          style={{
                                             background: isMale ? "rgba(10,132,255,0.1)" : "rgba(255,55,95,0.1)",
                                             border: `1px solid ${isMale ? "rgba(10,132,255,0.2)" : "rgba(255,55,95,0.2)"}`,
                                             color: isMale ? "#0A84FF" : "#FF375F",
                                          }}
                                       >
                                          {person.displayName.charAt(0).toUpperCase()}
                                       </div>
                                       <div>
                                          <p className="text-[13px] font-black text-black dark:text-white m-0 leading-tight">{person.displayName}</p>
                                          <span className={`text-[10px] font-bold ${isMale ? "text-[#0A84FF]" : "text-[#FF375F]"}`}>
                                             {isMale ? "♂ Nam" : "♀ Nữ"}
                                          </span>
                                          {payment.note && (
                                             <p className="text-[10px] font-medium text-black/45 dark:text-white/45 m-0 mt-0.5">
                                                Ghi chú: {payment.note}
                                             </p>
                                          )}
                                       </div>
                                    </div>

                                    {/* Checkbox for presence */}
                                    <button
                                       type="button"
                                       onClick={() => {
                                          setPresenceModalPayments((prev) =>
                                             prev.map((p, i) => (i === person.personIdx ? { ...p, isPresent: !p.isPresent } : p)),
                                          );
                                       }}
                                       className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
                                          payment.isPresent
                                             ? "bg-[#30D158] border-[#30D158] text-white"
                                             : "bg-white dark:bg-[#2C2C2E] border-black/10 dark:border-white/10 text-transparent hover:border-black/25 dark:hover:border-white/25"
                                       }`}
                                    >
                                       <Check size={14} strokeWidth={3} />
                                    </button>
                                 </div>
                              </div>
                           );
                        })}
                  </div>

                  {/* Footer */}
                  <div
                     style={{
                        padding: "16px 0px 20px",
                        borderTop: `1px solid ${border}`,
                        background: bg,
                     }}
                  >
                     <div className="flex gap-2.5">
                        <button
                           type="button"
                           onClick={() => {
                              setPresenceModalPlayer(null);
                              setPresenceModalIdx(null);
                           }}
                           className="flex-1 h-12 rounded-2xl text-sm font-black transition-opacity hover:opacity-75 active:scale-[0.97] cursor-pointer border-none"
                           style={{
                              background: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(60,60,67,0.08)",
                              color: isDarkMode ? "#ffffff" : "#000000",
                           }}
                        >
                           Hủy
                        </button>
                        <button
                           type="button"
                           onClick={() => {
                              if (presenceModalIdx !== null && presenceModalPayments.length > 0) {
                                 onTogglePresence(presenceModalIdx, presenceModalPayments);
                              }
                              setPresenceModalPlayer(null);
                              setPresenceModalIdx(null);
                           }}
                           className="flex-1 h-12 rounded-2xl text-sm font-black transition-all duration-200 active:scale-[0.97] border-none bg-[#0A84FF] text-white shadow-[0_4px_16px_rgba(10,132,255,0.4)] hover:opacity-90 cursor-pointer"
                        >
                           Xác nhận
                        </button>
                     </div>
                  </div>
               </div>
            </Modal>
         </ConfigProvider>

         {/* Sticky bottom actions */}
         <div className="pt-4 flex items-center justify-between gap-4">
            <div className="flex flex-col select-none">
               <span className="font-sans text-[10px] font-bold text-black/35 dark:text-white/35 uppercase tracking-wider leading-none">
                  Tham gia:
               </span>
               <span className="font-sans text-base font-extrabold text-[#0A84FF] mt-1 leading-none">
                  {selectedPlayersCount}/{totalPlayersCount} khách
               </span>
            </div>
            <button
               onClick={onNext}
               disabled={isPending || !allPlayersChecked}
               className={`h-13 px-6 rounded-2xl font-sans text-xs font-bold flex items-center transition-all select-none ${
                  allPlayersChecked
                     ? "bg-[#0A84FF] text-white hover:opacity-90 active:scale-[0.98] cursor-pointer"
                     : "bg-black/6 dark:bg-white/8 text-black/35 dark:text-white/35 cursor-not-allowed"
               }`}
            >
               {isPending ? "Đang lưu..." : "Tiếp tục"}
               <ChevronRight size={14} strokeWidth={2.5} className="ml-1" />
            </button>
         </div>

         {/* QR Modal */}
         <Modal
            title={<div className="font-sans font-extrabold text-black dark:text-white text-md select-none">Mã QR Thanh Toán</div>}
            open={isQrOpen}
            onCancel={() => setIsQrOpen(false)}
            footer={null}
            centered
            closeIcon={false}
            styles={{ body: { borderRadius: 16 } }}
            className="rounded-[18px] overflow-hidden"
         >
            <div className="flex flex-col items-center justify-center pace-y-4 font-sans select-none">
               <div className="p-3 bg-[#0A84FF]/10 rounded-3xl border border-[#0A84FF]/20">
                  <Image preview={false} src={QRBanking} />
               </div>

               <div className="text-center space-y-1 mt-5">
                  <p className="text-md font-extrabold text-[#0A84FF] uppercase tracking-wider">Mã QR Chuyển Khoản Nhanh</p>
                  <p className="text-[12px] font-semibold text-black/55 dark:text-white/55 max-w-60 leading-relaxed mx-auto">NGUYEN TRAN THUY DU</p>
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
