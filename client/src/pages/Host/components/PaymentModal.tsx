/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Modal, Button } from "antd";
import { Zap, Users, Check, X } from "lucide-react";
import type { IPlayer, IPersonPayment } from "../../../api/services/session.api";
import { expandPlayers, initIndividualPayments, deriveGroupPaymentStatus } from "../../../utils/playerUtils";

// ================================================================
// Types
// ================================================================

interface PaymentModalProps {
   /** null = closed */
   player: IPlayer | null;
   playerIdx: number | null;
   /** Called when user confirms — receives the full updated player object */
   onConfirm: (playerIdx: number, payments: IPersonPayment[]) => void;
   onClose: () => void;
   feeMale: number;
   feeFemale: number;
}

type PaymentMode = "group" | "individual";

// ================================================================
// Sub-components
// ================================================================

const PayStatusToggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
   <div className="flex rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
      <button
         onClick={() => onChange(false)}
         className={`flex-1 py-2 text-xs font-black transition-all cursor-pointer ${
            !value ? "bg-rose-500 text-white shadow-sm" : "text-gray-400 hover:text-gray-600"
         }`}
      >
         Nợ phí
      </button>
      <button
         onClick={() => onChange(true)}
         className={`flex-1 py-2 text-xs font-black transition-all cursor-pointer ${
            value ? "bg-emerald-500 text-white shadow-sm" : "text-gray-400 hover:text-gray-600"
         }`}
      >
         Đã đóng
      </button>
   </div>
);

const MethodToggle = ({ value, onChange }: { value: "cash" | "transfer"; onChange: (v: "cash" | "transfer") => void }) => (
   <div className="flex rounded-xl overflow-hidden border border-gray-200 bg-gray-50 mt-2">
      <button
         onClick={() => onChange("cash")}
         className={`flex-1 py-2 text-xs font-black transition-all cursor-pointer ${
            value === "cash" ? "bg-emerald-500 text-white" : "text-gray-400 hover:text-gray-600"
         }`}
      >
         💵 Tiền mặt
      </button>
      <button
         onClick={() => onChange("transfer")}
         className={`flex-1 py-2 text-xs font-black transition-all cursor-pointer ${
            value === "transfer" ? "bg-blue-500 text-white" : "text-gray-400 hover:text-gray-600"
         }`}
      >
         🏦 Chuyển khoản
      </button>
   </div>
);

// ================================================================
// Main Component
// ================================================================

const PaymentModal = ({ player, playerIdx, onConfirm, onClose, feeMale, feeFemale }: PaymentModalProps) => {
   const [mode, setMode] = useState<PaymentMode>("group");

   // Group-mode state
   const [groupIsPaid, setGroupIsPaid] = useState(false);
   const [groupMethod, setGroupMethod] = useState<"cash" | "transfer">("cash");

   // Individual-mode state: one entry per expanded person
   const [perPersonPayments, setPerPersonPayments] = useState<IPersonPayment[]>([]);

   // When player changes (modal opens), reset state
   useEffect(() => {
      if (!player) return;
      setMode("group");

      const existing = player.individualPayments ?? [];
      const total = player.maleCount + player.femaleCount;

      // Seed individual payments from existing data or init fresh
      const seeded = existing.length === total ? existing.map((p) => ({ ...p })) : initIndividualPayments(player.maleCount, player.femaleCount);
      setPerPersonPayments(seeded);

      // Seed group mode from existing data
      setGroupIsPaid(player.isPaid ?? false);
      setGroupMethod(player.paymentMethod ?? "cash");
   }, [player]);

   if (!player || playerIdx === null) return null;

   const total = player.maleCount + player.femaleCount;
   const isMultiple = total > 1;
   const expanded = expandPlayers([player]);

   // Build final payments array for submission
   const buildFinalPayments = (): IPersonPayment[] => {
      if (mode === "group") {
         return Array(total)
            .fill(null)
            .map(() => ({
               isPaid: groupIsPaid,
               paymentMethod: groupIsPaid ? groupMethod : undefined,
            }));
      }
      return perPersonPayments.map((p) => ({
         isPaid: p.isPaid,
         paymentMethod: p.isPaid ? (p.paymentMethod ?? "cash") : undefined,
      }));
   };

   const handleConfirm = () => {
      onConfirm(playerIdx, buildFinalPayments());
      onClose();
   };

   const updatePersonPayment = (personIdx: number, patch: Partial<IPersonPayment>) => {
      setPerPersonPayments((prev) => prev.map((p, i) => (i === personIdx ? { ...p, ...patch } : p)));
   };

   // Summary line for individual mode
   const { isPaid: derivedPaid } = deriveGroupPaymentStatus(mode === "individual" ? perPersonPayments : buildFinalPayments());
   const paidInIndividual = perPersonPayments.filter((p) => p.isPaid).length;

   // Fee preview
   const totalGroupFee = player.maleCount * feeMale + player.femaleCount * feeFemale;
   const paidAmount =
      mode === "group"
         ? groupIsPaid
            ? totalGroupFee
            : 0
         : perPersonPayments.reduce((acc, p, i) => {
              if (!p.isPaid) return acc;
              const person = expanded[i];
              return acc + (person?.gender === "male" ? feeMale : feeFemale);
           }, 0);

   return (
      <Modal
         open={!!player}
         onCancel={onClose}
         footer={null}
         centered
         closable={false}
         width={360}
         styles={{
            body: { borderRadius: 28, padding: 0, overflow: "hidden" },
         }}
      >
         <div className="font-sans select-none overflow-hidden rounded-[28px]">
            {/* ── Header ───────────────────────────────── */}
            <div className="px-5 pt-5 pb-4 bg-white border-b border-gray-100 relative">
               <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
               >
                  <X size={13} className="text-gray-500" strokeWidth={2.5} />
               </button>
               <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-2xl bg-linear-to-br from-[#c185fd] to-[#7b41b4] flex items-center justify-center font-sans text-base font-black text-white shadow-sm">
                     {player.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                     <p className="font-sans text-[15px] font-black text-gray-900 leading-tight">{player.name}</p>
                     <p className="font-sans text-[10px] font-bold text-gray-400">
                        {total} người · {player.maleCount > 0 && `${player.maleCount} Nam`}
                        {player.maleCount > 0 && player.femaleCount > 0 && ", "}
                        {player.femaleCount > 0 && `${player.femaleCount} Nữ`}
                     </p>
                  </div>
               </div>

               {/* Mode toggle — chỉ hiện khi có nhiều người */}
               {isMultiple && (
                  <div className="flex gap-2 bg-gray-100/80 p-1 rounded-2xl">
                     {(
                        [
                           { key: "group", icon: <Zap size={12} strokeWidth={2.5} />, label: "Đồng loạt" },
                           { key: "individual", icon: <Users size={12} strokeWidth={2.5} />, label: "Riêng lẻ" },
                        ] as const
                     ).map((tab) => (
                        <button
                           key={tab.key}
                           onClick={() => setMode(tab.key)}
                           className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl font-sans text-[11px] font-black transition-all cursor-pointer ${
                              mode === tab.key ? "bg-white text-[#7b41b4] shadow-sm border border-purple-100/60" : "text-gray-400 hover:text-gray-600"
                           }`}
                        >
                           {tab.icon}
                           {tab.label}
                        </button>
                     ))}
                  </div>
               )}
            </div>

            {/* ── Body ─────────────────────────────────── */}
            <div className="px-5 py-4 bg-[#f8f7fb] space-y-4 max-h-[52vh] overflow-y-auto">
               <AnimatePresence mode="wait">
                  {/* ─ Đồng loạt mode ─ */}
                  {mode === "group" && (
                     <motion.div
                        key="group"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="space-y-3"
                     >
                        {isMultiple && (
                           <p className="font-sans text-[10px] font-black text-gray-400 uppercase tracking-widest">
                              Áp dụng cho tất cả {total} người
                           </p>
                        )}
                        <div>
                           <p className="font-sans text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Trạng thái</p>
                           <PayStatusToggle value={groupIsPaid} onChange={setGroupIsPaid} />
                        </div>

                        <AnimatePresence>
                           {groupIsPaid && (
                              <motion.div
                                 initial={{ opacity: 0, height: 0 }}
                                 animate={{ opacity: 1, height: "auto" }}
                                 exit={{ opacity: 0, height: 0 }}
                              >
                                 <p className="font-sans text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Hình thức</p>
                                 <MethodToggle value={groupMethod} onChange={setGroupMethod} />
                              </motion.div>
                           )}
                        </AnimatePresence>
                     </motion.div>
                  )}

                  {/* ─ Riêng lẻ mode ─ */}
                  {mode === "individual" && (
                     <motion.div
                        key="individual"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="space-y-2.5"
                     >
                        <p className="font-sans text-[10px] font-black text-gray-400 uppercase tracking-widest">
                           {paidInIndividual}/{total} người đã đóng
                        </p>

                        {expanded.map((person) => {
                           const payment = perPersonPayments[person.personIdx] ?? { isPaid: false };
                           return (
                              <div
                                 key={person.personIdx}
                                 className={`rounded-2xl p-3.5 border transition-colors ${
                                    payment.isPaid ? "bg-white border-emerald-100" : "bg-white border-gray-100"
                                 }`}
                              >
                                 {/* Person header */}
                                 <div className="flex items-center justify-between mb-2.5">
                                    <div className="flex items-center gap-2">
                                       <div
                                          className={`w-7 h-7 rounded-xl flex items-center justify-center text-[11px] font-black ${
                                             person.gender === "male"
                                                ? "bg-blue-50 text-blue-500 border border-blue-100"
                                                : "bg-rose-50 text-rose-400 border border-rose-100"
                                          }`}
                                       >
                                          {person.displayName.charAt(0).toUpperCase()}
                                       </div>
                                       <div>
                                          <p className="font-sans text-[12px] font-black text-gray-800 leading-none">{person.displayName}</p>
                                          <span
                                             className={`font-sans text-[9px] font-bold uppercase ${
                                                person.gender === "male" ? "text-blue-400" : "text-rose-400"
                                             }`}
                                          >
                                             {person.gender === "male" ? "♂ Nam" : "♀ Nữ"}
                                          </span>
                                       </div>
                                    </div>

                                    {/* Paid indicator */}
                                    {payment.isPaid && (
                                       <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[9px] font-black">
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
                                       >
                                          <MethodToggle
                                             value={payment.paymentMethod ?? "cash"}
                                             onChange={(v) =>
                                                updatePersonPayment(person.personIdx, {
                                                   paymentMethod: v,
                                                })
                                             }
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

            {/* ── Footer ───────────────────────────────── */}
            <div className="px-5 py-4 bg-white border-t border-gray-100">
               {/* Fee preview */}
               <div className="flex justify-between items-center mb-3">
                  <span className="font-sans text-[11px] font-bold text-gray-400 uppercase tracking-wide">Đã thu được</span>
                  <span className={`font-sans text-sm font-black ${paidAmount > 0 ? "text-emerald-500" : "text-gray-400"}`}>
                     {paidAmount.toLocaleString("vi-VN")}đ<span className="text-gray-300 font-bold"> / {totalGroupFee.toLocaleString("vi-VN")}đ</span>
                  </span>
               </div>

               <div className="flex gap-2">
                  <Button size="large" onClick={onClose} className="flex-1 rounded-2xl font-sans font-black text-xs border-gray-200">
                     Hủy
                  </Button>
                  <button
                     onClick={handleConfirm}
                     disabled={!derivedPaid && mode === "group" && !groupIsPaid && paidInIndividual === 0}
                     className="flex-1 h-10 rounded-2xl bg-linear-to-r from-[#c185fd] to-[#7b41b4] text-white font-sans font-black text-xs shadow-md shadow-purple-200 hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     Xác nhận
                  </button>
               </div>
            </div>
         </div>
      </Modal>
   );
};

export default PaymentModal;
