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
      return res.status(409).json("Plant already exists");
    }

    if (!scientificName || !nickName || !type) {
      if (uploadedImage) deleteImageCloudinary(uploadedImage);
      return res.status(400).json("Please provide all the required fields");
    }

    if (!allowedPlantTypes.includes(type)) {
      if (uploadedImage) deleteImageCloudinary(uploadedImage);
      return res.status(400).json("Allowed plant types: tropical, desertica, acuatica, templada, alpina");
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const canDeletePlant = async (req, res, next) => {
  try {
    const requester = req.user;

    if (requester.role !== "admin") return res.status(403).json("Forbidden: You can't delete a plant");

    next();
  } catch (error) {
    next(error);
  }
};
