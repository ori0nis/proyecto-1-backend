import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const cloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "myplants.io",
    allowedFormats: ["jpg", "png", "jpeg", "gif", "webp"],
  },
});

export const upload = multer({ storage: cloudStorage });