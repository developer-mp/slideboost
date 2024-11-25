import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../../db/config/pool";
import { generateVerificationCode } from "../../utils/generateVerificationCode";
import AuthService from "../../services/auth/authService";
import { config } from "../../../env.config";
import { DbQueryResultProps } from "../../interfaces/interfaces";

const authController = {
  registerUser: async (req: Request, res: Response) => {
    const {
      name,
      email,
      password,
    }: { name: string; email: string; password: string } = req.body;

    try {
      const isUserExist = (await pool.query(
        "SELECT email FROM users WHERE email = $1",
        [email]
      )) as DbQueryResultProps;

      const userExists = isUserExist.rowCount ?? 0;

      if (userExists > 0) {
        res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationCode = generateVerificationCode();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 15);
      (await pool.query(
        "INSERT INTO users (name, email, password, verification_code, expires_at) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [name, email, hashedPassword, verificationCode, expiresAt]
      )) as DbQueryResultProps;

      try {
        if (verificationCode) {
          AuthService.sendVerificationEmail(email, verificationCode);
        }
      } catch (error) {
        console.error("Error sending verification email:", error);
      }

      res.status(201).json({
        message:
          "Registration successful. Please check your email for verification code",
      });
    } catch (error) {
      res.status(500).json({ message: "Registration failed", error });
    }
  },

  verifyEmail: async (req: Request, res: Response) => {
    const { email, code }: { email: string; code: string } = req.body;

    try {
      const result = (await pool.query(
        "SELECT verification_code, expires_at FROM users WHERE email = $1 AND is_verified = true",
        [email]
      )) as DbQueryResultProps;

      if (result.rowCount === 0) {
        res.status(400).json({ message: "Invalid email" });
      }

      const user = result.rows[0];
      if (user.verification_code !== code) {
        res.status(400).json({ message: "Invalid verification code" });
      }

      const now = new Date();
      if (now > new Date(user.expires_at)) {
        res.status(400).json({ message: "Verification code has expired" });
      }

      (await pool.query(
        "UPDATE users SET is_verified = true WHERE email = $1",
        [email]
      )) as DbQueryResultProps;

      res.status(201).json({
        message: "Email verification successful",
      });
    } catch (error) {
      console.error("Email verification failed:", error);
      res.status(500).json({ message: "Email verification failed", error });
    }
  },

  loginUser: async (req: Request, res: Response) => {
    try {
      const { email, password }: { email: string; password: string } = req.body;

      const result = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
      const user = result.rows[0];

      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign({ userId: user.id }, config.JWT_SECRET, {
          expiresIn: "1h",
        });
        res.json({
          token: token,
          name: user.name,
          createdAt: user.created_at,
          plan: user.plan,
        });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Login failed:", error);
      res.status(500).json({ message: "Login failed", error });
    }
  },

  authenticateToken: (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    const authHeader = req.headers.authorization;
    // const token = authHeader && authHeader.split(" ")[1];
    const token = authHeader?.split(" ")[1];

    // if (token == null) return res.sendStatus(401);
    if (!token) {
      res.sendStatus(401);
      return;
    }

    jwt.verify(token, config.JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      (req as any).user = user;
      next();
    });
  },

  updateUserName: async (req: Request, res: Response) => {
    const { name, email }: { name: string; email: string } = req.body;

    try {
      const isUserExist = (await pool.query(
        "SELECT email FROM users WHERE email = $1",
        [email]
      )) as DbQueryResultProps;

      if (isUserExist.rowCount === 0) {
        res.status(400).json({ message: "User does not exist" });
      }

      const updateQuery = (await pool.query(
        "UPDATE users SET name = $1 WHERE email = $2 RETURNING *",
        [name, email]
      )) as DbQueryResultProps;

      if (updateQuery.rowCount === 0) {
        res.status(400).json({ message: "User name change failed" });
      }

      res.status(201).json({
        message: "User name updated successfully",
      });
    } catch (error) {
      console.error("User name update failed:", error);
      res.status(500).json({ message: "User name update failed", error });
    }
  },

  sendEmail: async (req: Request, res: Response) => {
    const { email }: { email: string } = req.body;

    try {
      const isUserExist = (await pool.query(
        "SELECT email FROM users WHERE email = $1",
        [email]
      )) as DbQueryResultProps;

      if (isUserExist.rowCount === 0) {
        res.status(404).json({ message: "User not found" });
      }
      const user = isUserExist.rows[0];

      const verificationCode = generateVerificationCode();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 15);
      (await pool.query(
        "UPDATE users SET verification_code = $1, expires_at = $2 WHERE email = $3 RETURNING *",
        [verificationCode, expiresAt, email]
      )) as DbQueryResultProps;

      try {
        if (verificationCode) {
          AuthService.sendVerificationEmail(email, verificationCode);
        }
      } catch (error) {
        console.error("Error sending verification email:", error);
      }

      res.status(201).json({
        email: user.email,
        message: "Check your email for verification code",
      });
    } catch (error) {
      res.status(500).json({ message: "Email validation failed", error });
    }
  },

  resetPassword: async (req: Request, res: Response) => {
    const { email, password }: { email: string; password: string } = req.body;

    try {
      const isUserExist = (await pool.query(
        "SELECT email FROM users WHERE email = $1",
        [email]
      )) as DbQueryResultProps;

      if (isUserExist.rowCount === 0) {
        res.status(404).json({ message: "User not found" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      (await pool.query(
        "UPDATE users SET password = $1 WHERE email = $2 RETURNING *",
        [hashedPassword, email]
      )) as DbQueryResultProps;

      res.status(201).json({
        message: "Password reset successfully",
      });
    } catch (error) {
      res.status(500).json({ message: "Password reset failed", error });
    }
  },

  deactivateAccount: async (req: Request, res: Response) => {
    const { email, reason }: { email: string; reason: string } = req.body;
    try {
      const result = (await pool.query("DELETE FROM users WHERE email = $1", [
        email,
      ])) as DbQueryResultProps;

      if (result.rowCount === 0) {
        res.status(404).json({ message: "User not found" });
      }

      (await pool.query(
        "INSERT INTO deactivation_reasons (reason) VALUES ($1)",
        [reason]
      )) as DbQueryResultProps;
      res.status(200).json({ message: "Account deactivated successfully" });
    } catch (error) {
      console.error("Account deactivation failed:", error);
      res.status(500).json({ message: "Account deactivation failed", error });
    }
  },
};

export default authController;
