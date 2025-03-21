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
const TOKEN_EXPIRATION = parseInt(getEnvVar("TOKEN_EXPIRATION"), 10);
const REFRESH_TOKEN_EXPIRATION = parseInt(
  getEnvVar("REFRESH_TOKEN_EXPIRATION"),
  10
);
const VERIFICATION_CODE_EXPIRATION = parseInt(
  getEnvVar("VERIFICATION_CODE_EXPIRATION"),
  10
);
const GOOGLE_CLIENT_ID = getEnvVar("GOOGLE_CLIENT_ID");
const AI_API_KEY = getEnvVar("AI_API_KEY");
const AI_MODEL = getEnvVar("AI_MODEL");
const AI_MAX_TOKENS = parseInt(getEnvVar("AI_MAX_TOKENS"), 10);
const AI_TEMPERATURE = parseInt(getEnvVar("AI_TEMPERATURE"), 10);
const PROMPT_STRING = getEnvVar("PROMPT_STRING");
const STORAGE_API_URL = getEnvVar("STORAGE_API_URL");
const STORAGE_KEY_ID = getEnvVar("STORAGE_KEY_ID");
const STORAGE_APP_KEY = getEnvVar("STORAGE_APP_KEY");
const STORAGE_BUCKET_NAME = getEnvVar("STORAGE_BUCKET_NAME");
const STORAGE_BUCKET_ID = getEnvVar("STORAGE_BUCKET_ID");
const STORAGE_ENDPOINT = getEnvVar("STORAGE_ENDPOINT");
const STORAGE_AUTH_TOKEN_DURATION = parseInt(
  getEnvVar("STORAGE_AUTH_TOKEN_DURATION"),
  10
);
const STORAGE_DOWNLOAD_FILE_BY_ID = getEnvVar("STORAGE_DOWNLOAD_FILE_BY_ID");
const STORAGE_DELETE_URL = getEnvVar("STORAGE_DELETE_URL");
const PAYMENT_SECRET_KEY = getEnvVar("PAYMENT_SECRET_KEY");
const TOKENS_PER_CREDIT = parseInt(getEnvVar("TOKENS_PER_CREDIT"), 10);

export const config = {
  CLIENT_HOST,
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
  VERIFICATION_CODE_EXPIRATION,
  GOOGLE_CLIENT_ID,
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
  STORAGE_AUTH_TOKEN_DURATION,
  STORAGE_DOWNLOAD_FILE_BY_ID,
  STORAGE_DELETE_URL,
  PAYMENT_SECRET_KEY,
  TOKENS_PER_CREDIT,
};
