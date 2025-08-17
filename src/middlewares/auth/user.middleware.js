//? Aquí están todos los middlewares asociados a las requests hechas hacia la colección users

// GET
export const canViewAllUsers = async (req, res, next) => {
  try {
    const requester = req.user;

    if (requester.role !== admin) {
      return res.status(403).json("Forbidden: You need permission to view this resource");
    }

    next();
  } catch (error) {
    next(error);
  }
};

// PUT
export const canUpdateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const requester = req.user; // Esto vendrá de isAuth
    const attemptedRoleUpdate = req.body?.role;

    if (requester.role === "admin") return next(); // El admin siempre puede modificar/borrar

    if (attemptedRoleUpdate && requester._id.toString() === id) {
      return res.status(403).json("Forbidden: You can't modify your role");
    }

    if (requester._id.toString() !== id) {
      return res.status(403).json("Forbidden: You can't modify other users");
    }

    next();
  } catch (error) {
    next(error);
  }
};

// DELETE
export const canDeleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const requester = req.user;

    if (requester.role === "admin" || requester._id.toString() === id) {
      return next();
    }

    return res.status(403).json("Forbidden: You can't delete other users");
  } catch (error) {
    next(error);
  }
};
