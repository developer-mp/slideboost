import B2 from "backblaze-b2";
import { config } from "../../../env.config";

export const b2 = new B2({
  applicationKeyId: config.STORAGE_KEY_ID,
  applicationKey: config.STORAGE_APP_KEY,
});
