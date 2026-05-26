/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import * as echarts from "echarts";
import type { CostBreakdown } from "../types";
import { formatAmountFull } from "../../../utils/playerUtils";
import { useTheme } from "../../../contexts/ThemeContext";

interface CostBreakdownCardProps {
   data: CostBreakdown | null;
   isLoading: boolean;
}

const COLORS = ["#7b41b4", "#ffadb5"];

const CostBreakdownCard = ({ data, isLoading }: CostBreakdownCardProps) => {
   const { isDarkMode } = useTheme();
   const chartRef = useRef<HTMLDivElement>(null);
   const chartInstanceRef = useRef<echarts.ECharts | null>(null);

   useEffect(() => {
      if (!chartRef.current || !data || data.total === 0 || isLoading) return;

      // Dispose any existing instance
      if (chartInstanceRef.current) {
         chartInstanceRef.current.dispose();
      }

      const chartInstance = echarts.init(chartRef.current);
      chartInstanceRef.current = chartInstance;

      const chartData = [
         { name: "Tiền sân", value: data.courtCost, pct: data.courtPct },
         { name: "Tiền cầu", value: data.shuttleCost, pct: data.shuttlePct },
      ];

      const option: echarts.EChartsOption = {
         fontFamily: "Inter, sans-serif",
         tooltip: {
            trigger: "item",
            backgroundColor: isDarkMode ? "rgba(24, 24, 27, 0.98)" : "rgba(255, 255, 255, 0.98)",
            borderRadius: 12,
            borderWidth: 1,
            borderColor: isDarkMode ? "#27272a" : "#f3f4f6",
            shadowBlur: 15,
            shadowColor: "rgba(0,0,0,0.05)",
            padding: [8, 10],
            textStyle: {
               fontFamily: "Inter, sans-serif",
               color: isDarkMode ? "#e4e4e7" : "#1f2937",
               fontSize: 11,
            },
            formatter: (params: any) => {
               const item = params.data;
               let html = `<div style="font-family: Inter, sans-serif;">`;
               html += `<div style="font-weight: bold; color: ${isDarkMode ? "#ffffff" : "#4b5563"}; margin-bottom: 2px;">${params.name}</div>`;
               html += `<div style="color: #7b41b4; font-weight: 800; font-size: 12px; margin-bottom: 2px;">${formatAmountFull(params.value)}đ</div>`;
               html += `<div style="color: ${isDarkMode ? "#71717a" : "#9ca3af"}; font-size: 10px;">Tỷ lệ: ${item.pct}%</div>`;
               html += `</div>`;
               return html;
            },
         },
         series: [
            {
               name: "Phân bổ chi phí",
               type: "pie",
               radius: ["65%", "85%"],
               avoidLabelOverlap: false,
               itemStyle: {
                  borderRadius: 6,
                  borderColor: isDarkMode ? "#18181b" : "#fff",
                  borderWidth: 2,
               },
               label: { show: false },
               labelLine: { show: false },
               emphasis: {
                  scale: true,
                  scaleSize: 3,
               },
               color: COLORS,
               data: chartData,
            },
         ],
      };

      chartInstance.setOption(option);

      const handleResize = () => {
         chartInstance.resize();
      };
      window.addEventListener("resize", handleResize);

      return () => {
         chartInstance.dispose();
         window.removeEventListener("resize", handleResize);
      };
   }, [data, isLoading, isDarkMode]);

   if (isLoading) {
      return (
         <div className="glass-card rounded-3xl p-5 animate-pulse space-y-3">
            <div className="h-5 w-40 bg-gray-200 rounded-full" />
            <div className="flex items-center gap-4">
               <div className="w-32 h-32 bg-gray-200 rounded-full" />
               <div className="flex-1 space-y-3">
                  <div className="h-8 bg-gray-100 rounded-xl" />
                  <div className="h-8 bg-gray-100 rounded-xl" />
               </div>
            </div>
         </div>
      );
   }

   if (!data || data.total === 0) return null;

   const chartData = [
      { name: "Tiền sân", value: data.courtCost, pct: data.courtPct },
      { name: "Tiền cầu", value: data.shuttleCost, pct: data.shuttlePct },
   ];

   return (
      <motion.section
         initial={{ opacity: 0, y: 16 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.15, type: "spring", stiffness: 100 }}
         className="glass-card rounded-3xl p-5 space-y-4"
      >
         <div>
            <h3 className="font-sans text-sm font-black text-gray-900">Phân tích chi phí</h3>
            <p className="font-sans text-[10px] font-medium text-gray-400 mt-0.5">Tổng: {formatAmountFull(data.total)}</p>
         </div>

         <div className="flex items-center gap-4">
            {/* Donut Chart with Overlay */}
            <div className="relative w-32 h-32 shrink-0">
               {/* ECharts Canvas Container */}
               <div ref={chartRef} className="w-full h-full" />

               {/* Center absolute HTML labels */}
               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="font-sans text-[10px] font-bold text-gray-400 uppercase tracking-wide">Tổng</span>
                  <span className="font-sans text-xs font-black text-gray-800">{formatAmountFull(data.total)}</span>
               </div>
            </div>

            {/* Legend with motion progress bar */}
            <div className="flex flex-col gap-3 flex-1">
               {chartData.map((item, i) => (
                  <div key={item.name} className="flex flex-col gap-1.5">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                           <span className="font-sans text-[11px] font-bold text-gray-700">{item.name}</span>
                        </div>
                        <span className="font-sans text-[11px] font-black text-gray-900">{item.pct}%</span>
                     </div>
                     {/* Progress bar */}
                     <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                           className="h-full rounded-full"
                           style={{ background: COLORS[i] }}
                           initial={{ width: 0 }}
                           animate={{ width: `${item.pct}%` }}
                           transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                        />
                     </div>
                     <span className="font-sans text-[10px] font-medium text-gray-400">{formatAmountFull(item.value)}</span>
                  </div>
               ))}
            </div>
         </div>
      </motion.section>
   );
};

export default CostBreakdownCard;
