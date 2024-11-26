import Express from "express";
import authController from "./authController";

const authRouter = Express.Router();

authRouter.post("/register", authController.registerUser);
authRouter.post("/verify", authController.verifyEmail);
authRouter.post("/login", authController.loginUser);
authRouter.get("/protected", authController.authenticateToken);
authRouter.post("/username", authController.updateUserName);
authRouter.post("/password", authController.updatePassword);
authRouter.post("/email", authController.sendEmail);
authRouter.post("/deactivation", authController.deactivateAccount);

export default authRouter;
