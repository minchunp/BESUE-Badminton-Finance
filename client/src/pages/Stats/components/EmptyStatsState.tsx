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
            <div className="w-24 h-24 rounded-3xl bg-linear-to-br from-purple-50 to-pink-50 border border-purple-100/50 flex items-center justify-center shadow-inner">
               <BarChart3 size={36} className="text-gray-300" strokeWidth={1.5} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-2xl bg-purple-100 border-2 border-white flex items-center justify-center shadow-sm">
               <span className="text-sm">📭</span>
            </div>
         </div>

         <h3 className="font-sans text-base font-black text-gray-700 mb-1">Chưa có dữ liệu</h3>
         <p className="font-sans text-xs font-medium text-gray-400 max-w-52 leading-relaxed mb-6">
            Không có buổi host nào đã hoàn thành trong <span className="font-bold text-[#7b41b4]">{periodLabel}</span>. Hãy tạo và hoàn thành buổi
            host để xem thống kê.
         </p>

         <button
            onClick={() => navigate("/host")}
            className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-[#c185fd] to-[#7b41b4] text-white rounded-2xl font-sans text-xs font-black shadow-md shadow-purple-200 hover:opacity-90 active:scale-95 transition-all cursor-pointer"
         >
            <Plus size={14} strokeWidth={2.5} />
            Tạo buổi host mới
         </button>
      </motion.div>
   );
};

export default EmptyStatsState;
