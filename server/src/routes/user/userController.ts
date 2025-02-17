import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../../db/config/pool";
import { generateVerificationCode } from "../../utils/auth/generateVerificationCode";
import userService from "../../services/user/userService";
import { config } from "../../../env.config";
import { DbQueryResultProps } from "../../interfaces/interfaces";
import { client } from "../../utils/auth/googleAuthClient";
import handleError from "../../utils/common/handleError";

const userController = {
  registerUser: async (req: Request, res: Response): Promise<void> => {
    const {
      name,
      email,
      password,
    }: { name: string; email: string; password: string } = req.body;
    try {
      if (!name || !email || !password) {
        res.status(400).json({ message: "Invalid input parameters" });
        return;
      }

      const isUserExist = (await pool.query(
        "SELECT email FROM users WHERE email = $1",
        [email]
      )) as DbQueryResultProps;

      const userExists = isUserExist.rowCount ?? 0;

      if (userExists > 0) {
        res.status(400).json({ message: "User already exists" });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationCode = generateVerificationCode();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 15);
      const userResult = (await pool.query(
        "INSERT INTO users (name, email, password, verification_code, expires_at) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email",
        [name, email, hashedPassword, verificationCode, expiresAt]
      )) as DbQueryResultProps;

      const user = userResult.rows[0];

      const creditResult = (await pool.query(
        "INSERT INTO credits (user_id) VALUES ($1) RETURNING balance",
        [user.id]
      )) as DbQueryResultProps;

      const credit = creditResult.rows[0];

      try {
        if (verificationCode) {
          userService.sendEmail(
            email,
            user.name,
            verificationCode,
            "verificationEmail",
            "Account Verification"
          );
        }
      } catch (error: unknown) {
        handleError.controllerError(
          res,
          error,
          "sending the verification email"
        );
        return;
      }

      res.status(201).json({
        name: user.name,
        email: user.email,
        balance: credit.balance,
        message: "Check your email box for verification code",
      });
    } catch (error: unknown) {
      handleError.controllerError(res, error, "registering the user");
      return;
    }
  },

  verifyEmail: async (req: Request, res: Response): Promise<void> => {
    const { email, code }: { email: string; code: string } = req.body;
    try {
      const result = (await pool.query(
        "SELECT name, verification_code, expires_at, is_verified FROM users WHERE email = $1",
        [email]
      )) as DbQueryResultProps;

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
      if (now > new Date(user.expires_at)) {
        res.status(400).json({
          message: "Verification code has expired",
          requestCode: true,
        });
        return;
      }

      if (!user.is_verified) {
        try {
          userService.sendEmail(
            email,
            user.name,
            undefined,
            "greetingEmail",
            "Welcome to SlideBoost"
          );
        } catch (error: unknown) {
          handleError.controllerError(res, error, "sending the greeting email");
          return;
        }
      }

      (await pool.query(
        "UPDATE users SET is_verified = true WHERE email = $1",
        [email]
      )) as DbQueryResultProps;

      res.status(201).json({
        message: "Email verification successful",
      });
    } catch (error: unknown) {
      handleError.controllerError(res, error, "verifying the email");
      return;
    }
  },

  loginUser: async (req: Request, res: Response): Promise<void> => {
    const { email, password }: { email: string; password: string } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    try {
      const result = (await pool.query(
        "SELECT id, name, email, password, created_at FROM users WHERE email = $1",
        [email]
      )) as DbQueryResultProps;

      const user = result.rows[0];

      if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign({ userId: user.id }, config.JWT_SECRET, {
          expiresIn: config.TOKEN_EXPIRATION,
        });

        const refreshToken = jwt.sign(
          { userId: user.id },
          config.JWT_REFRESH_SECRET,
          { expiresIn: config.REFRESH_TOKEN_EXPIRATION }
        );

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
      } else {
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }
    } catch (error: unknown) {
      handleError.controllerError(res, error, "logging in the user");
      return;
    }
  },

  loginUserWithGoogle: async (req: Request, res: Response): Promise<void> => {
    const { idToken } = req.body;
    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: config.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      if (!payload) {
        res.status(400).json({ message: "Invalid Google token payload" });
        return;
      }

      const googleId = payload["sub"];

      let result = (await pool.query(
        "SELECT id, name, email, created_at FROM users WHERE google_id = $1",
        [googleId]
      )) as DbQueryResultProps;

      let user = result.rows[0];

      if (!user) {
        result = (await pool.query(
          "INSERT INTO users (google_id, name, email, is_verified) VALUES ($1, $2, $3, $4) RETURNING id, name, email, created_at",
          [googleId, payload["name"], payload["email"], true]
        )) as DbQueryResultProps;

        user = result.rows[0];
      }

      const accessToken = jwt.sign({ userId: user.id }, config.JWT_SECRET, {
        expiresIn: config.TOKEN_EXPIRATION,
      });
      const refreshToken = jwt.sign(
        { userId: user.id },
        config.JWT_REFRESH_SECRET,
        {
          expiresIn: config.REFRESH_TOKEN_EXPIRATION,
        }
      );

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
    } catch (error: unknown) {
      handleError.controllerError(res, error, "verifying the Google token");
      return;
    }
  },

  logoutUser: (req: Request, res: Response): void => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    try {
      res.status(200).json({
        message: "Logged out successfully",
      });
    } catch (error: unknown) {
      handleError.controllerError(
        res,
        error,
        "An error occurred while logging out the user"
      );
      return;
    }
  },

  verifyToken: (req: Request, res: Response): void => {
    const accessToken = req.cookies?.accessToken;
    try {
      if (!accessToken) {
        res.sendStatus(401);
        return;
      }

      jwt.verify(accessToken, config.JWT_SECRET, (err: any, user: any) => {
        if (err) {
          res.sendStatus(403);
          return;
        }

        res.status(200).json({ userId: user.userId });
        return;
      });
    } catch (error: unknown) {
      handleError.controllerError(res, error, "while verifying the token");
      return;
    }
  },

  refreshToken: async (req: Request, res: Response): Promise<void> => {
    const { email }: { email: string } = req.body;
    try {
      const result = (await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
      ])) as DbQueryResultProps;

      const user = result.rows[0];

      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
        res.status(401).json({ message: "User not authenticated" });
        return;
      }

      jwt.verify(
        refreshToken,
        config.JWT_REFRESH_SECRET,
        (err: jwt.VerifyErrors | null) => {
          if (err) {
            res.status(403).json({ message: "Access forbidden" });
            return;
          }

          const newAccessToken = jwt.sign(
            { userId: user.id },
            config.JWT_SECRET,
            {
              expiresIn: config.TOKEN_EXPIRATION,
            }
          );

          const newRefreshToken = jwt.sign(
            { userId: user.id },
            config.JWT_REFRESH_SECRET,
            { expiresIn: config.REFRESH_TOKEN_EXPIRATION }
          );

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
        }
      );
    } catch (error: unknown) {
      handleError.controllerError(res, error, "refreshing the token");
      return;
    }
  },

  updateUserName: async (req: Request, res: Response): Promise<void> => {
    const { name, email }: { name: string; email: string } = req.body;
    try {
      const isUserExist = (await pool.query(
        "SELECT email FROM users WHERE email = $1",
        [email]
      )) as DbQueryResultProps;

      if (isUserExist.rowCount === 0) {
        res.status(400).json({ message: "User does not exist" });
        return;
      }

      const result = (await pool.query(
        "UPDATE users SET name = $1 WHERE email = $2 RETURNING name",
        [name, email]
      )) as DbQueryResultProps;

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
    } catch (error: unknown) {
      handleError.controllerError(res, error, "updating the user name");
      return;
    }
  },

  updatePassword: async (req: Request, res: Response): Promise<void> => {
    const { email, password }: { email: string; password: string } = req.body;
    try {
      const isUserExist = (await pool.query(
        "SELECT email FROM users WHERE email = $1",
        [email]
      )) as DbQueryResultProps;

      if (isUserExist.rowCount === 0) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      (await pool.query("UPDATE users SET password = $1 WHERE email = $2", [
        hashedPassword,
        email,
      ])) as DbQueryResultProps;

      res.status(201).json({
        message: "Password reset successfully",
      });
    } catch (error: unknown) {
      handleError.controllerError(res, error, "resetting the password");
      return;
    }
  },

  sendEmail: async (req: Request, res: Response): Promise<void> => {
    const {
      email,
      template,
      subject,
    }: { email: string; template: string; subject: string } = req.body;
    try {
      const isUserExist = (await pool.query(
        "SELECT email, name FROM users WHERE email = $1",
        [email]
      )) as DbQueryResultProps;

      if (isUserExist.rowCount === 0) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      const user = isUserExist.rows[0];

      const verificationCode = generateVerificationCode();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 15);
      (await pool.query(
        "UPDATE users SET verification_code = $1, expires_at = $2 WHERE email = $3",
        [verificationCode, expiresAt, email]
      )) as DbQueryResultProps;

      try {
        if (verificationCode) {
          userService.sendEmail(
            email,
            user.name,
            verificationCode,
            template,
            subject
          );
        }
      } catch (error: unknown) {
        handleError.controllerError(
          res,
          error,
          "generating a verification code"
        );
        return;
      }

      res.status(201).json({
        email: user.email,
        message: "Check your email box for verification code",
      });
    } catch (error: unknown) {
      handleError.controllerError(res, error, "sending the verification code");
      return;
    }
  },

  deactivateAccount: async (req: Request, res: Response): Promise<void> => {
    const { email, reason }: { email: string; reason: string } = req.body;
    try {
      const result = (await pool.query("DELETE FROM users WHERE email = $1", [
        email,
      ])) as DbQueryResultProps;

      if (result.rowCount === 0) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      (await pool.query(
        "INSERT INTO user_deactivation_reasons (reason) VALUES ($1)",
        [reason]
      )) as DbQueryResultProps;
      res.status(200).json({ message: "Account deactivated successfully" });
    } catch (error: unknown) {
      handleError.controllerError(res, error, "deactivating the account");
      return;
    }
  },
};

export default userController;
