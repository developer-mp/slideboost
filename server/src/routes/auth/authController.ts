import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../../db/config/pool";
import { generateVerificationCode } from "../../utils/generateVerificationCode";
import AuthService from "../../services/auth/authService";
import { config } from "../../../env.config";
import { DbQueryResult } from "../../interfaces/interfaces";

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
      )) as DbQueryResult;

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
      )) as DbQueryResult;

      try {
        if (verificationCode) {
          AuthService.sendVerificationEmail(name, email, verificationCode);
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
        "SELECT verification_code, expires_at FROM users WHERE email = $1 AND is_verified = false",
        [email]
      )) as DbQueryResult;

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
        "UPDATE users SET is_verified = true, verification_code = NULL, expires_at = NULL WHERE email = $1",
        [email]
      )) as DbQueryResult;

      res.status(201).json({
        message: "Verification successful",
      });
    } catch (error) {
      console.error("Verification email:", error);
      res.status(500).json({ message: "Verification failed", error });
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
        res.json({ token: token, name: user.name });
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
      )) as DbQueryResult;

      if (isUserExist.rowCount === 0) {
        res.status(400).json({ message: "User does not exist" });
      }

      const updateQuery = (await pool.query(
        "UPDATE users SET name = $1 WHERE email = $2 RETURNING *",
        [name, email]
      )) as DbQueryResult;

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

  updatePassword: async (req: Request, res: Response) => {
    const { email, password }: { email: string; password: string } = req.body;

    try {
      const isUserExist = (await pool.query(
        "SELECT email FROM users WHERE email = $1",
        [email]
      )) as DbQueryResult;

      if (isUserExist.rowCount === 0) {
        res.status(400).json({ message: "User does not exist" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const updateQuery = (await pool.query(
        "UPDATE users SET password = $1 WHERE email = $2 RETURNING *",
        [hashedPassword, email]
      )) as DbQueryResult;

      if (updateQuery.rowCount === 0) {
        res.status(400).json({ message: "Password change failed" });
      }

      res.status(201).json({
        message: "Password updated successfully",
      });
    } catch (error) {
      console.error("Password update failed:", error);
      res.status(500).json({ message: "Password update failed", error });
    }
  },
};

export default authController;
