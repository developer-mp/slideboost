import cron from "node-cron";
import { pool } from "../../db/config/pool";
import handleError from "../../utils/common/handleError";
import { DbQueryResultProps } from "../../interfaces/interfaces";

// Schedule a job to run every 5 minutes
cron.schedule("*/5 * * * *", async () => {
  console.log("Cron job is running...");
  try {
    (await pool.query(
      "UPDATE users SET verification_code = NULL, code_expires_at = NULL WHERE code_expires_at < NOW() - INTERVAL '15 minutes'"
    )) as DbQueryResultProps;
  } catch (error: unknown) {
    handleError.axiosError(error, "clearing the expired verification code");
    throw error;
  }
});
