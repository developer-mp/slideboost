import Express from "express";
import userController from "./userController";

const userRouter = Express.Router();

userRouter.post("/register", userController.registerUser);
userRouter.post("/verify-email", userController.verifyEmail);
userRouter.post("/login", userController.loginUser);
userRouter.post("/login-google", userController.loginUserWithGoogle);
userRouter.post("/logout", userController.logoutUser);
userRouter.get("/verify-token", userController.verifyToken);
userRouter.post("/refresh-token", userController.refreshToken);
userRouter.post("/username", userController.updateUserName);
userRouter.post("/password", userController.updatePassword);
userRouter.post("/email", userController.sendEmail);
userRouter.post("/contact", userController.sendContactForm);
userRouter.post("/deactivation", userController.deactivateAccount);
userRouter.get("/balance", userController.getCreditBalance);

export default userRouter;
