/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { notesApi, type INote } from "../../../api/services/notes.api";
import type { UseNotesResult } from "../types";

export const useNotes = (): UseNotesResult => {
   const [notes, setNotes] = useState<INote[]>([]);
   const [searchQuery, setSearchQuery] = useState("");
   const [activeNote, setActiveNote] = useState<INote | null>(null);

   // Form fields state inside editor
   const [editTitle, setEditTitle] = useState("");
   const [editContent, setEditContent] = useState("");

   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState("");
   const [isSaving, setIsSaving] = useState(false);

   // Ref to manage auto-save debounce timeouts
   const saveTimeoutRef = useRef<any>(null);

   // Confirm Delete Modal state
   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
   const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

   // 1. Fetch all notes on mount
   const fetchNotes = async () => {
      setIsLoading(true);
      setError("");
      try {
         const res = await notesApi.getAll();
         if (res.success && res.data) {
            setNotes(res.data);
         } else {
            setError(res.message || "Không thể tải danh sách ghi chú.");
         }
      } catch (err: any) {
         setError(err.message || "Lỗi máy chủ khi tải ghi chú.");
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => {
      fetchNotes();
   }, []);

   // 2. Set form states when activeNote changes
   useEffect(() => {
      if (activeNote) {
         setEditTitle(activeNote.title);
         setEditContent(activeNote.content);
      } else {
         setEditTitle("");
         setEditContent("");
      }
   }, [activeNote]);

   // 3. Auto-save triggers when title or content is edited (Debounce: 700ms)
   useEffect(() => {
      if (!activeNote) return;

      // Avoid triggering auto-save on initial load
      if (editTitle === activeNote.title && editContent === activeNote.content) {
         return;
      }

      // Clear any pending timeouts
      if (saveTimeoutRef.current) {
         clearTimeout(saveTimeoutRef.current);
      }

      setIsSaving(true);

      saveTimeoutRef.current = setTimeout(async () => {
         try {
            const res = await notesApi.update(activeNote._id, {
               title: editTitle.trim() || "Ghi chú mới",
               content: editContent,
            });

            if (res.success && res.data) {
               // Update local list of notes
               setNotes((prevNotes) => prevNotes.map((n) => (n._id === activeNote._id ? res.data : n)));
               // Update active note record to match server
               setActiveNote(res.data);
            }
         } catch (err) {
            console.error("Auto-save failed:", err);
         } finally {
            setIsSaving(false);
         }
      }, 700);

      return () => {
         if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      };
   }, [editTitle, editContent]);

   // 4. Create a new note
   const handleCreateNote = async () => {
      setError("");
      try {
         const res = await notesApi.create();
         if (res.success && res.data) {
            setNotes((prev) => [res.data, ...prev]);
            setActiveNote(res.data);
         } else {
            setError(res.message || "Không thể khởi tạo ghi chú mới.");
         }
      } catch (err: any) {
         setError(err.message || "Lỗi kết nối khi khởi tạo ghi chú.");
      }
   };

   // 5. Delete a note
   const handleDeleteNote = (id: string) => {
      setNoteToDelete(id);
      setIsDeleteModalOpen(true);
   };

   const confirmDeleteNote = async () => {
      if (!noteToDelete) return;
      setError("");
      setIsDeleteModalOpen(false);
      try {
         const res = await notesApi.delete(noteToDelete);
         if (res.success) {
            setNotes((prev) => prev.filter((n) => n._id !== noteToDelete));
            setActiveNote(null);
            setNoteToDelete(null);
         } else {
            setError(res.message || "Không thể xóa ghi chú này.");
         }
      } catch (err: any) {
         setError(err.message || "Lỗi máy chủ khi xóa ghi chú.");
      }
   };

   // 6. Filter notes dynamically by search query
   const filteredNotes = notes.filter(
      (n) => n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.content.toLowerCase().includes(searchQuery.toLowerCase()),
   );

   return {
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
   };
};
