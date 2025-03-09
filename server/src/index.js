"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const router_1 = require("./routes/router");
const env_config_1 = require("../env.config");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const handleError_1 = __importDefault(require("./utils/common/handleError"));
const path_1 = __importDefault(require("path"));
require("./services/cron/clearExpiredVerificationCode");
const app = (0, express_1.default)();
const serverPort = env_config_1.config.SERVER_PORT;
const clientPort = env_config_1.config.CLIENT_PORT;
const host = env_config_1.config.CLIENT_HOST;
app.use(express_1.default.json());
const corsOptions = {
    origin: host + ":" + clientPort,
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
router_1.ServerRouter.setRouter(app);
app.use((err, req, res, next) => {
    handleError_1.default.controllerError(res, err, "An unknown error occurred");
});
app.listen(serverPort, () => {
    console.log(`Server is running on port ${serverPort}...`);
});
