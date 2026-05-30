import { useEffect } from "react";
import { Drawer, Form, Input, InputNumber, Button } from "antd";
import type { PlayerFormDrawerProps } from "../types";
import { useTheme } from "../../../contexts/ThemeContext";

const PlayerFormDrawer = ({ isOpen, onClose, editingIndex, onSave, initialValues }: PlayerFormDrawerProps) => {
   const { isDarkMode } = useTheme();
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
            <div className="mt-2 font-sans text-base font-bold text-black/35 dark:text-white/35 text-center flex-1">
               {editingIndex !== null ? "Chỉnh sửa người chơi" : "Thêm người chơi vãng lai"}
            </div>
         }
         closeIcon={false}
         placement="bottom"
         onClose={onClose}
         open={isOpen}
         size="60%"
         styles={{
            body: {
               paddingTop: 20,
               paddingBottom: 0,
               backgroundColor: isDarkMode ? "#1C1C1E" : "#FFFFFF",
            },
            header: {
               borderBottom: isDarkMode ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.05)",
               paddingTop: 40,
               paddingBottom: 20,
               backgroundColor: isDarkMode ? "#1C1C1E" : "#FFFFFF",
            },
            mask: {
               backdropFilter: "blur(10px)",
               backgroundColor: "rgba(0,0,0,0.35)",
            },
         }}
         className="rounded-t-4xl overflow-hidden"
      >
         <Form form={form} layout="vertical" onFinish={onSave} className="space-y-4 max-w-md mx-auto">
            <Form.Item
               name="name"
               label={
                  <span className="font-sans text-xs font-bold text-black/55 dark:text-white/55 uppercase tracking-wider">Tên người đại diện</span>
               }
               rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
            >
               <Input
                  placeholder="VD: Nguyễn Văn A"
                  className="h-12 rounded-xl border border-black/8 dark:border-white/8 font-sans text-sm bg-transparent!"
               />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
               <Form.Item
                  name="maleCount"
                  label={<span className="font-sans text-xs font-bold text-black/55 dark:text-white/55 uppercase tracking-wider">Số lượng Nam</span>}
                  rules={[{ required: true, message: "Thiếu!" }]}
               >
                  <InputNumber
                     min={0}
                     className="w-full h-12 flex items-center rounded-xl border border-black/8 dark:border-white/8 font-sans text-sm"
                  />
               </Form.Item>

               <Form.Item
                  name="femaleCount"
                  label={<span className="font-sans text-xs font-bold text-black/55 dark:text-white/55 uppercase tracking-wider">Số lượng Nữ</span>}
                  rules={[{ required: true, message: "Thiếu!" }]}
               >
                  <InputNumber
                     min={0}
                     className="w-full h-12 flex items-center rounded-xl border border-black/8 dark:border-white/8 font-sans text-sm"
                  />
               </Form.Item>
            </div>

            <div className="pt-0">
               <Button
                  type="primary"
                  htmlType="submit"
                  block
                  className="h-13! rounded-2xl! text-sm! font-bold border-none text-white flex items-center justify-center active:scale-[0.98] transition-transform cursor-pointer"
                  style={{ background: "#0A84FF" }}
               >
                  Xác nhận
               </Button>
            </div>
         </Form>
      </Drawer>
   );
};

export default PlayerFormDrawer;
