import express from "express";
import { isAuth } from "../../middlewares/auth/auth.middleware.js";
import { upload } from "../../middlewares/cloudinary/file-upload.middleware.js";
import { getAllPlants, getPlantById, postNewPlant } from "../controllers/plant.controller.js";
import { validatePlant } from "../../middlewares/auth/plant.middleware.js";

export const plantRouter = express.Router();

//TODO: Plant Router
plantRouter.get("/plantlist", isAuth, getAllPlants);
plantRouter.get("/plant/:id", isAuth, getPlantById);
plantRouter.post("/post-new-plant", isAuth, upload.single("img"), validatePlant, postNewPlant);