// ================================================================
// Shared API Response wrapper — dùng chung cho tất cả API services
// ================================================================

export interface ApiResponse<T> {
   success: boolean;
   message?: string;
   data: T;
}
