import { motion } from "framer-motion";
import { Search, SquarePen, Loader2, Notebook } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatAppleDate } from "../utils/date";
import type { NoteListProps } from "../types";

export const NoteList = ({ notes, filteredNotes, isLoading, searchQuery, setSearchQuery, setActiveNote, handleCreateNote }: NoteListProps) => {
   const navigate = useNavigate();

   return (
      <div className="flex flex-col gap-4 w-full">
         {/* Header Title */}
         <div className="flex justify-between items-center px-1">
            <h1 className="font-sans text-2xl font-black text-gray-900 dark:text-white tracking-tight">Ghi chú</h1>
            <div className="flex items-center gap-3">
               <motion.button
                  onClick={handleCreateNote}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#C084FC]/15 dark:bg-[#C084FC]/25 hover:bg-[#C084FC]/25 text-[#7b41b4] dark:text-[#dbb8ff] rounded-xl font-sans text-xs font-bold transition-all cursor-pointer border-none shadow-sm"
               >
                  <SquarePen size={14} strokeWidth={2.5} />
                  Viết ghi chú
               </motion.button>
               <motion.button
                  onClick={() => navigate("/home")}
                  whileTap={{ scale: 0.95 }}
                  className="font-sans text-xs font-bold text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200 cursor-pointer bg-transparent border-none"
               >
                  Trang chủ
               </motion.button>
            </div>
         </div>

         {/* iOS Search Bar */}
         <div className="relative w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 select-none pointer-events-none">
               <Search size={15} />
            </span>
            <input
               type="text"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               placeholder="Tìm kiếm"
               className="w-full h-9.5 bg-gray-100 dark:bg-zinc-800/80 hover:bg-gray-150/50 dark:hover:bg-zinc-800 border-none rounded-xl pl-11 pr-4 font-sans text-xs font-semibold text-gray-800 dark:text-white outline-none transition-all placeholder-gray-400"
            />
         </div>

         {/* List notes container */}
         {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
               <Loader2 size={24} className="text-[#C084FC] animate-spin" />
               <span className="font-sans text-xs font-bold text-gray-400 uppercase tracking-widest">Đang tải...</span>
            </div>
         ) : filteredNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-center px-4">
               <Notebook size={32} className="text-gray-300 dark:text-zinc-700" />
               <h4 className="font-sans font-black text-gray-800 dark:text-zinc-300 text-sm">
                  {searchQuery ? "Không tìm thấy ghi chú" : "Không có ghi chú nào"}
               </h4>
               <p className="font-sans text-xs text-gray-400 max-w-55 leading-relaxed">
                  {searchQuery ? "Thử tìm kiếm với từ khóa khác" : "Bấm nút 'Viết ghi chú' ở trên để tạo ghi chú đầu tiên"}
               </p>
            </div>
         ) : (
            <div className="glass-card rounded-2xl overflow-hidden divide-y divide-gray-100 dark:divide-zinc-800/40">
               {filteredNotes.map((note) => (
                  <div
                     key={note._id}
                     onClick={() => setActiveNote(note)}
                     className="p-4 hover:bg-gray-50/50 dark:hover:bg-zinc-800/20 active:bg-gray-100/50 dark:active:bg-zinc-800/30 cursor-pointer flex flex-col gap-1 transition-all"
                  >
                     <h3 className="font-sans text-xs font-extrabold text-gray-800 dark:text-zinc-200 line-clamp-1">{note.title || "Ghi chú mới"}</h3>
                     <div className="flex items-center gap-1.5 font-sans text-[11px]">
                        <span className="text-gray-400 dark:text-zinc-500 shrink-0 font-medium">{formatAppleDate(note.updatedAt)}</span>
                        <span className="text-gray-300 dark:text-zinc-700 select-none">•</span>
                        <span className="text-gray-400 dark:text-zinc-500 line-clamp-1 font-medium">
                           {note.content || "Chưa có mô tả nội dung..."}
                        </span>
                     </div>
                  </div>
               ))}
            </div>
         )}

         {/* Bottom notes count */}
         {!isLoading && notes.length > 0 && (
            <div className="text-center py-4 font-sans text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-widest">
               {notes.length} ghi chú
            </div>
         )}
      </div>
   );
};

export default NoteList;
