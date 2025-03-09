"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const env_config_1 = require("../../../env.config");
const google_auth_library_1 = require("google-auth-library");
exports.client = new google_auth_library_1.OAuth2Client(env_config_1.config.GOOGLE_CLIENT_ID);
