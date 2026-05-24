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
   hidden: { opacity: 0, y: 20 },
   show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 100, damping: 15 },
   },
};

const SessionCard = ({ session, formatSessionDate, formatAmount, isToday, onCardClick, onViewMatchStats }: SessionCardProps) => {
   const totalPlayers = session.players ? session.players.reduce((sum, p) => sum + (p.maleCount || 0) + (p.femaleCount || 0), 0) : 0;

   // Check if this session has any match data recorded
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
         className={`glass-card rounded-3xl p-5 flex flex-col gap-4 transition-all hover:shadow-md cursor-pointer border border-white/60 bg-white/70 backdrop-blur-md relative ${
            isLive ? "border-purple-200/80 shadow-[0_8px_30px_rgba(123,65,180,0.1)]" : "shadow-xs"
         }`}
      >
         {/* Top row: icon + title + status badge */}
         <div className="flex justify-between items-start">
            <div className="flex items-center gap-3.5 min-w-0">
               {isCompleted && (
                  <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                     <CheckCircle size={18} className="text-emerald-500" strokeWidth={2.5} />
                  </div>
               )}
               {isLive && (
                  <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 animate-[spin_6s_linear_infinite]">
                     <RefreshCw size={18} className="text-blue-500" strokeWidth={2.5} />
                  </div>
               )}
               {isDraft && (
                  <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-150 flex items-center justify-center shrink-0">
                     <FileText size={18} className="text-gray-400" strokeWidth={2.5} />
                  </div>
               )}

               <div className="min-w-0">
                  <h4 className="font-sans text-[14px] font-extrabold text-gray-800 leading-none mb-1.5 truncate">
                     {isLive && isToday(session.date) ? "Hôm nay - Đang diễn ra" : formattedDate}
                  </h4>
                  <div className="flex items-center gap-1 text-gray-400 font-sans text-[10px] font-bold uppercase tracking-wider">
                     <MapPin size={10} className="text-[#7b41b4] shrink-0" />
                     <span className="truncate">{session.court?.name || "Chưa chọn sân"}</span>
                  </div>
               </div>
            </div>

            <div>
               {isCompleted && (
                  <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-sans text-[9px] font-extrabold uppercase tracking-wider border border-emerald-100/50">
                     Hoàn tất
                  </span>
               )}
               {isLive && (
                  <span className="bg-rose-50 text-rose-500 px-2 py-0.5 rounded-full font-sans text-[9px] font-extrabold uppercase tracking-wider border border-rose-100 animate-pulse">
                     Live
                  </span>
               )}
               {isDraft && (
                  <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-sans text-[9px] font-extrabold uppercase tracking-wider">
                     Nháp
                  </span>
               )}
            </div>
         </div>

         {/* Middle info row */}
         {!isDraft && (
            <div className="flex gap-4 py-3 border-y border-gray-100/50 select-none">
               <div className="flex items-center gap-1.5">
                  <Users size={14} className="text-[#7b41b4]/70" />
                  <span className="font-sans text-xs font-bold text-gray-600">{totalPlayers} người</span>
               </div>
               <div className="flex items-center gap-1.5">
                  <Layers size={14} className="text-[#7b41b4]/70" />
                  <span className="font-sans text-xs font-bold text-gray-600">{session.shuttle?.usedQuantity || 0} quả cầu</span>
               </div>
               {/* Show match count badge if data exists */}
               {isCompleted && hasMatchData && (
                  <div className="flex items-center gap-1.5">
                     <Swords size={14} className="text-[#a93349]/70" />
                     <span className="font-sans text-xs font-bold text-[#a93349]">{totalMatchesRecorded} trận</span>
                  </div>
               )}
            </div>
         )}

         {/* Progress bar for in-progress sessions */}
         {isLive && (
            <div className="space-y-1.5 pt-1.5">
               <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                     className="h-full bg-linear-to-r from-[#c185fd] to-[#7b41b4] rounded-full transition-all duration-500"
                     style={{ width: `${(session.currentStep || 1) * 20}%` }}
                  />
               </div>
               <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <span>Bước {session.currentStep || 2}/5</span>
                  <span>{session.court?.hours || 2} giờ</span>
               </div>
            </div>
         )}

         {/* Bottom: financial info + action buttons */}
         <div className="flex justify-between items-center select-none pt-1">
            {isCompleted ? (
               <div className="flex flex-col">
                  <span className="font-sans text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                     Thu: {formatAmount(session.summary?.totalRevenue || 0)}
                  </span>
                  <span className="font-sans text-xs font-extrabold text-emerald-500 mt-0.5">
                     Lời: {formatAmount(session.summary?.profit || 0, true)}
                  </span>
               </div>
            ) : isDraft ? (
               <span className="font-sans text-[10px] font-bold text-gray-400 uppercase tracking-wider">Lưu nháp</span>
            ) : (
               <div className="flex flex-col">
                  <span className="font-sans text-[10px] font-bold text-gray-400 uppercase tracking-wider">Dự thu:</span>
                  <span className="font-sans text-xs font-extrabold text-[#7b41b4] mt-0.5">{formatAmount(session.summary?.totalRevenue || 0)}</span>
               </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-2">
               {/* Match stats button — only for completed sessions */}
               {isCompleted && onViewMatchStats && (
                  <button
                     onClick={(e) => {
                        e.stopPropagation();
                        onViewMatchStats(session);
                     }}
                     className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-sans text-[10px] font-extrabold uppercase tracking-wide transition-all cursor-pointer border ${
                        hasMatchData
                           ? "bg-purple-50 text-[#7b41b4] border-purple-100 hover:bg-purple-100"
                           : "bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-100"
                     }`}
                  >
                     <Swords size={11} strokeWidth={2.5} />
                     Số trận
                  </button>
               )}

               {isCompleted && (
                  <button className="font-sans text-xs font-bold text-[#7b41b4] flex items-center gap-0.5 hover:underline cursor-pointer bg-transparent border-none p-0">
                     Báo cáo <ArrowRight size={13} strokeWidth={2.5} />
                  </button>
               )}
               {isLive && (
                  <button className="font-sans text-xs font-bold bg-linear-to-r from-[#c185fd] to-[#7b41b4] text-white px-4 py-2 rounded-xl flex items-center gap-1 shadow-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer border-none">
                     Tiếp tục <ChevronRight size={13} strokeWidth={2.5} />
                  </button>
               )}
               {isDraft && (
                  <button className="font-sans text-xs font-bold text-gray-500 flex items-center gap-0.5 hover:text-[#7b41b4] transition-colors cursor-pointer bg-transparent border-none p-0">
                     Chỉnh sửa <ArrowRight size={13} strokeWidth={2.5} />
                  </button>
               )}
            </div>
         </div>
      </motion.article>
   );
};

export default SessionCard;
