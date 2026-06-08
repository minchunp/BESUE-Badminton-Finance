import { motion } from "framer-motion";
import { Banknote, CreditCard } from "lucide-react";
import { formatAmountFull } from "../../../utils/playerUtils";

interface PaymentMethodCardProps {
   totalCash: number;
   totalTransfer: number;
   isLoading: boolean;
}

const PaymentMethodCard = ({ totalCash, totalTransfer, isLoading }: PaymentMethodCardProps) => {
   if (isLoading) {
      return (
         <div className="bg-white dark:bg-[#1C1C1E] border border-black/[0.05] dark:border-white/[0.06] shadow-sm rounded-[14px] p-5 animate-pulse space-y-3">
            <div className="h-5 w-44 bg-black/[0.06] dark:bg-white/[0.06] rounded-full" />
            <div className="h-6 bg-black/[0.04] dark:bg-white/[0.04] rounded-full" />
            <div className="grid grid-cols-2 gap-3">
               <div className="h-16 bg-black/[0.04] dark:bg-white/[0.04] rounded-2xl" />
               <div className="h-16 bg-black/[0.04] dark:bg-white/[0.04] rounded-2xl" />
            </div>
         </div>
      );
   }

   const total = totalCash + totalTransfer;
   if (total === 0) return null;

   const cashPct = Math.round((totalCash / total) * 100);
   const transferPct = 100 - cashPct;

   return (
      <motion.section
         initial={{ opacity: 0, y: 16 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
         className="bg-white dark:bg-[#1C1C1E] border border-black/[0.05] dark:border-white/[0.07] rounded-[14px] p-5 space-y-4"
      >
         <div>
            <h3 className="font-sans text-sm font-black text-black dark:text-white">Phương thức thanh toán</h3>
            <p className="font-sans text-[10px] font-medium text-black/55 dark:text-white/55 mt-0.5">Tổng thu: {formatAmountFull(total)}</p>
         </div>

         {/* Stacked horizontal bar */}
         <div className="h-4 w-full bg-black/[0.06] dark:bg-white/[0.06] rounded-full overflow-hidden flex">
            <motion.div
               className="h-full bg-[#34C759] rounded-l-full"
               initial={{ width: 0 }}
               animate={{ width: `${cashPct}%` }}
               transition={{ duration: 0.8, ease: "easeOut" }}
            />
            <motion.div
               className="h-full bg-[#007AFF] rounded-r-full"
               initial={{ width: 0 }}
               animate={{ width: `${transferPct}%` }}
               transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            />
         </div>

         {/* Legend */}
         <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#34C759]/12 rounded-2xl p-3 border border-[#34C759]/20">
               <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 bg-[#34C759]/20 rounded-xl flex items-center justify-center">
                     <Banknote size={14} className="text-[#34C759]" strokeWidth={2} />
                  </div>
                  <span className="font-sans text-[10px] font-black text-[#34C759] uppercase tracking-wide">Tiền mặt</span>
               </div>
               <p className="font-sans text-sm font-black text-black dark:text-white">{formatAmountFull(totalCash)}</p>
               <p className="font-sans text-[11px] font-bold text-[#34C759]">{cashPct}%</p>
            </div>

            <div className="bg-[#007AFF]/10 rounded-2xl p-3 border border-[#007AFF]/20">
               <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 bg-[#007AFF]/15 rounded-xl flex items-center justify-center">
                     <CreditCard size={14} className="text-[#007AFF]" strokeWidth={2} />
                  </div>
                  <span className="font-sans text-[10px] font-black text-[#007AFF] uppercase tracking-wide">Chuyển khoản</span>
               </div>
               <p className="font-sans text-sm font-black text-black dark:text-white">{formatAmountFull(totalTransfer)}</p>
               <p className="font-sans text-[11px] font-bold text-[#007AFF]">{transferPct}%</p>
            </div>
         </div>
      </motion.section>
   );
};

export default PaymentMethodCard;
