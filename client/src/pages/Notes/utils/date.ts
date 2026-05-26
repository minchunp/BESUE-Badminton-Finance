import dayjs from "dayjs";
import "dayjs/locale/vi";

dayjs.locale("vi");

// Helper to format date in Apple Notes style
export const formatAppleDate = (dateStr: string): string => {
   if (!dateStr) return "";
   const date = dayjs(dateStr);
   const now = dayjs();

   if (date.isSame(now, "day")) {
      return date.format("HH:mm");
   } else if (date.isSame(now.subtract(1, "day"), "day")) {
      return "Hôm qua";
   } else if (date.isSame(now, "year")) {
      return date.format("D [thg] M");
   } else {
      return date.format("DD/MM/YYYY");
   }
};

// Helper to format full details date in Editor
export const formatEditorDate = (dateStr: string): string => {
   if (!dateStr) return "";
   return `Đã sửa ${dayjs(dateStr).format("D MMMM YYYY [lúc] HH:mm")}`;
};
