import { useState, useCallback } from "react";
import type { StatPeriod, DateRange } from "../types";
import dayjs from "dayjs";

// ================================================================
// Period → Date Range Mapping
// ================================================================

export const getPeriodRange = (period: StatPeriod, customRange?: DateRange | null): DateRange => {
   const to = dayjs().format("YYYY-MM-DD");

   if (period === "custom" && customRange) return customRange;

   const periodDays: Record<Exclude<StatPeriod, "custom">, number> = {
      "7d": 7,
      "30d": 30,
      "3m": 90,
      "1y": 365,
   };

   const days = periodDays[period as Exclude<StatPeriod, "custom">] ?? 30;
   const from = dayjs().subtract(days, "day").format("YYYY-MM-DD");
   return { from, to };
};

// ================================================================
// Hook
// ================================================================

export interface UseStatsPeriodReturn {
   activePeriod: StatPeriod;
   customRange: DateRange | null;
   dateRange: DateRange;
   setActivePeriod: (period: StatPeriod) => void;
   setCustomRange: (range: DateRange | null) => void;
   periodLabel: string;
}

const PERIOD_LABELS: Record<StatPeriod, string> = {
   "7d": "7 ngày qua",
   "30d": "30 ngày qua",
   "3m": "3 tháng qua",
   "1y": "Năm nay",
   custom: "Tuỳ chỉnh",
};

export const useStatsPeriod = (defaultPeriod: StatPeriod = "30d"): UseStatsPeriodReturn => {
   const [activePeriod, setActivePeriodState] = useState<StatPeriod>(defaultPeriod);
   const [customRange, setCustomRange] = useState<DateRange | null>(null);

   const setActivePeriod = useCallback((period: StatPeriod) => {
      setActivePeriodState(period);
      if (period !== "custom") {
         setCustomRange(null);
      }
   }, []);

   const dateRange = getPeriodRange(activePeriod, customRange);

   return {
      activePeriod,
      customRange,
      dateRange,
      setActivePeriod,
      setCustomRange,
      periodLabel: PERIOD_LABELS[activePeriod],
   };
};
