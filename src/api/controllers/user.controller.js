import { generateToken } from "../../utils/jwt/token.js";
import { User } from "../models/User.model.js";
import bcrypt from "bcrypt";

// REGISTER
export const registerUser = async (req, res, next) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });

    if (userExists) {
      return res.status(409).json("User already exists");
    } else {
      const user = new User({
        ...req.body,
        img: req.file.path, // Enlazamos la foto subida con el campo de User
        role: "user", // El user que se crea siempre se guarda en la BD con el rol user
      });

      const userSaved = await user.save();

      return res.status(201).json({
        message: "User created",
        user: userSaved,
      });
    }
  } catch (error) {
    next(error);
  }
};

// LOGIN
export const loginUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json("User not found");
    }

    if (bcrypt.compareSync(req.body.password, user.password)) {
      const token = generateToken(user._id);
      return res.status(200).json({
        message: "User logged in with token",
        element: [token, user],
      });
    }
  } catch (error) {
    next(error);
  }
};

// GET
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    return res.status(200).json({
      message: "Users found",
      users: users,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE (con permisos)
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const requester = req.user; // Esto vendrá de isAuth
    const attemptedUpdates = req.body;

    // Cambios permitidos según el rol
    const userAllowedFields = ["name", "email", "password", "img", "plantCareSkillLevel", "plants"];

    // Si el user es user, no puede cambiarse el rol
    if (attemptedUpdates.hasOwnProperty("role") && requester.role === "user") {
      return res.status(403).json("Forbidden: You can't change your own role");
    }

    // Si el usuario tiene rol "user", solo puede cambiar sus propios campos permitidos
    if (
      userAllowedFields.some((field) => attemptedUpdates.hasOwnProperty(field)) &&
      requester.role === "user" &&
      requester._id === id
    ) {
      const userToUpdate = new User(req.body);
      userToUpdate._id = id;
      const updatedUser = User.findByIdAndUpdate(id, userToUpdate, { new: true });

      return res.status(200).json({
        message: "User updated",
        user: updatedUser,
      });
    }
  } catch (error) {
    next(error);
  }
};
