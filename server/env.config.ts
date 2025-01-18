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
const TOKEN_EXPIRATION = getEnvVar("TOKEN_EXPIRATION");
const REFRESH_TOKEN_EXPIRATION = getEnvVar("REFRESH_TOKEN_EXPIRATION");
const GOOGLE_CLIENT_ID = getEnvVar("GOOGLE_CLIENT_ID");
const AI_API_URL = getEnvVar("AI_API_URL");
const AI_API_KEY = getEnvVar("AI_API_KEY");
const AI_MODEL = getEnvVar("AI_MODEL");
const AI_MAX_TOKENS = getEnvVar("AI_MAX_TOKENS");
const AI_TEMPERATURE = getEnvVar("AI_TEMPERATURE");
const PROMPT_STRING = getEnvVar("PROMPT_STRING");
const STORAGE_API_URL = getEnvVar("STORAGE_API_URL");
const STORAGE_KEY_ID = getEnvVar("STORAGE_KEY_ID");
const STORAGE_APP_KEY = getEnvVar("STORAGE_APP_KEY");
const STORAGE_BUCKET_NAME = getEnvVar("STORAGE_BUCKET_NAME");
const STORAGE_BUCKET_ID = getEnvVar("STORAGE_BUCKET_ID");
const STORAGE_ENDPOINT = getEnvVar("STORAGE_ENDPOINT");
const STORAGE_DELETE_URL = getEnvVar("STORAGE_DELETE_URL");

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
  TOKEN_EXPIRATION,
  REFRESH_TOKEN_EXPIRATION,
  GOOGLE_CLIENT_ID,
  AI_API_URL,
  AI_API_KEY,
  AI_MODEL,
  AI_MAX_TOKENS,
  AI_TEMPERATURE,
  PROMPT_STRING,
  STORAGE_API_URL,
  STORAGE_KEY_ID,
  STORAGE_APP_KEY,
  STORAGE_BUCKET_NAME,
  STORAGE_BUCKET_ID,
  STORAGE_ENDPOINT,
  STORAGE_DELETE_URL,
};
