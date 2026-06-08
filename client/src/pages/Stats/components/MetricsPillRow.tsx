import { motion } from "framer-motion";
import { Wallet, TrendingDown, BarChart2 } from "lucide-react";
import type { StatsOverview } from "../types";
import { formatAmountFull } from "../../../utils/playerUtils";

interface MetricsPillRowProps {
   overview: StatsOverview | null;
   isLoading: boolean;
}

const Shimmer = () => (
   <div className="bg-white dark:bg-[#1C1C1E] border border-black/[0.05] dark:border-white/[0.06] shadow-sm rounded-[14px] p-4 flex flex-col gap-2 items-center text-center animate-pulse">
      <div className="w-9 h-9 bg-black/[0.06] dark:bg-white/[0.06] rounded-2xl" />
      <div className="h-3 w-14 bg-black/[0.06] dark:bg-white/[0.06] rounded-full" />
      <div className="h-4 w-16 bg-black/[0.06] dark:bg-white/[0.06] rounded-full" />
   </div>
);

interface PillItem {
   icon: React.ReactNode;
   label: string;
   value: string;
   accent: string;
   bg: string;
}

const MetricsPillRow = ({ overview, isLoading }: MetricsPillRowProps) => {
   if (isLoading) {
      return (
         <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
               <Shimmer key={i} />
            ))}
         </div>
      );
   }

   const pills: PillItem[] = [
      {
         icon: <Wallet size={18} strokeWidth={2} className="text-[#0A84FF]" />,
         label: "Tổng thu",
         value: overview ? formatAmountFull(overview.totalRevenue) : "—",
         accent: "text-[#0A84FF]",
         bg: "bg-[#0A84FF]/12",
      },
      {
         icon: <TrendingDown size={18} strokeWidth={2} className="text-[#FF375F]" />,
         label: "Chi phí",
         value: overview ? formatAmountFull(overview.totalCost) : "—",
         accent: "text-[#FF375F]",
         bg: "bg-[#FF375F]/10",
      },
      {
         icon: <BarChart2 size={18} strokeWidth={2} className="text-[#30D158]" />,
         label: "Biên LN",
         value: overview ? `${overview.profitMargin}%` : "—",
         accent: "text-[#30D158]",
         bg: "bg-[#30D158]/12",
      },
   ];

   return (
      <div className="grid grid-cols-3 gap-3">
         {pills.map((pill, i) => (
            <motion.div
               key={pill.label}
               initial={{ opacity: 0, y: 12 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.07, type: "spring", stiffness: 120, damping: 15 }}
               className="bg-white dark:bg-[#1C1C1E] border border-black/[0.05] dark:border-white/[0.07] rounded-[14px] p-4 flex flex-col gap-2 items-center text-center"
            >
               <div className={`w-9 h-9 ${pill.bg} rounded-2xl flex items-center justify-center`}>{pill.icon}</div>
               <span className="font-sans text-[9px] font-bold text-black/35 dark:text-white/35 uppercase tracking-wider leading-none">{pill.label}</span>
               <span className={`font-sans text-sm font-black leading-none ${pill.accent}`}>{pill.value}</span>
            </motion.div>
         ))}
      </div>
   );
};

export default MetricsPillRow;
