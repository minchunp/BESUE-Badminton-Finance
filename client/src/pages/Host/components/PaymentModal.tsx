/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Modal, ConfigProvider, theme } from "antd";
import { Zap, Users, Check, X, Banknote, Building2, AlertCircle } from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";
import type { IPlayer, IPersonPayment } from "../../../api/services/session.api";
import { expandPlayers, initIndividualPayments, deriveGroupPaymentStatus } from "../../../utils/playerUtils";

interface PaymentModalProps {
   player: IPlayer | null;
   playerIdx: number | null;
   onConfirm: (playerIdx: number, payments: IPersonPayment[]) => void;
   onClose: () => void;
   feeMale: number;
   feeFemale: number;
}

type PaymentMode = "group" | "individual";

// ── Apple-style segmented toggle (Paid / Unpaid) ──────────────────
const PayStatusToggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
   <div className="flex p-0.75 rounded-[14px] gap-0.75" style={{ background: "var(--toggle-bg)" }}>
      {[
         { val: false, label: "Nợ phí", active: "bg-[#FF375F]" },
         { val: true, label: "Đã đóng", active: "bg-[#30D158]" },
      ].map(({ val, label, active }) => (
         <button
            key={String(val)}
            type="button"
            onClick={() => onChange(val)}
            className={`flex-1 py-2 rounded-[11px] text-xs font-black transition-all duration-200 cursor-pointer border-none outline-none ${
               value === val ? `${active} text-white shadow-sm` : "bg-transparent text-black/35 dark:text-white/35"
            }`}
         >
            {label}
         </button>
      ))}
   </div>
);

// ── Apple-style method toggle (Cash / Transfer) ───────────────────
const MethodToggle = ({ value, onChange }: { value: "cash" | "transfer"; onChange: (v: "cash" | "transfer") => void }) => (
   <div className="flex p-0.75 rounded-[14px] gap-0.75" style={{ background: "var(--toggle-bg)" }}>
      {[
         { val: "cash" as const, label: "Tiền mặt", icon: <Banknote size={12} strokeWidth={2.5} />, active: "bg-[#30D158]" },
         { val: "transfer" as const, label: "Chuyển khoản", icon: <Building2 size={12} strokeWidth={2.5} />, active: "bg-[#0A84FF]" },
      ].map(({ val, label, icon, active }) => (
         <button
            key={val}
            type="button"
            onClick={() => onChange(val)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[11px] text-xs font-black transition-all duration-200 cursor-pointer border-none outline-none ${
               value === val ? `${active} text-white shadow-sm` : "bg-transparent text-black/35 dark:text-white/35"
            }`}
         >
            {icon}
            {label}
         </button>
      ))}
   </div>
);

// ── Main Component ────────────────────────────────────────────────
const PaymentModal = ({ player, playerIdx, onConfirm, onClose, feeMale, feeFemale }: PaymentModalProps) => {
   const { isDarkMode } = useTheme();
   const [mode, setMode] = useState<PaymentMode>("group");
   const [groupIsPaid, setGroupIsPaid] = useState(false);
   const [groupMethod, setGroupMethod] = useState<"cash" | "transfer">("cash");
   const [perPersonPayments, setPerPersonPayments] = useState<IPersonPayment[]>([]);

   useEffect(() => {
      if (!player) return;
      setMode("group");
      const existing = player.individualPayments ?? [];
      const total = player.maleCount + player.femaleCount;
      const seeded = existing.length === total ? existing.map((p) => ({ ...p })) : initIndividualPayments(player.maleCount, player.femaleCount);
      setPerPersonPayments(seeded);
      setGroupIsPaid(player.isPaid ?? false);
      setGroupMethod(player.paymentMethod ?? "cash");
   }, [player]);

   if (!player || playerIdx === null) return null;

   const total = player.maleCount + player.femaleCount;
   const isMultiple = total > 1;
   const expanded = expandPlayers([player]);

   const buildFinalPayments = useCallback((): IPersonPayment[] => {
      if (mode === "group") {
         return Array(total)
            .fill(null)
            .map(() => ({ isPaid: groupIsPaid, paymentMethod: groupIsPaid ? groupMethod : undefined }));
      }
      return perPersonPayments.map((p) => ({
         isPaid: p.isPaid,
         paymentMethod: p.isPaid ? (p.paymentMethod ?? "cash") : undefined,
      }));
   }, [mode, total, groupIsPaid, groupMethod, perPersonPayments]);

   const handleConfirm = useCallback(() => {
      onConfirm(playerIdx!, buildFinalPayments());
      onClose();
   }, [playerIdx, buildFinalPayments, onConfirm, onClose]);

   const updatePersonPayment = useCallback((personIdx: number, patch: Partial<IPersonPayment>) => {
      setPerPersonPayments((prev) => prev.map((p, i) => (i === personIdx ? { ...p, ...patch } : p)));
   }, []);

   const { isPaid: derivedPaid } = useMemo(
      () => deriveGroupPaymentStatus(mode === "individual" ? perPersonPayments : buildFinalPayments()),
      [mode, perPersonPayments, buildFinalPayments],
   );
   const paidInIndividual = useMemo(() => perPersonPayments.filter((p) => p.isPaid).length, [perPersonPayments]);

   const totalGroupFee = player.maleCount * feeMale + player.femaleCount * feeFemale;

   const paidAmount = useMemo(() => {
      if (mode === "group") return groupIsPaid ? totalGroupFee : 0;
      return perPersonPayments.reduce((acc, p, i) => {
         if (!p.isPaid) return acc;
         const person = expanded[i];
         return acc + (person?.gender === "male" ? feeMale : feeFemale);
      }, 0);
   }, [mode, groupIsPaid, totalGroupFee, perPersonPayments, expanded, feeMale, feeFemale]);

   const isConfirmDisabled = useMemo(
      () => !derivedPaid && mode === "group" && !groupIsPaid && paidInIndividual === 0,
      [derivedPaid, mode, groupIsPaid, paidInIndividual],
   );

   // Avatar color based on name
   const avatarColors = ["#0A84FF", "#30D158", "#FF9F0A", "#FF375F", "#BF5AF2", "#5AC8FA"];
   const avatarColor = avatarColors[player.name.charCodeAt(0) % avatarColors.length];

   const bg = isDarkMode ? "#1C1C1E" : "#ffffff";
   const bgBody = isDarkMode ? "#000000" : "#F2F2F7";
   const border = isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";

   return (
      <ConfigProvider
         theme={{
            algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
            token: { colorPrimary: "#0A84FF", borderRadius: 28 },
         }}
      >
         <Modal
            open={!!player}
            onCancel={onClose}
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
            <div
               className="font-sans select-none"
               style={{ "--toggle-bg": isDarkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)" } as React.CSSProperties}
            >
               {/* ── HEADER ───────────────────────────────────────── */}
               <div style={{ marginBottom: 20, borderBottom: `1px solid ${border}`, background: bg }}>
                  {/* Avatar + Name + Close */}
                  <div className="flex items-center justify-between mb-3">
                     <div className="flex items-center gap-3">
                        <div
                           style={{
                              width: 46,
                              height: 46,
                              borderRadius: 16,
                              background: avatarColor,
                              boxShadow: `0 4px 14px ${avatarColor}50`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 18,
                              fontWeight: 900,
                              color: "#fff",
                              flexShrink: 0,
                           }}
                        >
                           {player.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                           <p className="text-[16px] font-black text-black dark:text-white m-0 leading-tight">{player.name}</p>
                           <p className="text-[11px] font-semibold text-black/45 dark:text-white/45 m-0 mt-0.5">
                              {total} người{player.maleCount > 0 && ` · ${player.maleCount} Nam`}
                              {player.femaleCount > 0 && ` · ${player.femaleCount} Nữ`}
                           </p>
                        </div>
                     </div>

                     {/* Close button */}
                     <button
                        type="button"
                        onClick={onClose}
                        className="w-7.5 h-7.5 rounded-full flex items-center justify-center cursor-pointer border-none transition-opacity hover:opacity-70"
                        style={{
                           background: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(60,60,67,0.08)",
                           color: isDarkMode ? "rgba(235,235,245,0.6)" : "rgba(60,60,67,0.6)",
                        }}
                     >
                        <X size={14} strokeWidth={2.5} />
                     </button>
                  </div>

                  {/* Fee pill */}
                  <div
                     className="flex items-center justify-between px-3.5 py-2.5 rounded-[14px] mb-3"
                     style={{ background: isDarkMode ? "rgba(10,132,255,0.12)" : "rgba(10,132,255,0.08)", border: "1px solid rgba(10,132,255,0.2)" }}
                  >
                     <span className="text-[11px] font-bold uppercase tracking-wider text-[#0A84FF]/70">Phí cần thu</span>
                     <span className="text-[15px] font-black text-[#0A84FF]">{totalGroupFee.toLocaleString("vi-VN")}đ</span>
                  </div>

                  {/* Mode toggle */}
                  {isMultiple && (
                     <div
                        className="flex p-0.75 rounded-[14px] gap-0.75"
                        style={{ background: isDarkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)" }}
                     >
                        {(
                           [
                              { key: "group", icon: <Zap size={11} strokeWidth={2.5} />, label: "Đồng loạt" },
                              { key: "individual", icon: <Users size={11} strokeWidth={2.5} />, label: "Riêng lẻ" },
                           ] as const
                        ).map((tab) => (
                           <button
                              key={tab.key}
                              type="button"
                              onClick={() => setMode(tab.key)}
                              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[11px] text-[11px] font-black transition-all duration-200 cursor-pointer border-none outline-none ${
                                 mode === tab.key ? "text-[#0A84FF] shadow-sm" : "bg-transparent text-black/30 dark:text-white/30"
                              }`}
                              style={mode === tab.key ? { background: bg, border: `1px solid ${border}` } : {}}
                           >
                              {tab.icon}
                              {tab.label}
                           </button>
                        ))}
                     </div>
                  )}
               </div>

               {/* ── BODY ─────────────────────────────────────────── */}
               <div style={{ padding: "16px 20px", background: bgBody, maxHeight: "44vh", overflowY: "auto" }}>
                  <AnimatePresence mode="wait">
                     {/* Group mode */}
                     {mode === "group" && (
                        <motion.div
                           key="group"
                           initial={{ opacity: 0, x: -10 }}
                           animate={{ opacity: 1, x: 0 }}
                           exit={{ opacity: 0, x: 10 }}
                           transition={{ duration: 0.18 }}
                           className="space-y-3"
                        >
                           {isMultiple && (
                              <div
                                 className="flex items-center gap-2 px-3 py-2 rounded-xl"
                                 style={{
                                    background: isDarkMode ? "rgba(10,132,255,0.1)" : "rgba(10,132,255,0.07)",
                                    border: "1px solid rgba(10,132,255,0.18)",
                                 }}
                              >
                                 <AlertCircle size={12} color="#0A84FF" strokeWidth={2.5} />
                                 <span className="text-[11px] font-bold text-[#0A84FF]">Áp dụng cho tất cả {total} người</span>
                              </div>
                           )}

                           {/* Status card */}
                           <div className="rounded-[18px] p-3.5" style={{ background: bg, border: `1px solid ${border}` }}>
                              <p className="text-[10px] font-bold text-black/35 dark:text-white/35 uppercase tracking-widest mb-2.5">
                                 Trạng thái thanh toán
                              </p>
                              <PayStatusToggle value={groupIsPaid} onChange={setGroupIsPaid} />
                           </div>

                           {/* Method card */}
                           <AnimatePresence>
                              {groupIsPaid && (
                                 <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.22 }}
                                    style={{ overflow: "hidden" }}
                                 >
                                    <div className="rounded-[18px] p-3.5" style={{ background: bg, border: `1px solid ${border}` }}>
                                       <p className="text-[10px] font-bold text-black/35 dark:text-white/35 uppercase tracking-widest mb-2.5">
                                          Hình thức thanh toán
                                       </p>
                                       <MethodToggle value={groupMethod} onChange={setGroupMethod} />
                                    </div>
                                 </motion.div>
                              )}
                           </AnimatePresence>
                        </motion.div>
                     )}

                     {/* Individual mode */}
                     {mode === "individual" && (
                        <motion.div
                           key="individual"
                           initial={{ opacity: 0, x: 10 }}
                           animate={{ opacity: 1, x: 0 }}
                           exit={{ opacity: 0, x: -10 }}
                           transition={{ duration: 0.18 }}
                           className="space-y-2.5"
                        >
                           {/* Progress */}
                           <div className="flex items-center justify-between mb-1">
                              <span className="text-[11px] font-bold text-black/35 dark:text-white/35 uppercase tracking-wider">
                                 {paidInIndividual}/{total} người đã đóng
                              </span>
                              <span className={`text-[11px] font-black ${paidInIndividual === total ? "text-[#30D158]" : "text-[#FF9F0A]"}`}>
                                 {Math.round((paidInIndividual / total) * 100)}%
                              </span>
                           </div>
                           <div
                              className="h-1 rounded-full overflow-hidden mb-3"
                              style={{ background: isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" }}
                           >
                              <motion.div
                                 animate={{ width: `${(paidInIndividual / total) * 100}%` }}
                                 transition={{ type: "spring", damping: 20, stiffness: 200 }}
                                 className="h-full rounded-full"
                                 style={{ background: paidInIndividual === total ? "#30D158" : "#FF9F0A" }}
                              />
                           </div>

                           {/* Per-person cards */}
                           {expanded.map((person) => {
                              const payment = perPersonPayments[person.personIdx] ?? { isPaid: false };
                              const isMale = person.gender === "male";
                              return (
                                 <div
                                    key={person.personIdx}
                                    className="rounded-[18px] p-3.5 transition-all duration-200"
                                    style={{
                                       background: bg,
                                       border: payment.isPaid ? "1px solid rgba(48,209,88,0.25)" : `1px solid ${border}`,
                                    }}
                                 >
                                    <div className="flex items-center justify-between mb-3">
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
                                             <p className="text-[13px] font-black text-black dark:text-white m-0 leading-tight">
                                                {person.displayName}
                                             </p>
                                             <span className={`text-[10px] font-bold ${isMale ? "text-[#0A84FF]" : "text-[#FF375F]"}`}>
                                                {isMale ? "♂ Nam" : "♀ Nữ"} · {(isMale ? feeMale : feeFemale).toLocaleString("vi-VN")}đ
                                             </span>
                                          </div>
                                       </div>

                                       {payment.isPaid && (
                                          <span
                                             className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black text-[#30D158]"
                                             style={{ background: "rgba(48,209,88,0.1)", border: "1px solid rgba(48,209,88,0.2)" }}
                                          >
                                             <Check size={9} strokeWidth={3} /> Đã đóng
                                          </span>
                                       )}
                                    </div>

                                    <PayStatusToggle value={payment.isPaid} onChange={(v) => updatePersonPayment(person.personIdx, { isPaid: v })} />

                                    <AnimatePresence>
                                       {payment.isPaid && (
                                          <motion.div
                                             initial={{ opacity: 0, height: 0 }}
                                             animate={{ opacity: 1, height: "auto" }}
                                             exit={{ opacity: 0, height: 0 }}
                                             transition={{ duration: 0.2 }}
                                             style={{ overflow: "hidden", marginTop: 10 }}
                                          >
                                             <MethodToggle
                                                value={payment.paymentMethod ?? "cash"}
                                                onChange={(v) => updatePersonPayment(person.personIdx, { paymentMethod: v })}
                                             />
                                          </motion.div>
                                       )}
                                    </AnimatePresence>
                                 </div>
                              );
                           })}
                        </motion.div>
                     )}
                  </AnimatePresence>
               </div>

               {/* ── FOOTER ───────────────────────────────────────── */}
               <div style={{ paddingTop: "10px", marginTop: "20px", background: bg, borderTop: `1px solid ${border}` }}>
                  {/* Amount row */}
                  <div
                     className="flex items-center justify-between px-3.5 py-2.5 rounded-[14px] mb-3.5 transition-all duration-300"
                     style={{
                        background:
                           paidAmount > 0
                              ? isDarkMode
                                 ? "rgba(48,209,88,0.1)"
                                 : "rgba(48,209,88,0.07)"
                              : isDarkMode
                                ? "rgba(255,255,255,0.04)"
                                : "rgba(0,0,0,0.03)",
                        border: paidAmount > 0 ? "1px solid rgba(48,209,88,0.2)" : `1px solid ${border}`,
                     }}
                  >
                     <span className="text-[11px] font-bold text-black/35 dark:text-white/35 uppercase tracking-wider">Đã thu được</span>
                     <div className="flex items-baseline gap-1">
                        <span
                           className={`text-[15px] font-black transition-colors duration-300 ${paidAmount > 0 ? "text-[#30D158]" : "text-black/25 dark:text-white/25"}`}
                        >
                           {paidAmount.toLocaleString("vi-VN")}đ
                        </span>
                        <span className="text-[12px] font-semibold text-black/25 dark:text-white/25">/ {totalGroupFee.toLocaleString("vi-VN")}đ</span>
                     </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2.5">
                     <button
                        type="button"
                        onClick={onClose}
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
                        onClick={handleConfirm}
                        disabled={isConfirmDisabled}
                        className="flex-1 h-12 rounded-2xl text-sm font-black transition-all duration-200 active:scale-[0.97] border-none"
                        style={{
                           background: "#0A84FF",
                           color: "#ffffff",
                           opacity: isConfirmDisabled ? 0.4 : 1,
                           cursor: isConfirmDisabled ? "not-allowed" : "pointer",
                           boxShadow: isConfirmDisabled ? "none" : "0 4px 16px rgba(10,132,255,0.4)",
                        }}
                     >
                        Xác nhận
                     </button>
                  </div>
               </div>
            </div>
         </Modal>
      </ConfigProvider>
   );
};

export default PaymentModal;
