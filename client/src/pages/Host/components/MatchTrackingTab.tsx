import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Minus, Plus, Swords, Users, User } from "lucide-react";
import type { IPlayer } from "../../../api/services/session.api";
import { expandPlayers } from "../../../utils/playerUtils";

// ================================================================
// Props
// ================================================================

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
   show: { opacity: 1, transition: { staggerChildren: 0.055 } },
};

const rowVariants = {
   hidden: { opacity: 0, y: 12 },
   show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 120, damping: 16 } },
};

// ================================================================
// Helpers
// ================================================================

const RANK_BADGES: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

const AVATAR_COLORS = [
   "bg-purple-50 text-[#7b41b4] border-purple-100",
   "bg-pink-50 text-[#a93349] border-pink-100",
   "bg-indigo-50 text-indigo-600 border-indigo-100",
   "bg-emerald-50 text-emerald-600 border-emerald-100",
   "bg-amber-50 text-amber-600 border-amber-100",
   "bg-sky-50 text-sky-600 border-sky-100",
   "bg-rose-50 text-rose-600 border-rose-100",
];

// ================================================================
// Component
// ================================================================

const MatchTrackingTab = ({ playersList, onUpdateMatches, readOnly = false }: MatchTrackingTabProps) => {
   const expanded = expandPlayers(playersList);
   const totalIndividuals = expanded.length;
   const totalMatches = expanded.reduce((acc, p) => acc + p.matches, 0);

   // Sort by matches descending for leaderboard — keep original indices for mutation
   const ranked = [...expanded].sort((a, b) => b.matches - a.matches);
   const maxMatches = Math.max(...expanded.map((p) => p.matches), 1);

   if (playersList.length === 0) {
      return (
         <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center"
         >
            <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center mb-4 border border-purple-100">
               <Swords size={28} className="text-purple-300" />
            </div>
            <p className="font-sans text-sm font-bold text-gray-400">Chưa có vãng lai nào</p>
            <p className="font-sans text-xs font-medium text-gray-300 mt-1">Thêm người chơi ở tab "Danh sách" để theo dõi số trận</p>
         </motion.div>
      );
   }

   return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
         {/* Summary stats */}
         <div className="grid grid-cols-3 gap-2.5">
            <div className="glass-card rounded-2xl p-3 flex flex-col items-center justify-center text-center border border-white/50 shadow-xs">
               <div className="w-7 h-7 rounded-xl bg-purple-100 flex items-center justify-center mb-1.5">
                  <Users size={13} className="text-[#7b41b4]" />
               </div>
               <p className="font-sans text-[9px] font-bold text-gray-400 uppercase tracking-wider leading-none">Nhóm</p>
               <p className="font-sans text-base font-extrabold text-[#7b41b4] leading-tight mt-0.5">{playersList.length}</p>
            </div>

            <div className="glass-card rounded-2xl p-3 flex flex-col items-center justify-center text-center border border-white/50 shadow-xs">
               <div className="w-7 h-7 rounded-xl bg-indigo-100 flex items-center justify-center mb-1.5">
                  <User size={13} className="text-indigo-600" />
               </div>
               <p className="font-sans text-[9px] font-bold text-gray-400 uppercase tracking-wider leading-none">Cá nhân</p>
               <p className="font-sans text-base font-extrabold text-indigo-600 leading-tight mt-0.5">{totalIndividuals}</p>
            </div>

            <div className="glass-card rounded-2xl p-3 flex flex-col items-center justify-center text-center border border-white/50 shadow-xs">
               <div className="w-7 h-7 rounded-xl bg-pink-100 flex items-center justify-center mb-1.5">
                  <Swords size={13} className="text-[#a93349]" />
               </div>
               <p className="font-sans text-[9px] font-bold text-gray-400 uppercase tracking-wider leading-none">Tổng trận</p>
               <p className="font-sans text-base font-extrabold text-[#a93349] leading-tight mt-0.5">{totalMatches}</p>
            </div>
         </div>

         {/* Leaderboard heading */}
         <div className="flex items-center gap-2 px-1">
            <Trophy size={13} className="text-yellow-500 shrink-0" />
            <span className="font-sans text-[11px] font-bold text-gray-400 uppercase tracking-wider">Bảng xếp hạng cá nhân</span>
         </div>

         {/* Ranked rows */}
         <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-2.5">
            <AnimatePresence>
               {ranked.map((person, rankIdx) => {
                  const progress = maxMatches > 0 ? (person.matches / maxMatches) * 100 : 0;
                  const badge = RANK_BADGES[rankIdx + 1];
                  const avatarColor = AVATAR_COLORS[person.playerIdx % AVATAR_COLORS.length];
                  const isFriend = person.personIdx > 0;

                  return (
                     <motion.div
                        key={`${person.playerIdx}-${person.personIdx}`}
                        variants={rowVariants}
                        layout
                        className="glass-card rounded-2xl p-3.5 border border-white/50 shadow-xs overflow-hidden"
                     >
                        <div className="flex items-center gap-3">
                           {/* Avatar + rank badge */}
                           <div className="relative shrink-0">
                              <div
                                 className={`w-10 h-10 rounded-full flex items-center justify-center font-sans text-sm font-extrabold border ${avatarColor}`}
                              >
                                 {person.displayName.charAt(0).toUpperCase()}
                              </div>
                              {badge && <span className="absolute -top-1 -right-1 text-[13px] leading-none">{badge}</span>}
                           </div>

                           {/* Name + gender tag + progress bar */}
                           <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-1.5">
                                 <div className="min-w-0 pr-2">
                                    <p className="font-sans text-[13px] font-extrabold text-gray-800 truncate leading-none">{person.displayName}</p>
                                    <div className="flex items-center gap-1 mt-0.5">
                                       {isFriend && (
                                          <span className="font-sans text-[9px] font-bold text-gray-300 uppercase tracking-wide">Bạn của ·</span>
                                       )}
                                       <span
                                          className={`font-sans text-[9px] font-extrabold uppercase tracking-wide ${
                                             person.gender === "male" ? "text-blue-400" : "text-rose-400"
                                          }`}
                                       >
                                          {person.gender === "male" ? "♂ Nam" : "♀ Nữ"}
                                       </span>
                                    </div>
                                 </div>
                                 <span className="font-sans text-xs font-extrabold text-[#7b41b4] shrink-0 leading-none mt-0.5">
                                    {person.matches} trận
                                 </span>
                              </div>

                              {/* Progress bar */}
                              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                 <motion.div
                                    className="h-full bg-linear-to-r from-[#c185fd] to-[#7b41b4] rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.1 }}
                                 />
                              </div>
                           </div>

                           {/* +/- controls (hidden in readOnly mode) */}
                           {!readOnly && (
                              <div className="flex items-center gap-1 shrink-0 ml-1">
                                 <motion.button
                                    whileTap={{ scale: 0.88 }}
                                    onClick={() => onUpdateMatches(person.playerIdx, person.personIdx, -1)}
                                    disabled={person.matches <= 0}
                                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors border ${
                                       person.matches <= 0
                                          ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                                          : "bg-white border-gray-200 text-gray-600 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-500 cursor-pointer"
                                    }`}
                                 >
                                    <Minus size={13} strokeWidth={2.5} />
                                 </motion.button>

                                 <motion.button
                                    whileTap={{ scale: 0.88 }}
                                    whileHover={{ scale: 1.05 }}
                                    onClick={() => onUpdateMatches(person.playerIdx, person.personIdx, 1)}
                                    className="w-8 h-8 rounded-xl flex items-center justify-center bg-linear-to-br from-[#c185fd] to-[#7b41b4] text-white border border-purple-200/50 shadow-sm cursor-pointer transition-all"
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
            <p className="text-center font-sans text-[10px] font-semibold text-gray-300 uppercase tracking-wider pt-1">
               Nhấn + / − để cập nhật số trận đã đánh
            </p>
         )}
      </motion.div>
   );
};

export default MatchTrackingTab;
