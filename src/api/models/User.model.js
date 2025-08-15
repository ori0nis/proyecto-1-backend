import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: [8, "Password must contain minimum 8 characters"],
    },
    img: { type: String, required: true, trim: true },
    plantCareSkillLevel: {
      type: String,
      enum: ["principiante", "intermedio", "avanzado", "Demeter"],
      required: true,
    },
    role: { type: String, required: true, trim: true }, //TODO: Admin no puede ser autoaplicable
    plants: [{ type: mongoose.Types.ObjectId, ref: "plants" }],
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("users", userSchema, "users");
