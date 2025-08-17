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
import { canDeleteUser, canUpdateUser, canViewAllUsers } from "../../middlewares/auth/user.middleware.js";

const userRouter = express.Router();

userRouter.post("/register", upload.single("img"), registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/user/:id", isAuth, getUserById);
userRouter.get("/userlist", isAuth, canViewAllUsers, getAllUsers);
userRouter.put("/:id", isAuth, canUpdateUser, updateUser);
userRouter.delete("/:id", isAuth, canDeleteUser, deleteUser);

export default userRouter;