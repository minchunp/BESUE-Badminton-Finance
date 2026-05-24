import type { HistoryFilterType } from "../types";

interface FilterTabsProps {
   filter: HistoryFilterType;
   setFilter: (filter: HistoryFilterType) => void;
   counts: {
      all: number;
      completed: number;
      active: number;
      draft: number;
   };
}

const FilterTabs = ({ filter, setFilter, counts }: FilterTabsProps) => {
   return (
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 px-1">
         <button
            onClick={() => setFilter("all")}
            className={`whitespace-nowrap px-4 py-2 rounded-full font-sans text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer ${
               filter === "all"
                  ? "bg-[#7b41b4] text-white shadow-md shadow-[#7b41b4]/20"
                  : "bg-white text-gray-500 border border-gray-100 shadow-xs hover:text-[#7b41b4]"
            }`}
         >
            Tất cả ({counts.all})
         </button>
         <button
            onClick={() => setFilter("completed")}
            className={`whitespace-nowrap px-4 py-2 rounded-full font-sans text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer ${
               filter === "completed"
                  ? "bg-[#7b41b4] text-white shadow-md shadow-[#7b41b4]/20"
                  : "bg-white text-gray-500 border border-gray-100 shadow-xs hover:text-[#7b41b4]"
            }`}
         >
            Hoàn tất ({counts.completed})
         </button>
         <button
            onClick={() => setFilter("active")}
            className={`whitespace-nowrap px-4 py-2 rounded-full font-sans text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer ${
               filter === "active"
                  ? "bg-[#7b41b4] text-white shadow-md shadow-[#7b41b4]/20"
                  : "bg-white text-gray-500 border border-gray-100 shadow-xs hover:text-[#7b41b4]"
            }`}
         >
            Đang diễn ra ({counts.active})
         </button>
         <button
            onClick={() => setFilter("draft")}
            className={`whitespace-nowrap px-4 py-2 rounded-full font-sans text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer ${
               filter === "draft"
                  ? "bg-[#7b41b4] text-white shadow-md shadow-[#7b41b4]/20"
                  : "bg-white text-gray-500 border border-gray-100 shadow-xs hover:text-[#7b41b4]"
            }`}
         >
            Nháp ({counts.draft})
         </button>
      </div>
   );
};

export default FilterTabs;
