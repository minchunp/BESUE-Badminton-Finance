import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Spin, ConfigProvider, DatePicker } from "antd";
import { SlidersHorizontal, FileText } from "lucide-react";
import dayjs from "dayjs";

import { sessionApi } from "../../api/services/session.api";
import type { ISession } from "../../api/services/session.api";
import type { HistoryFilterType, HistorySession } from "./types";

import HistoryHeader from "./components/HistoryHeader";
import FilterTabs from "./components/FilterTabs";
import MonthlyStatsCard from "./components/MonthlyStatsCard";
import SessionCard from "./components/SessionCard";
import MatchStatsModal from "./components/MatchStatsModal";

import { formatAmount, formatAmountFull, formatSessionDate, isToday } from "../../utils/playerUtils";

const containerVariants = {
   hidden: { opacity: 0 },
   show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
   },
};

const HistoryPage = () => {
   const navigate = useNavigate();
   const [filter, setFilter] = useState<HistoryFilterType>("all");
   const [searchQuery, setSearchQuery] = useState("");
   const [searchOpen, setSearchOpen] = useState(false);
   const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
   const [selectedMonth, setSelectedMonth] = useState<dayjs.Dayjs | null>(null);
   const [matchStatsSession, setMatchStatsSession] = useState<ISession | null>(null);

   // ==========================================
   // 1. FETCH DATA WITH TANSTACK QUERY v5
   // ==========================================
   const { data: response, isLoading } = useQuery({
      queryKey: ["sessions"],
      queryFn: sessionApi.getAll,
   });

   const sessions = useMemo(() => response?.data || [], [response]);

   // ==========================================
   // 2. STATS CALCULATION (Selected/Current Month)
   // ==========================================
   const monthlyStats = useMemo(() => {
      const targetMonth = selectedMonth ? selectedMonth.month() : new Date().getMonth();
      const targetYear = selectedMonth ? selectedMonth.year() : new Date().getFullYear();

      const monthSessions = sessions.filter((session) => {
         try {
            const d = new Date(session.date);
            return d.getMonth() === targetMonth && d.getFullYear() === targetYear && session.status === "completed";
         } catch {
            return false;
         }
      });

      const completedCount = monthSessions.length;
      const totalRevenue = monthSessions.reduce((sum, s) => sum + (s.summary?.totalRevenue || 0), 0);
      const totalProfit = monthSessions.reduce((sum, s) => sum + (s.summary?.profit || 0), 0);
      const monthLabel = `Tháng ${targetMonth + 1}/${targetYear}`;

      return { completedCount, totalRevenue, totalProfit, monthLabel };
   }, [sessions, selectedMonth]);

   // ==========================================
   // 3. FILTERING & SORTING
   // ==========================================
   const filteredAndSortedSessions = useMemo(() => {
      // 3.1 Status filter
      let result = sessions;
      if (filter !== "all") {
         result = sessions.filter((s) => s.status === filter);
      }

      // 3.2 Search filter
      if (searchQuery.trim()) {
         const q = searchQuery.toLowerCase();
         result = result.filter((s) => {
            const courtName = s.court?.name?.toLowerCase() || "";
            const notes = s.notes?.toLowerCase() || "";
            const dateStr = s.date ? new Date(s.date).toLocaleDateString("vi-VN").toLowerCase() : "";
            return courtName.includes(q) || notes.includes(q) || dateStr.includes(q);
         });
      }

      // 3.3 Month filter
      if (selectedMonth) {
         const filterMonth = selectedMonth.month();
         const filterYear = selectedMonth.year();
         result = result.filter((s) => {
            try {
               const d = new Date(s.date);
               return d.getMonth() === filterMonth && d.getFullYear() === filterYear;
            } catch {
               return false;
            }
         });
      }

      // 3.4 Date sorting
      return [...result].sort((a, b) => {
         const dateA = new Date(a.date).getTime();
         const dateB = new Date(b.date).getTime();
         return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      });
   }, [sessions, filter, searchQuery, sortOrder, selectedMonth]);

   // Tab badge counts
   const counts = useMemo(() => {
      const all = sessions.length;
      const completed = sessions.filter((s) => s.status === "completed").length;
      const active = sessions.filter((s) => s.status === "active").length;
      const draft = sessions.filter((s) => s.status === "draft").length;
      return { all, completed, active, draft };
   }, [sessions]);

   // ==========================================
   // 4. NAVIGATION HANDLERS
   // ==========================================
   const handleCardClick = (session: HistorySession) => {
      if (session.status === "completed") {
         navigate(`/host/report/${session._id}`);
      } else if (session.status === "active") {
         const stepToGo = session.currentStep || 2;
         navigate(`/host/create?step=${stepToGo}&id=${session._id}`);
      } else if (session.status === "draft") {
         const stepToGo = session.currentStep || 1;
         navigate(`/host/create?step=${stepToGo}&id=${session._id}`);
      }
   };

   const handleViewMatchStats = (session: HistorySession) => {
      setMatchStatsSession(session);
   };

   // ==========================================
   // 5. LOADING STATE
   // ==========================================
   if (isLoading) {
      return (
         <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
            <Spin size="large" className="text-[#7b41b4]" />
            <span className="text-sm font-semibold text-gray-400">Đang tải lịch sử buổi host...</span>
         </div>
      );
   }

   return (
      <ConfigProvider
         theme={{
            token: { colorPrimary: "#7b41b4", borderRadius: 16 },
         }}
      >
         <div className="space-y-6 pb-28 select-none font-sans">
            {/* Header with search */}
            <HistoryHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} searchOpen={searchOpen} setSearchOpen={setSearchOpen} />

            {/* Status Filter Tabs */}
            <FilterTabs filter={filter} setFilter={setFilter} counts={counts} />

            {/* Monthly Stats Card */}
            <MonthlyStatsCard
               completedCount={monthlyStats.completedCount}
               totalRevenue={monthlyStats.totalRevenue}
               totalProfit={monthlyStats.totalProfit}
               monthLabel={monthlyStats.monthLabel}
               formatAmountFull={formatAmountFull}
            />

            {/* List header with month filter + sort */}
            <div className="flex justify-between items-center pt-2 px-1">
               <h4 className="font-sans text-[14px] font-extrabold text-gray-500 uppercase tracking-wider">
                  {filteredAndSortedSessions.length} buổi host
               </h4>

               <div className="flex items-center gap-2">
                  <DatePicker
                     picker="month"
                     value={selectedMonth}
                     onChange={(date) => setSelectedMonth(date)}
                     format="MM/YYYY"
                     placeholder="Lọc tháng"
                     size="small"
                     allowClear
                     className="w-28 rounded-full font-sans text-[10px] font-bold border-purple-155 hover:border-purple-200"
                  />

                  <button
                     onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                     className="flex items-center gap-1 text-[#7b41b4] font-sans text-xs font-bold hover:opacity-80 active:scale-95 transition-all select-none cursor-pointer bg-purple-50/70 border border-purple-100 px-3 py-1 rounded-full shadow-xs shrink-0"
                  >
                     <span>{sortOrder === "desc" ? "Mới nhất" : "Cũ nhất"}</span>
                     <SlidersHorizontal size={12} strokeWidth={2.5} />
                  </button>
               </div>
            </div>

            {/* Session Cards */}
            {filteredAndSortedSessions.length === 0 ? (
               <div className="py-16 bg-white/40 backdrop-blur-md rounded-3xl border border-gray-100/50 flex flex-col items-center justify-center text-center">
                  <FileText size={36} className="text-gray-300 mb-2" />
                  <span className="text-xs font-bold text-gray-400">Không tìm thấy lịch sử phù hợp</span>
               </div>
            ) : (
               <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-4">
                  {filteredAndSortedSessions.map((session) => (
                     <SessionCard
                        key={session._id}
                        session={session}
                        formatSessionDate={formatSessionDate}
                        formatAmount={formatAmount}
                        isToday={isToday}
                        onCardClick={handleCardClick}
                        onViewMatchStats={handleViewMatchStats}
                     />
                  ))}
               </motion.div>
            )}
         </div>

         {/* Match Stats Modal */}
         <MatchStatsModal session={matchStatsSession} onClose={() => setMatchStatsSession(null)} />
      </ConfigProvider>
   );
};

export default HistoryPage;
export { HistoryPage };
