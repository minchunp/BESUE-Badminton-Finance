import { motion } from "framer-motion";
import { Wallet, TrendingDown, BarChart2 } from "lucide-react";
import type { StatsOverview } from "../types";
import { formatAmountFull } from "../../../utils/playerUtils";

interface MetricsPillRowProps {
   overview: StatsOverview | null;
   isLoading: boolean;
}

const Shimmer = () => (
   <div className="glass-card rounded-2xl p-4 flex flex-col gap-2 items-center text-center animate-pulse">
      <div className="w-9 h-9 bg-gray-200 rounded-2xl" />
      <div className="h-3 w-14 bg-gray-200 rounded-full" />
      <div className="h-4 w-16 bg-gray-200 rounded-full" />
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
         icon: <Wallet size={18} strokeWidth={2} className="text-[#7b41b4]" />,
         label: "Tổng thu",
         value: overview ? formatAmountFull(overview.totalRevenue) : "—",
         accent: "text-[#7b41b4]",
         bg: "bg-purple-50",
      },
      {
         icon: <TrendingDown size={18} strokeWidth={2} className="text-[#a93349]" />,
         label: "Chi phí",
         value: overview ? formatAmountFull(overview.totalCost) : "—",
         accent: "text-[#a93349]",
         bg: "bg-rose-50",
      },
      {
         icon: <BarChart2 size={18} strokeWidth={2} className="text-emerald-600" />,
         label: "Biên LN",
         value: overview ? `${overview.profitMargin}%` : "—",
         accent: "text-emerald-600",
         bg: "bg-emerald-50",
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
               className="glass-card rounded-2xl p-4 flex flex-col gap-2 items-center text-center"
            >
               <div className={`w-9 h-9 ${pill.bg} rounded-2xl flex items-center justify-center`}>{pill.icon}</div>
               <span className="font-sans text-[9px] font-bold text-gray-400 uppercase tracking-wider leading-none">{pill.label}</span>
               <span className={`font-sans text-sm font-black leading-none ${pill.accent}`}>{pill.value}</span>
            </motion.div>
         ))}
      </div>
   );
};

export default MetricsPillRow;
