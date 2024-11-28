import dotenv from "dotenv";
dotenv.config();

const getEnvVar = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
};

const CLIENT_HOST = getEnvVar("CLIENT_HOST");
const CLIENT_PORT = getEnvVar("CLIENT_PORT");
const SERVER_PORT = getEnvVar("SERVER_PORT");
const JWT_SECRET = getEnvVar("JWT_SECRET");
const JWT_REFRESH_SECRET = getEnvVar("JWT_REFRESH_SECRET");
const SMTP_HOST = getEnvVar("SMTP_HOST");
const SMTP_PORT = parseInt(getEnvVar("SMTP_PORT"), 10);
const SMTP_USER = getEnvVar("SMTP_USER");
const SMTP_PASS = getEnvVar("SMTP_PASS");
const SMTP_EMAIL_FROM = getEnvVar("SMTP_EMAIL_FROM");
const DB_USER = getEnvVar("DB_USER");
const DB_HOST = getEnvVar("DB_HOST");
const DB_DATABASE = getEnvVar("DB_DATABASE");
const DB_PASS = getEnvVar("DB_PASS");
const DB_PORT = parseInt(getEnvVar("DB_PORT"), 10);
const AI_API_URL = getEnvVar("AI_API_URL");
const AI_API_KEY = getEnvVar("AI_API_KEY");
const TOKEN_EXPIRATION = getEnvVar("TOKEN_EXPIRATION");
const REFRESH_TOKEN_EXPIRATION = getEnvVar("REFRESH_TOKEN_EXPIRATION");

export const config = {
  CLIENT_HOST,
  CLIENT_PORT,
  SERVER_PORT,
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_EMAIL_FROM,
  DB_USER,
  DB_HOST,
  DB_DATABASE,
  DB_PASS,
  DB_PORT,
  AI_API_URL,
  AI_API_KEY,
  TOKEN_EXPIRATION,
  REFRESH_TOKEN_EXPIRATION,
};
