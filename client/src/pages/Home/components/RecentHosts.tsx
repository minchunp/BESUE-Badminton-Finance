import { motion } from "framer-motion";
import { Avatar } from "antd";
import { ChevronRight } from "lucide-react";
import type { RecentSession } from "../types";

interface RecentHostsProps {
   sessions: RecentSession[];
}

// Collection of premium avatar URLs for high-end look
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
   show: {
      opacity: 1,
      transition: {
         staggerChildren: 0.1,
      },
   },
};

const cardVariants = {
   hidden: { opacity: 0, x: 30 },
   show: {
      opacity: 1,
      x: 0,
      transition: {
         type: "spring" as const,
         stiffness: 80,
         damping: 14,
      },
   },
};

const RecentHosts = ({ sessions }: RecentHostsProps) => {
   // Helper function to generate an array of avatars based on player count
   const getAvatarsForPlayerCount = (count: number, sessionId: string) => {
      const avatars: string[] = [];
      const seed = sessionId.charCodeAt(0) || 0;
      for (let i = 0; i < count; i++) {
         const avatarIndex = (seed + i) % AVATAR_POOL.length;
         avatars.push(AVATAR_POOL[avatarIndex]);
      }
      return avatars;
   };

   return (
      <section className="space-y-4">
         <div className="flex justify-between items-center px-1">
            <h2 className="font-sans text-lg font-extrabold text-[#1a1c1c] tracking-tight">Buổi host gần đây</h2>
            <a href="#" className="font-sans text-[13px] font-bold text-[#7b41b4] hover:text-[#6f5092] transition-colors flex items-center gap-0.5">
               Xem tất cả
               <ChevronRight size={14} strokeWidth={2.5} />
            </a>
         </div>

         <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex gap-4 overflow-x-auto hide-scrollbar pb-3 -mx-6 px-6"
         >
            {sessions.map((session) => {
               const playerAvatars = getAvatarsForPlayerCount(session.quantityPlayer, session.id);
               const isComplete = session.status === "complete";

               return (
                  <motion.div
                     key={session.id}
                     variants={cardVariants}
                     whileHover={{ y: -3, scale: 1.01 }}
                     whileTap={{ scale: 0.99 }}
                     className="min-w-70 w-70 glass-card rounded-2xl p-4 flex flex-col gap-3 shrink-0 transition-shadow hover:shadow-[0_12px_24px_rgba(216,180,254,0.2)]"
                  >
                     <div className="flex justify-between items-start">
                        <div>
                           <div className="font-sans text-[11px] font-semibold text-gray-400 mb-1">{session.date}</div>
                           <div className="font-sans text-sm font-extrabold text-gray-800 tracking-tight">{session.courtName}</div>
                        </div>

                        <span
                           className={`font-sans text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider select-none shrink-0 ${
                              isComplete ? "bg-[#FB7185]/10 text-[#FB7185]" : "bg-red-50 text-red-500"
                           }`}
                        >
                           {isComplete ? "Hoàn tất" : "Đã hủy"}
                        </span>
                     </div>

                     <div className="flex justify-between items-end mt-2">
                        <div className="flex flex-col">
                           <span className="font-sans text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Lợi nhuận</span>
                           <span className="font-sans text-lg font-extrabold text-emerald-600 tracking-tight leading-none">
                              +{session.profit.toLocaleString("vi-VN")}đ
                           </span>
                        </div>

                        {/* Ant Design Avatar.Group for beautiful profile representation */}
                        <div className="flex select-none">
                           <Avatar.Group
                              max={{
                                 count: 3,
                                 style: {
                                    color: "#7b41b4",
                                    backgroundColor: "#f0dbff",
                                    fontSize: "11px",
                                    fontWeight: "bold",
                                    border: "2px solid #ffffff",
                                 },
                              }}
                           >
                              {playerAvatars.map((url, idx) => (
                                 <Avatar key={idx} src={url} style={{ border: "2px solid #ffffff" }} className="shadow-sm" />
                              ))}
                           </Avatar.Group>
                        </div>
                     </div>
                  </motion.div>
               );
            })}
         </motion.div>
      </section>
   );
};

export default RecentHosts;
