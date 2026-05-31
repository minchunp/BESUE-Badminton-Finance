import axiosInstance from "../axios";
import type { ApiResponse } from "../types";
import type { StatsOverview, RevenueTrendPoint, CostBreakdown, SessionRow } from "../../pages/Stats/types";

// ================================================================
// Stats API Service
// ================================================================

export const statsApi = {
   /**
    * GET /api/stats/overview
    * KPI tổng quan: tổng thu, chi phí, lợi nhuận, tỷ suất, số buổi
    */
   getOverview: async (params: { from: string; to: string }): Promise<ApiResponse<StatsOverview>> => {
      const response = await axiosInstance.get<ApiResponse<StatsOverview>>("/stats/overview", {
         params,
      });
      return response.data;
   },

   /**
    * GET /api/stats/revenue-trend
    * Xu hướng thu/chi theo ngày hoặc tháng (dùng cho Area Chart)
    */
   getRevenueTrend: async (params: { from: string; to: string }): Promise<ApiResponse<RevenueTrendPoint[]>> => {
      const response = await axiosInstance.get<ApiResponse<RevenueTrendPoint[]>>("/stats/revenue-trend", {
         params,
      });
      return response.data;
   },

   /**
    * GET /api/stats/cost-breakdown
    * Phân bổ chi phí: tiền sân vs tiền cầu
    */
   getCostBreakdown: async (params: { from: string; to: string }): Promise<ApiResponse<CostBreakdown>> => {
      const response = await axiosInstance.get<ApiResponse<CostBreakdown>>("/stats/cost-breakdown", {
         params,
      });
      return response.data;
   },

   /**
    * GET /api/stats/sessions-table
    * Bảng chi tiết từng buổi host trong kỳ
    */
   getSessionsTable: async (params: { from: string; to: string }): Promise<ApiResponse<SessionRow[]>> => {
      const response = await axiosInstance.get<ApiResponse<SessionRow[]>>("/stats/sessions-table", {
         params,
      });
      return response.data;
   },
};
