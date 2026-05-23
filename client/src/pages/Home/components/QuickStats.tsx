import { motion } from "framer-motion";
import { Coins, Activity, Package, Clock } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { QuickStatItem } from "../types";

interface QuickStatsProps {
   stats: QuickStatItem[];
}

const iconMap: Record<string, LucideIcon> = {
   revenue: Coins,
   sessions: Activity,
   shuttles: Package,
   hours: Clock,
};

const iconColorMap: Record<string, string> = {
   revenue: "text-amber-500 bg-amber-50",
   sessions: "text-purple-500 bg-purple-50",
   shuttles: "text-blue-500 bg-blue-50",
   hours: "text-rose-500 bg-rose-50",
};

const containerVariants = {
   hidden: { opacity: 0 },
   show: {
      opacity: 1,
      transition: {
         staggerChildren: 0.08,
      },
   },
};

const itemVariants = {
   hidden: { opacity: 0, y: 15 },
   show: {
      opacity: 1,
      y: 0,
      transition: {
         type: "spring" as const,
         stiffness: 100,
         damping: 15,
      },
   },
};

const QuickStats = ({ stats }: QuickStatsProps) => {
   return (
      <motion.section variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-2 gap-4">
         {stats.map((stat) => {
            const IconComponent = iconMap[stat.icon] || Activity;
            const colorClass = iconColorMap[stat.icon] || "text-[#6f5092] bg-purple-50";

            return (
               <motion.div
                  key={stat.id}
                  variants={itemVariants}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="glass-card rounded-2xl p-4 flex flex-col justify-between min-h-26.25 transition-shadow hover:shadow-[0_12px_24px_rgba(216,180,254,0.25)]"
               >
                  <div className="flex items-center gap-2 mb-2">
                     <div className={`p-1.5 rounded-lg ${colorClass} flex items-center justify-center shrink-0`}>
                        <IconComponent size={16} strokeWidth={2.5} />
                     </div>
                     <span className="font-sans text-[11px] font-bold text-gray-500 uppercase tracking-wider">{stat.label}</span>
                  </div>

                  <div className="font-sans text-xl font-extrabold text-[#6f5092] tracking-tight leading-none mt-auto">
                     {typeof stat.value === "number" ? stat.value.toLocaleString("vi-VN") : stat.value}
                     {stat.unit && <span className="text-xs font-semibold text-gray-400 ml-1 lowercase">{stat.unit}</span>}
                  </div>
               </motion.div>
            );
         })}
      </motion.section>
   );
};

export default QuickStats;
