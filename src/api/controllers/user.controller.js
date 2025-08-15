import { User } from "../models/User.model.js";

// POST
export const registerUser = async (req, res, next) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });

    if (userExists) {
      return res.status(409).json("User already exists");
    } else {
      const user = new User(req.body);
      //*
      //TODO: Falta meter Cloudinary
      //*
      const userSaved = await user.save();
      return res.status(201).json({
        message: "User created",
        user: userSaved,
      });
    }
  } catch (error) {
    next(error);
  }
};

// LOGIN
export const loginUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json("User not found");
    }

    //*
    // TODO: Terminar con bcrypt
    //*
  } catch (error) {
    next(error);
  }
};

// GET
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    return res.status(200).json({
      message: "Users found",
      users: users,
    });
  } catch (error) {
    next(error);
  }
};
