import { motion } from "framer-motion";
import { BarChart2, Banknote, CreditCard, Building2 } from "lucide-react";
import { formatAmountFull } from "../../../utils/playerUtils";
import type { StatsOverview } from "../types";

interface InsightsCardProps {
   overview: StatsOverview | null;
   isLoading: boolean;
   periodLabel: string;
}

const InsightsCard = ({ overview, isLoading, periodLabel }: InsightsCardProps) => {
   if (isLoading || !overview) return null;
   if (overview.sessionCount === 0) return null;

   const avgRevenuePerSession = overview.sessionCount > 0 ? Math.round(overview.totalRevenue / overview.sessionCount) : 0;
   const avgProfitPerSession = overview.sessionCount > 0 ? Math.round(overview.totalProfit / overview.sessionCount) : 0;

   const insights: { icon: React.ReactNode; color: string; bg: string; label: string; value: string }[] = [
      {
         icon: <BarChart2 size={15} strokeWidth={2} />,
         color: "text-[#7b41b4]",
         bg: "bg-purple-50",
         label: "TB thu/buổi",
         value: formatAmountFull(avgRevenuePerSession),
      },
      {
         icon: <Building2 size={15} strokeWidth={2} />,
         color: "text-emerald-600",
         bg: "bg-emerald-50",
         label: "TB lợi nhuận/buổi",
         value: formatAmountFull(avgProfitPerSession),
      },
      {
         icon: <Banknote size={15} strokeWidth={2} />,
         color: "text-emerald-600",
         bg: "bg-emerald-50",
         label: "Tiền mặt",
         value: formatAmountFull(overview.totalCash),
      },
      {
         icon: <CreditCard size={15} strokeWidth={2} />,
         color: "text-blue-600",
         bg: "bg-blue-50",
         label: "Chuyển khoản",
         value: formatAmountFull(overview.totalTransfer),
      },
   ];

   return (
      <motion.section
         initial={{ opacity: 0, y: 16 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
         className="glass-card rounded-3xl p-5 space-y-4"
      >
         <div>
            <h3 className="font-sans text-sm font-black text-gray-900">Tổng quan chi tiết</h3>
            <p className="font-sans text-[10px] font-medium text-gray-400 mt-0.5">{periodLabel}</p>
         </div>

         <div className="grid grid-cols-2 gap-3">
            {insights.map((item, i) => (
               <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="bg-gray-50/80 rounded-2xl p-3 border border-gray-100/50"
               >
                  <div className={`w-7 h-7 ${item.bg} rounded-xl flex items-center justify-center ${item.color} mb-2`}>{item.icon}</div>
                  <p className="font-sans text-[9px] font-bold text-gray-400 uppercase tracking-wide leading-none mb-1">{item.label}</p>
                  <p className="font-sans text-sm font-black text-gray-900">{item.value}</p>
               </motion.div>
            ))}
         </div>
      </motion.section>
   );
};

export default InsightsCard;
