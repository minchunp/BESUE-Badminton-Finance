import { motion, AnimatePresence } from "framer-motion";
import { Input } from "antd";
import { Search } from "lucide-react";

interface HistoryHeaderProps {
   searchQuery: string;
   setSearchQuery: (query: string) => void;
   searchOpen: boolean;
   setSearchOpen: (open: boolean) => void;
}

const HistoryHeader = ({
   searchQuery,
   setSearchQuery,
   searchOpen,
   setSearchOpen
}: HistoryHeaderProps) => {
   return (
      <div className="flex justify-between items-center px-1">
         <h2 className="text-[22px] font-black text-gray-900 tracking-tight">Lịch sử</h2>
         
         <div className="flex items-center gap-2">
            <AnimatePresence>
               {searchOpen && (
                  <motion.div
                     initial={{ width: 0, opacity: 0 }}
                     animate={{ width: 180, opacity: 1 }}
                     exit={{ width: 0, opacity: 0 }}
                     className="overflow-hidden"
                  >
                     <Input
                        placeholder="Tìm sân, ghi chú..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-9 rounded-full border border-gray-200 shadow-xs text-xs"
                        allowClear
                     />
                  </motion.div>
               )}
            </AnimatePresence>
            
            <button
               onClick={() => setSearchOpen(!searchOpen)}
               aria-label="Search"
               className={`w-9 h-9 flex items-center justify-center rounded-full transition-all active:scale-95 duration-200 cursor-pointer ${
                  searchOpen
                     ? "bg-[#7b41b4]/10 text-[#7b41b4]"
                     : "bg-white border border-gray-100 text-gray-500 shadow-xs hover:text-[#7b41b4]"
               }`}
            >
               <Search size={16} />
            </button>
         </div>
      </div>
   );
};

export default HistoryHeader;
