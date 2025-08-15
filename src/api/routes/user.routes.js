import express from "express";
import { getUsers, registerUser } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.get("/", getUsers); //TODO: Aquí hay que meter el middleware de Auth

export default userRouter;