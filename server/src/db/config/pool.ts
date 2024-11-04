import { Pool } from "pg";
import { config } from "../../../env.config";

export const pool = new Pool({
  user: config.DB_USER,
  host: config.DB_HOST,
  database: config.DB_DATABASE,
  password: config.DB_PASS,
  port: config.DB_PORT,
});
