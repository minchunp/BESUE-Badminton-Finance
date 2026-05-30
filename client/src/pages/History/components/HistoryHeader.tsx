import { motion, AnimatePresence } from "framer-motion";
import { Input } from "antd";
import { Search } from "lucide-react";

interface HistoryHeaderProps {
   searchQuery: string;
   setSearchQuery: (query: string) => void;
   searchOpen: boolean;
   setSearchOpen: (open: boolean) => void;
}

const HistoryHeader = ({ searchQuery, setSearchQuery, searchOpen, setSearchOpen }: HistoryHeaderProps) => {
   return (
      <div className="flex justify-between items-center px-0.5">
         <h2 className="text-[22px] font-bold text-black dark:text-white tracking-tight">Lịch sử</h2>

         <div className="flex items-center gap-2">
            <AnimatePresence>
               {searchOpen && (
                  <motion.div
                     initial={{ width: 0, opacity: 0 }}
                     animate={{ width: 176, opacity: 1 }}
                     exit={{ width: 0, opacity: 0 }}
                     className="overflow-hidden"
                  >
                     <Input
                        placeholder="Tìm sân, ghi chú..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-9 rounded-2xl border-black/10 text-xs"
                        allowClear
                     />
                  </motion.div>
               )}
            </AnimatePresence>

            <button
               onClick={() => setSearchOpen(!searchOpen)}
               aria-label="Search"
               className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors active:scale-95 duration-150 cursor-pointer ${
                  searchOpen
                     ? "bg-[#0A84FF]/12 text-[#0A84FF]"
                     : "bg-black/5 dark:bg-white/[0.07] text-black/40 dark:text-white/40 hover:text-[#0A84FF]"
               }`}
            >
               <Search size={16} />
            </button>
         </div>
      </div>
   );
};

export default HistoryHeader;
