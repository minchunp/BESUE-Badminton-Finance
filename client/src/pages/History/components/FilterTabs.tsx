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

const TABS: { key: HistoryFilterType; label: string }[] = [
   { key: "all", label: "Tất cả" },
   { key: "completed", label: "Hoàn tất" },
   { key: "active", label: "Đang diễn ra" },
   { key: "draft", label: "Nháp" },
];

const FilterTabs = ({ filter, setFilter, counts }: FilterTabsProps) => {
   return (
      /* Apple Segmented Control container */
      <div className="bg-[#E5E5EA] dark:bg-[#2C2C2E] rounded-[10px] p-0.75 flex items-center gap-0 overflow-x-auto hide-scrollbar">
         {TABS.map(({ key, label }) => {
            const count = counts[key];
            const isActive = filter === key;
            return (
               <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`whitespace-nowrap flex-1 min-w-fit px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 active:scale-95 cursor-pointer border-none ${
                     isActive
                        ? "bg-white dark:bg-[#3A3A3C] text-black dark:text-white shadow-[0_1px_4px_rgba(0,0,0,0.10),0_0.5px_1px_rgba(0,0,0,0.06)]"
                        : "text-black/50 dark:text-white/45 hover:text-black dark:hover:text-white bg-transparent"
                  }`}
               >
                  {label} ({count})
               </button>
            );
         })}
      </div>
   );
};

export default FilterTabs;
