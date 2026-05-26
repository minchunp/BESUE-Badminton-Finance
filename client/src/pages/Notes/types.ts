import type { INote } from "../../api/services/notes.api";

export interface UseNotesResult {
   notes: INote[];
   isLoading: boolean;
   error: string;
   isSaving: boolean;
   searchQuery: string;
   setSearchQuery: (query: string) => void;
   activeNote: INote | null;
   setActiveNote: (note: INote | null) => void;
   editTitle: string;
   setEditTitle: (title: string) => void;
   editContent: string;
   setEditContent: (content: string) => void;
   isDeleteModalOpen: boolean;
   setIsDeleteModalOpen: (open: boolean) => void;
   handleCreateNote: () => Promise<void>;
   handleDeleteNote: (id: string) => void;
   confirmDeleteNote: () => Promise<void>;
   filteredNotes: INote[];
}

export interface DeleteConfirmModalProps {
   isOpen: boolean;
   onCancel: () => void;
   onConfirm: () => void;
}

export interface NoteListProps {
   notes: INote[];
   filteredNotes: INote[];
   isLoading: boolean;
   searchQuery: string;
   setSearchQuery: (query: string) => void;
   setActiveNote: (note: INote | null) => void;
   handleCreateNote: () => void;
}

export interface NoteEditorProps {
   activeNote: INote | null;
   setActiveNote: (note: INote | null) => void;
   editTitle: string;
   setEditTitle: (title: string) => void;
   editContent: string;
   setEditContent: (content: string) => void;
   isSaving: boolean;
   handleDeleteNote: (id: string) => void;
}
