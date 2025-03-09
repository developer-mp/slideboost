"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
const env_config_1 = require("../../../env.config");
exports.pool = new pg_1.Pool({
    user: env_config_1.config.DB_USER,
    host: env_config_1.config.DB_HOST,
    database: env_config_1.config.DB_DATABASE,
    password: env_config_1.config.DB_PASS,
    port: env_config_1.config.DB_PORT,
});
