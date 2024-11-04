import dotenv from "dotenv";
dotenv.config();

const getEnvVar = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
};

const AI_API_KEY = getEnvVar("AI_API_KEY");
const AI_API_BASE_URL = getEnvVar("AI_API_BASE_URL");
const AI_API_ENDPOINT = getEnvVar("AI_API_ENDPOINT");
const SMTP_HOST = getEnvVar("SMTP_HOST");
const SMTP_PORT = parseInt(getEnvVar("SMTP_PORT"), 10);
const SMTP_USER = getEnvVar("SMTP_USER");
const SMTP_PASS = getEnvVar("SMTP_PASS");
const SMTP_EMAIL_FROM = getEnvVar("SMTP_EMAIL_FROM");
const SERVER_PORT = getEnvVar("SERVER_PORT");
const JWT_SECRET = getEnvVar("JWT_SECRET");
const DB_USER = getEnvVar("DB_USER");
const DB_HOST = getEnvVar("DB_HOST");
const DB_DATABASE = getEnvVar("DB_DATABASE");
const DB_PASS = getEnvVar("DB_PASS");
const DB_PORT = parseInt(getEnvVar("DB_PORT"), 10);

export const config = {
  AI_API_KEY,
  AI_API_BASE_URL,
  AI_API_ENDPOINT,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_EMAIL_FROM,
  SERVER_PORT,
  JWT_SECRET,
  DB_USER,
  DB_HOST,
  DB_DATABASE,
  DB_PASS,
  DB_PORT,
};
