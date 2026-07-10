import express from "express";
import { createNewUser, deleteUser, getCurrentUser, getUserById, home , login, logout, updateUser } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.js";
import { checkAuth } from "../middleware/checkAuth.user.js";
import { forgotPassword } from "../controllers/forgotpassword.controller.js";
import { verifyOTP } from "../controllers/verifyotp.controller.js";
import { resetPassword } from "../controllers/resetpassword.controller.js";
const userRouter=express.Router();

userRouter.get("/",home);
userRouter.post("/signup",upload.single("profileImage"),createNewUser);
userRouter.post("/login",login);
userRouter.post("/logout",checkAuth,logout);
userRouter.get("/read/:id",checkAuth,getUserById);
userRouter.put("/update/:id",checkAuth,upload.single("profileImage"),updateUser);
userRouter.delete("/delete/:id",checkAuth,deleteUser);
userRouter.get("/getuserdata",checkAuth,getCurrentUser);
userRouter.post("/forgot-password",forgotPassword);
userRouter.post("/verify-otp", verifyOTP);
userRouter.post("/reset-password", resetPassword);


export default userRouter;