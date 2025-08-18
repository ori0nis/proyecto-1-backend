import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  loginUser,
  registerUser,
  updateUser,
} from "../controllers/user.controller.js";
import { upload } from "../../middlewares/cloudinary/file-upload.middleware.js";
import { isAuth } from "../../middlewares/auth/auth.middleware.js";
import { canDeleteUser, canUpdateUser, canViewAllUsers, validateUser } from "../../middlewares/auth/user.middleware.js";

const userRouter = express.Router();

userRouter.post("/register", upload.single("img"), validateUser, registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/user/:id", isAuth, getUserById);
userRouter.get("/user-list", isAuth, canViewAllUsers, getAllUsers);
userRouter.put("/user/:id", isAuth, canUpdateUser, updateUser);
userRouter.delete("/user/:id", isAuth, canDeleteUser, deleteUser);

export default userRouter;