import { motion } from "framer-motion";
import { BarChart3, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EmptyStatsStateProps {
   periodLabel: string;
}

const EmptyStatsState = ({ periodLabel }: EmptyStatsStateProps) => {
   const navigate = useNavigate();

   return (
      <motion.div
         initial={{ opacity: 0, scale: 0.95 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ type: "spring", stiffness: 100 }}
         className="flex flex-col items-center justify-center py-16 px-6 text-center"
      >
         {/* Illustration */}
         <div className="relative mb-6">
            <div className="w-24 h-24 rounded-[24px] bg-[#0A84FF]/12 border border-[#0A84FF]/20 flex items-center justify-center">
               <BarChart3 size={36} className="text-black/20 dark:text-white/20" strokeWidth={1.5} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-2xl bg-[#0A84FF]/15 border-2 border-white dark:border-black flex items-center justify-center shadow-sm">
               <span className="text-sm">📭</span>
            </div>
         </div>

         <h3 className="font-sans text-base font-black text-black dark:text-white mb-1">Chưa có dữ liệu</h3>
         <p className="font-sans text-xs font-medium text-black/55 dark:text-white/55 max-w-52 leading-relaxed mb-6">
            Không có buổi host nào đã hoàn thành trong <span className="font-bold text-[#0A84FF]">{periodLabel}</span>. Hãy tạo và hoàn thành buổi
            host để xem thống kê.
         </p>

         <button
            onClick={() => navigate("/host")}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0A84FF] text-white rounded-2xl font-sans text-xs font-black shadow-[0_4px_16px_rgba(88,86,214,0.28)] hover:opacity-90 active:scale-95 transition-all cursor-pointer"
         >
            <Plus size={14} strokeWidth={2.5} />
            Tạo buổi host mới
         </button>
      </motion.div>
   );
};

export default EmptyStatsState;
