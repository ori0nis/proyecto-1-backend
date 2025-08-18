//? Este controlador no va a tener más middlewares que el de isAuth. La API está planteada para tener espíritu de código abierto, con validaciones solo para que se cumpla bien el modelo Plant
import { deleteImageCloudinary } from "../../utils/cloudinary/delete-image.util.js";
import { Plant } from "../models/Plant.model.js";

//TODO: Controlador Planta

// GET
export const getAllPlants = async (req, res, next) => {
  try {
    const plants = await Plant.find();

    return res.status(200).json({
      message: "Plants found",
      plants: plants,
    });
  } catch (error) {
    next(error);
  }
};

// GET BY ID
export const getPlantById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const plant = await Plant.findById(id);

    if (!plant) return res.status(404).json("Plant not found");

    return res.status(200).json({
      message: "Plant found",
      plant: plant,
    });
  } catch (error) {
    next(error);
  }
};

// POST
export const postNewPlant = async (req, res, next) => {
  try {
    const uploadedImage = req.file.path;
    const plantExists = await Plant.findOne({ scientificName: req.body.scientificName });

    if (plantExists) {
      deleteImageCloudinary(uploadedImage);
      return res.status(409).json("Plant already exists");
    } else {
      const plant = new Plant({
        ...req.body,
        img: uploadedImage,
      });

      const plantPosted = await plant.save();

      return res.status(201).json({
        message: "New plant added",
        plant: plantPosted,
      });
    }
  } catch (error) {
    next(error);
  }
};
