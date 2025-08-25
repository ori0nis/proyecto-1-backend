//? Aquí están todos los middlewares asociados a las requests hechas hacia la colección users
import { User } from "../../api/models/User.model.js";
import { deleteImageCloudinary } from "../../utils/cloudinary/delete-image.util.js";

// Puerta de entrada para evitar bad requests que terminan en subidas a Cloudinary
export const validateUser = async (req, res, next) => {
  try {
    const { name, email, password, plantCareSkillLevel, role, plants } = req.body;
    const uploadedImage = req.file.path;
    const allowedRoles = User.schema.path("role").enumValues;
    const allowedSkillLevels = User.schema.path("plantCareSkillLevel").enumValues;
    const userExists = await User.findOne({ email });

    if (userExists) {
      if (uploadedImage) deleteImageCloudinary(uploadedImage);
      return res.status(409).json({
        message: "User already exists",
        status: 409,
      });
    }

    if (!name || !email || !password || !plantCareSkillLevel || !role || !plants) {
      if (uploadedImage) deleteImageCloudinary(uploadedImage);
      return res.status(400).json({
        message: "Please provide all the required fields",
        status: 400,
      });
    }

    if (password.length < 8) {
      if (uploadedImage) deleteImageCloudinary(uploadedImage);
      return res.status(400).json({
        message: "Your password must contain at least 8 characters",
        status: 400,
      });
    }

    if (!allowedRoles.includes(role) || req.body.role === "admin") {
      if (uploadedImage) deleteImageCloudinary(uploadedImage);
      return res.status(400).json({
        message: "Please provide a valid role. Valid roles: [user]",
        status: 400,
      });
    }

    if (!allowedSkillLevels.includes(plantCareSkillLevel)) {
      if (uploadedImage) deleteImageCloudinary(uploadedImage);
      return res.status(400).json({
        message: "Available skill levels: principiante, intermedio, avanzado",
        status: 400,
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

// GET
export const canViewAllUsers = async (req, res, next) => {
  try {
    const requester = req.user;

    if (requester.role !== "admin") {
      return res.status(403).json({
        message: "Forbidden: You need permission to view this resource",
        status: 403,
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

// PUT
export const canUpdateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const requester = req.user; // Esto vendrá de isAuth
    const attemptedRoleUpdate = req.body?.role;
    const attemptedPlantSkillUpdate = req.body?.plantCareSkillLevel;
    const allowedRoles = User.schema.path("role").enumValues;
    const allowedSkillLevels = User.schema.path("plantCareSkillLevel").enumValues;

    // Reforzamos los campos admitidos para el skill level. No meto "Demeter" porque es un easter egg
    if (attemptedPlantSkillUpdate && !allowedSkillLevels.includes(attemptedPlantSkillUpdate)) {
      return res.status(400).json({
        message: "Available skill levels: principiante, intermedio, avanzado",
        status: 400,
      });
    }

    // Primero validamos si el rol introducido existe
    if (attemptedRoleUpdate && !allowedRoles.includes(attemptedRoleUpdate)) {
      return res.status(400).json({
        message: "Role doesn't exist",
        status: 400,
      });
    }

    // ADMIN LOGIC
    if (requester.role === "admin") {
      if (requester._id.toString() === id && attemptedRoleUpdate === "user") {
        return res.status(403).json({
          message: "Forbidden: Admins cannot self-demote",
          status: 403,
        });
      }

      return next(); // Admins pueden modificar cualquier otra cosa
    }

    // USER LOGIC
    if (requester.role === "user") {
      if (requester._id.toString() !== id) {
        return res.status(403).json({
          message: "Forbidden: You can't modify other users",
          status: 403,
        });
      }

      if (attemptedRoleUpdate) {
        return res.status(403).json({
          message: "Forbidden: You can't modify your role",
          status: 403,
        });
      }

      return next(); // Lo demás está permitido
    }

    next();
  } catch (error) {
    next(error);
  }
};

// DELETE
export const canDeleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const requester = req.user;

    if (requester.role === "admin" || requester._id.toString() === id) {
      return next();
    }

    return res.status(403).json({
      message: "Forbidden: You can't delete other users",
      status: 403,
    });
  } catch (error) {
    next(error);
  }
};
