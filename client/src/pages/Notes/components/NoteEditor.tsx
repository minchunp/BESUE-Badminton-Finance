import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Loader2, Trash2 } from "lucide-react";
import { formatEditorDate } from "../utils/date";
import type { NoteEditorProps } from "../types";

export const NoteEditor = ({
   activeNote,
   setActiveNote,
   editTitle,
   setEditTitle,
   editContent,
   setEditContent,
   isSaving,
   handleDeleteNote,
}: NoteEditorProps) => {
   return (
      <AnimatePresence>
         {activeNote && (
            <motion.div
               initial={{ x: "100%" }}
               animate={{ x: 0 }}
               exit={{ x: "100%" }}
               transition={{ type: "spring", stiffness: 350, damping: 30 }}
               className="fixed inset-0 z-100 bg-white dark:bg-black flex flex-col w-full h-full pb-10"
            >
               {/* Top toolbar */}
               <div className="px-6 py-4 flex justify-between items-center border-b border-black/5 dark:border-white/6 bg-white/50 dark:bg-black/50 backdrop-blur-md">
                  <button
                     onClick={() => setActiveNote(null)}
                     className="flex items-center gap-1 font-sans text-md font-bold text-[#0A84FF] cursor-pointer outline-none border-none bg-transparent"
                  >
                     <ChevronLeft size={17} strokeWidth={2.5} />
                     Ghi chú
                  </button>

                  <span className="font-sans text-[10px] font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-1.5 select-none">
                     {isSaving ? (
                        <>
                           <Loader2 size={10} className="animate-spin text-[#0A84FF]" />
                           Đang lưu
                        </>
                     ) : (
                        "Đã lưu"
                     )}
                  </span>

                  <button
                     onClick={() => handleDeleteNote(activeNote._id)}
                     className="w-9 h-9 rounded-lg flex items-center justify-center text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer outline-none border-none bg-transparent"
                  >
                     <Trash2 size={17} strokeWidth={2} />
                  </button>
               </div>

               {/* Editing Scroll Area */}
               <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
                  {/* date edited info */}
                  <div className="text-center font-sans text-[10px] font-bold text-gray-400 dark:text-zinc-500 select-none">
                     {formatEditorDate(activeNote.updatedAt)}
                  </div>

                  {/* Title Input */}
                  <input
                     type="text"
                     value={editTitle}
                     onChange={(e) => setEditTitle(e.target.value)}
                     placeholder="Tiêu đề"
                     className="w-full bg-transparent! border-none outline-none font-sans text-xl font-black text-gray-900 dark:text-white tracking-tight"
                  />

                  {/* Content Textarea */}
                  <textarea
                     value={editContent}
                     onChange={(e) => setEditContent(e.target.value)}
                     placeholder="Bắt đầu viết ghi chú..."
                     className="w-full flex-1 bg-transparent! border-none outline-none font-sans text-sm font-semibold text-gray-700 dark:text-zinc-300 leading-relaxed resize-none"
                  />
               </div>
            </motion.div>
         )}
      </AnimatePresence>
   );
};

export default NoteEditor;
