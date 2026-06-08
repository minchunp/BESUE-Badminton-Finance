import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PrimaryActionProps {
   onClick?: () => void;
}

const PrimaryAction = ({ onClick }: PrimaryActionProps) => {
   const navigate = useNavigate();

   return (
      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.35, ease: "easeOut" }}>
         <motion.button
            onClick={onClick ?? (() => navigate("/host"))}
            whileTap={{ scale: 0.975 }}
            className="w-full h-13 bg-[#0A84FF] rounded-[10px] flex items-center justify-center gap-2 cursor-pointer hover:bg-[#0070E0] transition-colors"
         >
            <div className="flex items-center justify-center gap-1.5 select-none text-white text-[15px] font-bold tracking-tight">
               <Plus size={18} strokeWidth={2.8} />
               Tạo buổi host mới
            </div>
         </motion.button>
      </motion.section>
   );
};

export default PrimaryAction;
