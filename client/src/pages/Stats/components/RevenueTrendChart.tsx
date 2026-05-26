/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import * as echarts from "echarts";
import type { RevenueTrendPoint, StatPeriod } from "../types";
import { formatAmountFull } from "../../../utils/playerUtils";
import dayjs from "dayjs";
import { useTheme } from "../../../contexts/ThemeContext";

interface RevenueTrendChartProps {
   data: RevenueTrendPoint[];
   isLoading: boolean;
   period: StatPeriod;
}

// Format x-axis labels based on date string format
const formatXLabel = (dateStr: string, period: StatPeriod): string => {
   if (!dateStr) return "";
   try {
      const d = dayjs(dateStr);
      if (period === "1y") return d.format("M/YYYY");
      if (period === "3m") return d.format("DD/MM");
      return d.format("DD/MM");
   } catch {
      return dateStr;
   }
};

// Format VND amounts for y-axis
const formatVND = (value: number): string => {
   if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
   if (value >= 1_000) return `${(value / 1_000).toFixed(0)}k`;
   return `${value}`;
};

const ShimmerChart = () => (
   <div className="h-56 bg-gray-50 rounded-2xl animate-pulse flex items-end px-4 pb-4 gap-2">
      {[60, 40, 80, 55, 90, 70, 85, 50, 75, 65].map((h, i) => (
         <div key={i} className="flex-1 bg-gray-200 rounded-t-lg" style={{ height: `${h}%` }} />
      ))}
   </div>
);

const RevenueTrendChart = ({ data, isLoading, period }: RevenueTrendChartProps) => {
   const { isDarkMode } = useTheme();
   const chartRef = useRef<HTMLDivElement>(null);
   const chartInstanceRef = useRef<echarts.ECharts | null>(null);

   useEffect(() => {
      if (!chartRef.current || !data.length || isLoading) return;

      // Dispose any existing instance to avoid duplicate bindings
      if (chartInstanceRef.current) {
         chartInstanceRef.current.dispose();
      }

      const chartInstance = echarts.init(chartRef.current);
      chartInstanceRef.current = chartInstance;

      const labels = data.map((d) => formatXLabel(d.date, period));
      const revenues = data.map((d) => d.revenue);
      const costs = data.map((d) => d.cost);

      const option: echarts.EChartsOption = {
         fontFamily: "Inter, sans-serif",
         grid: {
            top: 25,
            right: 10,
            bottom: 25,
            left: 45,
            containLabel: false,
         },
         tooltip: {
            trigger: "axis",
            backgroundColor: isDarkMode ? "rgba(24, 24, 27, 0.98)" : "rgba(255, 255, 255, 0.98)",
            borderRadius: 16,
            borderWidth: 1,
            borderColor: isDarkMode ? "#27272a" : "#f3f4f6",
            shadowBlur: 20,
            shadowColor: "rgba(0,0,0,0.06)",
            padding: [10, 12],
            textStyle: {
               fontFamily: "Inter, sans-serif",
               color: isDarkMode ? "#e4e4e7" : "#1f2937",
               fontSize: 11,
            },
            formatter: (params: any) => {
               if (!params || !params.length) return "";
               const label = params[0].axisValue;
               let html = `<div style="font-family: Inter, sans-serif; min-width: 130px;">`;
               html += `<div style="font-size: 10px; font-weight: bold; color: ${isDarkMode ? "#71717a" : "#9ca3af"}; text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.05em;">${label}</div>`;
               params.forEach((param: any) => {
                  const color = param.color;
                  const name = param.seriesName;
                  const value = param.value;
                  html += `<div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 4px;">`;
                  html += `  <div style="display: flex; align-items: center; gap: 6px;">`;
                  html += `    <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${color};"></span>`;
                  html += `    <span style="font-size: 11px; font-weight: 600; color: ${isDarkMode ? "#e4e4e7" : "#4b5563"};">${name}</span>`;
                  html += `  </div>`;
                  html += `  <span style="font-size: 11px; font-weight: 800; color: ${isDarkMode ? "#ffffff" : "#111827"};">${formatAmountFull(value)}đ</span>`;
                  html += `</div>`;
               });
               html += `</div>`;
               return html;
            },
         },
         xAxis: {
            type: "category",
            data: labels,
            boundaryGap: false,
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: {
               fontFamily: "Inter, sans-serif",
               fontSize: 9,
               fontWeight: 600,
               color: isDarkMode ? "#a1a1aa" : "#9ca3af",
               margin: 10,
            },
         },
         yAxis: {
            type: "value",
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: {
               lineStyle: {
                  type: "solid",
                  color: isDarkMode ? "#27272a" : "#f3f4f6",
               },
            },
            axisLabel: {
               fontFamily: "Inter, sans-serif",
               fontSize: 9,
               fontWeight: 600,
               color: isDarkMode ? "#a1a1aa" : "#9ca3af",
               formatter: (value: number) => formatVND(value),
            },
         },
         series: [
            {
               name: "Thu nhập",
               type: "line",
               data: revenues,
               smooth: true,
               showSymbol: false,
               lineStyle: {
                  width: 2.5,
                  color: "#7b41b4",
               },
               itemStyle: {
                  color: "#7b41b4",
               },
               areaStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                     { offset: 0, color: "rgba(123, 65, 180, 0.22)" },
                     { offset: 1, color: "rgba(123, 65, 180, 0.0)" },
                  ]),
               },
            },
            {
               name: "Chi phí",
               type: "line",
               data: costs,
               smooth: true,
               showSymbol: false,
               lineStyle: {
                  width: 2,
                  type: "dashed",
                  color: "#a93349",
               },
               itemStyle: {
                  color: "#a93349",
               },
               areaStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                     { offset: 0, color: "rgba(169, 51, 73, 0.18)" },
                     { offset: 1, color: "rgba(169, 51, 73, 0.0)" },
                  ]),
               },
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
   }, [data, period, isLoading, isDarkMode]);

   if (isLoading)
      return (
         <div className="glass-card rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between">
               <div className="h-5 w-36 bg-gray-200 rounded-full animate-pulse" />
               <div className="h-4 w-20 bg-gray-100 rounded-full animate-pulse" />
            </div>
            <ShimmerChart />
         </div>
      );

   if (!data.length) return null;

   return (
      <motion.section
         initial={{ opacity: 0, y: 16 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
         className="glass-card rounded-3xl p-5 space-y-4"
      >
         {/* Header */}
         <div className="flex items-center justify-between">
            <div>
               <h3 className="font-sans text-sm font-black text-gray-900">Xu hướng thu nhập</h3>
               <p className="font-sans text-[10px] font-medium text-gray-400 mt-0.5">Thu và chi phí theo thời gian</p>
            </div>
            <div className="flex gap-3">
               <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#7b41b4]" />
                  <span className="font-sans text-[9px] font-bold text-gray-400 uppercase tracking-wide">Thu</span>
               </div>
               <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#a93349]" />
                  <span className="font-sans text-[9px] font-bold text-gray-400 uppercase tracking-wide">Chi</span>
               </div>
            </div>
         </div>

         {/* Chart DOM Container */}
         <div ref={chartRef} className="w-full h-50" />
      </motion.section>
   );
};

export default RevenueTrendChart;
