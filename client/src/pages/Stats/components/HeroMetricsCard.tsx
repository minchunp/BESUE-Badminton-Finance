import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { StatsOverview } from "../types";
import { formatAmountFull } from "../../../utils/playerUtils";

interface HeroMetricsCardProps {
   overview: StatsOverview | null;
   isLoading: boolean;
}

const Shimmer = ({ className }: { className: string }) => (
   <div className={`animate-pulse bg-white/20 rounded-xl ${className}`} />
);

const ChangeBadge = ({ change }: { change: number | null }) => {
   if (change === null) return null;

   const isPositive = change > 0;
   const isZero = change === 0;
   const Icon = isZero ? Minus : isPositive ? TrendingUp : TrendingDown;

   return (
      <div
         className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border"
         style={{
            color: "#FFFFFF",
            background: isZero
               ? "rgba(255,255,255,0.12)"
               : isPositive
                  ? "rgba(48, 209, 88, 0.22)"
                  : "rgba(255, 55, 95, 0.22)",
            borderColor: isZero
               ? "rgba(255,255,255,0.15)"
               : isPositive
                  ? "rgba(48, 209, 88, 0.30)"
                  : "rgba(255, 55, 95, 0.30)",
         }}
      >
         <Icon size={12} strokeWidth={2.5} />
         <span>
            {isPositive ? "+" : ""}
            {change}% so với kỳ trước
         </span>
      </div>
   );
};

const HeroMetricsCard = ({ overview, isLoading }: HeroMetricsCardProps) => {
   const profit = overview?.totalProfit ?? 0;
   const isNegative = profit < 0;

   const bgColor = isNegative ? "#FF375F" : "#1C1C1E";
   const profitColor = isNegative ? "#FFFFFF" : profit > 0 ? "#30D158" : "rgba(255,255,255,0.50)";

   return (
      <motion.section
         initial={{ opacity: 0, y: 16 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ type: "spring", stiffness: 110, damping: 15 }}
         className="relative overflow-hidden rounded-[14px] p-6 border"
         style={{
            background: bgColor,
            borderColor: "rgba(255, 255, 255, 0.08)",
         }}
      >
         {/* Always white text label */}
         <div className="relative z-10 flex flex-col items-center text-center gap-3">
            <p className="font-sans text-[11px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.55)" }}>
               Lợi nhuận ròng
            </p>

            {isLoading ? (
               <Shimmer className="h-12 w-48" />
            ) : (
               <motion.div
                  key={profit}
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="font-sans text-[42px] font-black tracking-tight leading-none"
                  style={{ color: profitColor }}
               >
                  {profit >= 0 ? "+" : ""}
                  {formatAmountFull(profit)}
               </motion.div>
            )}

            {isLoading ? <Shimmer className="h-6 w-36" /> : <ChangeBadge change={overview?.profitChange ?? null} />}
         </div>

         {/* 3 sub-metrics — always white text */}
         {!isLoading && overview && (
            <div className="relative z-10 mt-5 flex justify-center divide-x divide-white/10">
               <div className="flex flex-col items-center gap-0.5 px-5">
                  <span className="font-sans text-[10px] font-semibold uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.45)" }}>
                     Buổi host
                  </span>
                  <span className="font-sans text-[20px] font-black" style={{ color: "#FFFFFF" }}>
                     {overview.sessionCount}
                  </span>
               </div>
               <div className="flex flex-col items-center gap-0.5 px-5 border-l border-white/[0.10]">
                  <span className="font-sans text-[10px] font-semibold uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.45)" }}>
                     Cầu dùng
                  </span>
                  <span className="font-sans text-[20px] font-black" style={{ color: "#FFFFFF" }}>
                     {overview.totalShuttleUsed}
                  </span>
               </div>
               <div className="flex flex-col items-center gap-0.5 px-5 border-l border-white/[0.10]">
                  <span className="font-sans text-[10px] font-semibold uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.45)" }}>
                     Tỷ suất
                  </span>
                  <span className="font-sans text-[20px] font-black" style={{ color: "#FFFFFF" }}>
                     {overview.profitMargin}%
                  </span>
               </div>
            </div>
         )}
      </motion.section>
   );
};

export default HeroMetricsCard;
