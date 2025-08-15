import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/index.js";
import userRouter from "./api/routes/user.routes.js";

dotenv.config();

const app = express();
const PORT = 3000;

// Conexión a MongoAtlas
connectDB();

// Permitimos requests json y genéricas
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Ruta inicial
const router = express.Router();
app.use("/", router);

// Todas las rutas
app.use("/users", userRouter);

// Ruta para evitar rutas incorrectas
app.use((req, res, next) => {
  const error = new Error("Route not found");
  error.status = 404;
  next(error);
});

// Controlador de errores de Express
app.use((error, req, res, next) => {
  return res.status(error.status || 500).json(error.message || "Unexpected error");
});

// Listen del puerto
app.listen(PORT, () => {
  console.log(`Server running in https://localhost:${PORT}`);
});
