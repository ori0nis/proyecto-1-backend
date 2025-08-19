import express from "express";
import { isAuth } from "../../middlewares/auth/auth.middleware.js";
import { upload } from "../../middlewares/cloudinary/file-upload.middleware.js";
import { deletePlant, editPlant, getAllPlants, getPlantById, postNewPlant } from "../controllers/plant.controller.js";
import { canDeletePlant, validatePlant } from "../../middlewares/auth/plant.middleware.js";

export const plantRouter = express.Router();

//TODO: Dejar guay la lista de users con plantas diferentes asociadas
plantRouter.get("/plantlist", isAuth, getAllPlants);
plantRouter.get("/plant/:id", isAuth, getPlantById);
plantRouter.post("/post-new-plant", isAuth, upload.single("img"), validatePlant, postNewPlant);
plantRouter.put("/plant/:id", isAuth, editPlant);
plantRouter.delete("/plant/:id", isAuth, canDeletePlant, deletePlant);