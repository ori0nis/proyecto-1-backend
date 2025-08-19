//? Este controlador no va a tener más middlewares que el de isAuth. La API está planteada para tener espíritu de código abierto, con validaciones solo para que se cumpla bien el modelo Plant
import { deleteImageCloudinary } from "../../utils/cloudinary/delete-image.util.js";
import { Plant } from "../models/Plant.model.js";

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
    
    const plant = new Plant({
      ...req.body,
      img: uploadedImage,
    });

    const plantPosted = await plant.save();

    return res.status(201).json({
      message: "New plant added",
      plant: plantPosted,
    });
  } catch (error) {
    next(error);
  }
};

// PUT
export const editPlant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const plantExists = await Plant.findById(id);
    const plantToUpdate = req.body;

    if (!plantExists) return res.status(404).json("Plant not found");

    const updatedPlant = await Plant.findByIdAndUpdate(id, plantToUpdate, { new: true });

    return res.status(200).json({
      message: "Plant updated",
      plant: updatedPlant,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE
export const deletePlant = async (req, res, next) => {
  try {
    const { id } = req.params;

    const plantToDelete = await Plant.findByIdAndDelete(id);

    if (!plantToDelete) return res.status(404).json("Plant doesn't exist");

    const plantImg = plantToDelete.img;

    deleteImageCloudinary(plantImg);

    return res.status(200).json({
      message: "Plant deleted",
      plant: plantToDelete,
    });
  } catch (error) {
    next(error);
  }
};
