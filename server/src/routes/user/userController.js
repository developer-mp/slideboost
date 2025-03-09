"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const pool_1 = require("../../db/config/pool");
const generateVerificationCode_1 = require("../../utils/auth/generateVerificationCode");
const userService_1 = __importDefault(require("../../services/user/userService"));
const env_config_1 = require("../../../env.config");
const googleAuthClient_1 = require("../../utils/auth/googleAuthClient");
const handleError_1 = __importDefault(require("../../utils/common/handleError"));
const userController = {
    registerUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { name, email, password, } = req.body;
        try {
            if (!name || !email || !password) {
                res.status(400).json({ message: "Invalid input parameters" });
                return;
            }
            const isUserExist = (yield pool_1.pool.query("SELECT email FROM users WHERE email = $1", [email]));
            const userExists = (_a = isUserExist.rowCount) !== null && _a !== void 0 ? _a : 0;
            if (userExists > 0) {
                res.status(400).json({ message: "User already exists" });
                return;
            }
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            const verificationCode = (0, generateVerificationCode_1.generateVerificationCode)();
            const expiresAt = new Date();
            expiresAt.setMinutes(expiresAt.getMinutes() + env_config_1.config.VERIFICATION_CODE_EXPIRATION);
            const userResult = (yield pool_1.pool.query("INSERT INTO users (name, email, password, verification_code, code_expires_at) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email", [name, email, hashedPassword, verificationCode, expiresAt]));
            const user = userResult.rows[0];
            (yield pool_1.pool.query("INSERT INTO credits (user_id) VALUES ($1)", [
                user.id,
            ]));
            try {
                if (verificationCode) {
                    userService_1.default.sendEmail(email, user.name, env_config_1.config.VERIFICATION_CODE_EXPIRATION, undefined, verificationCode, "verificationEmail", "Account Verification");
                }
            }
            catch (error) {
                handleError_1.default.controllerError(res, error, "sending the verification email");
                return;
            }
            res.status(201).json({
                name: user.name,
                email: user.email,
                message: "Check your email box for verification code",
            });
        }
        catch (error) {
            handleError_1.default.controllerError(res, error, "registering the user");
            return;
        }
    }),
    verifyEmail: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, code } = req.body;
        try {
            const result = (yield pool_1.pool.query("SELECT name, verification_code, code_expires_at, is_verified FROM users WHERE email = $1", [email]));
            if (result.rowCount === 0) {
                res.status(400).json({ message: "User not found" });
                return;
            }
            const user = result.rows[0];
            if (user.verification_code !== code) {
                res.status(400).json({ message: "Invalid verification code" });
                return;
            }
            const now = new Date();
            if (now > new Date(user.code_expires_at)) {
                res.status(400).json({
                    message: "Verification code has expired",
                    requestCode: true,
                });
                return;
            }
            if (!user.is_verified) {
                try {
                    userService_1.default.sendEmail(email, user.name, undefined, undefined, undefined, "greetingEmail", "Welcome to SlideBoost");
                }
                catch (error) {
                    handleError_1.default.controllerError(res, error, "sending the greeting email");
                    return;
                }
            }
            (yield pool_1.pool.query("UPDATE users SET is_verified = true WHERE email = $1", [email]));
            res.status(201).json({
                message: "Email verification successful",
            });
        }
        catch (error) {
            handleError_1.default.controllerError(res, error, "verifying the email");
            return;
        }
    }),
    loginUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }
        try {
            const result = (yield pool_1.pool.query("SELECT id, name, email, password, created_at FROM users WHERE email = $1", [email]));
            const user = result.rows[0];
            if (user && (yield bcryptjs_1.default.compare(password, user.password))) {
                const accessToken = jsonwebtoken_1.default.sign({ userId: user.id }, env_config_1.config.JWT_SECRET, {
                    expiresIn: env_config_1.config.TOKEN_EXPIRATION,
                });
                const refreshToken = jsonwebtoken_1.default.sign({ userId: user.id }, env_config_1.config.JWT_REFRESH_SECRET, { expiresIn: env_config_1.config.REFRESH_TOKEN_EXPIRATION });
                res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "strict",
                    maxAge: 3600000,
                });
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "strict",
                    maxAge: 604800000,
                });
                res.status(200).json({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    createdAt: user.created_at,
                    message: "Logged in successfully",
                });
            }
            else {
                res.status(401).json({ message: "Invalid credentials" });
                return;
            }
        }
        catch (error) {
            handleError_1.default.controllerError(res, error, "logging in the user");
            return;
        }
    }),
    loginUserWithGoogle: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { idToken } = req.body;
        try {
            const ticket = yield googleAuthClient_1.client.verifyIdToken({
                idToken,
                audience: env_config_1.config.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            if (!payload) {
                res.status(400).json({ message: "Invalid Google token payload" });
                return;
            }
            const googleId = payload["sub"];
            let result = (yield pool_1.pool.query("SELECT id, name, email, created_at FROM users WHERE google_id = $1", [googleId]));
            let user = result.rows[0];
            if (!user) {
                result = (yield pool_1.pool.query("INSERT INTO users (google_id, name, email, is_verified) VALUES ($1, $2, $3, $4) RETURNING id, name, email, created_at", [googleId, payload["name"], payload["email"], true]));
                user = result.rows[0];
            }
            const existingCredits = (yield pool_1.pool.query("SELECT balance FROM credits WHERE user_id = $1 LIMIT 1", [user.id]));
            let creditResult;
            if (existingCredits.rows.length === 0) {
                (yield pool_1.pool.query("INSERT INTO credits (user_id) VALUES ($1)", [
                    user.id,
                ]));
            }
            else {
                creditResult = existingCredits;
            }
            const accessToken = jsonwebtoken_1.default.sign({ userId: user.id }, env_config_1.config.JWT_SECRET, {
                expiresIn: env_config_1.config.TOKEN_EXPIRATION,
            });
            const refreshToken = jsonwebtoken_1.default.sign({ userId: user.id }, env_config_1.config.JWT_REFRESH_SECRET, {
                expiresIn: env_config_1.config.REFRESH_TOKEN_EXPIRATION,
            });
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 3600000,
            });
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 604800000,
            });
            res.status(200).json({
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.created_at,
                message: "Logged in successfully",
            });
        }
        catch (error) {
            handleError_1.default.controllerError(res, error, "verifying the Google token");
            return;
        }
    }),
    logoutUser: (req, res) => {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        try {
            res.status(200).json({
                message: "Logged out successfully",
            });
        }
        catch (error) {
            handleError_1.default.controllerError(res, error, "An error occurred while logging out the user");
            return;
        }
    },
    verifyToken: (req, res) => {
        var _a;
        const accessToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken;
        try {
            if (!accessToken) {
                res.sendStatus(401);
                return;
            }
            jsonwebtoken_1.default.verify(accessToken, env_config_1.config.JWT_SECRET, (err, user) => {
                if (err) {
                    res.sendStatus(403);
                    return;
                }
                res.status(200).json({ userId: user.userId });
                return;
            });
        }
        catch (error) {
            handleError_1.default.controllerError(res, error, "while verifying the token");
            return;
        }
    },
    refreshToken: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        const { email } = req.body;
        try {
            const result = (yield pool_1.pool.query("SELECT * FROM users WHERE email = $1", [
                email,
            ]));
            const user = result.rows[0];
            const refreshToken = (_b = req.cookies) === null || _b === void 0 ? void 0 : _b.refreshToken;
            if (!refreshToken) {
                res.status(401).json({ message: "User not authenticated" });
                return;
            }
            jsonwebtoken_1.default.verify(refreshToken, env_config_1.config.JWT_REFRESH_SECRET, (err) => {
                if (err) {
                    res.status(403).json({ message: "Access forbidden" });
                    return;
                }
                const newAccessToken = jsonwebtoken_1.default.sign({ userId: user.id }, env_config_1.config.JWT_SECRET, {
                    expiresIn: env_config_1.config.TOKEN_EXPIRATION,
                });
                const newRefreshToken = jsonwebtoken_1.default.sign({ userId: user.id }, env_config_1.config.JWT_REFRESH_SECRET, { expiresIn: env_config_1.config.REFRESH_TOKEN_EXPIRATION });
                res.cookie("accessToken", newAccessToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "strict",
                    maxAge: 3600000,
                });
                res.cookie("refreshToken", newRefreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "strict",
                    maxAge: 604800000,
                });
                res.status(200).json({ userId: user.id });
                return;
            });
        }
        catch (error) {
            handleError_1.default.controllerError(res, error, "refreshing the token");
            return;
        }
    }),
    updateUserName: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, email } = req.body;
        try {
            const isUserExist = (yield pool_1.pool.query("SELECT email FROM users WHERE email = $1", [email]));
            if (isUserExist.rowCount === 0) {
                res.status(400).json({ message: "User does not exist" });
                return;
            }
            const result = (yield pool_1.pool.query("UPDATE users SET name = $1 WHERE email = $2 RETURNING name", [name, email]));
            const user = result.rows[0];
            if (user.rowCount === 0) {
                res.status(400).json({
                    message: "An error occurred while updating the database",
                });
                return;
            }
            res.status(201).json({
                name: user.name,
                message: "User name updated successfully",
            });
        }
        catch (error) {
            handleError_1.default.controllerError(res, error, "updating the user name");
            return;
        }
    }),
    updatePassword: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password } = req.body;
        try {
            const isUserExist = (yield pool_1.pool.query("SELECT email FROM users WHERE email = $1", [email]));
            if (isUserExist.rowCount === 0) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            (yield pool_1.pool.query("UPDATE users SET password = $1 WHERE email = $2", [
                hashedPassword,
                email,
            ]));
            res.status(201).json({
                message: "Password reset successfully",
            });
        }
        catch (error) {
            handleError_1.default.controllerError(res, error, "resetting the password");
            return;
        }
    }),
    sendEmail: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, template, subject, } = req.body;
        try {
            const isUserExist = (yield pool_1.pool.query("SELECT email, name FROM users WHERE email = $1", [email]));
            if (isUserExist.rowCount === 0) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            const user = isUserExist.rows[0];
            const verificationCode = (0, generateVerificationCode_1.generateVerificationCode)();
            const expiresAt = new Date();
            expiresAt.setMinutes(expiresAt.getMinutes() + env_config_1.config.VERIFICATION_CODE_EXPIRATION);
            (yield pool_1.pool.query("UPDATE users SET verification_code = $1, code_expires_at = $2 WHERE email = $3", [verificationCode, expiresAt, email]));
            try {
                if (verificationCode) {
                    userService_1.default.sendEmail(email, user.name, env_config_1.config.VERIFICATION_CODE_EXPIRATION, undefined, verificationCode, template, subject);
                }
            }
            catch (error) {
                handleError_1.default.controllerError(res, error, "generating a verification code");
                return;
            }
            res.status(201).json({
                email: user.email,
                message: "Check your email box for verification code",
            });
        }
        catch (error) {
            handleError_1.default.controllerError(res, error, "sending the verification code");
            return;
        }
    }),
    deactivateAccount: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, reason } = req.body;
        try {
            const result = (yield pool_1.pool.query("DELETE FROM users WHERE email = $1", [
                email,
            ]));
            if (result.rowCount === 0) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            (yield pool_1.pool.query("INSERT INTO user_deactivation_reasons (reason) VALUES ($1)", [reason]));
            res.status(200).json({ message: "Account deactivated successfully" });
        }
        catch (error) {
            handleError_1.default.controllerError(res, error, "deactivating the account");
            return;
        }
    }),
    getCreditBalance: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.query.userId;
        try {
            const userResult = (yield pool_1.pool.query("SELECT balance FROM credits WHERE user_id = $1 ORDER BY transaction_date DESC LIMIT 1", [userId]));
            const user = userResult.rows[0];
            res.status(200).json({
                creditBalance: user.balance,
            });
        }
        catch (error) {
            handleError_1.default.controllerError(res, error, "retrieving the credit balance");
            return;
        }
    }),
};
exports.default = userController;
