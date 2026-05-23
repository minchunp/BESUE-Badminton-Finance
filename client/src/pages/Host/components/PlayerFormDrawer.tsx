import { useEffect } from "react";
import { Drawer, Form, Input, InputNumber, Button } from "antd";
import type { PlayerFormDrawerProps } from "../types";

const PlayerFormDrawer = ({ isOpen, onClose, editingIndex, onSave, initialValues }: PlayerFormDrawerProps) => {
   const [form] = Form.useForm();

   useEffect(() => {
      if (isOpen) {
         form.resetFields();
         if (initialValues) {
            form.setFieldsValue(initialValues);
         }
      }
   }, [isOpen, initialValues, form]);

   return (
      <Drawer
         title={
            <div className="font-sans text-base font-extrabold text-gray-800 tracking-tight">
               {editingIndex !== null ? "Chỉnh sửa người chơi" : "Thêm người chơi vãng lai"}
            </div>
         }
         placement="bottom"
         onClose={onClose}
         open={isOpen}
         height="50%"
         styles={{
            body: {
               paddingTop: 16,
               paddingBottom: 40,
               backgroundColor: "#f9f9f9",
            },
            header: {
               borderBottom: "1px solid rgba(0,0,0,0.05)",
               paddingTop: 20,
               paddingBottom: 16,
            },
         }}
         className="rounded-t-4xl overflow-hidden"
      >
         <Form form={form} layout="vertical" onFinish={onSave} className="space-y-4 max-w-md mx-auto">
            <Form.Item
               name="name"
               label={<span className="font-sans text-xs font-bold text-gray-500 uppercase tracking-wider">Tên người đại diện</span>}
               rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
            >
               <Input placeholder="VD: Nguyễn Văn A" className="h-12 rounded-xl border border-gray-200/80 font-sans shadow-sm text-sm" />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
               <Form.Item
                  name="maleCount"
                  label={<span className="font-sans text-xs font-bold text-gray-500 uppercase tracking-wider">Số lượng Nam</span>}
                  rules={[{ required: true, message: "Thiếu!" }]}
               >
                  <InputNumber min={0} className="w-full h-12 flex items-center rounded-xl border border-gray-200/80 font-sans shadow-sm text-sm" />
               </Form.Item>

               <Form.Item
                  name="femaleCount"
                  label={<span className="font-sans text-xs font-bold text-gray-500 uppercase tracking-wider">Số lượng Nữ</span>}
                  rules={[{ required: true, message: "Thiếu!" }]}
               >
                  <InputNumber min={0} className="w-full h-12 flex items-center rounded-xl border border-gray-200/80 font-sans shadow-sm text-sm" />
               </Form.Item>
            </div>

            <div className="pt-0">
               <Button
                  type="primary"
                  htmlType="submit"
                  block
                  className="h-12! rounded-xl! text-sm! font-bold shadow-md shadow-[#7b41b4]/20 bg-linear-to-r! from-[#c185fd] to-[#7b41b4] border-none text-white flex items-center justify-center active:scale-98 transition-transform cursor-pointer"
               >
                  Xác nhận
               </Button>
            </div>
         </Form>
      </Drawer>
   );
};

export default PlayerFormDrawer;
