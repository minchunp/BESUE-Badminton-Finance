import { useQuery } from "@tanstack/react-query";
import { sessionApi } from "../../../api/services/session.api";
import type { HomePageData, QuickStatItem, RecentSession } from "../types";
import dayjs from "dayjs";

export const useHomeData = () => {
   return useQuery({
      queryKey: ["sessions", "all"],
      queryFn: () => sessionApi.getAll(),
      select: (res): HomePageData => {
         const sessions = res.data ?? [];

         // 1. Scheduled hosts (draft / active)
         const scheduledHostsCount = sessions.filter((s) => s.status === "draft" || s.status === "active").length;

         // 2. Completed sessions
         const completedSessions = sessions.filter((s) => s.status === "completed");

         // Sort completed sessions by date descending
         const sortedCompleted = [...completedSessions].sort((a, b) => {
            return dayjs(b.date).diff(dayjs(a.date));
         });

         // 3. Calculate statistics
         const totalRevenue = completedSessions.reduce((sum, s) => sum + (s.summary?.totalRevenue ?? 0), 0);

         const totalHours = completedSessions.reduce((sum, s) => sum + (s.court?.hours ?? 0), 0);

         const totalShuttlesUsed = completedSessions.reduce((sum, s) => sum + (s.shuttle?.usedQuantity ?? 0), 0);

         // Display tubes ("ống") of shuttles where 1 tube = 12 shuttles
         const shuttleTubes = Math.ceil(totalShuttlesUsed / 12);

         const stats: QuickStatItem[] = [
            {
               id: "stat-revenue",
               icon: "revenue",
               label: "Doanh thu",
               value: totalRevenue,
               unit: "đ",
            },
            {
               id: "stat-sessions",
               icon: "sessions",
               label: "Buổi host",
               value: completedSessions.length,
               unit: "buổi",
            },
            {
               id: "stat-shuttles",
               icon: "shuttles",
               label: "Cầu đã dùng",
               value: shuttleTubes,
               unit: "ống",
            },
            {
               id: "stat-hours",
               icon: "hours",
               label: "Giờ đã host",
               value: totalHours,
               unit: "giờ",
            },
         ];

         // 4. Map top 5 recent sessions
         const recentSessions: RecentSession[] = sortedCompleted.slice(0, 5).map((s) => {
            // Count total players slot
            const quantityPlayer = (s.players ?? []).reduce((sum, p) => sum + (p.maleCount ?? 0) + (p.femaleCount ?? 0), 0);

            return {
               id: s._id ?? "",
               date: dayjs(s.date).format("DD [Tháng] MM, YYYY"),
               courtName: s.court?.name ?? "Sân Cầu Lông",
               profit: s.summary?.profit ?? 0,
               status: "complete", // All completed sessions
               quantityPlayer,
            };
         });

         return {
            userName: "Suee Nguyen", // Keeps original user name
            scheduledHostsCount,
            stats,
            recentSessions,
         };
      },
      staleTime: 1000 * 60, // 1 minute
   });
};
