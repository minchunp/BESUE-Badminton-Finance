import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PrimaryActionProps {
   onClick?: () => void;
}

const PrimaryAction = ({ onClick }: PrimaryActionProps) => {
   const navigate = useNavigate();

   return (
      <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}>
         <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            className="w-full h-18 bg-linear-to-r from-[#6f5092] via-[#7b41b4] to-[#c084fc] rounded-2xl shadow-[0_8px_32px_rgba(216,180,254,0.3)] flex items-center justify-center gap-3 relative overflow-hidden group transition-all duration-300"
         >
            {/* Glossy overlay shine effect */}
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-linear-to-r from-transparent via-white/20 to-transparent opacity-40 group-hover:animate-shine" />

            <div className="flex flex-col items-center justify-center z-10 select-none" onClick={() => navigate("/host")}>
               <div className="flex items-center gap-2 text-white font-sans text-sm font-extrabold tracking-wider uppercase">
                  <Plus size={18} strokeWidth={3} className="transition-transform group-hover:rotate-90 duration-300" />
                  TẠO BUỔI HOST MỚI
               </div>
               <span className="text-white/80 font-sans text-[11px] font-semibold mt-1 tracking-wide">Track your badminton session now</span>
            </div>
         </motion.button>
      </motion.section>
   );
};

export default PrimaryAction;
