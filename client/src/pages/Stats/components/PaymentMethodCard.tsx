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
         <div className="glass-card rounded-3xl p-5 animate-pulse space-y-3">
            <div className="h-5 w-44 bg-gray-200 rounded-full" />
            <div className="h-6 bg-gray-100 rounded-full" />
            <div className="grid grid-cols-2 gap-3">
               <div className="h-16 bg-gray-100 rounded-2xl" />
               <div className="h-16 bg-gray-100 rounded-2xl" />
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
         className="glass-card rounded-3xl p-5 space-y-4"
      >
         <div>
            <h3 className="font-sans text-sm font-black text-gray-900">Phương thức thanh toán</h3>
            <p className="font-sans text-[10px] font-medium text-gray-400 mt-0.5">Tổng thu: {formatAmountFull(total)}</p>
         </div>

         {/* Stacked horizontal bar */}
         <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden flex">
            <motion.div
               className="h-full bg-linear-to-r from-emerald-400 to-emerald-500 rounded-l-full"
               initial={{ width: 0 }}
               animate={{ width: `${cashPct}%` }}
               transition={{ duration: 0.8, ease: "easeOut" }}
            />
            <motion.div
               className="h-full bg-linear-to-r from-blue-400 to-blue-500 rounded-r-full"
               initial={{ width: 0 }}
               animate={{ width: `${transferPct}%` }}
               transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            />
         </div>

         {/* Legend */}
         <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-50/80 rounded-2xl p-3 border border-emerald-100/50">
               <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 bg-emerald-100 rounded-xl flex items-center justify-center">
                     <Banknote size={14} className="text-emerald-600" strokeWidth={2} />
                  </div>
                  <span className="font-sans text-[10px] font-black text-emerald-700 uppercase tracking-wide">Tiền mặt</span>
               </div>
               <p className="font-sans text-sm font-black text-gray-900">{formatAmountFull(totalCash)}</p>
               <p className="font-sans text-[11px] font-bold text-emerald-600">{cashPct}%</p>
            </div>

            <div className="bg-blue-50/80 rounded-2xl p-3 border border-blue-100/50">
               <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 bg-blue-100 rounded-xl flex items-center justify-center">
                     <CreditCard size={14} className="text-blue-600" strokeWidth={2} />
                  </div>
                  <span className="font-sans text-[10px] font-black text-blue-700 uppercase tracking-wide">Chuyển khoản</span>
               </div>
               <p className="font-sans text-sm font-black text-gray-900">{formatAmountFull(totalTransfer)}</p>
               <p className="font-sans text-[11px] font-bold text-blue-600">{transferPct}%</p>
            </div>
         </div>
      </motion.section>
   );
};

export default PaymentMethodCard;
