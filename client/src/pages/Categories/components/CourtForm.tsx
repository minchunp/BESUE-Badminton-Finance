/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { Form, Input, InputNumber, Button } from "antd";
import { Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import type { ICourt } from "../types";

interface CourtFormProps {
   initialValues: ICourt | null;
   onFinish: (values: any) => void;
   loading: boolean;
}

const CourtForm = ({ initialValues, onFinish, loading }: CourtFormProps) => {
   const [form] = Form.useForm();

   // Sync form values when editing item changes
   useEffect(() => {
      if (initialValues) {
         form.setFieldsValue(initialValues);
      } else {
         form.resetFields();
         // Setup one default time slot for streamlined user onboarding
         form.setFieldsValue({
            timeSlots: [{ startHour: "05:00", endHour: "08:00", pricePerHour: 80000 }],
         });
      }
   }, [initialValues, form]);

   return (
      <Form form={form} layout="vertical" onFinish={onFinish} className="space-y-4 max-w-md mx-auto">
         {/* Form: Court name */}
         <Form.Item
            name="name"
            label={<span className="font-sans text-[11px] font-bold text-black/35 dark:text-white/35 uppercase tracking-wider">Tên sân</span>}
            rules={[{ required: true, message: "Vui lòng nhập tên sân!" }]}
         >
            <Input
               placeholder="VD: Sân Olympic"
               className="h-12 rounded-xl border border-black/8 dark:border-white/8 bg-transparent! text-black dark:text-white font-sans text-sm"
            />
         </Form.Item>

         {/* Form: Court address */}
         <Form.Item
            name="address"
            label={<span className="font-sans text-[11px] font-bold text-black/35 dark:text-white/35 uppercase tracking-wider">Địa chỉ</span>}
         >
            <Input
               placeholder="VD: 123 Nguyễn Du, Quận 1"
               className="h-12 rounded-xl border border-black/8 dark:border-white/8 bg-transparent! text-black dark:text-white font-sans text-sm"
            />
         </Form.Item>

         {/* Form: Court description */}
         <Form.Item
            name="description"
            label={<span className="font-sans text-[11px] font-bold text-black/35 dark:text-white/35 uppercase tracking-wider">Mô tả</span>}
         >
            <Input.TextArea
               placeholder="VD: Sân lót thảm cao cấp, có trần cao thoáng mát..."
               rows={2}
               className="rounded-xl border border-black/8 dark:border-white/8 bg-transparent! text-black dark:text-white font-sans text-sm"
            />
         </Form.Item>

         {/* Dynamic Time Slots Form List */}
         <div className="space-y-2">
            <span className="font-sans text-[11px] font-bold text-black/35 dark:text-white/35 uppercase tracking-wider block">
               Cấu hình khung giờ & Bảng giá
            </span>

            <Form.List name="timeSlots">
               {(fields, { add, remove }) => (
                  <div className="space-y-3">
                     {fields.map(({ key, name: listName, ...restField }) => (
                        <motion.div
                           key={key}
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           className="p-3.5 bg-black/2 dark:bg-white/2 border border-black/5 dark:border-white/5 rounded-2xl space-y-3 relative"
                        >
                           {/* Time inputs */}
                           <div className="grid grid-cols-2 gap-2.5">
                              <Form.Item
                                 {...restField}
                                 name={[listName, "startHour"]}
                                 label={
                                    <span className="text-[10px] font-bold text-black/35 dark:text-white/35 uppercase tracking-wider">
                                       Giờ bắt đầu
                                    </span>
                                 }
                                 rules={[{ required: true, message: "Thiếu giờ!" }]}
                                 className="mb-0!"
                              >
                                 <Input placeholder="05:00" className="h-10 rounded-lg! text-xs bg-transparent!" />
                              </Form.Item>

                              <Form.Item
                                 {...restField}
                                 name={[listName, "endHour"]}
                                 label={
                                    <span className="text-[10px] font-bold text-black/35 dark:text-white/35 uppercase tracking-wider">
                                       Giờ kết thúc
                                    </span>
                                 }
                                 rules={[{ required: true, message: "Thiếu giờ!" }]}
                                 className="mb-0!"
                              >
                                 <Input placeholder="08:00" className="h-10 rounded-lg! text-xs bg-transparent!" />
                              </Form.Item>
                           </div>

                           {/* Price input */}
                           <div className="flex gap-2 items-end">
                              <Form.Item
                                 {...restField}
                                 name={[listName, "pricePerHour"]}
                                 label={
                                    <span className="text-[10px] font-bold text-black/35 dark:text-white/35 uppercase tracking-wider">
                                       Giá tiền / giờ (VNĐ)
                                    </span>
                                 }
                                 rules={[{ required: true, message: "Thiếu giá!" }]}
                                 className="flex-1 mb-0!"
                              >
                                 <InputNumber
                                    placeholder="80,000"
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                                    className="w-full h-10 flex items-center rounded-lg! text-xs bg-transparent!"
                                 />
                              </Form.Item>

                              {fields.length > 1 && (
                                 <Button
                                    type="text"
                                    danger
                                    onClick={() => remove(listName)}
                                    icon={<Trash2 size={16} />}
                                    className="h-10 w-10 flex items-center justify-center shrink-0 rounded-lg border border-red-50 dark:border-red-950/20 hover:bg-red-50 dark:hover:bg-rose-950/20"
                                 />
                              )}
                           </div>
                        </motion.div>
                     ))}

                     <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<Plus size={14} />}
                        className="h-11 rounded-xl flex items-center justify-center text-xs font-bold text-gray-500 hover:text-[#0A84FF] hover:border-[#0A84FF]"
                     >
                        Thêm khung giờ mới
                     </Button>
                  </div>
               )}
            </Form.List>
         </div>

         {/* Submit controls */}
         <div className="pt-2">
            <Button
               type="primary"
               htmlType="submit"
               loading={loading}
               block
               className="h-12! rounded-2xl text-sm font-bold bg-[#0A84FF]! border-none text-white flex items-center justify-center active:scale-[0.98] transition-transform shadow-none"
            >
               Lưu thông tin
            </Button>
         </div>
      </Form>
   );
};

export default CourtForm;
