import Express from "express";
import userController from "./userController";

const userRouter = Express.Router();

userRouter.post("/register", userController.registerUser);
userRouter.post("/verify", userController.verifyEmail);
userRouter.post("/login", userController.loginUser);
userRouter.post("/google", userController.loginUserWithGoogle);
userRouter.post("/logout", userController.logoutUser);
userRouter.get("/token", userController.verifyToken);
userRouter.post("/refreshtoken", userController.refreshToken);
userRouter.post("/username", userController.updateUserName);
userRouter.post("/password", userController.updatePassword);
userRouter.post("/email", userController.sendEmail);
userRouter.post("/deactivation", userController.deactivateAccount);

export default userRouter;
