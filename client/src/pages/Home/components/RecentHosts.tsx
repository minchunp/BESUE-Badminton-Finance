import { motion } from "framer-motion";
import { Avatar } from "antd";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { RecentSession } from "../types";

interface RecentHostsProps {
   sessions: RecentSession[];
}

const AVATAR_POOL = [
   "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
   "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
   "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
   "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
   "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80",
   "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&h=150&q=80",
];

const containerVariants = {
   hidden: { opacity: 0 },
   show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
   hidden: { opacity: 0, x: 20 },
   show: {
      opacity: 1,
      x: 0,
      transition: { type: "spring" as const, stiffness: 100, damping: 16 },
   },
};

const RecentHosts = ({ sessions }: RecentHostsProps) => {
   const navigate = useNavigate();

   const getAvatarsForPlayerCount = (count: number, sessionId: string) => {
      const avatars: string[] = [];
      const seed = sessionId.charCodeAt(0) || 0;
      for (let i = 0; i < count; i++) {
         avatars.push(AVATAR_POOL[(seed + i) % AVATAR_POOL.length]);
      }
      return avatars;
   };

   return (
      <section className="space-y-3">
         {/* Section header — Apple Fitness style */}
         <div className="flex justify-between items-center">
            <h2 className="text-[17px] font-bold text-black dark:text-white tracking-tight">Buổi host gần đây</h2>
            <button
               onClick={() => navigate("/history")}
               className="text-[#0A84FF] text-[13px] font-semibold flex items-center gap-0.5 cursor-pointer bg-transparent border-none p-0 outline-none hover:opacity-75 transition-opacity"
            >
               Xem tất cả
               <ChevronRight size={14} strokeWidth={2.5} />
            </button>
         </div>

         {sessions.length === 0 ? (
            <div className="bg-white dark:bg-[#1C1C1E] rounded-[20px] p-6 text-center text-black/30 dark:text-white/30 text-sm border border-black/5 dark:border-white/[0.07]">
               Chưa có buổi host hoàn tất nào gần đây
            </div>
         ) : (
            <motion.div
               variants={containerVariants}
               initial="hidden"
               animate="show"
               className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 -mx-4 px-4"
            >
               {sessions.map((session) => {
                  const playerAvatars = getAvatarsForPlayerCount(session.quantityPlayer, session.id);
                  const isComplete = session.status === "complete";

                  return (
                     <motion.div
                        key={session.id}
                        variants={cardVariants}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(`/host/report/${session.id}`)}
                        className="min-w-65 w-65 bg-white dark:bg-[#1C1C1E] rounded-[20px] p-4 flex flex-col gap-3 shrink-0 cursor-pointer border border-black/5 dark:border-white/[0.07] active:bg-black/2 dark:active:bg-white/3 transition-colors"
                     >
                        {/* Top row */}
                        <div className="flex justify-between items-start">
                           <div>
                              <div className="text-[11px] font-medium text-black/35 dark:text-white/35 mb-1">{session.date}</div>
                              <div className="text-[15px] font-bold text-black dark:text-white tracking-tight line-clamp-1">{session.courtName}</div>
                           </div>

                           {/* Status chip */}
                           <span
                              className={`text-[10px] font-bold px-2.5 py-1 rounded-full select-none shrink-0 ${
                                 isComplete ? "bg-[#30D158]/12 text-[#30D158]" : "bg-[#FF375F]/10 text-[#FF375F]"
                              }`}
                           >
                              {isComplete ? "Hoàn tất" : "Đã hủy"}
                           </span>
                        </div>

                        {/* Bottom row: profit + avatars */}
                        <div className="flex justify-between items-end">
                           <div className="flex flex-col">
                              <span className="text-[10px] font-semibold text-black/30 dark:text-white/30 uppercase tracking-wider mb-0.5">
                                 Lợi nhuận
                              </span>
                              <span className="text-[18px] font-black text-[#30D158] tracking-tight leading-none">
                                 {session.profit.toLocaleString("vi-VN")}đ
                              </span>
                           </div>

                           <div className="flex select-none">
                              <Avatar.Group
                                 max={{
                                    count: 3,
                                    style: {
                                       color: "#0A84FF",
                                       backgroundColor: "rgba(10, 132, 255, 0.12)",
                                       fontSize: "11px",
                                       fontWeight: "bold",
                                       border: "2px solid transparent",
                                    },
                                 }}
                              >
                                 {playerAvatars.map((url, idx) => (
                                    <Avatar key={idx} src={url} style={{ border: "2px solid transparent" }} />
                                 ))}
                              </Avatar.Group>
                           </div>
                        </div>
                     </motion.div>
                  );
               })}
            </motion.div>
         )}
      </section>
   );
};

export default RecentHosts;
