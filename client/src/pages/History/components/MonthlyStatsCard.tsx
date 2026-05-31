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
   const profitColor = totalProfit >= 0 ? "#30D158" : "#FF375F";

   return (
      <motion.section
         initial={{ opacity: 0, scale: 0.97 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ type: "spring", stiffness: 120, damping: 16 }}
         style={{ background: "#1C1C1E", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "20px", padding: "20px" }}
      >
         {/* Header */}
         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3
               style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.45)",
                  margin: 0,
               }}
            >
               Thống kê tháng
            </h3>
            <span
               style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.45)",
                  background: "rgba(255,255,255,0.08)",
                  padding: "4px 10px",
                  borderRadius: "100px",
               }}
            >
               {monthLabel}
            </span>
         </div>

         {/* Stats — 3 columns */}
         <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
            {/* Sessions count */}
            <div style={{ display: "flex", flexDirection: "column" }}>
               <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "8px" }}>
                  <Calendar size={10} color="#0A84FF" />
                  <span
                     style={{
                        fontSize: "9px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "rgba(255,255,255,0.35)",
                     }}
                  >
                     Buổi host
                  </span>
               </div>
               <span style={{ fontSize: "17px", fontWeight: 900, color: "#FFFFFF", letterSpacing: "-0.02em", lineHeight: 1 }}>{completedCount}</span>
            </div>

            {/* Total revenue */}
            <div style={{ display: "flex", flexDirection: "column", borderLeft: "1px solid rgba(255,255,255,0.08)", paddingLeft: "12px" }}>
               <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "8px" }}>
                  <DollarSign size={10} color="#30D158" />
                  <span
                     style={{
                        fontSize: "9px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "rgba(255,255,255,0.35)",
                     }}
                  >
                     Tổng thu
                  </span>
               </div>
               <span style={{ fontSize: "17px", fontWeight: 900, color: "#FFFFFF", letterSpacing: "-0.02em", lineHeight: 1 }}>
                  {formatAmountFull(totalRevenue)}
               </span>
            </div>

            {/* Profit */}
            <div style={{ display: "flex", flexDirection: "column", borderLeft: "1px solid rgba(255,255,255,0.08)", paddingLeft: "12px" }}>
               <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "8px" }}>
                  <TrendingUp size={10} color={profitColor} />
                  <span
                     style={{
                        fontSize: "9px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "rgba(255,255,255,0.35)",
                     }}
                  >
                     Lợi nhuận
                  </span>
               </div>
               <span style={{ fontSize: "17px", fontWeight: 900, color: profitColor, letterSpacing: "-0.02em", lineHeight: 1 }}>
                  {formatAmountFull(totalProfit)}
               </span>
            </div>
         </div>
      </motion.section>
   );
};

export default MonthlyStatsCard;
