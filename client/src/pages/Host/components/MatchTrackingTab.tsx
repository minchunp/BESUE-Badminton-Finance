import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Minus, Plus, Swords, Users, User, LayoutGrid, List } from "lucide-react";
import type { IPlayer } from "../../../api/services/session.api";
import { expandPlayers } from "../../../utils/playerUtils";
import MatchTableView from "./MatchTableView";

// ================================================================
// Types
// ================================================================

type TrackingViewMode = "list" | "table";

interface MatchTrackingTabProps {
   playersList: IPlayer[];
   /** Called with (playerIdx, personIdx, delta) — parent updates individualMatches */
   onUpdateMatches: (playerIdx: number, personIdx: number, delta: number) => void;
   /** Read-only mode — hides +/- controls (used from History) */
   readOnly?: boolean;
}

// ================================================================
// Framer Motion variants
// ================================================================

const containerVariants = {
   hidden: { opacity: 0 },
   show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const rowVariants = {
   hidden: { opacity: 0, y: 10 },
   show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 130, damping: 18 } },
};

// ================================================================
// Constants
// ================================================================

const RANK_BADGES: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };
const DEFAULT_COLUMN_COUNT = 8;
const MIN_COLUMN_COUNT = 8;

const AVATAR_COLORS = [
   "bg-[#0A84FF]/12 text-[#0A84FF]",
   "bg-[#FF375F]/10 text-[#FF375F]",
   "bg-[#007AFF]/10 text-[#007AFF]",
   "bg-[#30D158]/12 text-[#30D158]",
   "bg-[#FF9F0A]/12 text-[#FF9F0A]",
   "bg-[#5AC8FA]/12 text-[#5AC8FA]",
   "bg-[#FF2D55]/10 text-[#FF2D55]",
];

// ================================================================
// ViewModeToggle — Apple Segmented Control
// ================================================================

const ViewModeToggle = ({ mode, onChange }: { mode: TrackingViewMode; onChange: (m: TrackingViewMode) => void }) => (
   <div className="flex bg-black/5 dark:bg-white/6 rounded-xl p-0.5 gap-0.5">
      <button
         onClick={() => onChange("table")}
         className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-[10px] text-xs font-bold transition-all duration-200 cursor-pointer border-none select-none ${
            mode === "table"
               ? "bg-white dark:bg-[#3A3A3C] text-black dark:text-white shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
               : "text-black/40 dark:text-white/40 hover:text-black/60 dark:hover:text-white/60"
         }`}
      >
         <LayoutGrid size={12} strokeWidth={2.5} />
         Bảng trận
      </button>
      <button
         onClick={() => onChange("list")}
         className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-[10px] text-xs font-bold transition-all duration-200 cursor-pointer border-none select-none ${
            mode === "list"
               ? "bg-white dark:bg-[#3A3A3C] text-black dark:text-white shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
               : "text-black/40 dark:text-white/40 hover:text-black/60 dark:hover:text-white/60"
         }`}
      >
         <List size={12} strokeWidth={2.5} />
         Xếp hạng
      </button>
   </div>
);

// ================================================================
// Component
// ================================================================

const MatchTrackingTab = ({ playersList, onUpdateMatches, readOnly = false }: MatchTrackingTabProps) => {
   const [viewMode, setViewMode] = useState<TrackingViewMode>("table");
   const [columnCount, setColumnCount] = useState(DEFAULT_COLUMN_COUNT);

   const expanded = useMemo(() => expandPlayers(playersList), [playersList]);
   const totalIndividuals = expanded.length;
   const totalMatches = useMemo(() => expanded.reduce((acc, p) => acc + p.matches, 0), [expanded]);

   // Sort by matches descending for leaderboard
   const ranked = useMemo(() => [...expanded].sort((a, b) => b.matches - a.matches), [expanded]);
   const maxMatches = useMemo(() => Math.max(...expanded.map((p) => p.matches), 1), [expanded]);

   const handleAddColumn = useCallback(() => setColumnCount((c) => c + 1), []);
   const handleRemoveColumn = useCallback(() => setColumnCount((c) => Math.max(MIN_COLUMN_COUNT, c - 1)), []);

   if (playersList.length === 0) {
      return (
         <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center"
         >
            <div className="w-14 h-14 rounded-full bg-[#0A84FF]/10 flex items-center justify-center mb-4">
               <Swords size={24} className="text-[#0A84FF]/50" />
            </div>
            <p className="text-sm font-semibold text-black/40 dark:text-white/40">Chưa có vãng lai nào</p>
            <p className="text-xs font-medium text-black/25 dark:text-white/25 mt-1">Thêm người chơi ở tab "Danh sách" để theo dõi số trận</p>
         </motion.div>
      );
   }

   return (
      <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-4">
         {/* ── Summary stats ── */}
         <div className="grid grid-cols-3 gap-2">
            <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-3 flex flex-col items-center justify-center text-center border border-black/4 dark:border-white/6">
               <div className="w-7 h-7 rounded-xl bg-[#0A84FF]/10 flex items-center justify-center mb-1.5">
                  <Users size={13} className="text-[#0A84FF]" />
               </div>
               <p className="text-[9px] font-semibold text-black/35 dark:text-white/35 uppercase tracking-wider leading-none">Nhóm</p>
               <p className="text-[17px] font-bold text-[#0A84FF] leading-tight mt-0.5">{playersList.length}</p>
            </div>

            <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-3 flex flex-col items-center justify-center text-center border border-black/4 dark:border-white/6">
               <div className="w-7 h-7 rounded-xl bg-[#007AFF]/10 flex items-center justify-center mb-1.5">
                  <User size={13} className="text-[#007AFF]" />
               </div>
               <p className="text-[9px] font-semibold text-black/35 dark:text-white/35 uppercase tracking-wider leading-none">Cá nhân</p>
               <p className="text-[17px] font-bold text-[#007AFF] leading-tight mt-0.5">{totalIndividuals}</p>
            </div>

            <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-3 flex flex-col items-center justify-center text-center border border-black/4 dark:border-white/6">
               <div className="w-7 h-7 rounded-xl bg-[#FF375F]/10 flex items-center justify-center mb-1.5">
                  <Swords size={13} className="text-[#FF375F]" />
               </div>
               <p className="text-[9px] font-semibold text-black/35 dark:text-white/35 uppercase tracking-wider leading-none">Tổng trận</p>
               <p className="text-[17px] font-bold text-[#FF375F] leading-tight mt-0.5">{totalMatches}</p>
            </div>
         </div>

         {/* ── View Mode Toggle ── */}
         <ViewModeToggle mode={viewMode} onChange={setViewMode} />

         {/* ── Tab content ── */}
         <AnimatePresence mode="wait">
            {viewMode === "list" ? (
               <motion.div
                  key="list-view"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-3"
               >
                  {/* Leaderboard heading */}
                  <div className="flex items-center gap-2 px-0.5">
                     <Trophy size={13} className="text-[#FF9F0A] shrink-0" />
                     <span className="text-[11px] font-semibold text-black/40 dark:text-white/40 uppercase tracking-wider">
                        Bảng xếp hạng cá nhân
                     </span>
                  </div>

                  {/* Ranked rows */}
                  <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-2">
                     <AnimatePresence>
                        {ranked.map((person, rankIdx) => {
                           const progress = maxMatches > 0 ? (person.matches / maxMatches) * 100 : 0;
                           const badge = RANK_BADGES[rankIdx + 1];
                           const avatarColor = AVATAR_COLORS[person.playerIdx % AVATAR_COLORS.length];
                           const isFriend = person.personIdx > 0;
                           const isTop = rankIdx === 0 && person.matches > 0;

                           return (
                              <motion.div
                                 key={`${person.playerIdx}-${person.personIdx}`}
                                 variants={rowVariants}
                                 layout
                                 className={`rounded-[18px] p-3.5 border overflow-hidden ${
                                    isTop
                                       ? "bg-[#FF9F0A]/5 dark:bg-[#FF9F0A]/8 border-[#FF9F0A]/20 dark:border-[#FF9F0A]/18"
                                       : "bg-white dark:bg-[#1C1C1E] border-black/4 dark:border-white/6"
                                 }`}
                              >
                                 <div className="flex items-center gap-3">
                                    {/* Rank badge */}
                                    <div className="w-6 text-center shrink-0">
                                       {badge && person.matches > 0 ? (
                                          <span className="text-base leading-none">{badge}</span>
                                       ) : (
                                          <span className="text-[11px] font-bold text-black/22 dark:text-white/22">#{rankIdx + 1}</span>
                                       )}
                                    </div>

                                    {/* Avatar */}
                                    <div className="relative shrink-0">
                                       <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${avatarColor}`}>
                                          {person.displayName.charAt(0).toUpperCase()}
                                       </div>
                                    </div>

                                    {/* Name + gender + progress bar */}
                                    <div className="flex-1 min-w-0">
                                       <div className="flex justify-between items-start mb-1.5">
                                          <div className="min-w-0 pr-2">
                                             <p
                                                className={`text-[13px] font-bold truncate leading-none ${isTop ? "text-[#FF9F0A]" : "text-black dark:text-white"}`}
                                             >
                                                {person.displayName}
                                             </p>
                                             <div className="flex items-center gap-1 mt-0.5">
                                                {isFriend && (
                                                   <span className="text-[9px] font-semibold text-black/25 dark:text-white/25 uppercase tracking-wide">
                                                      Bạn của ·
                                                   </span>
                                                )}
                                                <span
                                                   className={`text-[9px] font-bold uppercase tracking-wide ${
                                                      person.gender === "male" ? "text-[#007AFF]" : "text-[#FF2D55]"
                                                   }`}
                                                >
                                                   {person.gender === "male" ? "♂ Nam" : "♀ Nữ"}
                                                </span>
                                             </div>
                                          </div>
                                          <span
                                             className={`text-sm font-black shrink-0 leading-none mt-0.5 tabular-nums ${isTop ? "text-[#FF9F0A]" : "text-[#0A84FF]"}`}
                                          >
                                             {person.matches}
                                             <span className="text-[10px] font-medium ml-0.5 opacity-50">tr</span>
                                          </span>
                                       </div>

                                       {/* Progress bar */}
                                       <div className="h-1.5 w-full bg-black/6 dark:bg-white/6 rounded-full overflow-hidden">
                                          <motion.div
                                             className={`h-full rounded-full ${isTop ? "bg-[#FF9F0A]" : "bg-[#0A84FF]"}`}
                                             initial={{ width: 0 }}
                                             animate={{ width: `${progress}%` }}
                                             transition={{ type: "spring", stiffness: 90, damping: 16, delay: 0.08 }}
                                          />
                                       </div>
                                    </div>

                                    {/* +/- controls (hidden in readOnly mode) */}
                                    {!readOnly && (
                                       <div className="flex items-center gap-1.5 shrink-0 ml-0.5">
                                          <motion.button
                                             whileTap={{ scale: 0.85 }}
                                             onClick={() => onUpdateMatches(person.playerIdx, person.personIdx, -1)}
                                             disabled={person.matches <= 0}
                                             className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors border-none ${
                                                person.matches <= 0
                                                   ? "bg-black/4 dark:bg-white/4 text-black/20 dark:text-white/20 cursor-not-allowed"
                                                   : "bg-[#FF375F]/10 text-[#FF375F] hover:bg-[#FF375F]/18 cursor-pointer"
                                             }`}
                                          >
                                             <Minus size={13} strokeWidth={2.5} />
                                          </motion.button>

                                          <motion.button
                                             whileTap={{ scale: 0.85 }}
                                             whileHover={{ scale: 1.06 }}
                                             onClick={() => onUpdateMatches(person.playerIdx, person.personIdx, 1)}
                                             className="w-8 h-8 rounded-full flex items-center justify-center bg-[#0A84FF] text-white cursor-pointer transition-all border-none shadow-sm"
                                          >
                                             <Plus size={13} strokeWidth={2.5} />
                                          </motion.button>
                                       </div>
                                    )}
                                 </div>
                              </motion.div>
                           );
                        })}
                     </AnimatePresence>
                  </motion.div>

                  {!readOnly && (
                     <p className="text-center text-[10px] font-medium text-black/25 dark:text-white/25 uppercase tracking-wider pt-1">
                        Nhấn + / − để cập nhật số trận đã đánh
                     </p>
                  )}
               </motion.div>
            ) : (
               <motion.div
                  key="table-view"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-2"
               >
                  {/* Table heading */}
                  <div className="flex items-center justify-between px-0.5">
                     <div className="flex items-center gap-2">
                        <LayoutGrid size={13} className="text-[#5AC8FA] shrink-0" />
                        <span className="text-[11px] font-semibold text-black/40 dark:text-white/40 uppercase tracking-wider">Bảng số trận</span>
                     </div>
                     <span className="text-[10px] font-medium text-black/25 dark:text-white/25">{columnCount} cột</span>
                  </div>

                  <MatchTableView
                     playersList={playersList}
                     columnCount={columnCount}
                     onAddColumn={handleAddColumn}
                     onRemoveColumn={handleRemoveColumn}
                     readOnly={readOnly}
                     onUpdateMatches={onUpdateMatches}
                  />

                  {!readOnly && (
                     <p className="text-center text-[10px] font-medium text-black/25 dark:text-white/25 uppercase tracking-wider pt-1">
                        Chạm ô để cập nhật · Cuộn ngang để xem thêm
                     </p>
                  )}
               </motion.div>
            )}
         </AnimatePresence>
      </motion.div>
   );
};

export default MatchTrackingTab;
