import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, MapPin, Users, Zap } from "lucide-react";
import type { ActiveSession } from "../types";

interface ActiveHostSessionProps {
   session: ActiveSession;
}

const STEP_LABELS: Record<number, string> = {
   1: "Thông tin cơ bản",
   2: "Danh sách vãng lai",
   3: "Số cầu sử dụng",
};

const STEP_PROGRESS: Record<number, number> = {
   1: 25,
   2: 55,
   3: 80,
};

const ActiveHostSession = ({ session }: ActiveHostSessionProps) => {
   const navigate = useNavigate();

   const stepLabel = STEP_LABELS[session.currentStep] ?? "Đang diễn ra";
   const progressPct = STEP_PROGRESS[session.currentStep] ?? 50;

   const handleResume = () => {
      navigate(`/host?id=${session.id}&step=${session.currentStep}`);
   };

   return (
      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: "easeOut" }}>
         {/* Section header */}
         <div className="flex justify-between items-center mb-3">
            <h2 className="text-[17px] font-bold text-black dark:text-white tracking-tight">Buổi host hiện tại</h2>
            <div className="flex items-center gap-1.5">
               <motion.div
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  className="w-2 h-2 rounded-full bg-[#FF9F0A]"
               />
               <span className="text-[12px] font-semibold text-[#FF9F0A]">Đang diễn ra</span>
            </div>
         </div>

         {/* Card */}
         <motion.button onClick={handleResume} whileTap={{ scale: 0.985 }} className="w-full text-left cursor-pointer">
            <div
               className="relative rounded-[14px] overflow-hidden border border-[#0A84FF]/18 dark:border-[#0A84FF]/22"
               style={{
                  background: "linear-gradient(135deg, #0A84FF 0%, #0070E0 100%)",
               }}
            >
               {/* Subtle pattern overlay */}
               <div
                  className="absolute inset-0 opacity-[0.06]"
                  style={{
                     backgroundImage: `radial-gradient(circle at 80% 20%, #ffffff 0%, transparent 60%)`,
                  }}
               />

               <div className="relative z-10 px-4 py-4">
                  {/* Top: Court + Date */}
                  <div className="flex items-start justify-between mb-3">
                     <div className="flex-1 min-w-0 pr-3">
                        <div className="flex items-center gap-1.5 mb-1">
                           <MapPin size={11} className="text-white/60 shrink-0" strokeWidth={2} />
                           <span className="text-[11px] font-semibold text-white/60 uppercase tracking-wider truncate">{session.date}</span>
                        </div>
                        <h3 className="text-[17px] font-bold text-white! tracking-tight leading-tight line-clamp-1">{session.courtName}</h3>
                     </div>

                     {/* Resume CTA */}
                     <div className="flex items-center gap-1.5 bg-white/20 hover:bg-white/25 transition-colors rounded-lg px-3 py-2 shrink-0">
                        <span className="text-[12px] font-bold text-white">Tiếp tục</span>
                        <ArrowRight size={13} className="text-white" strokeWidth={2.5} />
                     </div>
                  </div>

                  {/* Middle: Stats row */}
                  <div className="flex items-center gap-4 mb-3.5">
                     <div className="flex items-center gap-1.5">
                        <Users size={13} className="text-white/60" strokeWidth={2} />
                        <span className="text-[12px] font-semibold text-white/85">
                           {session.playersCount > 0 ? `${session.playersCount} người` : "Chưa có người"}
                        </span>
                     </div>
                     <div className="flex items-center gap-1.5">
                        <Zap size={13} className="text-white/60" strokeWidth={2} />
                        <span className="text-[12px] font-semibold text-white/85">{stepLabel}</span>
                     </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1.5">
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">Tiến độ</span>
                        <span className="text-[10px] font-bold text-white/70">Bước {session.currentStep}/3</span>
                     </div>
                     <div className="h-1.5 bg-white/15 rounded-full overflow-hidden">
                        <motion.div
                           initial={{ width: 0 }}
                           animate={{ width: `${progressPct}%` }}
                           transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                           className="h-full bg-white/80 rounded-full"
                        />
                     </div>
                  </div>
               </div>
            </div>
         </motion.button>
      </motion.section>
   );
};

export default ActiveHostSession;
