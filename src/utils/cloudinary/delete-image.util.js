//! IMPORTANTE: Este util está metido en todas las validaciones de requests. Si no se mete, cada vez que se mande una request, sea 200 OK o no, se sube la foto de dentro de la request a Cloudinary. Evito este posible fallo de seguridad incluyéndolo siempre

import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const deleteImageCloudinary = (imgURL) => {
  const imgSplitted = imgURL.split("/");
  const imgName = imgSplitted.at(-1).split(".")[0];
  const imgFolder = imgSplitted.at(-2);
  const publicId = `${imgFolder}/${imgName}`;

  cloudinary.uploader.destroy(publicId, () => {
    console.log(`Image deleted: ${publicId}`);
  });
};