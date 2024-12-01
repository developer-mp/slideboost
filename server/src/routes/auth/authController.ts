import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../../db/config/pool";
import { generateVerificationCode } from "../../utils/generateVerificationCode";
import AuthService from "../../services/auth/authService";
import { config } from "../../../env.config";
import { DbQueryResultProps } from "../../interfaces/interfaces";

const authController = {
  registerUser: async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        name,
        email,
        password,
      }: { name: string; email: string; password: string } = req.body;

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
      (await pool.query(
        "INSERT INTO users (name, email, password, verification_code, expires_at) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [name, email, hashedPassword, verificationCode, expiresAt]
      )) as DbQueryResultProps;

      try {
        if (verificationCode) {
          AuthService.sendVerificationEmail(email, verificationCode);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(
            "An error occurred while sending the verification email: ",
            error.message
          );
        } else {
          console.error(
            "An unknown error occurred while sending the verification email"
          );
        }
        res.status(500).json({
          error: "An error occurred while sending the verification email",
        });
        return;
      }

      res.status(201).json({
        message: "Check your email for verification code",
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          "An error occurred while registering the user: ",
          error.message
        );
      } else {
        console.error("An unknown error occurred while registering the user");
      }
      res
        .status(500)
        .json({ message: "An error occurred while registering the user" });
      return;
    }
  },

  verifyEmail: async (req: Request, res: Response) => {
    try {
      const { email, code }: { email: string; code: string } = req.body;

      const result = (await pool.query(
        "SELECT verification_code, expires_at FROM users WHERE email = $1",
        [email]
      )) as DbQueryResultProps;

      if (result.rowCount === 0) {
        res.status(400).json({ message: "Invalid email" });
        return;
      }

      const user = result.rows[0];
      if (user.verification_code !== code) {
        res.status(400).json({ message: "Invalid verification code" });
        return;
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          "An error occurred while sending the verification email: ",
          error.message
        );
      } else {
        console.error(
          "An unknown error occurred while sending the verification"
        );
      }
      res.status(500).json({
        message: "An error occurred while sending the verification email",
      });
      return;
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
          name: user.name,
          email: user.email,
          createdAt: user.created_at,
          plan: user.plan,
          message: "Logged in successfully",
        });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          "An error occurred while loggin in the user: ",
          error.message
        );
      } else {
        console.error("An unknown error occurred while loggin in the user");
      }
      res
        .status(500)
        .json({ message: "An error occurred while loggin in the user", error });
      return;
    }
  },

  logoutUser: async (req: Request, res: Response) => {
    try {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      res.status(200).json({
        message: "Logged out successfully",
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          "An error occurred while logging out the user: ",
          error.message
        );
      } else {
        console.error("An unknown error occurred while logging out the user");
      }
      res.status(500).json({
        message: "An error occurred while logging out in the user",
        error,
      });
      return;
    }
  },

  verifyToken: (req: Request, res: Response, next: NextFunction): void => {
    try {
      const token = req.cookies?.accessToken;

      if (!token) {
        res.status(401).json({
          message: "User not authenticated",
        });
        return;
      }

      jwt.verify(token, config.JWT_SECRET, (err: any, user: any) => {
        if (err) {
          res.status(403).json({
            message: "Access forbidden",
          });
          return;
        }

        (req as any).user = user;
        next();
        // res.status(200);
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          "An error occurred while verifying token: ",
          error.message
        );
      } else {
        console.error("An unknown error occurred while verifying token");
      }
      res.status(500).json({
        message: "An error occurred while verifying the token",
        error,
      });
    }
  },

  refreshAccessToken: (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.cookies;

      if (!refreshToken) {
        res.status(401).json({ message: "Refresh token missing" });
        return;
      }

      jwt.verify(
        refreshToken,
        config.JWT_REFRESH_SECRET,
        (err: jwt.VerifyErrors | null, decoded: any) => {
          if (err) {
            res.status(403).json({ message: "Invalid refresh token" });
            return;
          }

          const newAccessToken = jwt.sign(
            { userId: decoded.userId },
            config.JWT_SECRET,
            { expiresIn: config.TOKEN_EXPIRATION }
          );

          res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 3600000,
          });

          res.status(200).json({ message: "Access token refreshed" });
          return;
        }
      );
    } catch (error: unknown) {
      console.error("An error occurred while refreshing access token: ", error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  },

  updateUserName: async (req: Request, res: Response) => {
    try {
      const { name, email }: { name: string; email: string } = req.body;

      const isUserExist = (await pool.query(
        "SELECT email FROM users WHERE email = $1",
        [email]
      )) as DbQueryResultProps;

      if (isUserExist.rowCount === 0) {
        res.status(400).json({ message: "User does not exist" });
        return;
      }

      const updateQuery = (await pool.query(
        "UPDATE users SET name = $1 WHERE email = $2 RETURNING *",
        [name, email]
      )) as DbQueryResultProps;

      if (updateQuery.rowCount === 0) {
        res.status(400).json({
          message: "An error occurred while updating the database",
        });
        return;
      }

      res.status(201).json({
        message: "User name updated successfully",
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          "An error occurred while updating the user name: ",
          error.message
        );
      } else {
        console.error("An unknown error occurred while updating the user name");
      }
      res.status(500).json({
        message: "An error occurred while updating the user name",
      });
      return;
    }
  },

  updatePassword: async (req: Request, res: Response) => {
    try {
      const { email, password }: { email: string; password: string } = req.body;

      const isUserExist = (await pool.query(
        "SELECT email FROM users WHERE email = $1",
        [email]
      )) as DbQueryResultProps;

      if (isUserExist.rowCount === 0) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      (await pool.query(
        "UPDATE users SET password = $1 WHERE email = $2 RETURNING *",
        [hashedPassword, email]
      )) as DbQueryResultProps;

      res.status(201).json({
        message: "Password reset successfully",
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          "An error occurred while resetting the password: ",
          error.message
        );
      } else {
        console.error("An unknown error occurred while resetting the password");
      }
      res
        .status(500)
        .json({ message: "An error occurred while resetting the password" });
      return;
    }
  },

  sendEmail: async (req: Request, res: Response) => {
    try {
      const { email }: { email: string } = req.body;

      const isUserExist = (await pool.query(
        "SELECT email FROM users WHERE email = $1",
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
        "UPDATE users SET verification_code = $1, expires_at = $2 WHERE email = $3 RETURNING *",
        [verificationCode, expiresAt, email]
      )) as DbQueryResultProps;

      try {
        if (verificationCode) {
          AuthService.sendVerificationEmail(email, verificationCode);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(
            "An error occurred while generating a verification code: ",
            error.message
          );
        } else {
          console.error(
            "An unknown error occurred while generating a verification code"
          );
        }
        res.status(500).json({
          error: "An error occurred while generating a verification code",
        });
        return;
      }

      res.status(201).json({
        email: user.email,
        message: "Check your email for verification code",
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          "An error occurred while sending the verification email: ",
          error.message
        );
      } else {
        console.error(
          "An unknown error occurred while sending the verification email"
        );
      }
      res.status(500).json({
        message: "An error occurred while sending the verification email",
      });
      return;
    }
  },

  deactivateAccount: async (req: Request, res: Response) => {
    try {
      const { email, reason }: { email: string; reason: string } = req.body;

      const result = (await pool.query("DELETE FROM users WHERE email = $1", [
        email,
      ])) as DbQueryResultProps;

      if (result.rowCount === 0) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      (await pool.query(
        "INSERT INTO deactivation_reasons (reason) VALUES ($1)",
        [reason]
      )) as DbQueryResultProps;
      res.status(200).json({ message: "Account deactivated successfully" });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          "An error occurred while deactivating the account: ",
          error.message
        );
      } else {
        console.error(
          "An unknown error occurred while deactivating the account"
        );
      }
      res
        .status(500)
        .json({ message: "An error occurred while deactivating the account" });
      return;
    }
  },
};

export default authController;
