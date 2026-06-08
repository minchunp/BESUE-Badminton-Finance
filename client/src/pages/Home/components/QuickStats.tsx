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

/* Apple Fitness-style activity ring colors */
const iconColorMap: Record<string, { icon: string; dot: string }> = {
   revenue: { icon: "text-[#FF9F0A]", dot: "bg-[#FF9F0A]" }, // Fitness orange
   sessions: { icon: "text-[#0A84FF]", dot: "bg-[#0A84FF]" }, // Fitness blue
   shuttles: { icon: "text-[#30D158]", dot: "bg-[#30D158]" }, // Fitness green
   hours: { icon: "text-[#FF375F]", dot: "bg-[#FF375F]" }, // Fitness red
};

const containerVariants = {
   hidden: { opacity: 0 },
   show: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
   },
};

const itemVariants = {
   hidden: { opacity: 0, y: 10 },
   show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 130, damping: 16 },
   },
};

const QuickStats = ({ stats }: QuickStatsProps) => {
   return (
      <motion.section variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-2 gap-3">
         {stats.map((stat) => {
            const IconComponent = iconMap[stat.icon] || Activity;
            const colors = iconColorMap[stat.icon] || {
               icon: "text-[#0A84FF]",
               dot: "bg-[#0A84FF]",
            };

            return (
               <motion.div
                  key={stat.id}
                  variants={itemVariants}
                  whileTap={{ scale: 0.97 }}
                  className="bg-white dark:bg-[#1C1C1E] rounded-[14px] p-4 flex flex-col justify-between min-h-25 border border-black/5 dark:border-white/[0.07]"
               >
                  {/* Label row with dot indicator */}
                  <div className="flex items-center gap-2 mb-2.5">
                     <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                     <span className="text-[11px] font-semibold text-black/40 dark:text-white/40 uppercase tracking-wider leading-none">
                        {stat.label}
                     </span>
                  </div>

                  {/* Value + Icon row */}
                  <div className="flex items-end justify-between">
                     <div className="text-[22px] font-black tracking-tight leading-none text-black dark:text-white">
                        {typeof stat.value === "number" ? stat.value.toLocaleString("vi-VN") : stat.value}
                        {stat.unit && <span className="text-[11px] font-semibold text-black/30 dark:text-white/30 ml-1">{stat.unit}</span>}
                     </div>
                     <IconComponent size={18} strokeWidth={2} className={`${colors.icon} opacity-60`} />
                  </div>
               </motion.div>
            );
         })}
      </motion.section>
   );
};

export default QuickStats;
