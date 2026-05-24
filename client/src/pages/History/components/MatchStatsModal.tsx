import { Modal, ConfigProvider } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, Trophy, User, X, MapPin, Clock } from "lucide-react";
import type { ISession } from "../../../api/services/session.api";
import { expandPlayers, formatSessionDate } from "../../../utils/playerUtils";

interface MatchStatsModalProps {
   session: ISession | null;
   onClose: () => void;
}

const RANK_MEDALS = ["🥇", "🥈", "🥉"];

const AVATAR_PALETTES = [
   { bg: "from-violet-500 to-purple-600", ring: "ring-violet-200" },
   { bg: "from-rose-400 to-pink-600", ring: "ring-rose-200" },
   { bg: "from-indigo-400 to-blue-600", ring: "ring-indigo-200" },
   { bg: "from-emerald-400 to-teal-600", ring: "ring-emerald-200" },
   { bg: "from-amber-400 to-orange-500", ring: "ring-amber-200" },
   { bg: "from-sky-400 to-cyan-600", ring: "ring-sky-200" },
   { bg: "from-fuchsia-400 to-violet-600", ring: "ring-fuchsia-200" },
];

const StatPill = ({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: number | string; accent: string }) => (
   <div className="flex-1 flex flex-col items-center gap-1.5 py-3">
      <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${accent}`}>{icon}</div>
      <span className="font-sans text-[9px] font-black uppercase tracking-widest text-gray-400">{label}</span>
      <span
         className={`font-sans text-xl font-black leading-none ${accent.includes("purple") ? "text-[#7b41b4]" : accent.includes("indigo") ? "text-indigo-600" : "text-[#a93349]"}`}
      >
         {value}
      </span>
   </div>
);

const EmptyMatchState = () => (
   <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.15 }}
      className="flex flex-col items-center justify-center py-10 px-6 text-center"
   >
      <div className="relative mb-5">
         <div className="w-20 h-20 rounded-3xl bg-linear-to-br from-gray-100 to-gray-50 border border-gray-100 flex items-center justify-center shadow-inner">
            <Trophy size={30} className="text-gray-300" strokeWidth={1.5} />
         </div>
         <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-gray-100 border border-white flex items-center justify-center">
            <span className="text-xs">❓</span>
         </div>
      </div>
      <p className="font-sans text-[15px] font-black text-gray-600 mb-1.5">Chưa có dữ liệu số trận</p>
      <p className="font-sans text-xs font-medium text-gray-400 leading-relaxed max-w-50">
         Sử dụng tab <span className="font-bold text-[#7b41b4]">"Số trận"</span> trong buổi host để ghi nhận số trận đã đánh
      </p>
   </motion.div>
);

// ================================================================
// Main Component
// ================================================================

const MatchStatsModal = ({ session, onClose }: MatchStatsModalProps) => {
   if (!session) return null;

   const expanded = expandPlayers(session.players || []);
   const totalMatches = expanded.reduce((acc, p) => acc + p.matches, 0);
   const totalIndividuals = expanded.length;
   const totalGroups = (session.players || []).length;
   const hasMatchData = totalMatches > 0;

   // Sort by matches desc for leaderboard
   const ranked = [...expanded].sort((a, b) => b.matches - a.matches);
   const maxMatches = Math.max(...expanded.map((p) => p.matches), 1);

   return (
      <ConfigProvider theme={{ token: { colorPrimary: "#7b41b4", borderRadius: 20 } }}>
         <Modal
            open={!!session}
            onCancel={onClose}
            footer={null}
            centered
            width={400}
            closable={false}
            styles={{
               body: {
                  borderRadius: 16,
                  padding: 0,
                  overflow: "hidden",
                  background: "transparent",
               },
            }}
         >
            <div className="font-sans overflow-hidden rounded-4xl bg-[#f6f4fa]">
               {/* ── Hero Header ─────────────────────────────────── */}
               <div className="relative overflow-hidden px-6 pt-7 pb-6 bg-white">
                  {/* Decorative blobs */}
                  <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-purple-100/60 blur-2xl pointer-events-none" />
                  <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-pink-100/50 blur-2xl pointer-events-none" />

                  {/* Icon + Close */}
                  <div className="relative flex items-start justify-between mb-4">
                     <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#c185fd] to-[#7b41b4] flex items-center justify-center shadow-lg shadow-purple-200">
                           <Swords size={18} className="text-white" strokeWidth={2} />
                        </div>
                        <div>
                           <p className="font-sans text-[12px] font-black uppercase tracking-widest text-[#7b41b4]">Thống kê số trận</p>
                        </div>
                     </div>

                     <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                     >
                        <X size={14} className="text-gray-500" strokeWidth={2.5} />
                     </button>
                  </div>

                  {/* Session info */}
                  <div className="relative">
                     <h2 className="font-sans text-[19px] font-black text-gray-900 leading-tight mb-2">{formatSessionDate(session.date)}</h2>
                     <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 font-sans text-[11px] font-bold text-gray-400">
                           <MapPin size={10} className="text-[#7b41b4]" />
                           {session.court?.name || "Chưa rõ sân"}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span className="flex items-center gap-1 font-sans text-[11px] font-bold text-gray-400">
                           <Clock size={10} className="text-[#7b41b4]" />
                           {session.court?.hours || 2}h · {session.court?.numberOfCourts || 1} sân
                        </span>
                     </div>
                  </div>
               </div>

               {/* ── Stats Strip ──────────────────────────────────── */}
               <div className="flex items-stretch divide-x divide-gray-100 bg-white border-t border-gray-100 mx-0">
                  <StatPill icon={<span className="text-base">👥</span>} label="Nhóm" value={totalGroups} accent="bg-purple-50 text-[#7b41b4]" />
                  <StatPill
                     icon={<User size={15} className="text-indigo-600" />}
                     label="Cá nhân"
                     value={totalIndividuals}
                     accent="bg-indigo-50 text-indigo-600"
                  />
                  <StatPill
                     icon={<Swords size={15} className="text-[#a93349]" />}
                     label="Tổng trận"
                     value={totalMatches}
                     accent="bg-rose-50 text-[#a93349]"
                  />
               </div>

               {/* ── Leaderboard / Empty ──────────────────────────── */}
               <div className="px-4 pt-4 pb-2 max-h-[46vh] overflow-y-auto">
                  {!hasMatchData ? (
                     <EmptyMatchState />
                  ) : (
                     <AnimatePresence>
                        <motion.div
                           initial="hidden"
                           animate="show"
                           variants={{ show: { transition: { staggerChildren: 0.07 } } }}
                           className="space-y-2.5"
                        >
                           {/* Section label */}
                           <div className="flex items-center gap-2 px-1 mb-1">
                              <Trophy size={12} className="text-amber-400" />
                              <span className="font-sans text-[10px] font-black uppercase tracking-widest text-gray-400">Bảng xếp hạng</span>
                           </div>

                           {ranked.map((person, rankIdx) => {
                              const palette = AVATAR_PALETTES[person.playerIdx % AVATAR_PALETTES.length];
                              const medal = RANK_MEDALS[rankIdx];
                              const isFriend = person.personIdx > 0;
                              const progress = maxMatches > 0 ? (person.matches / maxMatches) * 100 : 0;
                              const isTop = rankIdx === 0 && person.matches > 0;

                              return (
                                 <motion.div
                                    key={`${person.playerIdx}-${person.personIdx}`}
                                    variants={{
                                       hidden: { opacity: 0, y: 10, scale: 0.97 },
                                       show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 130, damping: 18 } },
                                    }}
                                    className={`relative flex items-center gap-3 rounded-2xl px-3.5 py-3 overflow-hidden ${
                                       isTop
                                          ? "bg-linear-to-r from-amber-50 to-yellow-50 border border-amber-200/60 shadow-sm shadow-amber-100"
                                          : "bg-white border border-gray-100 shadow-xs"
                                    }`}
                                 >
                                    {/* Subtle top-rank glow */}
                                    {isTop && (
                                       <div className="absolute inset-0 bg-linear-to-r from-amber-100/30 to-transparent pointer-events-none" />
                                    )}

                                    {/* Rank number / medal */}
                                    <div className="w-6 text-center shrink-0">
                                       {medal && person.matches > 0 ? (
                                          <span className="text-base leading-none">{medal}</span>
                                       ) : (
                                          <span className="font-sans text-[11px] font-black text-gray-300">#{rankIdx + 1}</span>
                                       )}
                                    </div>

                                    {/* Gradient avatar */}
                                    <div
                                       className={`w-9 h-9 rounded-2xl bg-linear-to-br ${palette.bg} flex items-center justify-center font-sans text-sm font-black text-white shrink-0 shadow-sm ring-2 ring-white`}
                                    >
                                       {person.displayName.charAt(0).toUpperCase()}
                                    </div>

                                    {/* Name + meta + bar */}
                                    <div className="flex-1 min-w-0">
                                       <div className="flex items-start justify-between gap-1 mb-1.5">
                                          <div className="min-w-0">
                                             <p
                                                className={`font-sans text-[13px] font-black truncate leading-tight ${isTop ? "text-amber-800" : "text-gray-800"}`}
                                             >
                                                {person.displayName}
                                             </p>
                                             <div className="flex items-center gap-1 mt-0.5">
                                                {isFriend && (
                                                   <span className="font-sans text-[9px] font-bold text-gray-300 uppercase tracking-wide">
                                                      bạn của ·
                                                   </span>
                                                )}
                                                <span
                                                   className={`font-sans text-[9px] font-black uppercase tracking-wide ${
                                                      person.gender === "male" ? "text-blue-400" : "text-rose-400"
                                                   }`}
                                                >
                                                   {person.gender === "male" ? "♂ Nam" : "♀ Nữ"}
                                                </span>
                                             </div>
                                          </div>
                                          <span
                                             className={`font-sans text-sm font-black shrink-0 tabular-nums ${isTop ? "text-amber-600" : "text-[#7b41b4]"}`}
                                          >
                                             {person.matches}
                                             <span className="text-[10px] font-bold ml-0.5 opacity-60">tr</span>
                                          </span>
                                       </div>

                                       {/* Progress bar */}
                                       <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                                          <motion.div
                                             className={`h-full rounded-full ${isTop ? "bg-linear-to-r from-amber-400 to-yellow-500" : "bg-linear-to-r from-[#c185fd] to-[#7b41b4]"}`}
                                             initial={{ width: 0 }}
                                             animate={{ width: `${progress}%` }}
                                             transition={{ type: "spring", stiffness: 60, damping: 14, delay: 0.1 + rankIdx * 0.04 }}
                                          />
                                       </div>
                                    </div>
                                 </motion.div>
                              );
                           })}
                        </motion.div>
                     </AnimatePresence>
                  )}
               </div>

               {/* ── Footer ───────────────────────────────────────── */}
               <div className="px-4 py-4">
                  <button
                     onClick={onClose}
                     className="w-full h-12 rounded-2xl bg-linear-to-r from-[#c185fd] to-[#7b41b4] text-white font-sans text-sm font-black shadow-md shadow-purple-200 hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
                  >
                     Đóng
                  </button>
               </div>
            </div>
         </Modal>
      </ConfigProvider>
   );
};

export default MatchStatsModal;
