import { useRef } from "react";
import { motion } from "framer-motion";
import { Plus, Minus, Swords } from "lucide-react";
import type { IPlayer } from "../../../api/services/session.api";
import { expandPlayers } from "../../../utils/playerUtils";

// ================================================================
// Types
// ================================================================

interface MatchTableViewProps {
   playersList: IPlayer[];
   columnCount: number;
   onAddColumn: () => void;
   onRemoveColumn?: () => void;
   /** If true, hides interactive controls (used in MatchStatsModal) */
   readOnly?: boolean;
   onUpdateMatches?: (playerIdx: number, personIdx: number, delta: number) => void;
}

// ================================================================
// Avatar colors palette (Apple system colors)
// ================================================================

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
// Constants
// ================================================================

const COL_NAME_W = 124; // px — sticky first column width
const COL_MATCH_W = 48; // px — each match column width

// ================================================================
// Cell — interactive match cell
// ================================================================

const MatchCell = ({ matched, readOnly, onClick }: { matched: boolean; readOnly: boolean; onClick?: () => void }) => (
   <div
      onClick={readOnly ? undefined : onClick}
      className={`flex items-center justify-center w-full h-full transition-all duration-150 ${!readOnly ? "cursor-pointer" : ""}`}
   >
      {matched ? (
         <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-5 h-5 rounded-full bg-[#0A84FF] flex items-center justify-center shadow-[0_2px_6px_rgba(10,132,255,0.35)]"
         >
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
               <path d="M1 4L3.8 7L9 1" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
         </motion.div>
      ) : (
         <div className="w-4 h-4 rounded-full border-[1.5px] border-black/12 dark:border-white/14 bg-transparent" />
      )}
   </div>
);

// ================================================================
// Main Component
// ================================================================

const MatchTableView = ({ playersList, columnCount, onAddColumn, onRemoveColumn, readOnly = false, onUpdateMatches }: MatchTableViewProps) => {
   const scrollRef = useRef<HTMLDivElement>(null);
   const expanded = expandPlayers(playersList);

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
         </motion.div>
      );
   }

   // Build columns array
   const matchColumns = Array.from({ length: columnCount }, (_, i) => i + 1);

   return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="match-table-container">
         {/* Outer wrapper — relative to allow sticky */}
         <div className="relative overflow-hidden rounded-[12px] border border-black/6 dark:border-white/6 bg-white dark:bg-[#1C1C1E]">
            {/* Scroll container */}
            <div
               ref={scrollRef}
               className="overflow-x-auto overflow-y-visible hide-scrollbar"
               style={{ WebkitOverflowScrolling: "touch" as React.CSSProperties["WebkitOverflowScrolling"] }}
            >
               <div style={{ minWidth: COL_NAME_W + matchColumns.length * COL_MATCH_W + COL_MATCH_W + 1 }}>
                  {/* ── HEADER ROW ── */}
                  <div className="flex sticky top-0 z-10 bg-white dark:bg-[#1C1C1E] border-b border-black/6 dark:border-white/6">
                     {/* Name column header */}
                     <div
                        className="shrink-0 flex items-center px-3 py-2.5 border-r border-black/6 dark:border-white/6 bg-white dark:bg-[#1C1C1E] sticky left-0 z-20"
                        style={{ width: COL_NAME_W }}
                     >
                        <span className="text-[10px] font-bold uppercase tracking-widest text-black/35 dark:text-white/35">Vãng lai</span>
                     </div>

                     {/* Match number headers */}
                     {matchColumns.map((col) => (
                        <div
                           key={col}
                           className="shrink-0 flex items-center justify-center border-r border-black/4 dark:border-white/4 last:border-r-0"
                           style={{ width: COL_MATCH_W, height: 38 }}
                        >
                           <span
                              className="text-[11px] font-extrabold tabular-nums"
                              style={{ color: col <= 5 ? "#0A84FF" : col <= 8 ? "#5AC8FA" : "#BF5AF2" }}
                           >
                              {col}
                           </span>
                        </div>
                     ))}

                     {/* Total + Add column button */}
                     <div
                        className="shrink-0 flex items-center justify-center gap-0 sticky right-0 z-20 bg-white dark:bg-[#1C1C1E] border-l border-black/6 dark:border-white/6"
                        style={{ width: COL_MATCH_W }}
                     >
                        {!readOnly && (
                           <div className="flex flex-col gap-0.5">
                              <button
                                 onClick={onAddColumn}
                                 className="w-6 h-5 flex items-center justify-center rounded-md bg-[#0A84FF]/12 text-[#0A84FF] hover:bg-[#0A84FF]/22 active:scale-90 transition-all cursor-pointer border-none"
                                 title="Thêm cột"
                              >
                                 <Plus size={11} strokeWidth={2.5} />
                              </button>
                              {columnCount > 8 && onRemoveColumn && (
                                 <button
                                    onClick={onRemoveColumn}
                                    className="w-6 h-5 flex items-center justify-center rounded-md bg-[#FF375F]/10 text-[#FF375F] hover:bg-[#FF375F]/20 active:scale-90 transition-all cursor-pointer border-none"
                                    title="Bớt cột"
                                 >
                                    <Minus size={11} strokeWidth={2.5} />
                                 </button>
                              )}
                           </div>
                        )}
                        {readOnly && <span className="text-[9px] font-bold uppercase tracking-wide text-black/25 dark:text-white/25">Tổng</span>}
                     </div>
                  </div>

                  {/* ── DATA ROWS ── */}
                  {expanded.map((person, rowIdx) => {
                     const avatarStyle = AVATAR_COLORS[person.playerIdx % AVATAR_COLORS.length];
                     const isFriend = person.personIdx > 0;
                     const isLastRow = rowIdx === expanded.length - 1;

                     return (
                        <div
                           key={`${person.playerIdx}-${person.personIdx}`}
                           className={`flex items-stretch ${!isLastRow ? "border-b border-black/4 dark:border-white/4" : ""}`}
                        >
                           {/* ── Name cell (sticky left) ── */}
                           <div
                              className="shrink-0 flex items-center gap-2 px-3 py-2.5 border-r border-black/6 dark:border-white/6 sticky left-0 z-10 bg-white dark:bg-[#1C1C1E]"
                              style={{ width: COL_NAME_W }}
                           >
                              {/* Avatar */}
                              <div
                                 className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                                 style={{ background: avatarStyle.bg, color: avatarStyle.text }}
                              >
                                 {person.displayName.charAt(0).toUpperCase()}
                              </div>

                              {/* Name + gender */}
                              <div className="min-w-0 flex-1">
                                 <p className="text-[11px] font-bold text-black dark:text-white truncate leading-tight">
                                    {isFriend ? (
                                       <>
                                          <span className="text-black/35 dark:text-white/35 font-medium text-[9px]">Bạn · </span>
                                          {person.displayName.replace(/^Bạn của\s*/, "")}
                                       </>
                                    ) : (
                                       person.displayName
                                    )}
                                 </p>
                                 <span
                                    className={`text-[8px] font-bold uppercase tracking-wide ${person.gender === "male" ? "text-[#0A84FF]" : "text-[#FF375F]"}`}
                                 >
                                    {person.gender === "male" ? "♂ Nam" : "♀ Nữ"}
                                 </span>
                              </div>
                           </div>

                           {/* ── Match cells ── */}
                           {matchColumns.map((col) => {
                              const isMatched = person.matches >= col;
                              const isNextToFill = person.matches === col - 1;

                              return (
                                 <div
                                    key={col}
                                    className={`shrink-0 flex items-center justify-center border-r border-black/4 dark:border-white/4 last:border-r-0 transition-colors duration-150 ${
                                       isMatched
                                          ? "bg-[#0A84FF]/4 dark:bg-[#0A84FF]/[0.07]"
                                          : isNextToFill && !readOnly
                                            ? "bg-[#FF9F0A]/3 dark:bg-[#FF9F0A]/5"
                                            : ""
                                    }`}
                                    style={{ width: COL_MATCH_W, height: 52 }}
                                 >
                                    <MatchCell
                                       matched={isMatched}
                                       readOnly={readOnly}
                                       onClick={() => {
                                          if (readOnly || !onUpdateMatches) return;
                                          // Tap the next-to-fill cell → add 1 match
                                          if (col === person.matches + 1) {
                                             onUpdateMatches(person.playerIdx, person.personIdx, 1);
                                             // Tap the last matched cell → remove 1 match
                                          } else if (col === person.matches) {
                                             onUpdateMatches(person.playerIdx, person.personIdx, -1);
                                          }
                                       }}
                                    />
                                 </div>
                              );
                           })}

                           {/* ── Total cell (sticky right) ── */}
                           <div
                              className="shrink-0 flex items-center justify-center sticky right-0 z-10 bg-white dark:bg-[#1C1C1E] border-l border-black/6 dark:border-white/6"
                              style={{ width: COL_MATCH_W }}
                           >
                              <span
                                 className={`text-[13px] font-black tabular-nums ${
                                    person.matches > 0 ? "text-[#0A84FF]" : "text-black/20 dark:text-white/20"
                                 }`}
                              >
                                 {person.matches}
                              </span>
                           </div>
                        </div>
                     );
                  })}
               </div>
            </div>
         </div>

         {/* Legend */}
         {!readOnly && (
            <div className="flex items-center justify-center gap-4 mt-2.5">
               <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#0A84FF] flex items-center justify-center">
                     <svg width="7" height="6" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.8 7L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                     </svg>
                  </div>
                  <span className="text-[9px] font-medium text-black/30 dark:text-white/30">Đã đánh</span>
               </div>
               <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded-full border-[1.5px] border-black/15 dark:border-white/15" />
                  <span className="text-[9px] font-medium text-black/30 dark:text-white/30">Chưa đánh</span>
               </div>
               <div className="flex items-center gap-1.5">
                  <Plus size={8} className="text-[#0A84FF]" />
                  <span className="text-[9px] font-medium text-black/30 dark:text-white/30">Thêm cột</span>
               </div>
            </div>
         )}
      </motion.div>
   );
};

export default MatchTableView;
