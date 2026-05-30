import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "../../../contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, Trophy, User, Users, MapPin, Clock, LayoutGrid } from "lucide-react";
import type { ISession } from "../../../api/services/session.api";
import { expandPlayers, formatSessionDate } from "../../../utils/playerUtils";
import MatchTableView from "../../Host/components/MatchTableView";

// ================================================================
// Types
// ================================================================

interface MatchStatsModalProps {
   session: ISession | null;
   onClose: () => void;
}

type ModalViewMode = "leaderboard" | "table";

// ================================================================
// Constants
// ================================================================

const RANK_MEDALS = ["🥇", "🥈", "🥉"];

const AVATAR_COLORS: { bg: string; text: string }[] = [
   { bg: "rgba(10,132,255,0.14)", text: "#0A84FF" },
   { bg: "rgba(255,55,95,0.12)", text: "#FF375F" },
   { bg: "rgba(48,209,88,0.12)", text: "#30D158" },
   { bg: "rgba(255,159,10,0.12)", text: "#FF9F0A" },
   { bg: "rgba(90,200,250,0.14)", text: "#5AC8FA" },
   { bg: "rgba(191,90,242,0.12)", text: "#BF5AF2" },
   { bg: "rgba(255,45,85,0.12)", text: "#FF2D55" },
];

// ================================================================
// ViewToggle — Apple Segmented Control
// ================================================================

const ViewToggle = ({ mode, onChange }: { mode: ModalViewMode; onChange: (m: ModalViewMode) => void }) => (
   <div className="flex rounded-xl p-0.5 gap-0.5 mx-4 mb-3" style={{ background: "rgba(120,120,128,0.12)" }}>
      <button
         onClick={() => onChange("table")}
         className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-[10px] text-[11px] font-bold transition-all duration-200 cursor-pointer border-none select-none ${
            mode === "table"
               ? "bg-white dark:bg-[#3A3A3C] text-black dark:text-white shadow-[0_1px_3px_rgba(0,0,0,0.12)]"
               : "bg-transparent text-black/40 dark:text-white/40"
         }`}
      >
         <LayoutGrid size={11} strokeWidth={2.5} />
         Bảng trận
      </button>
      <button
         onClick={() => onChange("leaderboard")}
         className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-[10px] text-[11px] font-bold transition-all duration-200 cursor-pointer border-none select-none ${
            mode === "leaderboard"
               ? "bg-white dark:bg-[#3A3A3C] text-black dark:text-white shadow-[0_1px_3px_rgba(0,0,0,0.12)]"
               : "bg-transparent text-black/40 dark:text-white/40"
         }`}
      >
         <Trophy size={11} strokeWidth={2.5} />
         Xếp hạng
      </button>
   </div>
);

// ================================================================
// Empty State
// ================================================================

const EmptyMatchState = () => (
   <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
      className="flex flex-col items-center justify-center py-10 px-6 text-center"
   >
      <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4" style={{ background: "rgba(120,120,128,0.08)" }}>
         <Trophy size={30} className="text-black/20 dark:text-white/20" strokeWidth={1.5} />
      </div>
      <p className="text-[15px] font-bold text-black/55 dark:text-white/55 mb-1.5">Chưa có dữ liệu số trận</p>
      <p className="text-xs font-medium text-black/30 dark:text-white/30 leading-relaxed max-w-50">
         Sử dụng tab <span className="font-bold text-[#0A84FF]">"Số trận"</span> trong buổi host để ghi nhận
      </p>
   </motion.div>
);

// ================================================================
// Leaderboard View
// ================================================================

const LeaderboardView = ({ session }: { session: ISession }) => {
   const expanded = expandPlayers(session.players || []);
   const totalMatches = expanded.reduce((acc, p) => acc + p.matches, 0);
   const hasMatchData = totalMatches > 0;
   const ranked = [...expanded].sort((a, b) => b.matches - a.matches);
   const maxMatches = Math.max(...expanded.map((p) => p.matches), 1);

   if (!hasMatchData) return <EmptyMatchState />;

   return (
      <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.05 } } }} className="space-y-2 px-4 pb-4">
         {/* Section label */}
         <div className="flex items-center gap-2 px-0.5 mb-3">
            <Trophy size={12} className="text-[#FF9F0A]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-black/30 dark:text-white/30">Bảng xếp hạng</span>
         </div>

         {ranked.map((person, rankIdx) => {
            const avatarStyle = AVATAR_COLORS[person.playerIdx % AVATAR_COLORS.length];
            const medal = RANK_MEDALS[rankIdx];
            const isFriend = person.personIdx > 0;
            const progress = maxMatches > 0 ? (person.matches / maxMatches) * 100 : 0;
            const isTop = rankIdx === 0 && person.matches > 0;

            return (
               <motion.div
                  key={`${person.playerIdx}-${person.personIdx}`}
                  variants={{
                     hidden: { opacity: 0, y: 8, scale: 0.97 },
                     show: {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: { type: "spring", stiffness: 140, damping: 18 },
                     },
                  }}
                  className="flex items-center gap-3 rounded-2xl px-3.5 py-3"
                  style={{
                     background: isTop ? "rgba(255,159,10,0.07)" : "rgba(120,120,128,0.06)",
                     border: isTop ? "1px solid rgba(255,159,10,0.2)" : "1px solid rgba(120,120,128,0.1)",
                  }}
               >
                  {/* Rank number / medal */}
                  <div className="w-7 text-center shrink-0">
                     {medal && person.matches > 0 ? (
                        <span className="text-[17px] leading-none">{medal}</span>
                     ) : (
                        <span className="text-[11px] font-bold text-black/25 dark:text-white/25">#{rankIdx + 1}</span>
                     )}
                  </div>

                  {/* Avatar */}
                  <div
                     className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0"
                     style={{ background: avatarStyle.bg, color: avatarStyle.text }}
                  >
                     {person.displayName.charAt(0).toUpperCase()}
                  </div>

                  {/* Name + meta + bar */}
                  <div className="flex-1 min-w-0">
                     <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="min-w-0 flex-1">
                           <p className="text-[13px] font-bold truncate leading-tight" style={{ color: isTop ? "#FF9F0A" : undefined }}>
                              {!isTop && <span className="text-black dark:text-white">{person.displayName}</span>}
                              {isTop && person.displayName}
                           </p>
                           <div className="flex items-center gap-1 mt-0.5">
                              {isFriend && (
                                 <span className="text-[9px] font-medium text-black/22 dark:text-white/22 uppercase tracking-wide">bạn của ·</span>
                              )}
                              <span
                                 className="text-[9px] font-bold uppercase tracking-wide"
                                 style={{ color: person.gender === "male" ? "#0A84FF" : "#FF375F" }}
                              >
                                 {person.gender === "male" ? "♂ Nam" : "♀ Nữ"}
                              </span>
                           </div>
                        </div>
                        <div className="shrink-0 flex items-baseline gap-0.5">
                           <span className="text-[15px] font-black tabular-nums leading-none" style={{ color: isTop ? "#FF9F0A" : "#0A84FF" }}>
                              {person.matches}
                           </span>
                           <span className="text-[9px] font-medium text-black/35 dark:text-white/35">tr</span>
                        </div>
                     </div>

                     {/* Progress bar */}
                     <div className="h-0.75 w-full rounded-full overflow-hidden" style={{ background: "rgba(120,120,128,0.1)" }}>
                        <motion.div
                           className="h-full rounded-full"
                           style={{ background: isTop ? "#FF9F0A" : "#0A84FF" }}
                           initial={{ width: 0 }}
                           animate={{ width: `${progress}%` }}
                           transition={{ type: "spring", stiffness: 70, damping: 14, delay: 0.1 + rankIdx * 0.04 }}
                        />
                     </div>
                  </div>
               </motion.div>
            );
         })}
      </motion.div>
   );
};

// ================================================================
// Table View (readonly wrapper)
// ================================================================

const TableViewSection = ({ session }: { session: ISession }) => {
   const maxMatches = Math.max(...expandPlayers(session.players || []).map((p) => p.matches), 8);
   const columnCount = Math.max(maxMatches, 8);

   return (
      <div className="px-4 pb-4">
         <div className="flex items-center gap-2 mb-3 px-0.5">
            <LayoutGrid size={12} className="text-[#5AC8FA]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-black/30 dark:text-white/30">Bảng số trận</span>
         </div>
         <MatchTableView playersList={session.players || []} columnCount={columnCount} onAddColumn={() => {}} readOnly />
      </div>
   );
};

// ================================================================
// Main Component — Custom overlay (NO Ant Design Modal)
// ================================================================

const MatchStatsModal = ({ session, onClose }: MatchStatsModalProps) => {
   const { isDarkMode } = useTheme();
   const [viewMode, setViewMode] = useState<ModalViewMode>("table");

   // Lock body scroll when open
   useEffect(() => {
      if (session) {
         document.body.style.overflow = "hidden";
      } else {
         document.body.style.overflow = "";
      }
      return () => {
         document.body.style.overflow = "";
      };
   }, [session]);

   const [prevSessionId, setPrevSessionId] = useState<string | undefined>(session?._id);

   // Reset view mode when session changes (adjust state during render)
   if (session?._id !== prevSessionId) {
      setPrevSessionId(session?._id);
      setViewMode("table");
   }

   if (!session) return null;

   const expanded = expandPlayers(session.players || []);
   const totalMatches = expanded.reduce((acc, p) => acc + p.matches, 0);
   const totalIndividuals = expanded.length;
   const totalGroups = (session.players || []).length;
   const hasMatchData = totalMatches > 0;

   const modalContent = (
      <AnimatePresence>
         {session && (
            <>
               {/* ── Backdrop ── */}
               <motion.div
                  key="backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  onClick={onClose}
                  style={{
                     position: "fixed",
                     inset: 0,
                     zIndex: 9998,
                     background: "rgba(0,0,0,0.55)",
                     backdropFilter: "blur(12px)",
                     WebkitBackdropFilter: "blur(12px)",
                  }}
               />

               {/* ── Sheet Layout Container ── */}
               <div
                  style={{
                     position: "fixed",
                     inset: 0,
                     display: "flex",
                     justifyContent: "center",
                     alignItems: "flex-end",
                     zIndex: 9999,
                     pointerEvents: "none",
                  }}
               >
                  {/* ── Sheet ── */}
                  <motion.div
                     key="sheet"
                     initial={{ opacity: 0, y: 60 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: 40 }}
                     transition={{ type: "spring", stiffness: 340, damping: 30 }}
                     onClick={(e) => e.stopPropagation()}
                     style={{
                        pointerEvents: "auto",
                        width: "100%",
                        maxWidth: 420,
                        background: isDarkMode ? "#1C1C1E" : "#FFFFFF",
                        borderRadius: "24px 24px 0 0",
                        boxShadow: isDarkMode ? "0 -8px 40px rgba(0,0,0,0.6)" : "0 -4px 32px rgba(0,0,0,0.14)",
                        overflow: "hidden",
                        maxHeight: "92dvh",
                        display: "flex",
                        flexDirection: "column",
                     }}
                  >
                     {/* Drag handle */}
                     <div style={{ display: "flex", justifyContent: "center", paddingTop: 12, paddingBottom: 4, flexShrink: 0 }}>
                        <div
                           style={{
                              width: 36,
                              height: 4,
                              borderRadius: 100,
                              background: isDarkMode ? "rgba(255,255,255,0.22)" : "rgba(60,60,67,0.18)",
                           }}
                        />
                     </div>

                     {/* ── Hero Header ── */}
                     <div
                        style={{
                           padding: "12px 20px 16px",
                           borderBottom: `1px solid ${isDarkMode ? "rgba(255,255,255,0.07)" : "rgba(60,60,67,0.08)"}`,
                           flexShrink: 0,
                        }}
                     >
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                           <div
                              style={{
                                 width: 36,
                                 height: 36,
                                 borderRadius: 12,
                                 background: "rgba(10,132,255,0.12)",
                                 display: "flex",
                                 alignItems: "center",
                                 justifyContent: "center",
                                 flexShrink: 0,
                              }}
                           >
                              <Swords size={16} color="#0A84FF" strokeWidth={2} />
                           </div>
                           <span
                              style={{
                                 fontSize: 11,
                                 fontWeight: 700,
                                 letterSpacing: "0.1em",
                                 textTransform: "uppercase",
                                 color: "#0A84FF",
                              }}
                           >
                              Thống kê số trận
                           </span>
                        </div>

                        <p
                           style={{
                              fontSize: 19,
                              fontWeight: 700,
                              color: isDarkMode ? "#FFFFFF" : "#000000",
                              margin: "0 0 6px",
                              lineHeight: 1.2,
                           }}
                        >
                           {formatSessionDate(session.date)}
                        </p>

                        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                           <span
                              style={{
                                 display: "flex",
                                 alignItems: "center",
                                 gap: 4,
                                 fontSize: 11,
                                 fontWeight: 600,
                                 color: isDarkMode ? "rgba(235,235,245,0.4)" : "rgba(60,60,67,0.45)",
                              }}
                           >
                              <MapPin size={10} color="#0A84FF" />
                              {session.court?.name || "Chưa rõ sân"}
                           </span>
                           <span
                              style={{
                                 width: 4,
                                 height: 4,
                                 borderRadius: "50%",
                                 background: isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(60,60,67,0.2)",
                                 flexShrink: 0,
                              }}
                           />
                           <span
                              style={{
                                 display: "flex",
                                 alignItems: "center",
                                 gap: 4,
                                 fontSize: 11,
                                 fontWeight: 600,
                                 color: isDarkMode ? "rgba(235,235,245,0.4)" : "rgba(60,60,67,0.45)",
                              }}
                           >
                              <Clock size={10} color="#0A84FF" />
                              {session.court?.hours || 2}h · {session.court?.numberOfCourts || 1} sân
                           </span>
                        </div>
                     </div>

                     {/* ── Stats Strip ── */}
                     <div
                        style={{
                           display: "flex",
                           borderBottom: `1px solid ${isDarkMode ? "rgba(255,255,255,0.07)" : "rgba(60,60,67,0.08)"}`,
                           flexShrink: 0,
                        }}
                     >
                        {[
                           {
                              icon: <Users size={15} color="#0A84FF" />,
                              label: "Nhóm",
                              value: totalGroups,
                              color: "#0A84FF",
                              bg: "rgba(10,132,255,0.10)",
                           },
                           {
                              icon: <User size={15} color="#30D158" />,
                              label: "Cá nhân",
                              value: totalIndividuals,
                              color: "#30D158",
                              bg: "rgba(48,209,88,0.12)",
                           },
                           {
                              icon: <Swords size={15} color="#FF375F" />,
                              label: "Tổng trận",
                              value: totalMatches,
                              color: "#FF375F",
                              bg: "rgba(255,55,95,0.10)",
                           },
                        ].map((stat, i, arr) => (
                           <div
                              key={stat.label}
                              style={{
                                 flex: 1,
                                 display: "flex",
                                 flexDirection: "column",
                                 alignItems: "center",
                                 gap: 6,
                                 paddingTop: 14,
                                 paddingBottom: 14,
                                 borderRight:
                                    i < arr.length - 1 ? `1px solid ${isDarkMode ? "rgba(255,255,255,0.07)" : "rgba(60,60,67,0.08)"}` : "none",
                              }}
                           >
                              <div
                                 style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 10,
                                    background: stat.bg,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                 }}
                              >
                                 {stat.icon}
                              </div>
                              <span
                                 style={{
                                    fontSize: 9,
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.08em",
                                    color: isDarkMode ? "rgba(235,235,245,0.3)" : "rgba(60,60,67,0.35)",
                                    lineHeight: 1,
                                 }}
                              >
                                 {stat.label}
                              </span>
                              <span style={{ fontSize: 20, fontWeight: 900, color: stat.color, lineHeight: 1 }}>{stat.value}</span>
                           </div>
                        ))}
                     </div>

                     {/* ── View Toggle (only when data exists) ── */}
                     {hasMatchData && (
                        <div style={{ paddingTop: 12, flexShrink: 0 }}>
                           <ViewToggle mode={viewMode} onChange={setViewMode} />
                        </div>
                     )}

                     {/* ── Scrollable Content ── */}
                     <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", minHeight: 0 }}>
                        {!hasMatchData ? (
                           <EmptyMatchState />
                        ) : (
                           <AnimatePresence mode="wait">
                              {viewMode === "leaderboard" ? (
                                 <motion.div
                                    key="leaderboard"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    transition={{ duration: 0.16 }}
                                 >
                                    <LeaderboardView session={session} />
                                 </motion.div>
                              ) : (
                                 <motion.div
                                    key="table"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.16 }}
                                 >
                                    <TableViewSection session={session} />
                                 </motion.div>
                              )}
                           </AnimatePresence>
                        )}
                     </div>

                     {/* ── Footer ── */}
                     <div
                        style={{
                           padding: "12px 16px",
                           borderTop: `1px solid ${isDarkMode ? "rgba(255,255,255,0.07)" : "rgba(60,60,67,0.07)"}`,
                           paddingBottom: "max(12px, env(safe-area-inset-bottom))",
                           flexShrink: 0,
                        }}
                     >
                        <button
                           onClick={onClose}
                           style={{
                              width: "100%",
                              height: 48,
                              borderRadius: 14,
                              background: "#0A84FF",
                              color: "#FFFFFF",
                              fontSize: 15,
                              fontWeight: 700,
                              border: "none",
                              cursor: "pointer",
                              transition: "opacity 0.15s, transform 0.15s",
                           }}
                           onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                           onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                           onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                           onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                        >
                           Đóng
                        </button>
                     </div>
                  </motion.div>
               </div>
            </>
         )}
      </AnimatePresence>
   );

   return createPortal(modalContent, document.body);
};

export default MatchStatsModal;
