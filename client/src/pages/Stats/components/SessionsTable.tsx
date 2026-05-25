/* eslint-disable react-hooks/static-components */
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronUp, ChevronDown, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import type { SessionRow } from "../types";
import { formatAmountFull } from "../../../utils/playerUtils";

interface SessionsTableProps {
   data: SessionRow[];
   isLoading: boolean;
}

type SortKey = "date" | "revenue" | "totalCost" | "profit";
type SortDir = "asc" | "desc";

const ShimmerRow = () => (
   <div className="flex items-center gap-3 py-3 border-b border-gray-50 animate-pulse">
      <div className="w-16 h-4 bg-gray-200 rounded-full" />
      <div className="flex-1 h-4 bg-gray-100 rounded-full" />
      <div className="w-12 h-4 bg-gray-100 rounded-full" />
      <div className="w-14 h-4 bg-gray-100 rounded-full" />
   </div>
);

const SessionsTable = ({ data, isLoading }: SessionsTableProps) => {
   const navigate = useNavigate();
   const [sortKey, setSortKey] = useState<SortKey>("date");
   const [sortDir, setSortDir] = useState<SortDir>("desc");

   const handleSort = (key: SortKey) => {
      if (sortKey === key) {
         setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
         setSortKey(key);
         setSortDir("desc");
      }
   };

   const sorted = [...data].sort((a, b) => {
      let valA: number, valB: number;
      if (sortKey === "date") {
         valA = new Date(a.date).getTime();
         valB = new Date(b.date).getTime();
      } else {
         valA = a[sortKey];
         valB = b[sortKey];
      }
      return sortDir === "asc" ? valA - valB : valB - valA;
   });

   const SortIcon = ({ col }: { col: SortKey }) => {
      if (sortKey !== col) return <ChevronDown size={10} className="text-gray-300" />;
      return sortDir === "asc" ? <ChevronUp size={10} className="text-[#7b41b4]" /> : <ChevronDown size={10} className="text-[#7b41b4]" />;
   };

   const ColHeader = ({ label, col, align = "right" }: { label: string; col: SortKey; align?: "left" | "right" }) => (
      <button
         onClick={() => handleSort(col)}
         className={`flex items-center gap-0.5 font-sans text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-[#7b41b4] transition-colors cursor-pointer ${
            align === "right" ? "ml-auto" : ""
         }`}
      >
         {label} <SortIcon col={col} />
      </button>
   );

   return (
      <motion.section
         initial={{ opacity: 0, y: 16 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.25, type: "spring", stiffness: 100 }}
         className="glass-card rounded-3xl p-5 space-y-4"
      >
         {/* Header */}
         <div className="flex items-center justify-between">
            <div>
               <h3 className="font-sans text-md font-black text-gray-900">Chi tiết từng buổi</h3>
               <p className="font-sans text-[11px] font-medium text-gray-400 mt-0.5">{isLoading ? "—" : `${data.length} buổi đã hoàn thành`}</p>
            </div>
         </div>

         {/* Table */}
         <div className="overflow-x-auto -mx-1">
            <table className="w-full min-w-110">
               <thead>
                  <tr className="border-b border-gray-100">
                     <th className="pb-2 text-left">
                        <ColHeader label="Ngày" col="date" align="left" />
                     </th>
                     <th className="pb-2 text-left">
                        <span className="font-sans text-[9px] font-black uppercase tracking-widest text-gray-400">Sân</span>
                     </th>
                     <th className="pb-2 text-right">
                        <ColHeader label="Thu" col="revenue" />
                     </th>
                     <th className="pb-2 text-right">
                        <ColHeader label="Chi" col="totalCost" />
                     </th>
                     <th className="pb-2 text-right">
                        <ColHeader label="Lợi nhuận" col="profit" />
                     </th>
                     <th className="pb-2 w-5" />
                  </tr>
               </thead>

               <tbody>
                  {isLoading
                     ? Array.from({ length: 5 }).map((_, i) => (
                          <tr key={i}>
                             <td colSpan={6} className="py-0 px-0">
                                <ShimmerRow />
                             </td>
                          </tr>
                       ))
                     : sorted.map((row, i) => {
                          const isProfit = row.profit >= 0;
                          return (
                             <motion.tr
                                key={row._id}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.04, duration: 0.25 }}
                                onClick={() => navigate(`/host/report/${row._id}`)}
                                className="border-b border-gray-50 hover:bg-purple-50/30 transition-colors cursor-pointer group"
                             >
                                <td className="py-3 pr-2">
                                   <div className="flex flex-col gap-0.5">
                                      <span className="font-sans text-[11px] font-black text-gray-800">{dayjs(row.date).format("DD/MM")}</span>
                                      <span className="font-sans text-[9px] font-medium text-gray-400">{dayjs(row.date).format("YYYY")}</span>
                                   </div>
                                </td>
                                <td className="py-3 pr-2">
                                   <div className="flex flex-col gap-0.5">
                                      <span className="font-sans text-[11px] font-bold text-gray-700 truncate max-w-20">{row.courtName}</span>
                                      <span className="font-sans text-[9px] text-gray-400">{row.playerCount} người</span>
                                   </div>
                                </td>
                                <td className="py-3 text-right">
                                   <span className="font-sans text-[11px] font-black text-gray-800">{formatAmountFull(row.revenue)}</span>
                                </td>
                                <td className="py-3 text-right">
                                   <span className="font-sans text-[11px] font-bold text-gray-500">{formatAmountFull(row.totalCost)}</span>
                                </td>
                                <td className="py-3 text-right">
                                   <span
                                      className={`font-sans text-[11px] font-black px-2 py-0.5 rounded-full ${
                                         isProfit ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"
                                      }`}
                                   >
                                      {isProfit ? "+" : ""}
                                      {formatAmountFull(row.profit)}
                                   </span>
                                </td>
                                <td className="py-3 pl-1">
                                   <ChevronRight size={13} className="text-gray-300 group-hover:text-[#7b41b4] transition-colors" />
                                </td>
                             </motion.tr>
                          );
                       })}
               </tbody>
            </table>

            {!isLoading && data.length === 0 && (
               <div className="py-8 text-center">
                  <p className="font-sans text-xs font-bold text-gray-400">Không có dữ liệu trong kỳ này</p>
               </div>
            )}
         </div>
      </motion.section>
   );
};

export default SessionsTable;
