import dotenv from "dotenv";

// Load environment variables FIRST — trước tất cả mọi thứ
dotenv.config();

// ================================================================
// Startup Environment Validation
// Crash sớm với thông báo rõ ràng nếu thiếu biến bắt buộc
// ================================================================
const REQUIRED_ENV_VARS = ["MONGODB_URI", "JWT_SECRET"] as const;

for (const key of REQUIRED_ENV_VARS) {
   if (!process.env[key]) {
      console.error(`\n❌ [ENV ERROR] Biến môi trường bắt buộc "${key}" chưa được khai báo.`);
      console.error(`   → Sao chép server/.env.example thành server/.env và điền đầy đủ.\n`);
      process.exit(1);
   }
}

// ================================================================
// Typed Config Object — dùng chung toàn server thay vì gọi process.env mỗi chỗ
// ================================================================
export const config = {
   port: Number(process.env.PORT) || 5001,
   nodeEnv: process.env.NODE_ENV ?? "development",
   mongoUri: process.env.MONGODB_URI!,
   jwtSecret: process.env.JWT_SECRET!,
   jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "30d",
   clientOrigin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
} as const;
