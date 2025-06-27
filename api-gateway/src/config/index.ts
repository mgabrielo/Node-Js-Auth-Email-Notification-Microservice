import dotenv from "dotenv";
dotenv.config();

interface Config {
  SERIVCE_NAME: string;
  PORT: number;
  AUTH_JWT_SECRET: string;
  GATEWAY_JWT_SECRET: string;
  GATEWAY_EXPIRES_IN: string;
  AUTH_SERVICE_URL: string;
  DEFAULT_TIMEOUT: number;
  ACCOUNT_SERVICE_URL: string;
  REDIS_URL: string;
  LOG_LEVEL: string;
}

export const config: Config = {
  SERIVCE_NAME: require("../../package.json")?.name,
  PORT: Number(process.env.PORT) || 30000,
  DEFAULT_TIMEOUT: Number(process.env.DEFAULT_TIMEOUT) || 30000,
  AUTH_JWT_SECRET: (process.env.AUTH_JWT_SECRET as string) || "auth-key",
  GATEWAY_JWT_SECRET:
    (process.env.GATEWAY_JWT_SECRET as string) || "gateway-key",
  GATEWAY_EXPIRES_IN: (process.env.GATEWAY_EXPIRES_IN as string) || "1m",
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
  AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL || "http://localhost:3001",
  ACCOUNT_SERVICE_URL:
    process.env.ACCOUNT_SERVICE_URL || "http://localhost:3002",
  LOG_LEVEL: (process.env.logging as string) || "info",
};
