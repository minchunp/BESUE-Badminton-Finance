import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { useNotes } from "./hooks/useNotes";
import NoteList from "./components/NoteList";
import NoteEditor from "./components/NoteEditor";
import DeleteConfirmModal from "./components/DeleteConfirmModal";

const NotesPage = () => {
   const {
      notes,
      isLoading,
      error,
      isSaving,
      searchQuery,
      setSearchQuery,
      activeNote,
      setActiveNote,
      editTitle,
      setEditTitle,
      editContent,
      setEditContent,
      isDeleteModalOpen,
      setIsDeleteModalOpen,
      handleCreateNote,
      handleDeleteNote,
      confirmDeleteNote,
      filteredNotes,
   } = useNotes();

   return (
      <div className="w-full relative min-h-[75vh] pt-4">
         {/* error alert */}
         <AnimatePresence>
            {error && (
               <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-xl px-4 py-3 text-rose-500 flex items-center gap-2 mb-4 font-sans text-xs font-semibold"
               >
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{error}</span>
               </motion.div>
            )}
         </AnimatePresence>

         {/* Note List Component */}
         <NoteList
            notes={notes}
            filteredNotes={filteredNotes}
            isLoading={isLoading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setActiveNote={setActiveNote}
            handleCreateNote={handleCreateNote}
         />

         {/* Slide-in Editor Component */}
         <NoteEditor
            activeNote={activeNote}
            setActiveNote={setActiveNote}
            editTitle={editTitle}
            setEditTitle={setEditTitle}
            editContent={editContent}
            setEditContent={setEditContent}
            isSaving={isSaving}
            handleDeleteNote={handleDeleteNote}
         />

         {/* Confirm Delete Modal */}
         <DeleteConfirmModal isOpen={isDeleteModalOpen} onCancel={() => setIsDeleteModalOpen(false)} onConfirm={confirmDeleteNote} />
      </div>
   );
};

export default NotesPage;
