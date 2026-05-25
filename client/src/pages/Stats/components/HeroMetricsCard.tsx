import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { StatsOverview } from "../types";
import { formatAmountFull } from "../../../utils/playerUtils";

interface HeroMetricsCardProps {
   overview: StatsOverview | null;
   isLoading: boolean;
}

// Shimmer placeholder
const Shimmer = ({ className }: { className: string }) => <div className={`animate-pulse bg-white/30 rounded-xl ${className}`} />;

const ChangeBadge = ({ change }: { change: number | null }) => {
   if (change === null) return null;

   const isPositive = change > 0;
   const isZero = change === 0;
   const color = isZero ? "bg-white/20" : isPositive ? "bg-emerald-400/30 border-emerald-300/30" : "bg-rose-400/30 border-rose-300/30";
   const Icon = isZero ? Minus : isPositive ? TrendingUp : TrendingDown;

   return (
      <div className={`flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-bold text-white ${color}`}>
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

   return (
      <motion.section
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ type: "spring", stiffness: 100, damping: 15 }}
         className="relative overflow-hidden rounded-3xl p-6 text-white"
         style={{
            background: isNegative ? "linear-gradient(135deg, #a93349 0%, #7b1a2a 100%)" : "linear-gradient(135deg, #7b41b4 0%, #a93349 100%)",
         }}
      >
         {/* Decorative blobs */}
         <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
         <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none" />

         <div className="relative z-10 flex flex-col items-center text-center gap-3">
            <p className="font-sans text-[11px] font-bold uppercase tracking-widest text-white/70">Lợi nhuận ròng</p>

            {isLoading ? (
               <Shimmer className="h-12 w-48" />
            ) : (
               <motion.div
                  key={profit}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`font-sans text-4xl font-black tracking-tight leading-none ${isNegative ? "text-rose-200" : "text-white"}`}
               >
                  {profit >= 0 ? "+" : ""}
                  {formatAmountFull(profit)}
               </motion.div>
            )}

            {isLoading ? <Shimmer className="h-6 w-36" /> : <ChangeBadge change={overview?.profitChange ?? null} />}
         </div>

         {/* Session count badge */}
         {!isLoading && overview && (
            <div className="relative z-10 mt-5 flex justify-center gap-4">
               <div className="flex flex-col items-center gap-0.5">
                  <span className="font-sans text-xs font-bold text-white/60">Buổi host</span>
                  <span className="font-sans text-lg font-black text-white">{overview.sessionCount}</span>
               </div>
               <div className="w-px bg-white/20" />
               <div className="flex flex-col items-center gap-0.5">
                  <span className="font-sans text-xs font-bold text-white/60">Cầu đã dùng</span>
                  <span className="font-sans text-lg font-black text-white">{overview.totalShuttleUsed}</span>
               </div>
               <div className="w-px bg-white/20" />
               <div className="flex flex-col items-center gap-0.5">
                  <span className="font-sans text-xs font-bold text-white/60">Tỷ suất</span>
                  <span className="font-sans text-lg font-black text-white">{overview.profitMargin}%</span>
               </div>
            </div>
         )}
      </motion.section>
   );
};

export default HeroMetricsCard;
