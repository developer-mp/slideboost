import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../../db/config/pool";
import { generateVerificationCode } from "../../utils/generateVerificationCode";
import userService from "../../services/user/userService";
import { config } from "../../../env.config";
import { DbQueryResultProps } from "../../interfaces/interfaces";
import { client } from "../../utils/googleAuthClient";

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
      const result = (await pool.query(
        "INSERT INTO users (name, email, password, verification_code, expires_at) VALUES ($1, $2, $3, $4, $5) RETURNING name, email",
        [name, email, hashedPassword, verificationCode, expiresAt]
      )) as DbQueryResultProps;

      const user = result.rows[0];

      try {
        if (verificationCode) {
          userService.sendVerificationEmail(email, verificationCode);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(
            "An error occurred while sending the verification email in the Auth Controller: ",
            error.message
          );
        } else {
          console.error(
            "An unknown error occurred while sending the verification email in the Auth Controller"
          );
        }
        res.status(500).json({
          mesage:
            "An error occurred while sending the verification email in the Auth Controller",
        });
        return;
      }

      res.status(201).json({
        name: user.name,
        email: user.email,
        message: "Check your email for verification code",
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          "An error occurred while registering the user in the Auth Controller: ",
          error.message
        );
      } else {
        console.error(
          "An unknown error occurred while registering the user in the Auth Controller"
        );
      }
      res.status(500).json({
        message:
          "An error occurred while registering the user in the Auth Controller",
      });
      return;
    }
  },

  verifyEmail: async (req: Request, res: Response): Promise<void> => {
    const { email, code }: { email: string; code: string } = req.body;
    try {
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
          "An error occurred while sending the verification email in the Auth Controller: ",
          error.message
        );
      } else {
        console.error(
          "An unknown error occurred while sending the verification in the Auth Controller"
        );
      }
      res.status(500).json({
        message:
          "An error occurred while sending the verification email in the Auth Controller",
      });
      return;
    }
  },

  loginUser: async (req: Request, res: Response): Promise<void> => {
    const { email, password }: { email: string; password: string } = req.body;
    try {
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
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          "An error occurred while logging in the user in the Auth Controller: ",
          error.message
        );
      } else {
        console.error(
          "An unknown error occurred while logging in the user in the Auth Controller"
        );
      }
      res.status(500).json({
        message:
          "An error occurred while logging in the user in the Auth Controller",
      });
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

      let result = await pool.query(
        "SELECT * FROM users WHERE google_id = $1",
        [googleId]
      );

      let user = result.rows[0];

      if (!user) {
        result = await pool.query(
          "INSERT INTO users (google_id, name, email, is_verified) VALUES ($1, $2, $3, $4) RETURNING id, name, email, created_at, plan",
          [googleId, payload["name"], payload["email"], true]
        );

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
        name: user.name,
        email: user.email,
        createdAt: user.created_at,
        plan: user.plan,
        message: "Logged in successfully",
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: "Invalid Google token" });
        console.error(
          "An error occurred while verifying Google token in the Auth Controller: ",
          error.message
        );
      } else {
        console.error(
          "An unknown error occurred while verifying Google token in the Auth Controller"
        );
      }
      res.status(500).json({
        message:
          "An error occurred while verifying Google token in the Auth Controller",
      });
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
      if (error instanceof Error) {
        console.error(
          "An error occurred while logging out the user in the Auth Controller: ",
          error.message
        );
      } else {
        console.error(
          "An unknown error occurred while logging out the user in the Auth Controller"
        );
      }
      res.status(500).json({
        message:
          "An error occurred while logging out in the user in the Auth Controller",
      });
      return;
    }
  },

  verifyToken: (req: Request, res: Response): void => {
    const accessToken = req.cookies?.accessToken;
    try {
      if (!accessToken) {
        res.status(401).json({
          message: "User not authenticated",
        });
        return;
      }

      jwt.verify(accessToken, config.JWT_SECRET, (err: any, user: any) => {
        if (err) {
          res.status(403).json({
            message: "Access forbidden",
          });
          return;
        }

        res.status(200).json({ userId: user.userId });
        return;
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          "An error occurred while verifying the token in the Auth Controller: ",
          error.message
        );
      } else {
        console.error(
          "An unknown error occurred while verifying the token in the Auth Controller"
        );
      }
      res.status(500).json({
        message:
          "An error occurred while verifying the token in the Auth Controller",
      });
      return;
    }
  },

  refreshToken: async (req: Request, res: Response): Promise<void> => {
    const { email }: { email: string } = req.body;
    try {
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
      const user = result.rows[0];

      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
        res.status(401).json({ message: "Refresh token missing" });
        return;
      }

      jwt.verify(
        refreshToken,
        config.JWT_REFRESH_SECRET,
        (err: jwt.VerifyErrors | null) => {
          if (err) {
            res.status(403).json({ message: "Invalid refresh token" });
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
      if (error instanceof Error) {
        console.error(
          "An error occurred while refreshing the token in the Auth Controller: ",
          error.message
        );
      } else {
        console.error(
          "An unknown error occurred while refreshing the token in the Auth Controller"
        );
      }
      res.status(500).json({
        message:
          "An error occurred while refreshing the token in the Auth Controller",
      });
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
      if (error instanceof Error) {
        console.error(
          "An error occurred while updating the user name in the Auth Controller: ",
          error.message
        );
      } else {
        console.error(
          "An unknown error occurred while updating the user name in the Auth Controller"
        );
      }
      res.status(500).json({
        message:
          "An error occurred while updating the user name in the Auth Controller",
      });
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
      if (error instanceof Error) {
        console.error(
          "An error occurred while resetting the password in the Auth Controller: ",
          error.message
        );
      } else {
        console.error(
          "An unknown error occurred while resetting the password in the Auth Controller"
        );
      }
      res.status(500).json({
        message:
          "An error occurred while resetting the password in the Auth Controller",
      });
      return;
    }
  },

  sendEmail: async (req: Request, res: Response): Promise<void> => {
    const { email }: { email: string } = req.body;
    try {
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
        "UPDATE users SET verification_code = $1, expires_at = $2 WHERE email = $3",
        [verificationCode, expiresAt, email]
      )) as DbQueryResultProps;

      try {
        if (verificationCode) {
          userService.sendVerificationEmail(email, verificationCode);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(
            "An error occurred while generating a verification code in the Auth Controller: ",
            error.message
          );
        } else {
          console.error(
            "An unknown error occurred while generating a verification code in the Auth Controller"
          );
        }
        res.status(500).json({
          message:
            "An error occurred while generating a verification code in the Auth Controller",
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
          "An error occurred while sending the verification email in the Auth Controller: ",
          error.message
        );
      } else {
        console.error(
          "An unknown error occurred while sending the verification email in the Auth Controller"
        );
      }
      res.status(500).json({
        message:
          "An error occurred while sending the verification email in the Auth Controller",
      });
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
        "INSERT INTO deactivation_reasons (reason) VALUES ($1)",
        [reason]
      )) as DbQueryResultProps;
      res.status(200).json({ message: "Account deactivated successfully" });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          "An error occurred while deactivating the account in the Auth Controller: ",
          error.message
        );
      } else {
        console.error(
          "An unknown error occurred while deactivating the account in the Auth Controller"
        );
      }
      res.status(500).json({
        message:
          "An error occurred while deactivating the account in the Auth Controller",
      });
      return;
    }
  },
};

export default userController;
