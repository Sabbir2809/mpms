import dotenv from "dotenv";
import { envSchema } from "./env.schema";

dotenv.config();

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = {
  nodeEnv: parsed.data.NODE_ENV,
  port: parseInt(parsed.data.PORT, 10),
  mongodbUri: parsed.data.MONGODB_URI,
  jwt: {
    accessSecret: parsed.data.JWT_ACCESS_SECRET,
    refreshSecret: parsed.data.JWT_REFRESH_SECRET,
    accessExpiresIn: parsed.data.JWT_ACCESS_EXPIRES_IN,
    refreshExpiresIn: parsed.data.JWT_REFRESH_EXPIRES_IN,
  },
  bcryptSaltRounds: parseInt(parsed.data.BCRYPT_SALT_ROUNDS, 10),
  clientUrl: parsed.data.CLIENT_URL,
  uploadDir: parsed.data.UPLOAD_DIR,
  maxFileSize: parseInt(parsed.data.MAX_FILE_SIZE, 10),
};
