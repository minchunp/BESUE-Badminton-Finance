// ================================================================
// Stats Page Types
// ================================================================

export type StatPeriod = "7d" | "30d" | "3m" | "1y" | "custom";

export interface PeriodOption {
   key: StatPeriod;
   label: string;
}

export interface DateRange {
   from: string; // ISO date string YYYY-MM-DD
   to: string;
}

// ================================================================
// API Response Types
// ================================================================

export interface StatsOverview {
   totalRevenue: number;
   totalCash: number;
   totalTransfer: number;
   courtCost: number;
   shuttleCost: number;
   totalCost: number;
   totalProfit: number;
   profitMargin: number;
   sessionCount: number;
   totalShuttleUsed: number;
   revenueChange: number | null; // % thay đổi so kỳ trước, null nếu không có dữ liệu kỳ trước
   profitChange: number | null;
}

export interface RevenueTrendPoint {
   date: string; // "2025-05-01" hoặc "2025-05"
   revenue: number;
   cost: number;
   profit: number;
   sessionCount: number;
}

export interface CostBreakdown {
   courtCost: number;
   shuttleCost: number;
   total: number;
   courtPct: number;
   shuttlePct: number;
}

export interface SessionRow {
   _id: string;
   date: string;
   courtName: string;
   shuttleName: string;
   shuttleUsed: number;
   playerCount: number;
   revenue: number;
   courtCost: number;
   shuttleCost: number;
   totalCost: number;
   profit: number;
   totalCash: number;
   totalTransfer: number;
   notes: string;
}

// ================================================================
// Component Props Types
// ================================================================

export interface StatsHeaderProps {
   activePeriod: StatPeriod;
   onPeriodChange: (period: StatPeriod) => void;
   customRange: DateRange | null;
   onCustomRangeChange: (range: DateRange | null) => void;
}

export interface HeroMetricsCardProps {
   overview: StatsOverview | null;
   isLoading: boolean;
}

export interface MetricsPillRowProps {
   overview: StatsOverview | null;
   isLoading: boolean;
}

export interface RevenueTrendChartProps {
   data: RevenueTrendPoint[];
   isLoading: boolean;
   period: StatPeriod;
}

export interface CostBreakdownCardProps {
   data: CostBreakdown | null;
   isLoading: boolean;
}

export interface PaymentMethodCardProps {
   totalCash: number;
   totalTransfer: number;
   isLoading: boolean;
}

export interface SessionsTableProps {
   data: SessionRow[];
   isLoading: boolean;
}
