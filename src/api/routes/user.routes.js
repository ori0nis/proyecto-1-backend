import express from "express";
import { getUsers, loginUser, registerUser } from "../controllers/user.controller.js";
import { upload } from "../../middlewares/cloudinary/file-upload.middleware.js";
import { isAuth } from "../../middlewares/auth/auth.middleware.js";

const userRouter = express.Router();

userRouter.post("/register", upload.single("img"),registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/", getUsers); //TODO: Aquí hay que meter el middleware de Auth

export default userRouter;