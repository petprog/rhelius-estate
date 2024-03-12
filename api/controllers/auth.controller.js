import User from "../models/user.model.js";
import { hashPassword } from "../utils/helpers.js";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = await hashPassword(password);
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });
  try {
    await newUser.save();
    return res.status(201).send("User created successfully");
  } catch (err) {
    next(err);
  }
};
