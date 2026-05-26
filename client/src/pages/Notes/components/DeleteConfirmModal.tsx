import { Modal } from "antd";
import { Trash2 } from "lucide-react";
import type { DeleteConfirmModalProps } from "../types";

export const DeleteConfirmModal = ({ isOpen, onCancel, onConfirm }: DeleteConfirmModalProps) => {
   return (
      <Modal open={isOpen} onCancel={onCancel} footer={null} centered closable={false} width={340} className="transparent-modal">
         <div className="font-sans overflow-hidden rounded-3xl bg-[#f6f4fa] dark:bg-zinc-900 border border-white/20 p-6 flex flex-col items-center text-center gap-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center text-rose-500 shadow-sm shadow-rose-100 dark:shadow-none">
               <Trash2 size={22} strokeWidth={2.5} />
            </div>
            <div className="space-y-1.5">
               <h3 className="font-sans text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Xác nhận xóa</h3>
               <p className="font-sans text-xs text-gray-400 dark:text-zinc-500 font-semibold leading-relaxed max-w-64">
                  Bạn có chắc chắn muốn xóa vĩnh viễn ghi chú này không? Thao tác này không thể hoàn tác.
               </p>
            </div>
            <div className="flex w-full gap-3 pt-2">
               <button
                  onClick={onCancel}
                  className="flex-1 h-11 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 font-sans text-xs font-extrabold uppercase tracking-widest hover:bg-gray-250/50 dark:hover:bg-zinc-750 transition-colors border-none cursor-pointer"
               >
                  Hủy
               </button>
               <button
                  onClick={onConfirm}
                  className="flex-1 h-11 rounded-xl bg-linear-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white font-sans text-xs font-extrabold uppercase tracking-widest shadow-md shadow-rose-200 dark:shadow-none transition-all active:scale-98 border-none cursor-pointer"
               >
                  Xóa
               </button>
            </div>
         </div>
      </Modal>
   );
};

export default DeleteConfirmModal;
