import express from "express";
import { getUsers, registerUser } from "../controllers/user.controller.js";
import { upload } from "../../middlewares/cloudinary/file-upload.middleware.js";

const userRouter = express.Router();

userRouter.post("/register", upload.single("img"),registerUser);
userRouter.get("/", getUsers); //TODO: Aquí hay que meter el middleware de Auth

export default userRouter;