import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import {
  comparePassword,
  hashPassword,
  removePassword,
} from "../utils/helpers.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = hashPassword(password);
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });
  try {
    await newUser.save();
    return res.status(201).send({ message: "User created successfully" });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) throw errorHandler(401, "User not found!");
    const hasValidPassword = comparePassword(password, validUser.password);
    if (!hasValidPassword) throw errorHandler(401, "Wrong credentials!");
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("access_token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).send(removePassword(validUser));
  } catch (err) {
    next(err);
  }
};
