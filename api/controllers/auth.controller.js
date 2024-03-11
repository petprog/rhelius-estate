import User from "../models/user.model.js";
import { hashPassword } from "../utils/helpers.js";

export const signup = async (req, res) => {
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
    if (err.code === 11000) {
      return res.status(400).send({ msg: "User already exists" });
    }
    return res.status(500).send({ msg: err.message });
  }
};
