import { Modal } from "antd";
import { Trash2 } from "lucide-react";
import type { DeleteConfirmModalProps } from "../types";

export const DeleteConfirmModal = ({ isOpen, onCancel, onConfirm }: DeleteConfirmModalProps) => {
   return (
      <Modal open={isOpen} onCancel={onCancel} footer={null} centered closable={false} width={340} className="transparent-modal">
         <div className="font-sans overflow-hidden bg-white dark:bg-[#1C1C1E] flex flex-col items-center text-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FF3B30]/10 flex items-center justify-center text-[#FF3B30]">
               <Trash2 size={22} strokeWidth={2.5} />
            </div>
            <div className="space-y-1.5">
               <h3 className="font-sans text-[15px] font-bold text-black dark:text-white uppercase tracking-wider">Xác nhận xóa</h3>
               <p className="font-sans text-xs text-black/45 dark:text-white/45 font-semibold leading-relaxed max-w-64">
                  Bạn có chắc chắn muốn xóa vĩnh viễn ghi chú này không? Thao tác này không thể hoàn tác.
               </p>
            </div>
            <div className="flex w-full gap-3 pt-2">
               <button
                  onClick={onCancel}
                  className="flex-1 h-11 rounded-2xl bg-black/5 dark:bg-white/8 text-black/60 dark:text-white/60 font-sans text-xs font-bold uppercase tracking-wider hover:bg-black/10 dark:hover:bg-white/12 transition-colors border-none cursor-pointer"
               >
                  Hủy
               </button>
               <button
                  onClick={onConfirm}
                  className="flex-1 h-11 rounded-2xl bg-[#FF3B30] hover:bg-[#FF453A] text-white font-sans text-xs font-bold uppercase tracking-wider transition-all active:scale-[0.98] border-none cursor-pointer"
               >
                  Xóa
               </button>
            </div>
         </div>
      </Modal>
   );
};

export default DeleteConfirmModal;
