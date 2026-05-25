import { useQuery } from "@tanstack/react-query";
import { statsApi } from "../../../api/services/stats.api";
import type { DateRange, RevenueTrendPoint, CostBreakdown, SessionRow } from "../types";

// ================================================================
// useStatsOverview
// ================================================================

export const useStatsOverview = (dateRange: DateRange) => {
   return useQuery({
      queryKey: ["stats", "overview", dateRange.from, dateRange.to],
      queryFn: () => statsApi.getOverview(dateRange),
      select: (res) => res.data,
      staleTime: 1000 * 60 * 2,
   });
};

// ================================================================
// useRevenueTrend
// ================================================================

export const useRevenueTrend = (dateRange: DateRange) => {
   return useQuery({
      queryKey: ["stats", "revenue-trend", dateRange.from, dateRange.to],
      queryFn: () => statsApi.getRevenueTrend(dateRange),
      select: (res): RevenueTrendPoint[] => res.data ?? [],
      staleTime: 1000 * 60 * 2,
   });
};

// ================================================================
// useCostBreakdown
// ================================================================

export const useCostBreakdown = (dateRange: DateRange) => {
   return useQuery({
      queryKey: ["stats", "cost-breakdown", dateRange.from, dateRange.to],
      queryFn: () => statsApi.getCostBreakdown(dateRange),
      select: (res): CostBreakdown | null => res.data ?? null,
      staleTime: 1000 * 60 * 2,
   });
};

// ================================================================
// useSessionsTable
// ================================================================

export const useSessionsTable = (dateRange: DateRange) => {
   return useQuery({
      queryKey: ["stats", "sessions-table", dateRange.from, dateRange.to],
      queryFn: () => statsApi.getSessionsTable(dateRange),
      select: (res): SessionRow[] => res.data ?? [],
      staleTime: 1000 * 60 * 2,
   });
};
