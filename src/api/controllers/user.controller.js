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
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password"); // El admin no puede ver los passwords

    return res.status(200).json({
      message: "Users found",
      users: users,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  // La validación es tan corta que este request no tiene middleware separado
  try {
    const { id } = req.params;
    const requester = req.user;

    let fieldsToHide = "-password"; // Nadie puede ver los passwords

    if (requester.role === "user") {
      fieldsToHide += " -role"; // Si el user es user, tampoco puede ver el rol
    }

    const users = await User.findById(id).select(fieldsToHide);

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
    const adminAllowedFields = [...userAllowedFields, "role"];

    // Determinamos qué campos se usan
    const allowedFields = requester.role === "admin" ? adminAllowedFields : userAllowedFields;

    // Metemos los updates que vamos a pasar por request en un objeto. El [key] es el campo a modificar y el [value] es cada valor metido en el req.body
    const updates = {};
    allowedFields.forEach((field) => {
      if (attemptedUpdates.hasOwnProperty(field)) {
        updates[field] = attemptedUpdates[field];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });

    return res.status(200).json({
      message: "User updated",
      user: updatedUser,
    });
  } catch (error) {
    next(error); 
  }
};

// DELETE
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const userToDelete = await User.findByIdAndDelete(id);
    
    return res.status(200).json({
      message: "User deleted",
      user: userToDelete,
    });
  } catch (error) {
    next(error);
  }
};
