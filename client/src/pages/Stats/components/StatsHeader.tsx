import { motion, AnimatePresence } from "framer-motion";
import { DatePicker, ConfigProvider } from "antd";
import dayjs from "dayjs";
import type { StatPeriod, DateRange } from "../types";

const { RangePicker } = DatePicker;

interface PeriodTab {
   key: StatPeriod;
   label: string;
}

const PERIOD_TABS: PeriodTab[] = [
   { key: "7d", label: "7 ngày" },
   { key: "30d", label: "30 ngày" },
   { key: "3m", label: "3 tháng" },
   { key: "1y", label: "1 năm" },
   { key: "custom", label: "Tuỳ chỉnh" },
];

interface StatsHeaderProps {
   activePeriod: StatPeriod;
   onPeriodChange: (period: StatPeriod) => void;
   customRange: DateRange | null;
   onCustomRangeChange: (range: DateRange | null) => void;
}

const StatsHeader = ({ activePeriod, onPeriodChange, customRange, onCustomRangeChange }: StatsHeaderProps) => {
   return (
      <ConfigProvider theme={{ token: { colorPrimary: "#7b41b4", borderRadius: 20 } }}>
         <div className="space-y-3">
            {/* Title row */}
            <div className="flex items-center justify-between">
               <div>
                  <h1 className="font-sans text-xl font-black text-gray-900 leading-tight">Thống kê</h1>
                  <p className="font-sans text-xs font-medium text-gray-400 mt-0.5">Phân tích tài chính buổi host</p>
               </div>
            </div>

            {/* Period Tabs */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
               {PERIOD_TABS.map((tab) => {
                  const isActive = activePeriod === tab.key;
                  return (
                     <motion.button
                        key={tab.key}
                        onClick={() => onPeriodChange(tab.key)}
                        whileTap={{ scale: 0.93 }}
                        className={`relative whitespace-nowrap px-4 py-2 rounded-full font-sans text-xs font-bold transition-all duration-200 cursor-pointer shrink-0 ${
                           isActive
                              ? "bg-[#7b41b4] text-white shadow-md shadow-[#7b41b4]/25"
                              : "bg-white text-gray-500 border border-gray-100 shadow-xs hover:text-[#7b41b4] hover:border-purple-100"
                        }`}
                     >
                        {tab.label}
                     </motion.button>
                  );
               })}
            </div>

            {/* Custom Range Picker — slides in when "Tuỳ chỉnh" is active */}
            <AnimatePresence>
               {activePeriod === "custom" && (
                  <motion.div
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: "auto" }}
                     exit={{ opacity: 0, height: 0 }}
                     className="overflow-hidden"
                  >
                     <RangePicker
                        format="DD/MM/YYYY"
                        allowClear
                        size="middle"
                        className="w-full rounded-2xl font-sans text-xs border-purple-200"
                        value={customRange ? [dayjs(customRange.from), dayjs(customRange.to)] : null}
                        onChange={(dates) => {
                           if (!dates || !dates[0] || !dates[1]) {
                              onCustomRangeChange(null);
                              return;
                           }
                           onCustomRangeChange({
                              from: dates[0].format("YYYY-MM-DD"),
                              to: dates[1].format("YYYY-MM-DD"),
                           });
                        }}
                        disabledDate={(d) => d.isAfter(dayjs(), "day")}
                        placeholder={["Từ ngày", "Đến ngày"]}
                     />
                  </motion.div>
               )}
            </AnimatePresence>
         </div>
      </ConfigProvider>
   );
};

export default StatsHeader;
