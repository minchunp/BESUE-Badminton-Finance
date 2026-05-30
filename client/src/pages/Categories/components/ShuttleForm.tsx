/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { Form, Input, InputNumber, Button } from "antd";
import type { IShuttle } from "../types";

interface ShuttleFormProps {
   initialValues: IShuttle | null;
   onFinish: (values: any) => void;
   loading: boolean;
}

const ShuttleForm = ({ initialValues, onFinish, loading }: ShuttleFormProps) => {
   const [form] = Form.useForm();

   // Sync form values when editing item changes
   useEffect(() => {
      if (initialValues) {
         form.setFieldsValue(initialValues);
      } else {
         form.resetFields();
         form.setFieldsValue({ quantityPerTube: 12 }); // default quantity
      }
   }, [initialValues, form]);

   return (
      <Form form={form} layout="vertical" onFinish={onFinish} className="space-y-4 max-w-md mx-auto">
         {/* Form: Shuttle name */}
         <Form.Item
            name="name"
            label={<span className="font-sans text-[10px] font-bold text-black/35 dark:text-white/35 uppercase tracking-wider">Tên loại cầu</span>}
            rules={[{ required: true, message: "Vui lòng nhập tên loại cầu!" }]}
         >
            <Input
               placeholder="VD: Yonex AS-50"
               className="h-12 rounded-xl border border-black/8 dark:border-white/8 bg-transparent! text-black dark:text-white font-sans text-sm"
            />
         </Form.Item>

         {/* Form: Price per tube */}
         <Form.Item
            name="pricePerTube"
            label={
               <span className="font-sans text-[10px] font-bold text-black/35 dark:text-white/35 uppercase tracking-wider">Giá tiền (VNĐ) / Ống</span>
            }
            rules={[{ required: true, message: "Vui lòng nhập giá ống!" }]}
         >
            <InputNumber
               placeholder="0"
               formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
               parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
               className="w-full h-12 flex items-center rounded-xl! border border-black/8 dark:border-white/8 bg-transparent! text-black dark:text-white font-sans text-sm"
            />
         </Form.Item>

         {/* Form: Quantity per tube */}
         <Form.Item
            name="quantityPerTube"
            label={
               <span className="font-sans text-[10px] font-bold text-black/35 dark:text-white/35 uppercase tracking-wider">Số lượng quả / Ống</span>
            }
            rules={[{ required: true, message: "Vui lòng nhập số quả!" }]}
         >
            <InputNumber
               placeholder="12"
               className="w-full h-12 flex items-center rounded-xl! border border-black/8 dark:border-white/8 bg-transparent! text-black dark:text-white font-sans text-sm"
            />
         </Form.Item>

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

export default ShuttleForm;
