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
  if (!email || !password || !username)
    throw errorHandler(400, "email, password and username are required");
  const hashedPassword = hashPassword(password);
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });
  try {
    await newUser.save();
    return res
      .status(201)
      .send({ message: "User created successfully", success: true });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw errorHandler(400, "email and password required");

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
    const rest = removePassword(validUser);
    res.status(200).send({ ...rest, success: true });
  } catch (err) {
    next(err);
  }
};

export const google = async (req, res, next) => {
  const { email, name, photo } = req.body;
  if (!email || !name) throw errorHandler(400, "email, name are required");
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res.cookie("access_token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      const rest = removePassword(user);
      res.status(200).send({ ...rest, success: true });
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = hashPassword(generatedPassword);
      const newUser = new User({
        username:
          name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email,
        password: hashedPassword,
        avatar: photo,
        displayName: name,
      });
      try {
        const result = await newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });
        res.cookie("access_token", token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        });
        const rest = removePassword(result);
        return res.status(201).send({ ...rest, success: true });
      } catch (err) {
        next(err);
      }
    }
  } catch (err) {
    next(err);
  }
};

export const signout = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res
      .status(200)
      .send({ message: "User has been logged out!", success: true });
  } catch (err) {
    next(err);
  }
};
