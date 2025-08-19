import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connected = await mongoose.connect(process.env.DB_URL);
    if (connected) console.log("Succesfully connected to MongoAtlas");
  } catch (error) {
    console.log(`Couldn't connect to MongoAtlas ${error}`);
  }
};
