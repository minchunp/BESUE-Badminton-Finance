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
            label={<span className="font-sans text-xs font-bold text-gray-500 uppercase tracking-wider">Tên loại cầu</span>}
            rules={[{ required: true, message: "Vui lòng nhập tên loại cầu!" }]}
         >
            <Input placeholder="VD: Yonex AS-50" className="h-12 rounded-xl border border-gray-200/80 font-sans shadow-sm text-sm" />
         </Form.Item>

         {/* Form: Price per tube */}
         <Form.Item
            name="pricePerTube"
            label={<span className="font-sans text-xs font-bold text-gray-500 uppercase tracking-wider">Giá tiền (VNĐ) / Ống</span>}
            rules={[{ required: true, message: "Vui lòng nhập giá ống!" }]}
         >
            <InputNumber
               placeholder="0"
               formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
               parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
               className="w-full h-12 flex items-center rounded-xl border border-gray-200/80 font-sans shadow-sm text-sm"
            />
         </Form.Item>

         {/* Form: Quantity per tube */}
         <Form.Item
            name="quantityPerTube"
            label={<span className="font-sans text-xs font-bold text-gray-500 uppercase tracking-wider">Số lượng quả / Ống</span>}
            rules={[{ required: true, message: "Vui lòng nhập số quả!" }]}
         >
            <InputNumber
               placeholder="12"
               className="w-full h-12 flex items-center rounded-xl border border-gray-200/80 font-sans shadow-sm text-sm"
            />
         </Form.Item>

         {/* Submit controls */}
         <div className="pt-6">
            <Button
               type="primary"
               htmlType="submit"
               loading={loading}
               block
               className="h-12 rounded-xl text-sm font-bold shadow-md shadow-[#7b41b4]/20 bg-[#7b41b4] border-none text-white flex items-center justify-center active:scale-98 transition-transform"
            >
               Lưu thông tin
            </Button>
         </div>
      </Form>
   );
};

export default ShuttleForm;
