const getEnvVar = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
};

const API_BASE_URL = getEnvVar("API_BASE_URL");
const API = getEnvVar("API");
const API_VERSION = getEnvVar("API_VERSION");
const AUTH_ROUTER = getEnvVar("AUTH_ROUTER");
const LOGIN_ENDPOINT = getEnvVar("LOGIN_ENDPOINT");
const AI_ROUTER = getEnvVar("AI_ROUTER");
const TRANSCRIPT_ROUTER = getEnvVar("TRANSCRIPT_ROUTER");
const IMGTOTXT_ENDPOINT = getEnvVar("IMGTOTXT_ENDPOINT");
const AUDIOTOTXT_ENDPOINT = getEnvVar("AUDIOTOTXT_ENDPOINT");
const PPT_ROUTER = getEnvVar("PPT_ROUTER");
const USER_ENDPOINT = getEnvVar("USER_ENDPOINT");
const PASSWORD_ENDPOINT = getEnvVar("PASSWORD_ENDPOINT");
const REGISTER_ENDPOINT = getEnvVar("REGISTER_ENDPOINT");
const VERIFY_ENDPOINT = getEnvVar("VERIFY_ENDPOINT");
const PROMPT_STRING = getEnvVar("PROMPT_STRING");
const PROMPT_TEXT = getEnvVar("PROMPT_TEXT");

export const config = {
  API_BASE_URL,
  API,
  API_VERSION,
  AUTH_ROUTER,
  LOGIN_ENDPOINT,
  AI_ROUTER,
  TRANSCRIPT_ROUTER,
  IMGTOTXT_ENDPOINT,
  AUDIOTOTXT_ENDPOINT,
  PPT_ROUTER,
  USER_ENDPOINT,
  PASSWORD_ENDPOINT,
  REGISTER_ENDPOINT,
  VERIFY_ENDPOINT,
  PROMPT_STRING,
  PROMPT_TEXT,
};
