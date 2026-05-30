import { Modal, ConfigProvider, theme } from "antd";
import { useTheme } from "../../../contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, Trophy, User, MapPin, Clock } from "lucide-react";
import type { ISession } from "../../../api/services/session.api";
import { expandPlayers, formatSessionDate } from "../../../utils/playerUtils";

interface MatchStatsModalProps {
   session: ISession | null;
   onClose: () => void;
}

const RANK_MEDALS = ["🥇", "🥈", "🥉"];

/* Apple Fitness activity-ring-inspired avatar colors */
const AVATAR_COLORS = [
   "bg-[#0A84FF]/14 text-[#0A84FF]",
   "bg-[#FF375F]/10 text-[#FF375F]",
   "bg-[#30D158]/12 text-[#30D158]",
   "bg-[#FF9F0A]/12 text-[#FF9F0A]",
   "bg-[#64D2FF]/12 text-[#64D2FF]",
   "bg-[#FF375F]/10 text-[#FF375F]",
   "bg-[#30D158]/12 text-[#30D158]",
];

const StatPill = ({ icon, label, value, color, bg }: { icon: React.ReactNode; label: string; value: number | string; color: string; bg: string }) => (
   <div className="flex-1 flex flex-col items-center gap-1.5 py-3.5">
      <div className={`w-9 h-9 rounded-[14px] flex items-center justify-center ${bg}`}>{icon}</div>
      <span className="text-[9px] font-bold uppercase tracking-widest text-black/30 dark:text-white/30">{label}</span>
      <span className={`text-xl font-black leading-none ${color}`}>{value}</span>
   </div>
);

const EmptyMatchState = () => (
   <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
      className="flex flex-col items-center justify-center py-10 px-6 text-center"
   >
      <div className="w-20 h-20 rounded-[24px] bg-black/[0.04] dark:bg-white/[0.04] flex items-center justify-center mb-4">
         <Trophy size={30} className="text-black/20 dark:text-white/20" strokeWidth={1.5} />
      </div>
      <p className="text-[15px] font-bold text-black/55 dark:text-white/55 mb-1.5">Chưa có dữ liệu số trận</p>
      <p className="text-xs font-medium text-black/30 dark:text-white/30 leading-relaxed max-w-[200px]">
         Sử dụng tab <span className="font-bold text-[#0A84FF]">"Số trận"</span> trong buổi host để ghi nhận
      </p>
   </motion.div>
);

// ================================================================
// Main Component
// ================================================================

const MatchStatsModal = ({ session, onClose }: MatchStatsModalProps) => {
   const { isDarkMode } = useTheme();
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
      <ConfigProvider
         theme={{
            algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
            token: { colorPrimary: "#0A84FF", borderRadius: 20 },
         }}
      >
         <Modal
            open={!!session}
            onCancel={onClose}
            footer={null}
            centered
            width={400}
            closable={false}
            className="transparent-modal"
            styles={{
               body: { padding: 0, backgroundColor: "transparent" },
            }}
         >
            <div className="overflow-hidden rounded-[28px] bg-white dark:bg-[#1C1C1E]">
               {/* ── Hero Header ── */}
               <div className="px-5 pt-6 pb-4 border-b border-black/[0.05] dark:border-white/[0.05]">
                  {/* Icon */}
                  <div className="flex items-start justify-between mb-4">
                     <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-[14px] bg-[#0A84FF]/12 flex items-center justify-center">
                           <Swords size={18} className="text-[#0A84FF]" strokeWidth={2} />
                        </div>
                        <p className="text-[12px] font-bold uppercase tracking-widest text-[#0A84FF]">Thống kê số trận</p>
                     </div>
                  </div>

                  {/* Session info */}
                  <h2 className="text-[19px] font-bold text-black dark:text-white leading-tight mb-1.5">{formatSessionDate(session.date)}</h2>
                  <div className="flex items-center gap-3">
                     <span className="flex items-center gap-1 text-[11px] font-medium text-black/35 dark:text-white/35">
                        <MapPin size={10} className="text-[#0A84FF]" />
                        {session.court?.name || "Chưa rõ sân"}
                     </span>
                     <span className="w-1 h-1 rounded-full bg-black/15 dark:bg-white/15" />
                     <span className="flex items-center gap-1 text-[11px] font-medium text-black/35 dark:text-white/35">
                        <Clock size={10} className="text-[#0A84FF]" />
                        {session.court?.hours || 2}h · {session.court?.numberOfCourts || 1} sân
                     </span>
                  </div>
               </div>

               {/* ── Stats Strip ── */}
               <div className="flex items-stretch divide-x divide-black/[0.05] dark:divide-white/[0.05]">
                  <StatPill
                     icon={<span className="text-base">👥</span>}
                     label="Nhóm"
                     value={totalGroups}
                     color="text-[#0A84FF]"
                     bg="bg-[#0A84FF]/10"
                  />
                  <StatPill
                     icon={<User size={15} className="text-[#30D158]" />}
                     label="Cá nhân"
                     value={totalIndividuals}
                     color="text-[#30D158]"
                     bg="bg-[#30D158]/12"
                  />
                  <StatPill
                     icon={<Swords size={15} className="text-[#FF375F]" />}
                     label="Tổng trận"
                     value={totalMatches}
                     color="text-[#FF375F]"
                     bg="bg-[#FF375F]/10"
                  />
               </div>

               {/* ── Leaderboard / Empty ── */}
               <div className="px-4 pt-4 pb-2 max-h-[46vh] overflow-y-auto">
                  {!hasMatchData ? (
                     <EmptyMatchState />
                  ) : (
                     <AnimatePresence>
                        <motion.div
                           initial="hidden"
                           animate="show"
                           variants={{ show: { transition: { staggerChildren: 0.06 } } }}
                           className="space-y-2"
                        >
                           {/* Section label */}
                           <div className="flex items-center gap-2 px-0.5 mb-1">
                              <Trophy size={12} className="text-[#FF9F0A]" />
                              <span className="text-[10px] font-semibold uppercase tracking-widest text-black/30 dark:text-white/30">
                                 Bảng xếp hạng
                              </span>
                           </div>

                           {ranked.map((person, rankIdx) => {
                              const avatarColor = AVATAR_COLORS[person.playerIdx % AVATAR_COLORS.length];
                              const medal = RANK_MEDALS[rankIdx];
                              const isFriend = person.personIdx > 0;
                              const progress = maxMatches > 0 ? (person.matches / maxMatches) * 100 : 0;
                              const isTop = rankIdx === 0 && person.matches > 0;

                              return (
                                 <motion.div
                                    key={`${person.playerIdx}-${person.personIdx}`}
                                    variants={{
                                       hidden: { opacity: 0, y: 8, scale: 0.97 },
                                       show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 140, damping: 18 } },
                                    }}
                                    className={`flex items-center gap-3 rounded-[16px] px-3.5 py-3 ${
                                       isTop ? "bg-[#FF9F0A]/08 border border-[#FF9F0A]/18" : "bg-black/[0.02] dark:bg-white/[0.02]"
                                    }`}
                                 >
                                    {/* Rank number / medal */}
                                    <div className="w-6 text-center shrink-0">
                                       {medal && person.matches > 0 ? (
                                          <span className="text-base leading-none">{medal}</span>
                                       ) : (
                                          <span className="text-[11px] font-bold text-black/22 dark:text-white/22">#{rankIdx + 1}</span>
                                       )}
                                    </div>

                                    {/* Avatar */}
                                    <div
                                       className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${avatarColor}`}
                                    >
                                       {person.displayName.charAt(0).toUpperCase()}
                                    </div>

                                    {/* Name + meta + bar */}
                                    <div className="flex-1 min-w-0">
                                       <div className="flex items-start justify-between gap-1 mb-1.5">
                                          <div className="min-w-0">
                                             <p
                                                className={`text-[13px] font-bold truncate leading-tight ${isTop ? "text-[#FF9F0A]" : "text-black dark:text-white"}`}
                                             >
                                                {person.displayName}
                                             </p>
                                             <div className="flex items-center gap-1 mt-0.5">
                                                {isFriend && (
                                                   <span className="text-[9px] font-medium text-black/22 dark:text-white/22 uppercase tracking-wide">
                                                      bạn của ·
                                                   </span>
                                                )}
                                                <span
                                                   className={`text-[9px] font-bold uppercase tracking-wide ${person.gender === "male" ? "text-[#0A84FF]" : "text-[#FF375F]"}`}
                                                >
                                                   {person.gender === "male" ? "♂ Nam" : "♀ Nữ"}
                                                </span>
                                             </div>
                                          </div>
                                          <span className={`text-sm font-black shrink-0 tabular-nums ${isTop ? "text-[#FF9F0A]" : "text-[#0A84FF]"}`}>
                                             {person.matches}
                                             <span className="text-[10px] font-medium ml-0.5 opacity-50">tr</span>
                                          </span>
                                       </div>

                                       {/* Progress bar */}
                                       <div className="h-1 w-full bg-black/[0.05] dark:bg-white/[0.05] rounded-full overflow-hidden">
                                          <motion.div
                                             className={`h-full rounded-full ${isTop ? "bg-[#FF9F0A]" : "bg-[#0A84FF]"}`}
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
                     </AnimatePresence>
                  )}
               </div>

               {/* ── Footer ── */}
               <div className="px-4 py-4 pt-2">
                  <button
                     onClick={onClose}
                     className="w-full h-12 rounded-[14px] bg-[#0A84FF] text-white text-sm font-bold hover:bg-[#0070E0] active:scale-[0.98] transition-all cursor-pointer border-none"
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
