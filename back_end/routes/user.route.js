import express from "express";
import { createNewUser, deleteUser, getCurrentUser, getUserById, home , login, logout, updateUser } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.js";
import { checkAuth } from "../middleware/checkAuth.user.js";
const userRouter=express.Router();

userRouter.get("/",home);
userRouter.post("/signup",upload.single("profileImage"),createNewUser);
userRouter.post("/login",login);
userRouter.post("/logout",checkAuth,logout);
userRouter.get("/read/:id",checkAuth,getUserById);
userRouter.put("/update/:id",checkAuth,updateUser);
userRouter.delete("/delete/:id",checkAuth,deleteUser);
userRouter.get("/getuserdata",checkAuth,getCurrentUser);


export default userRouter;