import { generateToken } from "../../utils/jwt/token.js";
import { User } from "../models/User.model.js";
import bcrypt from "bcrypt";

// REGISTER USER
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
