import { motion } from "framer-motion";
import { CheckCircle, RefreshCw, FileText, MapPin, Users, Layers, ArrowRight, ChevronRight, Swords } from "lucide-react";
import type { HistorySession } from "../types";
import { expandPlayers } from "../../../utils/playerUtils";

interface SessionCardProps {
   session: HistorySession;
   formatSessionDate: (dateStr: string) => string;
   formatAmount: (value: number, showSign?: boolean) => string;
   isToday: (dateStr: string) => boolean;
   onCardClick: (session: HistorySession) => void;
   onViewMatchStats?: (session: HistorySession) => void;
}

const cardVariants = {
   hidden: { opacity: 0, y: 14 },
   show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 120, damping: 16 },
   },
};

const SessionCard = ({ session, formatSessionDate, formatAmount, isToday, onCardClick, onViewMatchStats }: SessionCardProps) => {
   const totalPlayers = session.players ? session.players.reduce((sum, p) => sum + (p.maleCount || 0) + (p.femaleCount || 0), 0) : 0;

   const totalMatchesRecorded = session.players ? expandPlayers(session.players).reduce((acc, p) => acc + p.matches, 0) : 0;
   const hasMatchData = totalMatchesRecorded > 0;

   const formattedDate = formatSessionDate(session.date);
   const isLive = session.status === "active";
   const isCompleted = session.status === "completed";
   const isDraft = session.status === "draft";

   return (
      <motion.article
         variants={cardVariants}
         onClick={() => onCardClick(session)}
         className="bg-white dark:bg-[#1C1C1E] rounded-[14px] p-4 flex flex-col gap-3.5 cursor-pointer border border-black/5 dark:border-white/[0.07] active:bg-black/1 dark:active:bg-white/2 transition-colors"
      >
         {/* ── Top row: icon + title + status badge ── */}
         <div className="flex justify-between items-start">
            <div className="flex items-center gap-3 min-w-0">
               {isCompleted && (
                  <div className="w-9 h-9 rounded-full bg-[#30D158]/12 flex items-center justify-center shrink-0">
                     <CheckCircle size={17} className="text-[#30D158]" strokeWidth={2.5} />
                  </div>
               )}
               {isLive && (
                  <div className="w-9 h-9 rounded-full bg-[#0A84FF]/10 flex items-center justify-center shrink-0">
                     <RefreshCw size={17} className="text-[#0A84FF] animate-spin" style={{ animationDuration: "4s" }} strokeWidth={2.5} />
                  </div>
               )}
               {isDraft && (
                  <div className="w-9 h-9 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center shrink-0">
                     <FileText size={17} className="text-black/30 dark:text-white/30" strokeWidth={2.5} />
                  </div>
               )}

               <div className="min-w-0">
                  <h4 className="text-[14px] font-bold text-black dark:text-white leading-none mb-1.5 truncate">
                     {isLive && isToday(session.date) ? "Hôm nay — Đang diễn ra" : formattedDate}
                  </h4>
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-black/35 dark:text-white/35 uppercase tracking-wider">
                     <MapPin size={9} className="text-[#0A84FF] shrink-0" />
                     <span className="truncate">{session.court?.name || "Chưa chọn sân"}</span>
                  </div>
               </div>
            </div>

            {/* Status chip */}
            <div className="shrink-0">
               {isCompleted && (
                  <span className="bg-[#30D158]/12 text-[#30D158] px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide">
                     Hoàn tất
                  </span>
               )}
               {isLive && (
                  <span className="bg-[#FF9F0A]/12 text-[#FF9F0A] px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide animate-pulse">
                     Live
                  </span>
               )}
               {isDraft && (
                  <span className="bg-black/5 dark:bg-white/6 text-black/35 dark:text-white/35 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide">
                     Nháp
                  </span>
               )}
            </div>
         </div>

         {/* ── Middle info row ── */}
         {!isDraft && (
            <div className="flex gap-4 py-3 border-y border-black/4 dark:border-white/4 select-none">
               <div className="flex items-center gap-1.5">
                  <Users size={12} className="text-[#0A84FF]/60" />
                  <span className="text-xs font-semibold text-black/50 dark:text-white/50">{totalPlayers} người</span>
               </div>
               <div className="flex items-center gap-1.5">
                  <Layers size={12} className="text-[#0A84FF]/60" />
                  <span className="text-xs font-semibold text-black/50 dark:text-white/50">{session.shuttle?.usedQuantity || 0} quả cầu</span>
               </div>
               {isCompleted && hasMatchData && (
                  <div className="flex items-center gap-1.5">
                     <Swords size={12} className="text-[#FF375F]/70" />
                     <span className="text-xs font-semibold text-[#FF375F]">{totalMatchesRecorded} trận</span>
                  </div>
               )}
            </div>
         )}

         {/* ── Progress bar for Live sessions ── */}
         {isLive && (
            <div className="space-y-1.5">
               <div className="h-1.5 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
                  <div
                     className="h-full bg-[#0A84FF] rounded-full transition-all duration-500"
                     style={{ width: `${(session.currentStep || 1) * 20}%` }}
                  />
               </div>
               <div className="flex justify-between items-center text-[10px] font-semibold text-black/30 dark:text-white/30 uppercase tracking-wider">
                  <span>Bước {session.currentStep || 2}/5</span>
                  <span>{session.court?.hours || 2} giờ</span>
               </div>
            </div>
         )}

         {/* ── Bottom: financial info + action ── */}
         <div className="flex justify-between items-center select-none">
            {isCompleted ? (
               <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-black/30 dark:text-white/30 uppercase tracking-wider">
                     Thu: {formatAmount(session.summary?.totalRevenue || 0)}
                  </span>
                  <span className="text-[14px] font-black text-[#30D158] mt-0.5">Lời: {formatAmount(session.summary?.profit || 0, true)}</span>
               </div>
            ) : isDraft ? (
               <span className="text-[10px] font-semibold text-black/30 dark:text-white/30 uppercase tracking-wider">Lưu nháp</span>
            ) : (
               <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-black/30 dark:text-white/30 uppercase tracking-wider">Dự thu:</span>
                  <span className="text-[14px] font-black text-[#0A84FF] mt-0.5">{formatAmount(session.summary?.totalRevenue || 0)}</span>
               </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-2">
               {isCompleted && onViewMatchStats && (
                  <button
                     onClick={(e) => {
                        e.stopPropagation();
                        onViewMatchStats(session);
                     }}
                     className={`flex items-center gap-1 px-2.5 py-1.5 rounded-[10px] text-[10px] font-bold uppercase tracking-wide transition-colors cursor-pointer border-none ${
                        hasMatchData
                           ? "bg-[#0A84FF]/10 text-[#0A84FF] hover:bg-[#0A84FF]/16"
                           : "bg-black/4 dark:bg-white/4 text-black/30 dark:text-white/30"
                     }`}
                  >
                     <Swords size={11} strokeWidth={2.5} />
                     Số trận
                  </button>
               )}

               {isCompleted && (
                  <button className="text-[13px] font-semibold text-[#0A84FF] flex items-center gap-0.5 hover:opacity-70 transition-opacity cursor-pointer bg-transparent border-none p-0">
                     Báo cáo <ArrowRight size={13} strokeWidth={2.5} />
                  </button>
               )}
               {isLive && (
                  <button className="text-[13px] font-bold bg-[#0A84FF] text-white px-3.5 py-1.5 rounded-[10px] flex items-center gap-1 hover:bg-[#0070E0] active:scale-95 transition-all cursor-pointer border-none">
                     Tiếp tục <ChevronRight size={13} strokeWidth={2.5} />
                  </button>
               )}
               {isDraft && (
                  <button className="text-[13px] font-semibold text-black/35 dark:text-white/35 flex items-center gap-0.5 hover:text-[#0A84FF] transition-colors cursor-pointer bg-transparent border-none p-0">
                     Chỉnh sửa <ArrowRight size={13} strokeWidth={2.5} />
                  </button>
               )}
            </div>
         </div>
      </motion.article>
   );
};

export default SessionCard;
