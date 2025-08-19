import { User } from "../../api/models/User.model.js";
import { verifyToken } from "../../utils/jwt/token.js";

// Autenticación
export const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "").trim();

    if (!token) return res.status(401).json("Unauthorized");

    // Asignamos el user pasado por el request a su equivalente en documento de Mongo para no tener que volver a buscarlo con los siguientes middlewares
    const decoded = verifyToken(token);
    req.user = await User.findById(decoded.id); // Podemos acceder a esto porque decoded contiene el id del user
    next();
  } catch (error) {
    next(error);
  }
};
