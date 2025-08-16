import dotenv from "dotenv";
import mongoose from "mongoose";
import { Plant } from "../../api/models/Plant.model.js";
import { plants } from "../../data/plant-list.js";

dotenv.config();

export const runPlantSeed = async () => {
  try {
    const connected = await mongoose.connect(process.env.DB_URL);
    if (connected) {
      await Plant.collection.drop();
      await Plant.insertMany(plants);
      console.log("✅ Database successfully seeded");
    }
  } catch (error) {
    console.log(`❌ Error seeding data: ${error}`);
  } finally {
    mongoose.disconnect();
  }
};

runPlantSeed();
