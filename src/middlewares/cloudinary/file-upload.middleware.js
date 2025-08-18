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

//* Rollbackeado - preguntar

/* IMPORTANTE: Meto upload en una promesa para poder utilizarlo no como middleware, sino como util y solo una vez que la request devuelve 200 OK. Si no, cualquier bad request puede meter fotos en Cloudinary

export const uploadSingleImage = (req, res) => {
  new Promise((resolve, reject) => {
    upload.single("img")(req, res, (error) => {
      if (error) reject(error);
      else resolve(req.file);
    });
  });
}; */
