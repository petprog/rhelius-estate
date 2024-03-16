import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import { hashPassword, removePassword } from "../utils/helpers.js";

export const test = (req, res) => {
  res.send({ msg: "Hello World" });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account"));
  try {
    if (req.body.password) {
      req.body.password = hashPassword(req.body.password);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
          displayName: req.body.displayName,
        },
      },
      { new: true }
    );
    const rest = removePassword(updatedUser);
    res.status(200).send({
      ...rest,
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only delete your own account"));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).send({ message: "User has been deleted.", success: true });
  } catch (err) {
    next(err);
  }
};
