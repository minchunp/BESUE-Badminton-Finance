import { motion } from "framer-motion";
import { Calendar, DollarSign, TrendingUp } from "lucide-react";

interface MonthlyStatsCardProps {
   completedCount: number;
   totalRevenue: number;
   totalProfit: number;
   monthLabel: string;
   formatAmountFull: (val: number) => string;
}

const MonthlyStatsCard = ({ completedCount, totalRevenue, totalProfit, monthLabel, formatAmountFull }: MonthlyStatsCardProps) => {
   return (
      <motion.section
         initial={{ opacity: 0, scale: 0.95 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ type: "spring", stiffness: 100, damping: 15 }}
         className="bg-linear-to-br from-[#7b41b4] to-[#a93349] rounded-3xl p-6 text-white shadow-lg relative overflow-hidden"
      >
         <div className="absolute top-[-30%] right-[-10%] w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
         <div className="absolute bottom-[-20%] left-[-15%] w-40 h-40 bg-[#ffb2b9]/25 rounded-full blur-2xl pointer-events-none" />

         <div className="flex justify-between items-center mb-5 relative z-10">
            <h3 className="font-sans text-sm font-extrabold tracking-wide uppercase opacity-95">Thống kê tháng này</h3>
            <span className="font-sans text-[11px] font-bold bg-white/20 px-3 py-1 rounded-full border border-white/20 backdrop-blur-md">
               {monthLabel}
            </span>
         </div>

         <div className="grid grid-cols-[.7fr_1fr_1fr] gap-2 relative z-10">
            <div className="flex flex-col">
               <span className="font-sans text-[10px] font-bold uppercase tracking-wider opacity-75 mb-1.5 flex items-center gap-1">
                  <Calendar size={10} /> Buổi host
               </span>
               <span className="font-sans text-xl font-extrabold tracking-tight">{completedCount}</span>
            </div>

            <div className="flex flex-col border-l border-white/10 pl-3">
               <span className="font-sans text-[10px] font-bold uppercase tracking-wider opacity-75 mb-1.5 flex items-center gap-1">
                  <DollarSign size={10} /> Tổng thu
               </span>
               <span className="font-sans text-xl font-extrabold tracking-tight">{formatAmountFull(totalRevenue)}</span>
            </div>

            <div className="flex flex-col border-l border-white/10 pl-3">
               <span className="font-sans text-[10px] font-bold uppercase tracking-wider opacity-75 mb-1.5 flex items-center gap-1">
                  <TrendingUp size={10} /> Lợi nhuận
               </span>
               <span className={`font-sans text-xl font-extrabold tracking-tight ${totalProfit > 0 ? "text-emerald-300" : ""}`}>
                  {formatAmountFull(totalProfit)}
               </span>
            </div>
         </div>
      </motion.section>
   );
};

export default MonthlyStatsCard;
