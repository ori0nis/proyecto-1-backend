//? Aquí están los middlewares asociados a las requests hacia la colección plants
import { Plant } from "../../api/models/Plant.model.js";
import { deleteImageCloudinary } from "../../utils/cloudinary/delete-image.util.js";

// Puerta de entrada para evitar bad requests que terminan en subidas a Cloudinary
export const validatePlant = async (req, res, next) => {
  try {
    const { scientificName, nickName, type } = req.body;
    const uploadedImage = req.file.path;
    const allowedPlantTypes = Plant.schema.path("type").enumValues;
    const plantExists = await Plant.findOne({ scientificName });

    if (plantExists) {
      if (uploadedImage) deleteImageCloudinary(uploadedImage);
      return res.status(409).json({
        message: "Plant already exists",
        status: 409,
      });
    }

    if (!scientificName || !nickName || !type) {
      if (uploadedImage) deleteImageCloudinary(uploadedImage);
      return res.status(400).json({
        message: "Please provide all the required fields",
        status: 400,
      });
    }

    if (!allowedPlantTypes.includes(type)) {
      if (uploadedImage) deleteImageCloudinary(uploadedImage);
      return res.status(400).json({
        message: "Allowed plant types: tropical, desertica, acuatica, templada, alpina",
        status: 400,
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const canDeletePlant = async (req, res, next) => {
  try {
    const requester = req.user;

    if (requester.role !== "admin")
      return res.status(403).json({
        message: "Forbidden: You can't delete a plant",
        status: 403,
      });

    next();
  } catch (error) {
    next(error);
  }
};
