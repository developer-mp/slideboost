import { config } from "../../env.config";
import { OAuth2Client } from "google-auth-library";

export const client = new OAuth2Client(config.GOOGLE_CLIENT_ID);
