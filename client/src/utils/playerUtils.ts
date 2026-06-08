import type { IPlayer, IPersonPayment } from "../api/services/session.api";

// ================================================================
// Types
// ================================================================

/**
 * A single "expanded" individual derived from an IPlayer entry.
 * One IPlayer with maleCount=2, femaleCount=1 expands to 3 ExpandedPlayer rows.
 */
export interface ExpandedPlayer {
   /** Human-readable display name: "Minh", "Bạn của Minh", "Bạn của Minh 1" */
   displayName: string;
   /** Index in the original IPlayer[] array */
   playerIdx: number;
   /** Index within this player's individualMatches[] / individualPayments[] */
   personIdx: number;
   /** Gender of this individual */
   gender: "male" | "female";
   /** Current match count */
   matches: number;
   /** Payment info for this individual */
   payment: IPersonPayment;
}

/** Summary badge for a player card's payment status */
export type PaymentBadgeInfo =
   | { type: "all_paid"; method: "cash" | "transfer" } // Tất cả đã đóng, cùng loại
   | { type: "mixed_method" } // Tất cả đã đóng, hỗn hợp TM+CK
   | { type: "partial"; paidCount: number; total: number } // Một phần đã đóng
   | { type: "unpaid" } // Tất cả nợ phí
   | { type: "unchecked" }; // Chưa check in

// ================================================================
// Core name helpers
// ================================================================

/**
 * Returns the display name for a specific person inside a player entry.
 * personIdx 0 → player.name
 * personIdx 1 → "Bạn của [name]"
 * personIdx 2+ → "Bạn của [name] [personIdx - 1]"
 */
export const getExpandedName = (playerName: string, personIdx: number): string => {
   if (personIdx === 0) return playerName;
   if (personIdx === 1) return `Bạn của ${playerName}`;
   return `Bạn của ${playerName} ${personIdx - 1}`;
};

/** Males come first (indices 0..maleCount-1), then females */
export const getPersonGender = (player: IPlayer, personIdx: number): "male" | "female" => (personIdx < player.maleCount ? "male" : "female");

// ================================================================
// expandPlayers — core flat-list builder
// ================================================================

/**
 * Expands a list of IPlayer entries into a flat list of ExpandedPlayer rows.
 * Each IPlayer with (maleCount + femaleCount = N) produces N rows.
 */
export const expandPlayers = (players: IPlayer[]): ExpandedPlayer[] => {
   const result: ExpandedPlayer[] = [];
   players.forEach((player, playerIdx) => {
      const total = player.maleCount + player.femaleCount;
      for (let personIdx = 0; personIdx < total; personIdx++) {
         result.push({
            displayName: getExpandedName(player.name, personIdx),
            playerIdx,
            personIdx,
            gender: getPersonGender(player, personIdx),
            matches: player.individualMatches?.[personIdx] ?? 0,
            payment: player.individualPayments?.[personIdx] ?? { isPaid: false },
         });
      }
   });
   return result;
};

// ================================================================
// individualMatches management
// ================================================================

export const initIndividualMatches = (maleCount: number, femaleCount: number): number[] => new Array(maleCount + femaleCount).fill(0);

export const resizeIndividualMatches = (existing: number[], newMaleCount: number, newFemaleCount: number): number[] => {
   const newTotal = newMaleCount + newFemaleCount;
   const padded = [...existing, ...new Array(Math.max(0, newTotal - existing.length)).fill(0)];
   return padded.slice(0, newTotal);
};

export const updateIndividualMatch = (matches: number[], personIdx: number, delta: number): number[] => {
   const copy = [...matches];
   copy[personIdx] = Math.max(0, (copy[personIdx] ?? 0) + delta);
   return copy;
};

// ================================================================
// individualPayments management
// ================================================================

/** Khởi tạo individualPayments: tất cả chưa đóng */
export const initIndividualPayments = (maleCount: number, femaleCount: number): IPersonPayment[] =>
   new Array(maleCount + femaleCount).fill(null).map(() => ({ isPaid: false, isPresent: false }));

/** Resize giữ data cũ khi chỉnh sửa số lượng */
export const resizeIndividualPayments = (existing: IPersonPayment[], newMaleCount: number, newFemaleCount: number): IPersonPayment[] => {
   const newTotal = newMaleCount + newFemaleCount;
   const padded = [...existing, ...new Array(Math.max(0, newTotal - existing.length)).fill(null).map(() => ({ isPaid: false, isPresent: false }))];
   return padded.slice(0, newTotal);
};

/**
 * Tính lại isPaid và paymentMethod tổng hợp từ individualPayments.
 * isPaid = true khi TẤT CẢ cá nhân đã đóng.
 * paymentMethod = undefined khi hỗn hợp (TM + CK).
 */
export const deriveGroupPaymentStatus = (payments: IPersonPayment[]): { isPaid: boolean; paymentMethod?: "cash" | "transfer" } => {
   if (payments.length === 0) return { isPaid: false };
   const isPaid = payments.every((p) => p.isPaid);
   if (!isPaid) return { isPaid: false };
   const methods = new Set(payments.filter((p) => p.isPaid).map((p) => p.paymentMethod));
   const method = methods.size === 1 ? [...methods][0] : undefined;
   return { isPaid: true, paymentMethod: method };
};

// ================================================================
// Payment badge info for card display
// ================================================================

/**
 * Returns structured badge info for display in the player list card.
 * Handles all cases: unchecked, all-paid (same method), mixed, partial, unpaid.
 */
export const getPaymentBadgeInfo = (player: IPlayer): PaymentBadgeInfo => {
   if (!player.isCheckedIn) return { type: "unchecked" };

   const payments = player.individualPayments ?? [];
   if (payments.length === 0) {
      // Fallback to legacy isPaid field
      if (!player.isPaid) return { type: "unpaid" };
      return { type: "all_paid", method: player.paymentMethod ?? "cash" };
   }

   const paidCount = payments.filter((p) => p.isPaid).length;
   const total = payments.length;

   if (paidCount === 0) return { type: "unpaid" };
   if (paidCount < total) return { type: "partial", paidCount, total };

   // All paid — check methods
   const paidMethods = new Set(payments.filter((p) => p.isPaid).map((p) => p.paymentMethod));
   if (paidMethods.size === 1) {
      return { type: "all_paid", method: [...paidMethods][0] ?? "cash" };
   }
   return { type: "mixed_method" };
};

// ================================================================
// Revenue calculation
// ================================================================

/**
 * Calculates collected revenue using individual payment data.
 * Falls back to group isPaid for backward compatibility.
 */
export const calcCollectedRevenue = (players: IPlayer[], feeMale: number, feeFemale: number): number => {
   let total = 0;
   players.forEach((player) => {
      const payments = player.individualPayments ?? [];
      if (payments.length > 0) {
         // Use per-person data
         payments.forEach((p, personIdx) => {
            if (p.isPaid) {
               total += p.customFee !== undefined ? p.customFee : personIdx < player.maleCount ? feeMale : feeFemale;
            }
         });
      } else {
         // Fallback: group-level isPaid
         if (player.isPaid) {
            total += player.maleCount * feeMale + player.femaleCount * feeFemale;
         }
      }
   });
   return total;
};

/**
 * Calculates the total expected fee of a player group, accounting for individual customFee overrides.
 */
export const getPlayerTotalFee = (player: IPlayer, feeMale: number, feeFemale: number): number => {
   const payments = player.individualPayments ?? [];
   const totalCount = player.maleCount + player.femaleCount;
   let sum = 0;
   for (let personIdx = 0; personIdx < totalCount; personIdx++) {
      const p = payments[personIdx];
      if (p && p.customFee !== undefined) {
         sum += p.customFee;
      } else {
         sum += personIdx < player.maleCount ? feeMale : feeFemale;
      }
   }
   return sum;
};

// ================================================================
// Formatting helpers shared across features
// ================================================================

export const formatAmount = (value: number, showSign = false): string => {
   const prefix = showSign && value > 0 ? "+" : "";
   if (Math.abs(value) >= 1000000) return `${prefix}${(value / 1000000).toFixed(1)}M`;
   if (Math.abs(value) >= 1000) return `${prefix}${(value / 1000).toFixed(0)}k`;
   return `${prefix}${value.toLocaleString("vi-VN")}đ`;
};

export const formatAmountFull = (value: number): string => {
   if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M đ`;
   return `${value.toLocaleString("vi-VN")}đ`;
};

export const formatSessionDate = (dateStr: string): string => {
   try {
      const d = new Date(dateStr);
      const days = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
      const dayName = days[d.getDay()];
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${dayName}, ${day}/${month}/${year}`;
   } catch {
      return dateStr;
   }
};

export const isToday = (dateStr: string): boolean => {
   try {
      const today = new Date();
      const d = new Date(dateStr);
      return today.getDate() === d.getDate() && today.getMonth() === d.getMonth() && today.getFullYear() === d.getFullYear();
   } catch {
      return false;
   }
};

/**
 * Short date format: "T6 , 31/5"
 * Dùng chung cho StepBasicInfo & StepPlayerList (thay thế getFormattedDate inline)
 */
export const formatShortDate = (dateStr: string): string => {
   try {
      const d = new Date(dateStr);
      const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
      return `${days[d.getDay()]} , ${d.getDate()}/${d.getMonth() + 1}`;
   } catch {
      return dateStr;
   }
};
