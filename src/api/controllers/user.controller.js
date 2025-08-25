import { generateToken } from "../../utils/jwt/token.js";
import bcrypt from "bcrypt";
import { User } from "../models/User.model.js";
import { deleteImageCloudinary } from "../../utils/cloudinary/delete-image.util.js";

// REGISTER
export const registerUser = async (req, res, next) => {
  try {
    const userPlants = req.body.plants;
    // Creamos un Set con las plantas para que el register tampoco permita valores duplicados
    const plantsArray = Array.isArray(userPlants) ? userPlants : [userPlants];
    const plantsWithNoDuplicates = [...new Set(plantsArray)];

    const user = new User({
      ...req.body,
      img: req.file.path, // Enlazamos la foto subida con el campo de User
      role: "user", // El user que se crea siempre se guarda en la BD con el rol user
      plants: plantsWithNoDuplicates, // Metemos el Set
    });

    const userSaved = await user.save();

    const userWithPlants = await User.findById(userSaved._id).populate("plants");

    return res.status(201).json({
      message: "User created",
      user: userWithPlants,
    });
  } catch (error) {
    next(error);
  }
};

// LOGIN
export const loginUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }).populate("plants");

    if (!user) {
      return res.status(401).json({
        message: "Email or password do not match",
        statu: 401,
      }); // Mando esto en lugar de un 404 para no dar pistas
    }

    if (bcrypt.compareSync(req.body.password, user.password)) {
      const token = generateToken(user._id);
      return res.status(200).json({
        message: "User logged in with token",
        element: [token, user],
      });
    } else {
      return res.status(401).json({
        message: "Email or password do not match",
        status: 401,
      });
    }
  } catch (error) {
    next(error);
  }
};

// GET
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").populate("plants"); // El admin no puede ver los passwords

    return res.status(200).json({
      message: "Users found",
      users: users,
    });
  } catch (error) {
    next(error);
  }
};

// GET BY ID
export const getUserById = async (req, res, next) => {
  // La validación es tan corta que este request no tiene middleware separado
  try {
    const { id } = req.params;
    const requester = req.user;

    let fieldsToHide = "-password"; // Nadie puede ver los passwords

    if (requester.role === "user") {
      fieldsToHide += " -role"; // Si el user es user, tampoco puede ver el rol
    }

    const user = await User.findById(id).select(fieldsToHide).populate("plants");

    return res.status(200).json({
      message: "User found",
      users: user,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE (con permisos)
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const attemptedUpdates = { ...req.body };

    const updates = { ...attemptedUpdates };

    // Si el user quiere actualizar plants, verificamos si mete varias y si no, convertimos su insert en array para que funcione $addToSet
    if (attemptedUpdates.plants) {
      const plantsArray = Array.isArray(attemptedUpdates.plants) ? attemptedUpdates.plants : [attemptedUpdates.plants];

      updates["$addToSet"] = { plants: { $each: plantsArray } };

      // Después de haber refinado el campo plants del update, borramos el objeto original del request para que no haya conflictos
      delete updates.plants;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true }).populate("plants");

    if (!updatedUser)
      return res.status(404).json({
        message: "User not found",
        status: 404,
      });

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
    const profilePic = req.user.img;

    const userToDelete = await User.findByIdAndDelete(id);

    if (!userToDelete)
      return res.status(404).json({
        message: "User not found",
        status: 404,
      });

    deleteImageCloudinary(profilePic);

    return res.status(200).json({
      message: "User deleted",
      user: userToDelete,
    });
  } catch (error) {
    next(error);
  }
};
