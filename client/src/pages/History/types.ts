import type { ISession } from "../../api/services/session.api";

export type HistorySession = ISession;

export type HistoryFilterType = "all" | "completed" | "active" | "draft";

export interface MonthlyStats {
   completedCount: number;
   totalRevenue: number;
   totalProfit: number;
   monthLabel: string;
}
